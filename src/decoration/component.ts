import { IComponent } from "dothtml-interfaces";
import renderCss from "../helpers/render-css";

let tagId = 0x10000;

function restyle(c: IComponent){
	if(c._._meta.shadowRoot && c._?._meta?.sharedStyles){
		c._._meta.shadowRoot.adoptedStyleSheets = c._._meta.sharedStyles;

		// TODO: If there are additional styles, we should return them here too.
	}
}

export function component(Base: new(...args:Array<any>)=>IComponent, styles: []) {

	let ts = (Math.floor(performance.now()*10000000000000)).toString(16);
	let tId = (tagId++).toString(16);
	let tagName = `dothtml-${tId}${component["_addTimestamp"] ? `-${ts}` : ""}`;

	let sharedStyles = null;
	
	if(styles){
		sharedStyles = [];
		for(let i = 0; i < styles.length; i++){
			sharedStyles.push(renderCss(styles[i]));
		}
	}

	// TODO: this isn't working. Might need to get some help from an expert.
	// It's going to be a lot more complex than this... This doesn't even have a reference to the updated module.
	// TODO: before deploying v6, it would be prudent to ensure components have some kind of state.
	// if (module["hot"]) {
    //     module["hot"].accept((err, ...args) => {
    //         if (err) {
    //             console.error("Cannot apply HMR update.", err);
    //         }
	// 		console.log("ACCEPT!!!", tagName, args);
    //     });

    //     module["hot"].dispose((...args) => {
    //         console.log("DISPOSE!!!", tagName, args);
	// 		// TODO:
    //     });
    // }

	// Decorator mode.
	return class extends Base{

		constructor(...args: any[]){
			super(...args);

			if(!this._){
				(this._ as any) = {};
			}
			(this._.refs as any) = {};
			(this._.restyle as any) = ()=>{restyle(this)};
			(this._._meta as any) = this._._meta || {};
			(this._._meta.args as any) = args;
			(this._._meta.isRendered as any) = false;
			(this._._meta.tagName as any) = tagName;
			if(sharedStyles){
				if(this._._meta.sharedStyles){
					(this._._meta.sharedStyles as any) = [...this._._meta.sharedStyles, ...sharedStyles];
				}
				else{
					(this._._meta.sharedStyles as any) = sharedStyles;
				}
			}

		}
	}
}

component["_addTimestamp"] = true; // Turn off for testing.


/*
@dot.component
@dot.style(stylesheet)
class xyz implements IComponent{
	events?: string[];
	_?: FrameworkItems;
	build(...args: any[]): IDotGenericElement {
	}
	style?(css: IDotCss): void {
	}
	creating?(...args: any[]): void {
	}
	ready?(): void {
	}
	deleting?(): void {
	}
	deleted?(): void {
	}
	built?(): void {
	}
}

*/