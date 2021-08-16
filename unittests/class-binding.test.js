import addTest from "./core";
import dot from "../src/index";

addTest("Basic immutable class binding.", function(){
    return dot.div().class({
        "foo": true,
        "bar": false,
        "xyz": true
    })
}, "<div class=\"foo xyz\"></div>");

addTest("Class binding to a component property.", function(){
    var Component = dot.component({
        builder(v){
            this.prop = v;
            return dot.div().class({
                "foo": ()=>this.prop,
                "bar": ()=>!this.prop,
            })
        },
        props: ["prop"],
        ready(){
            this.prop = !this.prop;
        }
    });

    return dot.h(Component(false)).h(Component(true));

}, "<div class=\"foo\"></div><div class=\"bar\"></div>");

addTest("Class binding to a component property with a style.", function(){
    var Component = dot.component({
        builder(v){
            this.prop = v;
            return dot.div().class({
                "foo": ()=>this.prop,
                "bar": ()=>!this.prop,
            })
        },
        props: ["prop"],
        ready(){
            this.prop = !this.prop;
        },
        style(css){
            css("div").backgroundColor("white");
            css(".foo").color("red");
            css(".bar").color("blue");
        }
    });

    return dot.h(Component(false)).h(Component(true));

}, "<div class=\"foo\" style=\"background-color: rgb(255, 255, 255); color: rgb(255, 0, 0);\"></div><div class=\"bar\" style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 255);\"></div>");
