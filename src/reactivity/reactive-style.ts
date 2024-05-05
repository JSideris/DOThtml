import VStyle from "../v-style-nodes/v-style";

export default class ReactiveStyle{
	
	vStyle: VStyle;
	prop: string;

	constructor(vStyle: VStyle, attribute: string){
		this.vStyle = vStyle;
		this.prop = attribute;
	}
}