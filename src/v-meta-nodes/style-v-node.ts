import { IDotCss } from "dothtml-interfaces";
import cssProps from "../css/css-props";
import Reactive from "../reactive";
import VMetaNode from "./v-meta-node";
import CssFunctionBuilderVStyle from "../v-style-nodes/css-function-builder-v-style";
import FilterVStyle from "../v-style-nodes/filter-v-style";
import TransformVStyle from "../v-style-nodes/transform-v-style";
import { formatCssLength } from "../css/format-css-type";

// TODO: Don't forget that this needs to support both elements and css targets.

/**
 * Plan: 
 * 1. DONE - Build a style bulider to apply inline styles to HTML elements.
 * 2. DONE - Support reactive styles.
 * 3. CANCELLED - Support unrendering. // Is this just the same as reactive styles? Should be.
 * 4. Support toString().
 * 5. DONE - Support sub-builders (filter, transform, etc).
 * 6. Support adding to the document head or to the shadow root.
 * 7. Component-scoped variables (may require looking into how shared styles (and otherwise) are applied to shadow roots).
 */



export default class StyleVNode extends VMetaNode{
	target: NodeListOf<Element>|HTMLElement|string;
	document: Document;
	shadowRoot: ShadowRoot;
	styleValue: IDotCss;

	observables: Array<Reactive> = [];
	observableIds: Array<number> = [];

	constructor(styleValue: IDotCss){
		super();
		this.styleValue = styleValue;

		{ // Get observables and nested nodes.
			for(let prop in this.styleValue){
				let value = this.styleValue[prop];
				if(value instanceof Reactive){
					this.observables.push(value);
				}
				else if(typeof value === "object"){
					// For example: { blur: 5 }

					let builder: CssFunctionBuilderVStyle;
					switch(prop){
						case "filter": {
							builder = new FilterVStyle(prop);
							break;
						}
						case "transform": {
							builder = new TransformVStyle(prop);
							break;
						}
					}

					for(let k in value){
						let v = value[k];
						if(v instanceof Reactive){
							this.observables.push(v);
						}
						else if(v instanceof Array){
							for(let j in v){
								let w = v[j];
								if(w instanceof Reactive){
									this.observables.push(w);
								}
							}
						}

						if(builder && builder[k]){
							builder[k](v);
						}
					}

					if(builder){
						this.styleValue[prop] = builder;
					}
				}
			}
		}
	}

	render(target: HTMLElement|string, document: Document = window.document, shadowRoot?: ShadowRoot){
		this.target = target;
		this.document = document;
		this.shadowRoot = shadowRoot;

		{ // Subscribe all the observables.
			for(let i in this.observables){
				let observable = this.observables[i];
				let id = observable.subscribeAttrCollection(this);
				this.observableIds.push(id);
			}
		}

		this.update();
	}

	update(){

		let allStylesToApply: Array<{cssProp: string, cssValue: string}> = [];
		for(let prop in this.styleValue){
			// this.target.style[prop] = this.styleValue[prop];
			let cssValue;
			{ // Get the value.
				let value = this.styleValue[prop];
				if(value instanceof Reactive){
					cssValue = value.getValue();
				}
				else if(value instanceof CssFunctionBuilderVStyle){
					cssValue = value.toString();
				}
				else{
					cssValue = `${value}`;
				}
			}
			
			let cssType, cssProp, cssUnit;
			{ // Get the prop.
				let registeredProp = cssProps[prop];
				// console.log("Registered prop??", prop, registeredProp);
				if(registeredProp){
					cssType = cssProps[prop].type;
					cssProp = cssProps[prop].cssName;
					cssUnit = cssProps[prop].unit;
					// switch(cssProp.type){
					// 	default:
					// 	{
					// 		this.target.style[cssProp.cssName] = cssValue;
					// 		break;
					// 	}
					// }
				}
				else{
					cssType = "custom";
					cssProp = prop;
				}
			}

			// Apply them to the list.
			let formattedValue = cssValue;
			// TODO: do other types.
			switch(cssType){
				case "length":
					formattedValue = formatCssLength(cssValue, cssUnit);
					break;
			}
			
			allStylesToApply.push({cssProp, cssValue: formattedValue});
		}

		if(this.target instanceof HTMLElement){
			// Apply the styles directly to the element.
			for(let i in allStylesToApply){
				let assignment = allStylesToApply[i];
				this.target.style[assignment.cssProp] = assignment.cssValue;
			}
		}
		else if(typeof this.target === "string"){
			// TODO:
			// This needs to support several things.
			// If a document was provided but not a shadow root, we should add the style to the document head.
			// If a shadow root was provided, we should add the style to the shadow root.
			// The string may also be a pseudo selector or an at rule.
			
		}
	}

	unrender(){
		// TODO: need to deregister from the observable (if applicable).
		for(let i in this.observableIds){
			let id = this.observableIds[i];
			let observable = this.observables[i];
			observable.detachBinding(id);
		}

		this.observables.length = 0;
	}

	toString(){}
}