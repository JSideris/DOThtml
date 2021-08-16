import { eachK, isF } from "./util";
import ERR from "./err";
import ObservableArray from "./observable-array";
import { AttrArgCallback } from "./arg-callback-obj";

/** How it works:
 * 
 * _C represents the prototype for all components.
 * You create a component with dot.component().
 * This creates a new class (CC), which acts as the prototype to that component.
 * The prototype of CC is set to a new _C.
 * Instantiating the component creates a new CC.
 * This CC is the `this` for each method of the component.
 * 
 * 
 * */ 

/** How computed props work.
 * 
 * If a computed property has a dependency on a regular property, 
 * assigning the computed property to an element will cause the regular property's getter to trigger, establishing the dependency.
 * */

export function _C(){
	this.$el = null;
	this.$refs = {};
	this.__handlers = {};
}

_C.prototype.__addHandler = function(eventName, event){
	var h = this.__handlers[eventName];
	if(!h) h = this.__handlers[eventName] = [];
	h.push(event);
}

var dot, _p, _D;

var sT = setTimeout;

export function dotReady(d, p, _d){
    dot = d;
    _p = p;
    _D = _d;
};

function configureDependency(ret, name){
	// TODO: verify that there is no memory leak!!
	var cb = dot.__currentArgCallback[dot.__currentArgCallback.length-1];
	if(cb){
		// This means this getter is being used during the invocation of an arg callback.
		// Add it to a collection so that when the value is set, the appropriate component will update.
		
		if(ret instanceof ObservableArray){
			var d = cb.dotTarget;
			ret.addEventListener("itemadded", function(e) {
				d._appendOrCreateDocument(cb.f(e.item, e.index), undefined, e.index);
			});

			ret.addEventListener("itemset", function(e) {
				var p = d.__document;
				var el = p.childNodes[e.index];
				p.removeChild(el);
				d._appendOrCreateDocument(cb.f(e.item, e.index), undefined, e.index);
				
			});

			ret.addEventListener("itemremoved", function(e) {
				d.__document.removeChild(d.__document.childNodes[e.index]);
			});
		}
		else{
			var ar = this.__propDependencies[name];
			if(!ar) ar = this.__propDependencies[name] = [];
			ar.push(cb);
		}
	}
}

function createProp(name, CC){
	var dependencies = [];
	Object.defineProperty(CC.prototype, name, {
		configurable: false,
		enumerable: false,
		get: function() {
			var ret = this.__rawProps[name];
			configureDependency.call(this, ret, name);
			return ret;
		},
		set: function(value) {
			// TODO: if this value is set, get the list of dependencies, and update them by calling their dot argument callbacks.
			var propVal = value;
			if(value instanceof Array){
				propVal = new ObservableArray(value);
			}
			this.__rawProps[name] = propVal;

			var ar = this.__propDependencies[name];

			// // {f:contentCallback,startNode:startNode, endNode:endNode,condition:condition}
			var updateStyles = false;
			for(let i = 0; i < (ar||[]).length; i++){
				ar[i].updateContent(dot, propVal);

				if(ar[i] instanceof AttrArgCallback && ar[i].attr == "class"){
					updateStyles = true;
				}
			}

			if(updateStyles) this.$updateStyles();

			return propVal;
		}
	});
}

// TODO: ideally we'd like to remove this, and create scoped namespaces for all components.
// One option would be to have a global namespace where each item is only accessible by parent components who have registered to use it.
// Another option is to inject a custom reference to dot that inherits from the actual dot but also has sub-components in it.
var componentNames = {};
var componentStyleElement = null;
/**
 * @param {object} prms - Params for the component builder.
 * @param {string} prms.name - Name of the component (optional). If provided, dot and the vdbo will be extended.
 * @param {Function} prms.registered - An optional function that gets called once per component after registering in the dot namespace, with the component class passed in as a parameter.
 * @param {Function} prms.created - An optional function that gets called before the component is created, scoped to the new component object.
 * @param {Function} prms.builder - A function returning DOThtml (required).
 * @param {Array<string>} prms.events - An array of names that can be called as functions. The component will be extended by these names.
 * @param {Array<Function>} prms.methods - An array of functions that can be called within the component.
 * @param {Function} prms.style - An optional function that is called after builder that stylizes .
 * @param {Function} prms.props - An optional function that is called after builder that stylizes .
 * @param {Function} prms.computed - An optional function that is called after builder that stylizes .
 * @param {Function} prms.ready - An optional function called after the element has been added. One parameter will be provided containing the added element.
 * @param {Function} prms.deleting - An optional function called before the component is deleted.
 * @param {Function} prms.deleted - An optional function called after the component is deleted.
 */
export function addComponent(prms){

	// TODO: generalize this (for routes).
;;; var prmsKeys = Object.keys(prms);
;;;	for(var i = 0; i < prmsKeys.length; i++) try{["name", "register", "created", "methods", "events", "props", "computed", "builder", "ready", "deleting", "deleted"][prmsKeys[i]];}catch(e){throw prmsKeys[i] + " is not a valid component field."}
	
	// Setting this potentially allows automatic code completion to get the method signature from builder. 
	var comp = prms.builder;

	let n = prms.name;
	if(!n || (!dot[n] && !_p[n])) {
		n && (componentNames[n] = 1);
		var CC = function(){
			_C.call(this);
            this.__rawProps = {};
			this.__propDependencies = {};
			this.__prms = prms;
        }
		CC.prototype = Object.create(_C.prototype);
		CC.prototype.constructor = CC;

		eachK(prms.methods, function(k, v){
			if(!isF(v)) ERR("XF");
			CC.prototype[k] = v;
		});

		eachK(prms.events, function(k, v){
			if(typeof v != "string") ERR("XS");
			var handlerName = "on" + v[0].toUpperCase() + v.substring(1);
			CC.prototype[handlerName] = function(cb){
				this.__addHandler(v, cb);
			}
			CC.prototype[v] = function(){
				var h = this.__handlers[v];
				if(h){
					for(var i = 0; i < h.length; i++){
						h[i].apply(this, arguments);
					}
				}
			}
		});

        eachK(prms.props, function(k,v){
            createProp(typeof v == "string" ? v : v.name, CC);
        });

		eachK(prms.computed, function(k, v){
			isF(v) ? v : ERR("XF")
			//createProp(k, CC);
			CC.prototype[k] = v;
			Object.defineProperty(CC.prototype, k, {
				enumerable: true,
				get: function(){
					//configureDependency(v(), this, k);
					return v.call(this);
				}
			});
		});

		prms.register && prms.register.apply(CC.prototype);

		// Scoped classes and styles.
		var classNumb = undefined;
		var st = prms.style;
		if(st && !isF(st)){
			// This is the less-preferred method of using component styles.

			classNumb = classPrefix++;

			if(st instanceof string){
				// TODO: need to parse?
				// var cssParts = st.split("{");
				// for(var i = 0; i < cssParts.length; i+=2){

				// }
				// st.split(".").join(".dot-" + str(classNumb,16) + "-");
			}
			else{
				// Assume json object.
				var result = "";
				for(var k in st){
					result += k + ":" + str(st[k]) + ";"
				}
				st = result;
			}

			if(!componentStyleElement)
				componentStyleElement = dot("head").el("style", st);
			else 
				dot(componentStyleElement).t("\r\n" + st);
			
		}

		CC.prototype.$updateStyles = function(){
			this.$styleBuilder && this.$styleBuilder();
		}

		// Adding the component to dot.
		comp = function(){
			var obj = new CC();
			prms.created && prms.created.apply(obj, arguments);

			// eachK(prms.computed, function(k, v){
			// 	dot.__currentArgCallback.push({f:v})
			// 	//obj[k] = function(){return v.call(obj)};
			// 	//obj[k] = v.call(obj);
			// 	v.call(obj);
			// 	dot.__currentArgCallback.pop()
			// });

			var ret = prms.builder.apply(obj, arguments); // TODO: eventually want to only pass in the slot and leave all other stuff up to params.

			// Add the events to ret.

			// // TODO: this is kind of bad, because it duplicates the function for each instance rather than using prototypes.
			// eachK(prms.events, function(k, v){
			// 	if(typeof v != "string") ERR("XS");
			// 	ret[v] = function(){obj[v].apply(obj, arguments); return ret;}
			// });

			ret = ret instanceof _D ? ret : dot.h(ret);
			// ret = (this instanceof _D ? this : dot).h(ret);

			var lst = ret.getLast();
			(!lst || (lst.parentNode.childNodes.length > 1)) && ERR("C#", [n || "(un-named component)"]);
			

			// Some weird ass logic to support legacy named components and the new syntax.
			if(classNumb || n) ret = (this instanceof _D ? this : dot)._appendOrCreateDocument(dot.scopeClass(classNumb, ret));
			obj.$el = obj.$el || lst;
			obj.$el.dotComponent = obj;

			if(isF(st)) {
				// This will be the officially supported way to use dothtml.
				obj.$styleBuilder = function(){
					dot.css.scopeToEl(obj.$el)
					st.apply(obj, [dot.css]);
					dot.css.unscope();
				}
				obj.$updateStyles();
				//styler();
			}

			prms.built && prms.built.apply(obj);

			prms.ready && sT(function(){
				prms.ready.apply(obj)
			}, 0);
			if (n) return ret; // Named components - used with inline syntax (legacy).
			else return obj; // Unnamed components - used with modern component syntax.
		}

		n && (dot[n] = _p[n] = comp);
	}
	else ERR("CC", [n || "(un-named component)"]);
	
	//_p[prms.name].prototype

	//return function(){return comp.apply(dot, arguments)};
	return comp;
};

export function removeComponent(name){
	if(componentNames[name]){
		delete componentNames[name];
		delete dot[name];
		delete _p[name];
	}
}