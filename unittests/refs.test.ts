import addTest from "./core";
import dot, { IDotElement } from "../src/dothtml";

class RefComponent1 extends dot.Component{
	builder(): IDotElement {
		return dot.div(
			dot
				.span().ref("a")
				.span().ref("b")
				.span().ref("c")
		)
	}
	ready(){
		dot(this.$refs.a).t("a");
		dot(this.$refs.b).t("b");
		dot(this.$refs.c).t("c");
	}
}
class RefComponent2 extends dot.Component{
	builder(content): IDotElement {
		return dot.div(
			dot.span().ref("a")
			.h(content)
		)
	}
	ready(){
		dot(this.$refs.a).t("1");
	}
}

addTest("Ref.", ()=>{
	return dot.h(new RefComponent1())
}, "<div><span>a</span><span>b</span><span>c</span></div>");
addTest("Nested ref.", ()=>{
	return dot.h(new RefComponent2(new RefComponent1()))
}, "<div><span>1</span><div><span>a</span><span>b</span><span>c</span></div></div>");