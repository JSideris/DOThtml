import ObservableArray from "./observable-array";
import dot from "./dot";
import { ClassPrefix, eachK, GlobalComponentStack, isF, sT } from "./dot-util";
import ERR from "./err";
import { ArgCallback, ArrayArgCallback, AttrArgCallback } from "./arg-callback-obj";
import { FrameworkItems, FrameworkItems, IComponent, IDotCss, IDotElement } from "dothtml-interfaces";

interface IPropertyContainer{
	activePropConstructor: Function;
	propDependencies: {[key: string]: Array<ArgCallback>}
	rawProps: {[key: string]: any}
	activeProps: {[key: string]: any}
	bindings: {[key: string]: Array<{
		element: HTMLElement
	}>}
}

// TODO: refactor is in progress
// https://github.com/JSideris/DOThtml/issues/146

class _FrameworkItems implements FrameworkItems{
	css: IDotCss;
	el: null;
	html: dot;
	refs: {};
	restyle(){

	};
	
	on(event: string, handler: Function): void{
		ComponentFactory.initializeEventHandlers(this);

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

}

export interface IWrappedComponent extends IComponent{
	__initializingStyles: boolean;
	__initializingBuild: boolean;
	__rebuildStylesOnPropChange: {[propName: string]: true};
	__rebuildBuilderOnPropChange: {[propName: string]: true};

	__built: boolean;
	__stylesSet: boolean;
	__eventsInitialized: boolean;
	__propContainer: IPropertyContainer;
	__args: Array<any>;
}

class _ComponentFactory{

	make<T extends new (...args: any[]) => IComponent>(Base: T): T & (new (...args: any[]) => { $: FrameworkItems; }){
		return class ComponentWrapper extends Base implements IWrappedComponent{

			constructor(...args: Array<any>){
				super(...args);
				this.__args = args;
			}
		
		
			$: FrameworkItems = ;
			
			// Private fields.
			/**
			 * Used internally to indicate the first time $updateStyles is called.
			 * This method is called by the static component builder when the component is created.
			 * If a prop is accessed within the style builder, the getter reads this field to mark $updateStyles as a dependency.
			*/
			__initializingStyles: boolean = false;
			__initializingBuild: boolean = false;
			// A bit messy but gets us to MVP for this feature.
			// Ideally this should be made a singleton somehow, perhaps put in the property metadata.
			__rebuildStylesOnPropChange: {[propName: string]: true} = {};
			__rebuildBuilderOnPropChange: {[propName: string]: true} = {};

			__built = false;
			__stylesSet = false;
			__eventsInitialized: boolean = false;
			__propContainer: IPropertyContainer;
			__args: Array<any>;
		}
	}

	/**
	 * Called once per component, on the first build.
	 * TODO: this shouldn't require an instance of the component. Please experiment with fixing this.
	 * The issue with this is that simply declaring a class, it's not obvious how to run code. 
	 * There are four options that come to mind:
	 * 1. We could find a way to call this upon declaration of the class (might not be possible).
	 * 2. Ignore the problem.
	 * 3. Call this per instance (possibly wasteful, but has some advantages, for instance, with polymorphic components).
	 * 4. Move to a completely different prop system that doesn't require this type of instantiation.
	*/
	initializeComponent(obj: IWrappedComponent): void{
		if(!(obj.constructor as any).__dotComponentInitialized) {
			(obj.constructor as any).__dotComponentInitialized = true;
			
			// Additional generic logic that should run once per component.
			(obj.constructor as any).__dotClassNumb = ClassPrefix.next;
			(obj.constructor as any).__activePropContainer = function ActivePropContainer(obj){
				this.__component = obj;
			};

			// TODO: for polymorphic components, may need to also loop through parent props and bindings.

			// Creating the props.
			eachK(obj.props, (k,v) => {
				this.createProp((obj.constructor as any).__activePropContainer, k);
			});

			// Create data bindings.
			eachK(obj.bindings, (k) => {
				this.createBinding(k, obj);
			});
		}

	}

	build<T extends IWrappedComponent>(obj: T): HTMLElement{
		this.initializeComponent(obj);

		GlobalComponentStack.push(obj);

		// This name isn't very useful because it's ambiguous and easily confused with `ready`.
		// The hook may be valid but needs an appropriate name. Temp removed in v6.
		// obj.created && obj.created(...obj.__args);
	
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

		this.initializeEventHandlers(obj);
	
		this.rebuild(obj);
	
		// TODO: would be great to do this without a timer, once the DOM is updated. 
		// May require some type of queueing system within dot.
		obj.ready && sT(()=>{
			GlobalComponentStack.push(obj);
			obj.ready();
			GlobalComponentStack.pop()
		}, 0);

		GlobalComponentStack.pop();
		
		return obj.$.el;
	}

	/**
	 * Called any time the component needs to be completely rebuilt.
	*/
	rebuild<T extends IWrappedComponent>(obj: T) {

		let oldEl = obj.$.el;
		
		if(!obj.__eventsInitialized) obj.__initializingBuild = true;
		let ret = obj.build(...obj.__args);
		obj.__initializingBuild = false;
	
		let lst = ret.getLast();
		(!lst || (lst.parentNode.childNodes.length > 1)) && ERR("C#", /*obj.name ||*/ obj.constructor.name || "(unnamed obj)");
		

		// Note: I don't know what the justification was for using $obj.el, but all tests pass without it.
		// It was removed to facilitate rebuilding the component (during a prop change).
		obj["__$el"] = /*obj.$el ||*/ lst;
		obj.$.el["__dothtml_component"] = obj;

		if(oldEl){
			// Clean it up and replace it with the new element!
		}

		// TODO: would there be a way to not have to create obj function for each instance?
		if(obj.style) {
			// obj will be the officially supported way to use dothtml.
			obj.$.restyle = function(){
				// dot.css.scopeToEl(obj.$el, !obj.__stylesSet);
				dot.css.scopeToEl(obj.$.el);
				if(!obj.__stylesSet){
					dot.css.cacheScopedStaticStyles(obj.$.el);
					obj.__stylesSet = true;
				}
				dot.css.clearDynamicStyles(obj.$.el);
				obj.style(dot.css);
				dot.css.unscope();
			}
			if(!obj.__eventsInitialized) obj.__initializingStyles = true;
			obj.$.restyle();
			obj.__initializingStyles = false;
			//styler();
		}
	
		obj.built && obj.built();
	}

	initializeEventHandlers(obj: IWrappedComponent){
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

	createProp(activePropContainer: Function, name: string){
		// var dependencies = [];
		Object.defineProperty(activePropContainer.prototype, name, {
			configurable: false,
			enumerable: false,
			get: function() {
				dot["__lastProp"] = name;
				dot["__lastIndex"] = null;
				dot["__lastComponent"] = this.__component;

				let rawProp = this.__component.__propContainer.rawProps[name];
				this.configureDependency(this.__component, name);
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
	
				this.updateProp(this.__component, name);
	
				return propVal;
			}
		});

		
	}

	createBinding(ref: string, sample: IWrappedComponent){
		// There are loosely three requirements to this.
		// 1. When modifying a prop, all of the bindings should be updated. 
		//    This can be handled by setting some initialization flag on the component, looping through each binding, and then adding the logic on update to save updates to the inputs with the given refs.
		// 2. Updating the input should also update the prop.
		//    Once we have 1, we can have 2 by simply giong the other way.
		// 3. If multiple refs are bound to the same prop, they should all be updated when one elemnet is updated.
		//    This may be implicit once 1 and 2 are done. We just need to prevent infinite loops.
		(sample.constructor as any).__nextBinding = ref;
		sample.bindings[ref];
		(sample.constructor as any).__nextBinding = undefined;

	}

	configureDependency(cc: IWrappedComponent, name: string){
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
						this.updateProp(cc, name);
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
						this.updateProp(cc, name);
					}
					
					
				});
	
				(rawProp as any).addEventListener("itemremoved", function(e) {
					if(cb instanceof ArrayArgCallback) {
						(cb.dotTarget as any).__document.removeChild((cb.dotTarget as any).__document.childNodes[e.index]);
					}
					else if(cb as AttrArgCallback) {	
						this.updateProp(cc, name);
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
		if(cc.__initializingStyles){
			cc.__rebuildStylesOnPropChange[name] = true;
		}
		if(cc.__initializingBuild){
			cc.__rebuildBuilderOnPropChange[name] = true;
		}
	}
	
	updateProp(obj: IWrappedComponent, name: string){
		let ar = obj.__propContainer.propDependencies[name];
		let value = obj.__propContainer.rawProps[name];
	
		// // {f:contentCallback,startNode:startNode, endNode:endNode,condition:condition}
		let updateStyles = false;
		if(false && obj.__rebuildBuilderOnPropChange[name] && !obj.__initializingBuild){
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
				
				if(obj.__rebuildStylesOnPropChange[name] || (arg instanceof AttrArgCallback && arg.attr == "class")){
					updateStyles = true;
				}
			}
		}
	
		if(updateStyles) obj.$.restyle();
	}
}

const ComponentFactory = new _ComponentFactory();

export default ComponentFactory;