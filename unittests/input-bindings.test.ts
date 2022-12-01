import addTest from "./core";
import dot from "../src/dothtml";
import Component from "../src/component";

// TODO: not sure if this is a valid test case.
// The change event is dispatched on the option element, not the select.
// Need to ensure this works with real elements and user interaction.
class CompBindingInputChangeOption extends Component{
    props:{myValue:boolean} = {myValue: false}
    builder(){
        return dot.select(
            dot.option("a").value("a").selected()
            .option("b").value("b").bindTo(this.props.myValue)
            .option("c").value("c"))}
    ready(){
        dot(this.$el).as(dot.select).setVal("b");
        //this.myValue.setFrom(this.$el.childNodes[1]);
        var v = dot(this.$el).as(dot.select).getVal();
        this.$el.children[1].dispatchEvent(new Event("change"));
        dot(this.$el.parentNode as ParentNode).empty()
        .div("Var: " + this.props.myValue)
        .div("Input: " + v);
    }
}

class CompBindingWriteInput extends Component{builder(){return dot.div(new CompBindingWrite(dot.input(), "a", "b"))}}
class CompBindingVarChangeInput extends Component{builder(){return dot.div(new CompBindingVarChange(dot.input(), "a", "b"))}}
class CompBindingInputChangeInput extends Component{builder(){return dot.div(new CompBindingInputChange(dot.input(), "a", "b"))}}
class CompBindingWriteTextArea extends Component{builder(){return dot.div(new CompBindingWrite(dot.textArea("x"), "a", "b"))}}
class CompBindingVarChangeTextArea extends Component{builder(){return dot.div(new CompBindingVarChange(dot.textArea("x"), "a", "b"))}}
class CompBindingInputChangeTextArea extends Component{builder(){return dot.div(new CompBindingInputChange(dot.textArea("x"), "a", "b"))}}
class CompBindingWriteCheckboxOn extends Component{builder(){return dot.div(new CompBindingWrite(dot.input().type("checkbox"), false, true))}}
class CompBindingVarChangeCheckboxOn extends Component{builder(){return dot.div(new CompBindingVarChange(dot.input().type("checkbox"), false, true))}}
class CompBindingInputChangeCheckboxOn extends Component{builder(){return dot.div(new CompBindingInputChange(dot.input().type("checkbox"), false, true))}}
class CompBindingWriteCheckboxOff extends Component{builder(){return dot.div(new CompBindingWrite(dot.input().type("checkbox").checked(), true, false))}}
class CompBindingVarChangeCheckboxOff extends Component{builder(){return dot.div(new CompBindingVarChange(dot.input().type("checkbox").checked(), true, false))}}
class CompBindingInputChangeCheckboxOff extends Component{builder(){return dot.div(new CompBindingInputChange(dot.input().type("checkbox").checked(), true, false))}}
class CompBindingWriteRadioOn extends Component{builder(){return dot.div(new CompBindingWrite(dot.input().type("radio").name("radiotest1"), false, true))}}
class CompBindingVarChangeRadioOn extends Component{builder(){return dot.div(new CompBindingVarChange(dot.input().type("radio").name("radiotest2"), false, true))}}
class CompBindingInputChangeRadioOn extends Component{builder(){return dot.div(new CompBindingInputChange(dot.input().type("radio").name("radiotest3"), false, true))}}
class CompBindingWriteRadioOff extends Component{builder(){return dot.div(new CompBindingWrite(dot.input().type("radio").name("radiotest4"), true, false))}}
class CompBindingVarChangeRadioOff extends Component{builder(){return dot.div(new CompBindingVarChange(dot.input().type("radio").name("radiotest5"), true, false))}}
class CompBindingInputChangeRadioOff extends Component{builder(){return dot.div(new CompBindingInputChange(dot.input().type("radio").name("radiotest6"), true, false))}}
class CompBindingWriteSelect extends Component{builder(){return dot.div(new CompBindingWrite(new CompSelect(), "a", "b"))}}
class CompBindingVarChangeSelect extends Component{builder(){return dot.div(new CompBindingVarChange(new CompSelect(), "a", "b"))}}
class CompBindingInputChangeSelect extends Component{builder(){return dot.div(new CompBindingInputChange(new CompSelect(), "a", "b"))}}

class CompBindingWrite extends Component{
    props:{v1:any, v2: any} = {v1: null, v2: null}
    builder(input, v1, v2){
        this.props.v1 = v1;
        this.props.v2 = v2;
        return dot.h(input).as(dot.input).bindTo(this.props.v2);
        // if(input instanceof Component){
        // }
        // else
        //     return dot.h(input).as(dot.input).bindTo(this.props.v2);
    }
    ready(){
        var v = dot(this.$el).as(dot.input).getVal();
        dot(this.$el.parentNode as ParentNode).empty()
        .div("Var: " + this.props.v2)
        .div("Input: " + v);
    }
}
class CompBindingVarChange extends Component{
    props:{v1:any, v2: any} = {v1: null, v2: null}
    builder(input, v1, v2){
        this.props.v1 = v1;
        this.props.v2 = v2;
        return dot.h(input).as(dot.input).bindTo(this.props.v1);
    }
    ready(){
        this.props.v1 = this.props.v2;
        var v = dot(this.$el).as(dot.input).getVal();
        dot(this.$el.parentNode as ParentNode).empty()
        .div("Var: " + this.props.v1)
        .div("Input: " + v);
    }
}

class CompBindingInputChange extends Component{
    props:{v1:any, v2: any} = {v1: null, v2: null}
    builder(input, v1, v2){
        this.props.v1 = v1;
        this.props.v2 = v2;
        //this.myValue = dot.binding(v1);
        return dot.h(input).as(dot.input).bindTo(this.props.v1);
    }
    ready(){
        dot(this.$el).as(dot.input).setVal(this.props.v2);
        var v = dot(this.$el).as(dot.input).getVal();
        this.$el.dispatchEvent(new Event("change"));
        //this.v1 = v;
        dot(this.$el.parentNode as ParentNode).empty()
        .div("Var: " + this.props.v1)
        .div("Input: " + v);
    }
}


// class CompBindingWriteoption extends Component{ builder(){return dot.CompBindingwrite(dot.input(),  false, true)}});
// class CompBindingVarchangeOption extends Component{ builder(){return dot.CompBindingVarchange(dot.input(),  false, true)}});
// class CompBindingInputChangeOption extends Component{ builder(){return dot.CompBindingInputChange(dot.input(),  false, true)}});
class CompBindingWriteOption extends Component{
    props:{myValue:boolean} = {myValue: false}
    builder(){
        this.props.myValue = true;
        return dot.select(
            dot.option("a").value("a").selected()
            .option("b").value("b").bindTo(this.props.myValue)
            .option("c").value("c"))
    }
    ready(){
        var v = dot(this.$el).as(dot.select).getVal();
        dot(this.$el.parentNode as ParentNode).empty()
        .div("Var: " + this.props.myValue).div("Input: " + v)
    }
}
class CompBindingVarChangeOption extends Component{
    props:{myValue:boolean} = {myValue: false}
    builder(){
        this.props.myValue = false;
        return dot.select(
            dot.option("a").value("a").selected()
            .option("b").value("b").bindTo(this.props.myValue)
            .option("c").value("c"))
    }
    ready(){
        this.props.myValue = true;
        var v = dot(this.$el).as(dot.select).getVal();
        dot(this.$el.parentNode as ParentNode).empty()
        .div("Var: " + this.props.myValue)
        .div("Input: " + v)
    }
}

class CompSelect extends Component{ builder(){return dot.select(dot.option("a").value("a").option("b").value("b").option("c").value("c"));}}



addTest("Var bound to input.", function(){return dot.h(new CompBindingWriteInput())}, "<div><div>Var: b</div><div>Input: b</div></div>");
addTest("Var change updating input.", function(){return dot.h(new CompBindingVarChangeInput())}, "<div><div>Var: b</div><div>Input: b</div></div>");
addTest("Input change updating var.", function(){return dot.h(new CompBindingInputChangeInput())}, "<div><div>Var: b</div><div>Input: b</div></div>");
addTest("Var bound to textarea.", function(){return dot.h(new CompBindingWriteTextArea())}, "<div><div>Var: b</div><div>Input: b</div></div>");
addTest("Var change updating textarea.", function(){return dot.h(new CompBindingVarChangeTextArea())}, "<div><div>Var: b</div><div>Input: b</div></div>");
addTest("Textarea change updating var.", function(){return dot.h(new CompBindingInputChangeTextArea())}, "<div><div>Var: b</div><div>Input: b</div></div>");
addTest("Var bound to checkbox on.", function(){return dot.h(new CompBindingWriteCheckboxOn())}, "<div><div>Var: true</div><div>Input: true</div></div>");
addTest("Var change updating checkbox on.", function(){return dot.h(new CompBindingVarChangeCheckboxOn())}, "<div><div>Var: true</div><div>Input: true</div></div>");
addTest("Checkbox change updating var on.", function(){return dot.h(new CompBindingInputChangeCheckboxOn())}, "<div><div>Var: true</div><div>Input: true</div></div>");
addTest("Var bound to checkbox off.", function(){return dot.h(new CompBindingWriteCheckboxOff())}, "<div><div>Var: false</div><div>Input: false</div></div>");
addTest("Var change updating checkbox off.", function(){return dot.h(new CompBindingVarChangeCheckboxOff())}, "<div><div>Var: false</div><div>Input: false</div></div>");
addTest("Checkbox change updating var.", function(){return dot.h(new CompBindingInputChangeCheckboxOff())}, "<div><div>Var: false</div><div>Input: false</div></div>");
addTest("Var bound to radio on.", function(){return dot.h(new CompBindingWriteRadioOn())}, "<div><div>Var: true</div><div>Input: true</div></div>");
addTest("Var change updating radio on.", function(){return dot.h(new CompBindingVarChangeRadioOn())}, "<div><div>Var: true</div><div>Input: true</div></div>");
addTest("Radio change updating var on.", function(){return dot.h(new CompBindingInputChangeRadioOn())}, "<div><div>Var: true</div><div>Input: true</div></div>");
addTest("Var bound to radio off.", function(){return dot.h(new CompBindingWriteRadioOff())}, "<div><div>Var: false</div><div>Input: false</div></div>");
addTest("Var change updating radio off.", function(){return dot.h(new CompBindingVarChangeRadioOff())}, "<div><div>Var: false</div><div>Input: false</div></div>");
addTest("Radio change updating var off.", function(){return dot.h(new CompBindingInputChangeRadioOff())}, "<div><div>Var: false</div><div>Input: false</div></div>");
addTest("Var bound to select.", function(){return dot.h(new CompBindingWriteSelect())}, "<div><div>Var: b</div><div>Input: b</div></div>");
addTest("Var change updating select.", function(){return dot.h(new CompBindingVarChangeSelect())}, "<div><div>Var: b</div><div>Input: b</div></div>");
addTest("Select change updating var.", function(){return dot.h(new CompBindingInputChangeSelect())}, "<div><div>Var: b</div><div>Input: b</div></div>");
addTest("Var bound to option.", function(){return dot.h(new CompBindingWriteOption())}, "<div>Var: true</div><div>Input: b</div>");
addTest("Var change updating option.", function(){return dot.h(new CompBindingVarChangeOption())}, "<div>Var: true</div><div>Input: b</div>");
addTest("Option change updating var.", function(){return dot.h(new CompBindingInputChangeOption())}, "<div>Var: true</div><div>Input: b</div>");
  // expected output: Object { foo: "bar", baz: 42 }