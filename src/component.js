import { eachK, isF } from "./util";
import ERR from "./err";

function _C(){
	this.$el = null;
	this.$refs = {};
}

var dot, _p, _D;

var sT = setTimeout;

export function dotReady(d, p, _d){
    dot = d;
    _p = p;
    _D = _d;
};

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
;;;		var prmsKeys = Object.keys(prms);
;;;		for(var i = 0; i < prmsKeys.length; i++) try{["name", "register", "created", "methods", "events", "props", "computed", "builder", "ready", "deleting", "deleted"][prmsKeys[i]];}catch(e){throw prmsKeys[i] + " is not a valid component field."}
	
	// Setting this potentially allows automatic code completion to get the method signature from builder. 
	var comp = prms.builder;

	let n = prms.name;
	if(!n || (!dot[n] && !_p[n])) {
		n && (componentNames[n] = 1);
		var CC = function(){}
		CC.prototype = Object.create(_C.prototype);
		CC.prototype.__prms = prms;

		// eachK(prms.events, function(k, v){
		// 	if(typeof v != "string") ERR("XS");
		// 	CC.prototype[v] = function(cb){}
		// });

		eachK(prms.methods, function(k, v){
			if(!isF(v)) ERR("XF");
			CC.prototype[k] = v;
		});

		eachK(prms.computed, function(k, v){
			Object.defineProperty(CC.prototype, k, {
				enumerable: true,
				get: isF(v) ? v : ERR("XF")
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

		// Adding the component to dot.
		comp = function(){
			var obj = new CC();
			prms.created && prms.created.apply(obj, arguments);

			var ret = prms.builder.apply(obj, arguments); // TODO: eventually want to only pass in the slot and leave all other stuff up to params.

			// Add the events to ret.

			// TODO: this is kind of bad, because it duplicates the function for each instance rather than using prototypes.
			eachK(prms.events, function(k, v){
				if(typeof v != "string") ERR("XS");
				ret[v] = function(){obj[v].apply(obj, arguments); return ret;}
			});

			ret = ret instanceof _D ? ret : dot.h(ret);
			

			var lst = ret.getLast();
			(!lst || (lst.parentNode.childNodes.length > 1)) && ERR("C#", [n || "(un-named component)"]);
			if(classNumb || n) ret = this._appendOrCreateDocument(dot.scopeClass(classNumb, ret));
			obj.$el = obj.$el || lst;
			obj.$el.dotComponent = obj;

			if(isF(st)) {
				// This will be the officially supported way to use dothtml.
				dot.css.scopeToEl(obj.$el)
				st.apply(obj, [dot.css]);
				dot.css.unscope();
			}

			prms.built && prms.built.apply(obj);

			prms.ready && sT(function(){
				prms.ready.apply(obj)
			}, 0);
			return ret;
		}

		n && (dot[n] = _p[n] = comp);
	}
	else ERR("CC", [n || "(un-named component)"]);
	
	//_p[prms.name].prototype

	return function(){return comp.apply(dot, arguments)};
};

export function removeComponent(name){
	if(componentNames[name]){
		delete componentNames[name];
		delete dot[name];
		delete _p[name];
	}
}