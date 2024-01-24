import { IComponent, IDotCss } from "dothtml-interfaces";
import Reactive from "../reactive";
import CollectionVdom from "./collection-vdom";
import { ConditionalVdom } from "./conditional-vdom";
import ElementVdom from "./element-vdom";
import { HtmlVdom } from "./html-vdom";
import { TextVdom } from "./text-vdom";
import { Vdom } from "./vdom";
import { AttributeValueType, ObservableCollection } from "./vdom-types";
import { ComponentVdom } from "./component-vdom";

type ParentVdom = ContainerVdom|ConditionalVdom|ElementVdom;

/**
 * This is the actual document builder.
 */
export class ContainerVdom extends Vdom{
	_children: Array<Vdom> = [];
	_parent: ParentVdom = null;

	constructor(){
		super();
	}

	_addChild(content: Vdom){
		this._children.push(content);
		if(this._parent && this._parent instanceof ElementVdom && this._parent.element) content._render(this._parent.element);
		return this;
	}

	_render(node: HTMLElement){	
		for(let c = 0; c < this._children.length; c++){
			this._children[c]._render(node);
		}
	}

	_unrender() {
		for(let c = 0; c < this._children.length; c++){
			this._children[c]._unrender();
		}
	}

	attr(A: string, c: any){
		let C = this._children[this._children.length - 1];
		if(C && C instanceof ElementVdom){
			C.setAttr(A, c);
		}
		else{
			throw new Error(`Invalid node to set ${A} attribute.`);
		}
	}
	
	html(c: string|Reactive){
		let hn = new HtmlVdom(c);
		return this._addChild(hn);
	}

	text(c: string|Reactive){
		let tn = new TextVdom(c);
		return this._addChild(tn);
	}

	md(c: string|Reactive){
		// TODO: for now, just render as text. 
		// We can add the md functionality later.
		return this.text(c);
	}

	// style(c: string|Reactive|IDotCss){
	// 	if(c instanceof Reactive || typeof c == "string"){
	// 		this.attr("style", c);
	// 	}
	// 	else{
	// 		// It's a style builder.
	// 		if()
	// 	}
	// }

	mount(c: IComponent){
		let cn = new ComponentVdom(c);
		return this._addChild(cn);
	}

	// // TODO: need to support immediate rendering.
	when(condition:Reactive|boolean, then: ContainerVdom|string|boolean|number){
		let condNode = new ConditionalVdom();
		let thenContainer: ContainerVdom;
		if(then instanceof ContainerVdom){
			thenContainer = then;
		}
		else{
			thenContainer = new ContainerVdom();
			let textVdom = new TextVdom(then);
			thenContainer._addChild(textVdom);
			then = thenContainer;
		}
		condNode.addCondition(condition, then);
		this._addChild(condNode);

		return this;
	}
	otherwiseWhen(condition:Reactive|boolean, then: ContainerVdom|string|boolean|number, seal = false){
		let condNode = this._children[this._children.length - 1];
		if(condNode instanceof ConditionalVdom){
			let thenContainer: ContainerVdom;
			if(then instanceof ContainerVdom){
				thenContainer = then;
			}
			else{
				thenContainer = new ContainerVdom();
				let textVdom = new TextVdom(then);
				thenContainer._addChild(textVdom);
				then = thenContainer;
			}
			condNode.addCondition(condition, then, seal);
			// if(this._isCore){
			// 	this._renderChildAndAppend(condNode);
			// }
		}
		else{
			throw new Error("Can't branch off of a non-conditional node.");
		}

		return this;
	}
	otherwise(then: ContainerVdom|string|boolean|number){ return this.otherwiseWhen(true, then, true) }

	each(collection: ObservableCollection, callback: ()=>Vdom){
		let collectionVdom = new CollectionVdom(collection, callback);
		this._addChild(collectionVdom);
		return this;
	}
}

{ // Extending the vdom.
	const allAttributes = [
		"accept",
		"accessKey",
		"action",
		"align",
		"allow",
		"allowFullScreen",
		"aLink",
		"alt",
		"archive",
		"autoCapitalize",
		"autoComplete",
		"autoFocus",
		"autoPlay",
		"autoSave",
		"axis",
		"background",
		"bgColor",
		"border",
		"buffered",
		"cellPadding",
		"cellSpacing",
		"challenge",
		"char",
		"charset",
		"charOff",
		"checked",
		// "cite", //*
		"class",
		"classId",
		"clear",
		"codeBase",
		"codeType",
		"color",
		"cols",
		"colSpan",
		"compact",
		"contentEditable",
		"contextMenu",
		"controls",
		"coords",
		"crossOrigin",
		"dateTime",
		"declare",
		"decoding",
		"default",
		//"data", //*
		"dir",
		"dirName",
		"disabled",
		"download",
		"draggable",
		"dropZone",
		"encType",
		"enterKeyHint",
		"exportParts",
		"face",
		"font",
		"fontFace",
		"fontFaceFormat",
		"fontFaceName",
		"fontFaceSrc",
		"fontFaceUri",
		"fontSpecification",
		"for",
		"foreignObject",
		// "form", //*
		"formAction",
		"frame",
		"frameBorder",
		"headers",
		"height",
		"hidden",
		"high",
		"hRef",
		"hRefLang",
		"hSpace",
		"icon",
		"id",
		"inert",
		"inputMode",
		"images",
		"is",
		"isMap",
		"itemId",
		"itemProp",
		"itemRef",
		"itemScope",
		"itemType",
		"keyType",
		"kind",
		// "label", //*
		"lang",
		"list",
		"loading",
		"longDesc",
		"loop",
		"low",
		"manifest",
		"marginHeight",
		"marginWidth",
		"max",
		"maxLength",
		"media",
		"metadata",
		"method",
		"min",
		"missingGlyph",
		"multiple",
		"muted",
		"name",
		"noHRef",
		"nOnce",
		"noResize",
		"noShade",
		"noValidate",
		"noWrap",
		"open",
		"optimum",
		"part",
		"pattern",
		"ping",
		"placeholder",
		"playsInline",
		"poster",
		"preload",
		"prompt",
		"radioGroup",
		"readOnly",
		"referrerPolicy",
		"rel",
		"required",
		"rev",
		"reversed",
		"role",
		"rows",
		"rowSpan",
		"rules",
		"sandbox",
		"scope",
		"scrolling",
		"seamless",
		"selected",
		"shape",
		"size",
		"sizes",
		// "span", //*
		"spellCheck",
		"src",
		"srcDoc",
		"srcLang",
		"srcSet",
		"standby",
		"start",
		"step",
		// "summary", //*
		"style", // Special
		"tabIndex",
		"target",
		"title",
		"translate",
		"type",
		"useMap",
		"vAlign",
		// "value", // Special behavior.
		"valueType",
		"virtualKeyboardPolicy",
		"width",
		"wrap"
		//"dataA", //Special explicit 
		//"citeA",
		//"formA",
		//"labelA",
		//"spanA",
		//"summaryA"
	];

	for(let i = 0; i < allAttributes.length; i++){
		let A = allAttributes[i];
		ContainerVdom.prototype[A] = function(c){
			this.attr(A, c);
			return this;
		};
	}
}