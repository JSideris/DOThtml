import Reactive from "../reactive";
import { VStyle } from "./v-style";

// What we need to support:
// 1. Building a stylesheet that will be added to the document <head>.
// 2. Building a stylesheet that will be added as a CSSStyleSheet object to a shadow root.
// 3. Attaching styles directly to elements via the .style function.
// 4. Observables.
//   a. When attached directly to elements, observables will update the element's value directly.
//   b. When attached to a stylesheet, it would be REALLY cool if we could update scoped variables that set affected props. Take care to escape values properly...


export default class BaseVStyle extends VStyle{

	// Used internally to indicate that this is the base style builder.
	// Calling style functions on this object will create (and return) a new BaseVStyle, rather than extend this one.
	private readonly _isBase = false;
	private props: Array<{prop: string, value: string|Reactive}> = [];
	private subscriptions: Record<number, Reactive> = {};

	// One of these (but not both) should be used.
	private selector: string;
	private target: HTMLElement;

	_render(target: HTMLElement) {
		this.target = target;
		for(let i = 0; i < this.props.length; i++){
			let P = this.props[i];

			let value = "";
			if(P.value instanceof Reactive){
				let id = P.value.subscribeStyle(this, P.prop);
				this.subscriptions[id] = P.value;

				value = P.value.getValue();
			}
			else{
				value = P.value;
			}

			this.updateProp(P.prop, value);
		}
	}
	_unrender() {
		// Main thing to do is clear up all the observabels.
		for(let s in this.subscriptions){
			let P = this.subscriptions[s];

			P.detachBinding(Number(s));
		}

		this.target = null;
	}

	updateProp(prop: string, value: string){

		if(this.target){
			this.target.style[prop] = value;
		}
	}

	setProp(propName, value){
		if(this._isBase){
			let newStyle = new BaseVStyle();
			return newStyle.setProp(propName, value);
		}
		else{
			// TODO: handle builders here too.
			if(value && value.call && value.apply){
				// Might be a builder.
			}
			else{
				if(this.target){
					let observerId = value.subscribeStyle(this, propName);
					this.subscriptions[observerId] = value;

					let valueAsStr = "";
					if(value instanceof Reactive){
						valueAsStr = value.getValue();
					}
					else{
						valueAsStr = value;
					}
					this.updateProp(propName, valueAsStr);
				}
				this.props.push({prop: propName, value: value});
			}
			return this;
		}
	}
}

{
	// This data structure needs to be replaced. But for now it will get the job done.
	// Should aim to replace in in a future subversion of v6.
	// The limitations come because the types accepted by CSS props are so much more than what's listed below.
	// One option is to put the prop names as strings and have |-separated types indicating all the arg configurations.
	const _allProps = {
		"color": "color|background-Color|border-Bottom-Color|border-Color|border-Left-Color|border-Right-Color|border-Top-Color|text-Decoration-Color|outline-Color|column-Rule-Color",
		"length": "background-Size|block-Size|border-Bottom-Left-Radius|border-Bottom-Right-Radius|border-Bottom-Width|border-Image-Width|border-Left-Width|border-Radius|border-Right-Width|border-Top-Left-Radius|border-Top-Right-Radius|border-Top-Width|border-Width|bottom|gap|height|left|margin|margin-Bottom|margin-Left|margin-Right|margin-Top|max-Height|max-Width|min-Height|min-Width|padding|padding-Bottom|padding-Left|padding-Right|padding-Top|right|top|width|line-Height|flex-Basis|font-Size|text-Indent",
		"url": "background-Image|border-Image|list-Style-Image|content|image-Orientation",
		"transformation": "transform",
		"filter": "filter|backdrop-Filter",
		"misc": "appearance|aspect-Ratio|opacity|background|background-Attachment|background-Blend-Mode|background-Position|background-Repeat|background-Clip|background-Origin|border|border-Bottom|border-Bottom-Style|border-Image-Outset|border-Image-Repeat|border-Image-Slice|border-Image-Source|border-Left|border-Left-Style|border-Right|border-Right-Style|border-Style|border-Top|border-Top-Style|box-Decoration-Break|box-Shadow|clear|clip|display|float|overflow|box|overflow-X|overflow-Y|position|visibility|vertical-Align|z-Index|align-Content|align-Items|align-Self|flex|flex-Basis|flex-Direction|flex-Flow|flex-Grow|flex-Shrink|flex-Wrap|grid|grid-Area|grid-Auto-Columns|grid-auto-Rows|grid-Column|grid-Column-End|grid-Column-Gap|grid-Column-Start|grid-Gap|grid-Row|grid-Row-End|grid-Row-Gap|grid-Row-Start|grid-Template|grid-Template-Areas|grid-Template-Columns|grid-Template-Rows|justify-Content|order|hanging-Punctuation|hyphens|letter-Spacing|line-Break|overflow-Wrap|tab-Size|text-Align|text-Align-Last|text-Combine-Upright|text-Justify|text-Transform|white-Space|word-Break|word-Spacing|word-Wrap|text-Decoration|text-Decoration-Line|text-Decoration-Style|text-Shadow|text-Underline-Position|font|font-Family|font-Feature-Settings|font-Kerning|font-Language-Override|font-Size-Adjust|font-Stretch|font-Style|font-Synthesis|font-Variant|font-Variant-Alternates|font-Variant-Caps|font-Variant-East-Asian|font-Variant-Ligatures|font-Variant-Numeric|font-Variant-Position|font-Weight|direction|text-Orientation|text-Combine-Upright|unicode-Bidi|user-Select|writing-Mode|border-Collapse|border-Spacing|caption-Side|empty-Cells|table-Layout|counter-Increment|counter-Reset|list-Style|list-Style-Position|list-Style-Type|animation|animation-Delay|animation-Direction|animation-Duration|animation-Fill-Mode|animation-Iteration-Count|animation-Name|animation-Play-State|animation-Timing-Function|backface-Visibility|perspective2d|perspective-Origin|transform-Origin|transform-Style|transition|transition-Property|transition-Duration|transition-Timing-Function|transition-Delay|box-Sizing|cursor|ime-Mode|nav-Down|nav-Index|nav-Left|nav-Right|nav-Up|outline|outline-Offset|outline-Style|outline-Width|resize|text-Overflow|break-After|break-Before|break-Inside|column-Count|column-Fill|column-Gap|column-Rule|column-Rule-Style|column-Rule-Width|column-Span|column-Width|columns|widows|orphans|page-Break-After|page-Break-Before|page-Break-Inside|marks|quotes|image-Rendering|image-Resolution|object-Fit|object-Position|mask|mask-Type|mark|mark-After|mark-Before|phonemes|rest|rest-After|rest-Before|voice-Balance|voice-Duration|voice-Pitch|voice-Pitch-Range|voice-Rate|voice-Stress|voice-Volume|marquee-Direction|marquee-Play-Count|marquee-Speed|marquee-Style|pointer-Events"
	}

	for(let k in _allProps){
		let str = _allProps[k];
		let props = str.split("|");
		
		let types = k.split("|");

		for(let t in types){
		
			for(let i = 0; i < props.length; i++){
				let pName = props[i];
				let cssName = pName.toLowerCase();
				let jsName = pName.split("-").join("");

				BaseVStyle.prototype[jsName] = function(){
					return this.setProp(cssName, ...arguments);
				}
			}
		}
	}
}