import { IDotcssProp } from "dothtml-interfaces";

// TODO: Don't forget that this needs to support both elements and css targets.

export default class StyleVNode{
	constructor(styleValue: IDotcssProp){

	}

	render(target: HTMLElement|string){
		
	}

	unrender(){
		// TODO: need to deregister from the observable (if applicable).
	}
}