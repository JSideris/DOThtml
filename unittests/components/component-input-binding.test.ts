import addTest from "../core";
import {dot, DotComponent, IDotElement} from "../../src/dothtml";

class ComponentA extends DotComponent{

	props = {
		myNumb: 10,
		myString: "a",
		myDate: new Date(1989,3,2),
		myDynamic: null as any,
		myColor: "#FF0000",
		myBoolean: true,

		myRadioA: "1",
		myRadioB: "3",

		myWeek: "2023-W24",
		myMonth: "2023-06",

		mySelect: 1
	}

	bindings = {
		"text": this.props.myString,
		"dynamictext": this.props.myDynamic,
		"radio1": this.props.myRadioA,
		"radio2": this.props.myRadioA,
		"radio3": this.props.myRadioB,
		"radio4": this.props.myRadioB,
		"checkbox": this.props.myBoolean,
		"color": this.props.myColor,
		"date": this.props.myDate,
		// TODO: file???
		"month": this.props.myMonth,
		"number": this.props.myNumb,
		"range": this.props.myNumb,
		"time": this.props.myDate,
		"week": this.props.myWeek,
		"textarea": this.props.myString,
		"select": this.props.mySelect
	}

	builder(...args: any[]): IDotElement {
		return dot.div(
			dot
			.input().type("text").ref("text")
			.input().type("text").value("abc").ref("dynamictext")
			.input().type("number").ref("number")
			.input().type("range").min(0).max(100).ref("range")
			// These following few are all just text.
			// .input().type("password")
			// .input().type("email").ref("email")
			// .input().type("hidden").ref("hidden")
			// .input().type("search")
			// .input().type("tel").ref("tel")
			// .input().type("url").ref("url")
			.input().type("radio").name("radio-a").value("1").ref("radio1")
			.input().type("radio").name("radio-a").value("2").ref("radio2")
			.input().type("radio").name("radio-b").value("3").ref("radio3")
			.input().type("radio").name("radio-b").value("4").ref("radio4")
			.input().type("checkbox").ref("checkbox") // TODO: make sure we test undefined.
			.input().type("color").ref("color")
			.input().type("date").ref("date")
			.input().type("month").ref("month")
			.input().type("time").ref("time")
			.input().type("week").ref("week")
			// .input().type("datetime-local").ref("datetimelocal")
			.input().type("file").ref("file") // TODO: figure out how this will work.
			.textArea().ref("textarea")
			.select(
				dot
				.option(1).value(1)
				.option(2).value(2)
			).ref("select")
		);
	}
}

{ // Default values.

	addTest("Default prop value sets bound text inputs.", function(){ 
		let c = new ComponentA();
		return dot.t((c.$refs.text as HTMLInputElement).value.toString());
	}, "a");

	addTest("Default prop value sets bound dynamic text inputs.", function(){ 
		let c = new ComponentA();
		return dot.t((c.$refs.dynamictext as HTMLInputElement).value.toString());
	}, "a");

	addTest("Default prop value sets bound number inputs.", function(){ 
		let c = new ComponentA();
		return dot.t((c.$refs.number as HTMLInputElement).value.toString());
	}, "2023-06");

	addTest("Default prop value sets bound range inputs.", function(){ 
		let c = new ComponentA();
		return dot.t((c.$refs.range as HTMLInputElement).value.toString());
	}, "10");

	addTest("Default prop value sets bound radio inputs.", function(){ 
		let c = new ComponentA();
		return dot.t(`${(c.$refs.radio1 as HTMLInputElement).value.toString()} ${(c.$refs.radio2 as HTMLInputElement).value.toString()} ${(c.$refs.radio3 as HTMLInputElement).value.toString()} ${(c.$refs.radio4 as HTMLInputElement).value.toString()}`);
	}, "true false true false");

	addTest("Default prop value sets bound checkbox inputs.", function(){ 
		let c = new ComponentA();
		return dot.t((c.$refs.checkbox as HTMLInputElement).value.toString());
	}, "true");

	addTest("Default prop value sets bound color inputs.", function(){ 
		let c = new ComponentA();
		return dot.t((c.$refs.color as HTMLInputElement).value.toString());
	}, "#FF0000");

	addTest("Default prop value sets bound date inputs.", function(){ 
		let c = new ComponentA();
		return dot.t((c.$refs.date as HTMLInputElement).value.toString());
	}, "1989-03-02");

	addTest("Default prop value sets bound month inputs.", function(){ 
		let c = new ComponentA();
		return dot.t((c.$refs.month as HTMLInputElement).value.toString());
	}, "2023-06");

	addTest("Default prop value sets bound week inputs.", function(){ 
		let c = new ComponentA();
		return dot.t((c.$refs.week as HTMLInputElement).value.toString());
	}, "2023-W24");

	addTest("Default prop value sets bound time inputs.", function(){ 
		let c = new ComponentA();
		return dot.t((c.$refs.time as HTMLInputElement).value.toString());
	}, "0:00");

	// TODO: take a moment to figure this out if possible.
	// addTest("Default prop value sets bound file inputs.", function(){ 
	// 	let c = new ComponentA();
	// 	return dot.t((c.$refs.file as HTMLInputElement).value.toString());
	// }, "1989-03-02");

	addTest("Default prop value sets bound textarea inputs.", function(){ 
		let c = new ComponentA();
		return dot.t((c.$refs.textarea as HTMLTextAreaElement).value.toString());
	}, "a");

	addTest("Default prop value sets bound select inputs.", function(){ 
		let c = new ComponentA();
		return dot.t((c.$refs.select as HTMLSelectElement).value.toString());
	}, "1");

}

{ // Updating prop sets element.

	addTest("Updating prop value sets bound text inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.myString = "b";
		return dot.t((c.$refs.text as HTMLInputElement).value.toString());
	}, "b");

	addTest("Updating prop value sets bound dynamic text inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.myString = "b";
		return dot.t((c.$refs.dynamictext as HTMLInputElement).value.toString());
	}, "b");

	addTest("Updating prop value sets bound number inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.myNumb = 20;
		return dot.t((c.$refs.number as HTMLInputElement).value.toString());
	}, "20");

	addTest("Updating prop value sets bound range inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.myNumb = 20;
		return dot.t((c.$refs.range as HTMLInputElement).value.toString());
	}, "20");

	addTest("Updating prop value sets bound radio inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.myRadioA = "2";
		c.props.myRadioB = "4";
		return dot.t(`${(c.$refs.radio1 as HTMLInputElement).value.toString()} ${(c.$refs.radio2 as HTMLInputElement).value.toString()} ${(c.$refs.radio3 as HTMLInputElement).value.toString()} ${(c.$refs.radio4 as HTMLInputElement).value.toString()}`);
	}, "false true false true");

	addTest("Updating prop value sets bound checkbox inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.myBoolean = false;
		return dot.t((c.$refs.checkbox as HTMLInputElement).value.toString());
	}, "false");

	// Not supported, because then we can't bind the value to an actual boolean.
	// addTest("Undecided option for checkboxes.", async function(){ 
	// 	let c = new ComponentA();
	// 	dot(document.body).h(c);
	// 	c.props.myBoolean = undefined;
	// 	return dot.t((c.$refs.checkbox as HTMLInputElement).value.toString());
	// }, "undefined");

	addTest("Updating prop value sets bound color inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.myColor = "#00FF00";
		return dot.t((c.$refs.color as HTMLInputElement).value.toString());
	}, "#00FF00");

	addTest("Updating prop value sets bound date inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.myDate = new Date("1989-03-03");
		return dot.t((c.$refs.date as HTMLInputElement).value.toString());
	}, "1989-03-03");

	addTest("Updating prop value sets bound month inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.myMonth = "2023-07";
		return dot.t((c.$refs.month as HTMLInputElement).value.toString());
	}, "2023-07");

	addTest("Updating prop value sets bound week inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.myWeek = "2023-W25";
		return dot.t((c.$refs.week as HTMLInputElement).value.toString());
	}, "2023-W25");

	addTest("Updating prop value sets bound time inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.myDate = new Date(2020,1,1,12,0);
		return dot.t((c.$refs.time as HTMLInputElement).value.toString());
	}, "12:00");

	// TODO: take a moment to figure this out if possible.
	// addTest("Updating prop value sets bound file inputs.", async function(){ 
	// 	let c = new ComponentA();
		// dot(document.body).h(c);
		// c.props.xyz = "";
		// return dot.t((c.$refs.file as HTMLInputElement).value.toString());
	// }, "???");

	addTest("Updating prop value sets bound textarea inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.myString = "";
		return dot.t((c.$refs.textarea as HTMLTextAreaElement).value.toString());
	}, "b");

	addTest("Updating prop value sets bound select inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.mySelect = 2;
		return dot.t((c.$refs.select as HTMLSelectElement).value.toString());
	}, "2");

}

{ // Updating field sets prop.
	addTest("Updating prop value sets bound text inputs.", async function(){ 
		let c = new ComponentA();

		dot(document.body).h(c);
		(c.$refs.text as HTMLInputElement).value = "b";
		return dot.t(c.props.myString.toString());
	}, "b");

	addTest("Updating prop value sets bound dynamic text inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		(c.$refs.dynamictext as HTMLInputElement).value = "b";
		return dot.t(c.props.myString.toString());
	}, "b");

	addTest("Updating prop value sets bound number inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		(c.$refs.number as HTMLInputElement).value = "20";
		return dot.t(c.props.myNumb.toString());
	}, "20");

	addTest("Updating prop value sets bound range inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		(c.$refs.range as HTMLInputElement).value = "20";
		return dot.t(c.props.myNumb.toString());
	}, "20");

	addTest("Updating prop value sets bound radio inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.myRadioA = "2";
		c.props.myRadioB = "4";
		return dot.t(`${(c.$refs.radio1 as HTMLInputElement).value.toString()} ${(c.$refs.radio2 as HTMLInputElement).value.toString()} ${(c.$refs.radio3 as HTMLInputElement).value.toString()} ${(c.$refs.radio4 as HTMLInputElement).value.toString()}`);
	}, "false true false true");

	addTest("Updating prop value sets bound checkbox inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		(c.$refs.checkbox as HTMLInputElement).value = "false";
		return dot.t(c.props.myBoolean.toString());
	}, "false");

	// Not supported, because then we can't bind the value to an actual boolean.
	// addTest("Undecided option for checkboxes.", async function(){ 
	// 	let c = new ComponentA();
	// 	dot(document.body).h(c);
	// 	c.props.myBoolean = undefined;
	// 	return dot.t((c.$refs.checkbox as HTMLInputElement).value.toString());
	// }, "undefined");

	addTest("Updating prop value sets bound color inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		(c.$refs.color as HTMLInputElement).value = "#00FF00";
		return dot.t(c.props.myColor.toString());
	}, "#00FF00");

	addTest("Updating prop value sets bound date inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		(c.$refs.date as HTMLInputElement).value = new Date("1989-03-03").toString();
		return dot.t(c.props.myDate.toString());
	}, "1989-03-03");

	addTest("Updating prop value sets bound month inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		(c.$refs.month as HTMLInputElement).value = "2023-07";
		return dot.t(c.props.myMonth.toString());
	}, "2023-07");

	addTest("Updating prop value sets bound week inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		(c.$refs.week as HTMLInputElement).value = "2023-W25";
		return dot.t(c.props.myWeek.toString());
	}, "2023-W25");

	addTest("Updating prop value sets bound time inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		(c.$refs.time as HTMLInputElement).value = new Date(2020,1,1,12,0).toString();
		return dot.t(c.props.myDate.toString());
	}, "12:00");

	// TODO: take a moment to figure this out if possible.
	// addTest("Updating prop value sets bound file inputs.", async function(){ 
	// 	let c = new ComponentA();
		// dot(document.body).h(c);
		// c.props.xyz = "";
		// return dot.t((c.$refs.file as HTMLInputElement).value.toString());
	// }, "???");

	addTest("Updating prop value sets bound textarea inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.myString = "";
		return dot.t((c.$refs.textarea as HTMLTextAreaElement).value.toString());
	}, "b");

	addTest("Updating prop value sets bound select inputs.", async function(){ 
		let c = new ComponentA();
		dot(document.body).h(c);
		c.props.mySelect = 2;
		return dot.t((c.$refs.select as HTMLSelectElement).value.toString());
	}, "2");

}

// TODO: test to make sure updating an input will also update a bound element