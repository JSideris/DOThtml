
export class ArgCallback{
    constructor(element, value){
        this.el = element;
        this.f = value;
    }
}

export class AttrArgCallback extends ArgCallback{
    constructor(element, attributeName, value){
        super(element, value);
        this.attr = attributeName;
    }

    updateContent(dot){
        this.el.setAttribute(this.attr, this.f());
    }
}

export class ContentArgCallback extends ArgCallback{
    constructor(element, content){
        super(element, content);
    }

    updateContent(dot, propVal){
        dot(this.el).empty().h(this.f(propVal));
    }
}

export class ArrayArgCallback extends ArgCallback{
    constructor(dotTarget, content){
        super(null, content);
        this.dotTarget = dotTarget;
    }

    updateContent(){}
}

export class ConditionalArgCallback extends ArgCallback{
    constructor(startNode, endNode, content, condition){
        super(null, content);
        this.startNode = startNode;
        this.endNode = endNode;
        this.condition = condition;
        this.lastValue = undefined; // This will be set by the calling code - after the object is added to __currentArgCallback.
    }

    updateContent(dot){
        if(this.lastValue != !!this.condition()){
            this.lastValue = !this.lastValue;
            if(this.lastValue){
                dot._appendOrCreateDocument(this.f, this.endNode.parentNode, this.endNode);
            }
            else {
                do{
                    var e = this.startNode.nextSibling;
                    if(e && e != this.endNode){
                        e.parentNode.removeChild(e);
                    }
                } while(this.startNode.nextSibling && this.startNode.nextSibling != this.endNode)
            }
        }
    }
}
