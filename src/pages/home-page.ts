import dot, { IDotElement, IDotCss } from "dothtml";


export default class HomePage extends dot.Component{
	props={
		data: d1
	}

	builder(): IDotElement {
		return dot.div(
			()=>this.props.data[0]
		);
	}
	
	ready(){
		// this.props.data[0] = "1";
		// this.props.data = d2;
		//this.props.data = "1";
	}

	style(css: IDotCss){
		css("div").color("red")
	}
}