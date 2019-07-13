

function InteractiveEmblem(targetSelector, aspectRatio, dotBuilder){
	this.aspectRatio = aspectRatio;
	this.dotBuilder = dotBuilder;
	this.targetSelector = targetSelector;

	this.dot = dot; //TODO: encapsulate.
	this.dotcss = dotcss; //TODO: encapsulate.

	this.outerNode = this.dot(this.targetSelector).div(
		this.dot.div().class("interactive-emblem-inner").style("position: absolute; text-align: center;")
	).class("interactive-emblem-outer").style("position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px; overflow: hidden;").getLast();

	//this.cellNode = this.outerNode.children[0];
	this.innerNode = this.outerNode.children[0];

	this.redraw();
}

InteractiveEmblem.version = "0.2";

//Can these be used?:
//if(this.outerNode.addEventListener) this.outerNode.addEventListener("resize", this.resize);
//else this.outerNode.onresize = this.resize;
//No, doesn't work.

InteractiveEmblem.prototype.resize = function(){
	//var oS = window.getComputedStyle(this.outerNode);
	var oW = this.outerNode.offsetWidth;//oS.width;
	var oH = this.outerNode.offsetHeight;//oS.height;
	var oA = oW / oH;
	if(oA < this.aspectRatio){
		this.innerNode.style.width = oW + "px";
		var nH = Math.round(oW / this.aspectRatio);
		this.innerNode.style.height = nH + "px";
		this.innerNode.style.top = Math.round(oH * 0.5 - nH * 0.5) + "px";
		this.innerNode.style.left = 0;
	}
	else{
		this.innerNode.style.height = oH + "px";
		var nW = Math.round(oH * this.aspectRatio);
		this.innerNode.style.width = nW + "px";
		this.innerNode.style.left = Math.round(oW * 0.5 - nW * 0.5) + "px";
		this.innerNode.style.top = 0;
	}

	this.dotBuilder && this.dotBuilder.resize && this.dotBuilder.resize(this, this.dot, this.dotcss);
}

InteractiveEmblem.prototype.redraw = function(){
	this.skip();
	while (this.innerNode.hasChildNodes()) {
		this.innerNode.removeChild(this.innerNode.lastChild);
	}

	this.resize(this, this.dot, this.dotcss);
	
	this.dotBuilder && this.dotBuilder.play && this.innerNode && dot(this.innerNode).h(this.dotBuilder.draw(this, this.dot, this.dotcss));
	this.dotBuilder && this.dotBuilder.resize && this.dotBuilder.resize(this, this.dot, this.dotcss);
}

//If this logo has an animation, play it. If it's already playing, do nothing.
InteractiveEmblem.prototype.play = function(){
	this.skip();
	this.dotBuilder && this.dotBuilder.play && this.dotBuilder.play(this, this.dot, this.dotcss);
}

//If this logo has an animation, skip it and just display the final logo.
InteractiveEmblem.prototype.skip = function(){
	this.dotBuilder && this.dotBuilder.skip && this.dotBuilder.skip(this, this.dot, this.dotcss);
}
