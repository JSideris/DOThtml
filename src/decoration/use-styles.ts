import { IComponent } from "dothtml-interfaces";
import renderCss from "../helpers/render-css";

export function useStyles(styleCallback) {

	let sharedStyles = renderCss(styleCallback);

	return function(Base: new(...args:Array<any>)=>IComponent){
		return class extends Base{
	
			constructor(...args: any[]){
				super(...args);
				if(!this._){
					(this._ as any) = {_meta: {}};
				}
				if(!this._._meta.sharedStyles){
					(this._._meta.sharedStyles as any) = [];
				}
				this._._meta.sharedStyles.push(sharedStyles);
			}
		}
	}
}


