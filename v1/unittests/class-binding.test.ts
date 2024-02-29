import addTest from "./core";
import {dot} from "../src/dothtml";
import Component from "../src/component";

addTest("Basic immutable class binding.", function(){
    return dot.div().class({
        "foo": true,
        "bar": false,
        "xyz": true
    })
}, "<div class=\"foo xyz\"></div>");

addTest("Class binding to a component property.", function(){
    class C extends Component{
        constructor(v){
            super();
            this.props.prop = v;
        }
        props = {
            prop: false
        };
        builder(){
            return dot.div().class({
                "foo": ()=>this.props.prop,
                "bar": ()=>!this.props.prop,
            })
        }
        ready(){
            this.props.prop = !this.props.prop;
        }
    }

    return dot.h(new C(false)).h(new C(true));

}, "<div class=\"foo\"></div><div class=\"bar\"></div>");

addTest("Class binding to a component property with a style.", function(){
    class C extends Component{
        constructor(v){
            super();
            this.props.prop = v;
        }
        props = {
            prop: false
        };
        builder(){
            return dot.div().class({
                "foo": ()=>this.props.prop,
                "bar": ()=>!this.props.prop,
            })
        }
        ready(){
            this.props.prop = !this.props.prop;
        }
        style(css){
            css("div").backgroundColor("white");
            css(".foo").color("red");
            css(".bar").color("blue");
        }
    }

    return dot.h(new C(false)).h(new C(true));

}, "<div class=\"foo\" style=\"background-color: rgb(255, 255, 255); color: rgb(255, 0, 0);\"></div><div class=\"bar\" style=\"background-color: rgb(255, 255, 255); color: rgb(0, 0, 255);\"></div>");

addTest("Remove styles applied by a class.", function(){
    class C extends Component{
        constructor(v){
            super();
            this.props.prop = v;
        }
        props = {
            prop: false
        };
        builder(){
            return dot.div().class({
                "foo": ()=>this.props.prop,
            })
        }
        ready(){
            this.props.prop = !this.props.prop;
        }
        style(css){
            css(".foo").color("red");
        }
    }

    return dot.h(new C(true));

}, "<div class=\"\"></div>");
addTest("Remove styles applied by a nested class.", function(){
    class C extends Component{
        constructor(v){
            super();
            this.props.prop = v;
        }
        props = {
            prop: false
        };
        builder(){
            return dot.div(
                dot.div().class({
                    "foo": ()=>this.props.prop,
                })
            )
        }
        ready(){
            this.props.prop = !this.props.prop;
        }
        style(css){
            css(".foo").color("red");
        }
    }

    return dot.h(new C(true));

}, "<div><div class=\"\"></div></div>");

addTest("Remove only dynamic styles applied by a class.", function(){
    class C extends Component{
        constructor(v){
            super();
            this.props.prop = v;
        }
        props = {
            prop: false
        };
        builder(){
            return dot.div().class({
                "foo": ()=>this.props.prop,
            }).style(dot.css.backgroundColor("blue"))
        }
        ready(){
            this.props.prop = !this.props.prop;
        }
        style(css){
            css(".foo").color("red");
        }
    }

    return dot.h(new C(true));

}, "<div class=\"\" data-dot-static-styles=\"background-color:rgb(0, 0, 255);\" style=\"background-color:rgb(0, 0, 255);\"></div>");

addTest("Remove only dynamic styles applied by a nested class.", function(){
    class C extends Component{
        constructor(v){
            super();
            this.props.prop = v;
        }
        props = {
            prop: false
        };
        builder(){
            return dot.div(
                dot.div().class({
                    "foo": ()=>this.props.prop,
                }).style(dot.css.backgroundColor("blue"))
            )
        }
        ready(){
            this.props.prop = !this.props.prop;
        }
        style(css){
            css(".foo").color("red");
        }
    }

    return dot.h(new C(true));

}, "<div><div class=\"\" data-dot-static-styles=\"background-color:rgb(0, 0, 255);\" style=\"background-color:rgb(0, 0, 255);\"></div></div>");

addTest("Dynamic styles contribute to static styles.", function(){
    class C extends Component{
        constructor(v){
            super();
            this.props.prop = v;
        }
        props = {
            prop: false
        };
        builder(){
            return dot.div().class({
                "foo": ()=>this.props.prop,
            }).style(dot.css.backgroundColor("blue"))
        }
        ready(){
            this.props.prop = !this.props.prop;
        }
        style(css){
            css(".foo").color("red");
        }
    }

    return dot.h(new C(false));

}, "<div class=\"foo\" data-dot-static-styles=\"background-color:rgb(0, 0, 255);\" style=\"background-color: rgb(0, 0, 255); color: rgb(255, 0, 0);\"></div>");

addTest("Class based on computed field.", function(){
    class C extends Component{
        constructor(){
            super();
        }
        props = {
            prop: []
        };
        builder(){
            return dot.div().class({
                "foo": ()=>this.isFoo,
            })
        }
        get isFoo(){
            let value = this.props.prop.length > 0;
            return value;
        }

        ready(){
            this.props.prop.push(1);
        }
        style(css){
            css(".foo").color("red");
        }
    }

    return dot.h(new C());

}, "<div class=\"foo\" style=\"color: rgb(255, 0, 0);\"></div>");
