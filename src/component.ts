import ObservableArray from "./observable-array";
import dot from "./dot";
import { ClassPrefix, eachK, GlobalComponentStack, isF, sT } from "./dot-util";
import ERR from "./err";
import { IDotDocument, IDotElement, IDotElementDocument, IDotGenericElement } from "./i-dot";
import { ArgCallback, ArrayArgCallback, AttrArgCallback } from "./arg-callback-obj";
import IDotCss from "./styling/i-dotcss";

interface IPropertyContainer{
	activePropConstructor: Function;
	propDependencies: {[key: string]: Array<ArgCallback>}
	rawProps: {[key: string]: any}
	activeProps: {[key: string]: any}
	bindings: {[key: string]: Array<{
		element: HTMLElement
	}>}
}


abstract class Component{

	/**
	 * Used internally to indicate the first time $updateStyles is called.
	 * This method is called by the static component builder when the component is created.
	 * If a prop is accessed within the style builder, the getter reads this field to mark $updateStyles as a dependency.
	*/
	#initializingStyles: boolean = false;
	#initializingBuild: boolean = false;
	// A bit messy but gets us to MVP for this feature.
	// Ideally this should be made a singleton somehow, perhaps put in the property metadata.
	#rebuildStylesOnPropChange: {[propName: string]: true} = {};
	#rebuildBuilderOnPropChange: {[propName: string]: true} = {};

	/**
	 * Called once per component, on the first build.
	 * TODO: this shouldn't require an instance of the component. Please experiment with fixing this.
	*/
	static initializeComponent<T extends Component>(obj: T): void{
		if(!(obj.constructor as any).__dotComponentInitialized) {
			(obj.constructor as any).__dotComponentInitialized = true;
			
			// Additional generic logic that should run once per component.
			(obj.constructor as any).__dotClassNumb = ClassPrefix.next;
			(obj.constructor as any).__activePropContainer = function ActivePropContainer(obj){
				this.__component = obj;
			};

			eachK(obj.props, (k,v) => {
				Component.createProp((obj.constructor as any).__activePropContainer, k);
			});
		}

	}

	static build<T extends Component>(obj: T): HTMLElement{
		Component.initializeComponent(obj);

		GlobalComponentStack.push(obj);
		obj.created && obj.created(...obj.__args);
	
		if(obj.__built) ERR("CB");
		obj.__built = true;

		

		obj.__propContainer = {
			activePropConstructor: (obj.constructor as any).__activePropContainer,
			rawProps: obj.props || {},
			activeProps: new (obj.constructor as any).__activePropContainer(obj),
			propDependencies: {},
			bindings: {}
		};

		// eachK(obj.props, (k,v) => {
		// 	// Initialize it.
		// 	cc.__propContainer.activeProps[k] = cc.__propContainer.rawProps[k];
		// });
		obj.props = obj.__propContainer.activeProps;

		eachK(obj.__propContainer.rawProps, (k,v) => {
			obj.__propContainer.bindings[k] = []
			obj.props[k] = v;
		});

		// function ComputedContainer(){
		// };
		// let cc = new ComputedContainer();
		
		// eachK(obj.computed, function(k, v){
		// 	isF(v) ? v : ERR("XF", "computed")
		// 	//createProp(k, CC);
		// 	ComputedContainer.prototype[k] = v;
		// 	Object.defineProperty(ComputedContainer.prototype, k, {
		// 		enumerable: true,
		// 		get: function(){
		// 			// This was commented out pre-ts.
		// 			//configureDependency(v(), this, k);
		// 			return v.call(obj);
		// 		}
		// 	});
		// });
		// obj.computed = cc;

		Component.initializeEventHandlers(obj);
	
		Component.rebuild(obj);
	
		// TODO: would be great to do this without a timer, once the DOM is updated. 
		// May require some type of queueing system within dot.
		obj.ready && sT(()=>{
			GlobalComponentStack.push(obj);
			obj.ready();
			GlobalComponentStack.pop()
		}, 0);

		GlobalComponentStack.pop();
		
		return obj.$el;
	}

	/**
	 * Called any time the component needs to be completely rebuilt.
	*/
	static rebuild<T extends Component>(obj: T) {

		let oldEl = obj.$el;
		
		if(!obj.__eventsInitialized) obj.#initializingBuild = true;
		let ret = obj.builder(...obj.__args);
		obj.#initializingBuild = false;
	
		let lst = ret.getLast();
		(!lst || (lst.parentNode.childNodes.length > 1)) && ERR("C#", obj.name || obj.constructor.name || "(unnamed obj)");
		

		// Note: I don't know what the justification was for using $obj.el, but all tests pass without it.
		// It was removed to facilitate rebuilding the component (during a prop change).
		obj["__$el"] = /*obj.$el ||*/ lst;
		obj.$el["__dothtml_component"] = obj;

		if(oldEl){
			// Clean it up and replace it with the new element!
		}

		// TODO: would there be a way to not have to create obj function for each instance?
		if(obj.style) {
			// obj will be the officially supported way to use dothtml.
			obj.$styleBuilder = function(){
				// dot.css.scopeToEl(obj.$el, !obj.__stylesSet);
				dot.css.scopeToEl(obj.$el);
				if(!obj.__stylesSet){
					dot.css.cacheScopedStaticStyles(obj.$el);
					obj.__stylesSet = true;
				}
				dot.css.clearDynamicStyles(obj.$el);
				obj.style(dot.css);
				dot.css.unscope();
			}
			if(!obj.__eventsInitialized) obj.#initializingStyles = true;
			obj.$updateStyles();
			obj.#initializingStyles = false;
			//styler();
		}
	
		obj.built && obj.built();
	}

	static initializeEventHandlers(obj){
		if(!obj.__eventsInitialized){
			obj.__eventsInitialized = true;
			eachK(obj.events, (k,v) => {
				obj.events[k] = function(){
					for(let f of obj.events[k]["__handlers"]){
						f.apply(this, arguments);
					}
				}
				
				obj.events[k]["__handlers"] = [];
	
			});
		}
	}

	static createProp(activePropContainer: Function, name: string){
		// var dependencies = [];
		Object.defineProperty(activePropContainer.prototype, name, {
			configurable: false,
			enumerable: false,
			get: function() {
				dot["__lastProp"] = name;
				dot["__lastIndex"] = null;
				dot["__lastComponent"] = this.__component;

				let rawProp = this.__component.__propContainer.rawProps[name];
				Component.configureDependency(this.__component, name);
				return rawProp;
			},
			set: function(value) {
				// TODO: if this value is set, get the list of dependencies, and update them by calling their dot argument callbacks.
				let propVal = value;
				if(value instanceof Array){
					propVal = new ObservableArray(value);
					propVal.addEventListener("read",e=>{
						
						dot["__lastIndex"] = e.index;
					});
				}
				this.__component.__propContainer.rawProps[name] = propVal;
				for(let b of this.__component.__propContainer.bindings[name]){
					dot(b.element).as(dot.input).setVal(propVal);
				}
	
				Component.updateProp(this.__component, name);
	
				return propVal;
			}
		});

		
	}

	static configureDependency(cc: Component, name: string){
		// TODO: verify that there is no memory leak!!
		var cb: ArgCallback = dot["__currentArgCallback"][dot["__currentArgCallback"].length-1];
		if(cb){
			// This means this getter is being used during the invocation of an arg callback.
			// Add it to a collection so that when the value is set, the appropriate component will update.
			let rawProp = cc.__propContainer.rawProps[name];

			if(rawProp instanceof ObservableArray){
				(rawProp as any).addEventListener("itemadded", function(e) {
					// TODO: More test cases to create:
					// TODO: what about rendering the list length or something?
					// TODO: what about a computed field based on length?
					if(cb instanceof ArrayArgCallback) {
						cb.dotTarget._appendOrCreateDocument(cb.f(e.item, e.index), undefined, e.index);
					}
					else if(cb as AttrArgCallback) {	
						Component.updateProp(cc, name);
					}
				});
	
				(rawProp as any).addEventListener("itemset", function(e) {
					if(cb instanceof ArrayArgCallback) {
						var p = (cb.dotTarget as any).__document;
						var el = p.childNodes[e.index];
						p.removeChild(el);
						cb.dotTarget._appendOrCreateDocument(cb.f(e.item, e.index), undefined, e.index);	
					}
					else if(cb as AttrArgCallback) {	
						Component.updateProp(cc, name);
					}
					
					
				});
	
				(rawProp as any).addEventListener("itemremoved", function(e) {
					if(cb instanceof ArrayArgCallback) {
						(cb.dotTarget as any).__document.removeChild((cb.dotTarget as any).__document.childNodes[e.index]);
					}
					else if(cb as AttrArgCallback) {	
						Component.updateProp(cc, name);
					}
				});
			}
			else{
			}
			var ar = cc.__propContainer.propDependencies[name];
			if(!ar) ar = cc.__propContainer.propDependencies[name] = [];
			ar.push(cb);
		}

		// Again I find this a weird way to do it that kind of side-steps the above approach, but it gets the job done and is dead simple.
		if(cc.#initializingStyles){
			cc.#rebuildStylesOnPropChange[name] = true;
		}
		if(cc.#initializingBuild){
			cc.#rebuildBuilderOnPropChange[name] = true;
		}
	}
	
	static updateProp(obj: Component, name: string){
		let ar = obj.__propContainer.propDependencies[name];
		let value = obj.__propContainer.rawProps[name];
	
		// // {f:contentCallback,startNode:startNode, endNode:endNode,condition:condition}
		let updateStyles = false;
		if(false && obj.#rebuildBuilderOnPropChange[name] && !obj.#initializingBuild){
			// Call the builder again.
		}
		else{
			// Maybe update specific areas.
			// This is admittedly more efficient.
			for(let i = 0; i < (ar||[]).length; i++){
				let arg = ar[i];
				// TODO: this could be used to update attributes.
				// But right now that relies exclusively on function setters. It's a bit weird.
				arg.updateContent(dot, value);
				
				if(obj.#rebuildStylesOnPropChange[name] || (arg instanceof AttrArgCallback && arg.attr == "class")){
					updateStyles = true;
				}
			}
		}
	
		if(updateStyles) obj.$updateStyles();
	}

	constructor(...args: Array<any>){
		this.__args = args;
	}

	/**
	 * A function returning DOThtml (required).
	 */
	abstract builder(...args: Array<any>): IDotElement;

	/**
	 * 
	*/
	props: {[key: string]: any};

	/**
	 * A series of events that can be raised from inside the component.
	 */
	events: {[key: string]: (... params: Array<any>)=>void};
	
	/**
	 * An optional function that gets called before the component is created, scoped to the new component object.
	 */
	created(...args: Array<any>): void{}

	/**
	 * An optional function called after the element has been added. One parameter will be provided containing the added element.
	 */
	ready(): void{}

	/**
	 * An optional function called before the component is deleted.
	 */
	deleting(): void{}

	/**
	 * An optional function called after the component is deleted.
	 */
	deleted(): void{}
	/**
	 * An optional function called after the component is built.
	 */
	built(): void{}

	on(event: string, handler: Function): void{
		Component.initializeEventHandlers(this);

		let e = this.events && this.events[event];
		if(!e) ERR("UE", event);
		let handlers = e["__handlers"] as Array<Function>;
		if(handlers.indexOf(handler) == -1){
			handlers.push(handler);
		}
	}
	off(event: string, handler: Function): void{
		let e = this.events && this.events[event];
		if(!e) ERR("UE", event);
		let handlers = e["__handlers"] as Array<Function>;
		let i = handlers.indexOf(handler);
		if(i > -1){
			handlers.splice(i, 1);
		}
	}

	private __$el: HTMLElement;
	private __built = false;
	private __stylesSet = false;
	private __eventsInitialized: boolean = false;
	private __propContainer: IPropertyContainer;
	private __args: Array<any>;

	/**
	 * The main element of this component - automatically set after the builder is called.
	*/
	get $el(): HTMLElement{
		return this.__$el;
	}

	$refs: {[key: string]: HTMLElement} = {};

	/**
	 * Name of the component (optional). If provided, dot and the VDBO will be extended.
	 */
	name: string;
	/**
	 * An optional function that is called after builder that stylizes the component using a scoped style builder.
	 */
	style?(styleBuilder: IDotCss): void;

	// constructor(params: ComponentParams){
	// 	this.name = params.name;
	// }

	$styleBuilder?: Function;

	$updateStyles(){
		this.$styleBuilder && this.$styleBuilder();
	}
}

export default Component;

// Eventually we'd like to set this up. Might be overkill.
// function component<T extends { new (...args: any[]): {} }>(constructor: T) {
// 	return class extends constructor {
// 	  
// 	};
// }