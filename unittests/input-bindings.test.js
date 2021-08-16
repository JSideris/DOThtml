import addTest from "./core";
import dot from "../src/index";

// TODO: not sure if this is a valid test case.
// The change event is dispatched on the option element, not the select.
// Need to ensure this works with real elements and user interaction.
dot.component({name: "comp_binding_input_change_option",
    builder: function(){
        this.myValue = false;
        return dot.select(
            dot.option("a").value("a").selected()
            .option("b").value("b").bindTo(this, "myValue")
            .option("c").value("c"))},
    ready: function(){
        dot(this.$el).setVal("b");
        //this.myValue.setFrom(this.$el.childNodes[1]);
        var v = dot(this.$el).getVal();
        this.$el.children[1].dispatchEvent(new Event("change"));
        dot(this.$el.parentNode).empty()
        .div("Var: " + this.myValue)
        .div("Input: " + v);
    }
});

dot.component({name: "comp_binding_write_input", builder: function(){return dot.comp_binding_write(dot.input(), "a", "b")}});
dot.component({name: "comp_binding_var_change_input", builder: function(){return dot.comp_binding_var_change(dot.input(), "a", "b")}});
dot.component({name: "comp_binding_input_change_input", builder: function(){return dot.comp_binding_input_change(dot.input(), "a", "b")}});
dot.component({name: "comp_binding_write_textarea", builder: function(){return dot.comp_binding_write(dot.textarea("x"), "a", "b")}});
dot.component({name: "comp_binding_var_change_textarea", builder: function(){return dot.comp_binding_var_change(dot.textarea("x"), "a", "b")}});
dot.component({name: "comp_binding_input_change_textarea", builder: function(){return dot.comp_binding_input_change(dot.textarea("x"), "a", "b")}});
dot.component({name: "comp_binding_write_checkbox_on", builder: function(){return dot.comp_binding_write(dot.input().type("checkbox"), false, true)}});
dot.component({name: "comp_binding_var_change_checkbox_on", builder: function(){return dot.comp_binding_var_change(dot.input().type("checkbox"), false, true)}});
dot.component({name: "comp_binding_input_change_checkbox_on", builder: function(){return dot.comp_binding_input_change(dot.input().type("checkbox"), false, true)}});
dot.component({name: "comp_binding_write_checkbox_off", builder: function(){return dot.comp_binding_write(dot.input().type("checkbox").checked(), true, false)}});
dot.component({name: "comp_binding_var_change_checkbox_off", builder: function(){return dot.comp_binding_var_change(dot.input().type("checkbox").checked(), true, false)}});
dot.component({name: "comp_binding_input_change_checkbox_off", builder: function(){return dot.comp_binding_input_change(dot.input().type("checkbox").checked(), true, false)}});
dot.component({name: "comp_binding_write_radio_on", builder: function(){return dot.comp_binding_write(dot.input().type("radio").name("radiotest1"), false, true)}});
dot.component({name: "comp_binding_var_change_radio_on", builder: function(){return dot.comp_binding_var_change(dot.input().type("radio").name("radiotest2"), false, true)}});
dot.component({name: "comp_binding_input_change_radio_on", builder: function(){return dot.comp_binding_input_change(dot.input().type("radio").name("radiotest3"), false, true)}});
dot.component({name: "comp_binding_write_radio_off", builder: function(){return dot.comp_binding_write(dot.input().type("radio").name("radiotest4"), true, false)}});
dot.component({name: "comp_binding_var_change_radio_off", builder: function(){return dot.comp_binding_var_change(dot.input().type("radio").name("radiotest5"), true, false)}});
dot.component({name: "comp_binding_input_change_radio_off", builder: function(){return dot.comp_binding_input_change(dot.input().type("radio").name("radiotest6"), true, false)}});
dot.component({name: "comp_binding_write_select", builder: function(){return dot.comp_binding_write(dot.component_select(), "a", "b")}});
dot.component({name: "comp_binding_var_change_select", builder: function(){return dot.comp_binding_var_change(dot.component_select(), "a", "b")}});
dot.component({name: "comp_binding_input_change_select", builder: function(){return dot.comp_binding_input_change(dot.component_select(), "a", "b")}});

dot.component({name: "comp_binding_write",
builder: function(input, v1, v2){
    this.v1 = v1;
    this.v2 = v2;
    return input.bindTo(this, "v2");
},
ready: function(){
    var v = dot(this.$el).getVal();
    dot(this.$el.parentNode).empty()
    .div("Var: " + this.v2)
    .div("Input: " + v);
}
});
dot.component({name: "comp_binding_var_change",
builder: function(input, v1, v2){
    this.v1 = v1;
    this.v2 = v2;
    return input.bindTo(this, "v1");
},
ready: function(){
    this.v1 = this.v2;
    var v = dot(this.$el).getVal();
    dot(this.$el.parentNode).empty()
    .div("Var: " + this.v1)
    .div("Input: " + v);
}
});

dot.component({name: "comp_binding_input_change",
builder: function(input, v1, v2){
    this.v1 = v1;
    this.v2 = v2;
    //this.myValue = dot.binding(v1);
    return input.bindTo(this, "v1");
},
ready: function(){
    dot(this.$el).setVal(this.v2);
    var v = dot(this.$el).getVal();
    this.$el.dispatchEvent(new Event("change"));
    //this.v1 = v;
    dot(this.$el.parentNode).empty()
    .div("Var: " + this.v1)
    .div("Input: " + v);
}
});


// dot.component({name: "comp_binding_write_option", builder: function(){return dot.comp_binding_write(dot.input(),  false, true)}});
// dot.component({name: "comp_binding_var_change_option", builder: function(){return dot.comp_binding_var_change(dot.input(),  false, true)}});
// dot.component({name: "comp_binding_input_change_option", builder: function(){return dot.comp_binding_input_change(dot.input(),  false, true)}});
dot.component({name: "comp_binding_write_option",
builder: function(){
    this.myValue = true;
    return dot.select(
        dot.option("a").value("a").selected()
        .option("b").value("b").bindTo(this, "myValue")
        .option("c").value("c"))
},
ready: function(){
    var v = dot(this.$el).getVal();
    dot(this.$el.parentNode).empty()
    .div("Var: " + this.myValue).div("Input: " + v)
}
});
dot.component({name: "comp_binding_var_change_option",
builder: function(){
    this.myValue = false;
    return dot.select(
        dot.option("a").value("a").selected()
        .option("b").value("b").bindTo(this, "myValue")
        .option("c").value("c"))
    },
ready: function(){
    this.myValue = true;
    var v = dot(this.$el).getVal();
    dot(this.$el.parentNode).empty()
    .div("Var: " + this.myValue)
    .div("Input: " + v)
}
});

dot.component({name: "component_select", builder: function(){return dot.select(dot.option("a").value("a").option("b").value("b").option("c").value("c"));}});



addTest("Var bound to input.", function(){return dot.comp_binding_write_input()}, "<div>Var: b</div><div>Input: b</div>");
addTest("Var change updating input.", function(){return dot.comp_binding_var_change_input()}, "<div>Var: b</div><div>Input: b</div>");
addTest("Input change updating var.", function(){return dot.comp_binding_input_change_input()}, "<div>Var: b</div><div>Input: b</div>");
addTest("Var bound to textarea.", function(){return dot.comp_binding_write_textarea()}, "<div>Var: b</div><div>Input: b</div>");
addTest("Var change updating textarea.", function(){return dot.comp_binding_var_change_textarea()}, "<div>Var: b</div><div>Input: b</div>");
addTest("Textarea change updating var.", function(){return dot.comp_binding_input_change_textarea()}, "<div>Var: b</div><div>Input: b</div>");
addTest("Var bound to checkbox on.", function(){return dot.comp_binding_write_checkbox_on()}, "<div>Var: true</div><div>Input: true</div>");
addTest("Var change updating checkbox on.", function(){return dot.comp_binding_var_change_checkbox_on()}, "<div>Var: true</div><div>Input: true</div>");
addTest("Checkbox change updating var on.", function(){return dot.comp_binding_input_change_checkbox_on()}, "<div>Var: true</div><div>Input: true</div>");
addTest("Var bound to checkbox off.", function(){return dot.comp_binding_write_checkbox_off()}, "<div>Var: false</div><div>Input: false</div>");
addTest("Var change updating checkbox off.", function(){return dot.comp_binding_var_change_checkbox_off()}, "<div>Var: false</div><div>Input: false</div>");
addTest("Checkbox change updating var.", function(){return dot.comp_binding_input_change_checkbox_off()}, "<div>Var: false</div><div>Input: false</div>");
addTest("Var bound to radio on.", function(){return dot.comp_binding_write_radio_on()}, "<div>Var: true</div><div>Input: true</div>");
addTest("Var change updating radio on.", function(){return dot.comp_binding_var_change_radio_on()}, "<div>Var: true</div><div>Input: true</div>");
addTest("Radio change updating var on.", function(){return dot.comp_binding_input_change_radio_on()}, "<div>Var: true</div><div>Input: true</div>");
addTest("Var bound to radio off.", function(){return dot.comp_binding_write_radio_off()}, "<div>Var: false</div><div>Input: false</div>");
addTest("Var change updating radio off.", function(){return dot.comp_binding_var_change_radio_off()}, "<div>Var: false</div><div>Input: false</div>");
addTest("Radio change updating var off.", function(){return dot.comp_binding_input_change_radio_off()}, "<div>Var: false</div><div>Input: false</div>");
addTest("Var bound to select.", function(){return dot.comp_binding_write_select()}, "<div>Var: b</div><div>Input: b</div>");
addTest("Var change updating select.", function(){return dot.comp_binding_var_change_select()}, "<div>Var: b</div><div>Input: b</div>");
addTest("Select change updating var.", function(){return dot.comp_binding_input_change_select()}, "<div>Var: b</div><div>Input: b</div>");
addTest("Var bound to option.", function(){return dot.comp_binding_write_option()}, "<div>Var: true</div><div>Input: b</div>");
addTest("Var change updating option.", function(){return dot.comp_binding_var_change_option()}, "<div>Var: true</div><div>Input: b</div>");
addTest("Option change updating var.", function(){return dot.comp_binding_input_change_option()}, "<div>Var: true</div><div>Input: b</div>");