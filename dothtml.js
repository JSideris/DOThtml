"use strict";
/*
	V0.2
	This is an experimental project created by Joshua Sideris. 
	It has not been released to public yet and you do not have permission to use or distribute it.
	Instead, follow me on Twitter to be notified of an official release.
*/


function DOT (){
	this._es = []; //Element stack
	this._ce = null; //Current element
	this._myDom = null;
	//this._newBlock = false;
	this._lastCondition = true;

}

DOT.prototype.do = DOT.prototype.begin = function(newtarget){
	/*if(typeof newtarget !== "undefined"){*/
		this._es = [$(newtarget)];
		this._ce = newtarget;
	/*}
	else{
		this._es.push(this._ce);
		this._ce = null;
	//}*/
	return DOT;
}

/*DOT.prototype.end = function(){
	//this._newBlock = false;
	if(this._es.length > 1){
		this._ce = this._es.pop();
	}
	return DOT;
}*/

DOT.prototype.attr = function(a, v){
	/*if(!this._ce) {
		console.error("Cannot set attribute " + a + " of null.");
		return this;
	}*/
	this._ce.attr(a, v);
	return DOT;
}

DOT.prototype.el = function(e, c){
	/*if(this._es.length == 0){
		this.begin("body");
	}*/
	this._ce = $("<" + e + "/>");
	if(!typeof c !== "undefined"){
		if(c == DOT){
			//
		}
		else if(!!(c && c.constructor && c.call && c.apply)){
			//c is a function (_ test).
			this._es.push(this._ce);
			this._ce = null;
			c();
			//this._newBlock = false;
			this._ce = this._es.pop();
		}
		else{
			this._ce.html(c);
		}
	}
	this._es[this._es.length - 1].append(this._ce);
	
	return DOT;
}

/*DOT.prototype.iterate = function(iterations, callback, params){
	for(var i = 0; i < iterations; i++){
		callback(i, params);
	}
	
	return DOT;
}

DOT.prototype.each = function(objects, callback){
	for(var i = 0; i < objects.length; i++){
		callback(objects[i]);
	}
	return DOT;
}

DOT.prototype.if = function(condition, callback){
	if(condition) {
		callback();
		this._lastCondition = true;
	}
	else{
		this._lastCondition = false;
	}
	return DOT;
}

DOT.prototype.elseif = function(condition, callback){
	if(!this._lastCondition){
		this.if(condition, callback);
	}
	return DOT;
}

DOT.prototype.else = function(callback){
	if(!this._lastCondition){
		callback();
	}
	return DOT;
}

DOT.prototype.script = function(callback){
	callback();
	return DOT;
}*/

DOT.prototype.wait = function(timeout, callback){
	var target = DOT._ce;
	setTimeout(function(){
		DOT._ce = target;
		callback();
	}, timeout);
	return DOT;
}

DOT.prototype.t = function(c){
	this._ce = null;
	this._es[this._es.length - 1].append($("<div/>").text(c).html());
	return DOT;
}

DOT.prototype.h = function(c){
	this._ce = null;
	this._es[this._es.length - 1].append(c);
	return DOT;
}

DOT.prototype.a = function(c){return this.el("a", c);}
DOT.prototype.aaside = function(c){return this.el("aside", c);}
DOT.prototype.abbr = function(c){return this.el("abbr", c);}
DOT.prototype.address = function(c){return this.el("address", c);}
DOT.prototype.altglyph = function(c){return this.el("altglyph", c);}
DOT.prototype.altglyphdef = function(c){return this.el("altglyphdef", c);}
DOT.prototype.altglyphitem = function(c){return this.el("altglyphitem", c);}
DOT.prototype.animate = function(c){return this.el("animate", c);}
DOT.prototype.animatemotion = function(c){return this.el("animatemotion", c);}
DOT.prototype.animatetransform = function(c){return this.el("animatetransform", c);}
DOT.prototype.area = function(c){return this.el("area", c);}
DOT.prototype.article = function(c){return this.el("article", c);}
DOT.prototype.audio = function(c){return this.el("audio", c);}
DOT.prototype.b = function(c){return this.el("b", c);}
DOT.prototype.bdi = function(c){return this.el("bdi", c);}
DOT.prototype.bdo = function(c){return this.el("bdo", c);}
DOT.prototype.blockquote = function(c){return this.el("blockquote", c);}
DOT.prototype.br = function(c){return this.el("br", c);}
DOT.prototype.button = function(c){return this.el("button", c);}
DOT.prototype.canvas = function(c){return this.el("canvas", c);}
DOT.prototype.caption = function(c){return this.el("caption", c);}
DOT.prototype.circle = function(c){return this.el("circle", c);}
DOT.prototype.clippath = function(c){return this.el("clippath", c);}
DOT.prototype.code = function(c){return this.el("code", c);}
DOT.prototype.col = function(c){return this.el("col", c);}
DOT.prototype.colgroup = function(c){return this.el("colgroup", c);}
DOT.prototype.colorprofile = function(c){return this.el("color-profile", c);}
DOT.prototype.cursor = function(c){return this.el("cursor", c);}
DOT.prototype.datalist = function(c){return this.el("datalist", c);}
DOT.prototype.dd = function(c){return this.el("dd", c);}
DOT.prototype.defs = function(c){return this.el("defs", c);}
DOT.prototype.del = function(c){return this.el("del", c);}
DOT.prototype.desc = function(c){return this.el("desc", c);}
DOT.prototype.details = function(c){return this.el("details", c);}
DOT.prototype.dfn = function(c){return this.el("dfn", c);}
DOT.prototype.dialog = function(c){return this.el("dialog", c);}
DOT.prototype.div = function(c){return this.el("div", c);}
DOT.prototype.dl = function(c){return this.el("dl", c);}
DOT.prototype.dt = function(c){return this.el("dt", c);}
DOT.prototype.ellipse = function(c){return this.el("ellipse", c);}
DOT.prototype.em = function(c){return this.el("em", c);}
DOT.prototype.embed = function(c){return this.el("embed", c);}
DOT.prototype.feblend = function(c){return this.el("feblend", c);}
DOT.prototype.fieldset = function(c){return this.el("fieldset", c);}
DOT.prototype.figcaption = function(c){return this.el("figcaption", c);}
DOT.prototype.figure = function(c){return this.el("figure", c);}
DOT.prototype.footer = function(c){return this.el("footer", c);}
DOT.prototype.g = function(c){return this.el("g", c);}
DOT.prototype.h1 = function(c){return this.el("h1", c);}
DOT.prototype.h2 = function(c){return this.el("h2", c);}
DOT.prototype.h3 = function(c){return this.el("h3", c);}
DOT.prototype.h4 = function(c){return this.el("h4", c);}
DOT.prototype.h5 = function(c){return this.el("h5", c);}
DOT.prototype.h6 = function(c){return this.el("h6", c);}
DOT.prototype.header = function(c){return this.el("header", c);}
DOT.prototype.hr = function(c){return this.el("hr", c);}
DOT.prototype.i = function(c){return this.el("i", c);}
DOT.prototype.iframe = function(c){return this.el("iframe", c);}
DOT.prototype.image = function(c){return this.el("image", c);}
DOT.prototype.img = function(c){return this.el("img", c);}
DOT.prototype.input = function(c){return this.el("input", c);}
DOT.prototype.ins = function(c){return this.el("ins", c);}
DOT.prototype.kbd = function(c){return this.el("kbd", c);}
DOT.prototype.keygen = function(c){return this.el("keygen", c);}
DOT.prototype.legend = function(c){return this.el("legend", c);}
DOT.prototype.li = function(c){return this.el("li", c);}
DOT.prototype.line = function(c){return this.el("line", c);}
DOT.prototype.lineargradient = function(c){return this.el("lineargradient", c);}
DOT.prototype.main = function(c){return this.el("main", c);}
DOT.prototype.map = function(c){return this.el("map", c);}
DOT.prototype.mark = function(c){return this.el("mark", c);}
DOT.prototype.marker = function(c){return this.el("marker", c);}
DOT.prototype.mask = function(c){return this.el("mask", c);}
DOT.prototype.menu = function(c){return this.el("menu", c);}
DOT.prototype.menuitem = function(c){return this.el("menuitem", c);}
DOT.prototype.meter = function(c){return this.el("meter", c);}
DOT.prototype.nav = function(c){return this.el("nav", c);}
DOT.prototype.noscript = function(c){return this.el("noscript", c);}
DOT.prototype.object = function(c){return this.el("object", c);}
DOT.prototype.ol = function(c){return this.el("ol", c);}
DOT.prototype.optgroup = function(c){return this.el("optgroup", c);}
DOT.prototype.option = function(c){return this.el("option", c);}
DOT.prototype.output = function(c){return this.el("output", c);}
DOT.prototype.p = function(c){return this.el("p", c);}
DOT.prototype.param = function(c){return this.el("param", c);}
DOT.prototype.path = function(c){return this.el("path", c);}
DOT.prototype.pattern = function(c){return this.el("pattern", c);}
DOT.prototype.polygon = function(c){return this.el("polygon", c);}
DOT.prototype.polyline = function(c){return this.el("polyline", c);}
DOT.prototype.pre = function(c){return this.el("pre", c);}
DOT.prototype.progress = function(c){return this.el("progress", c);}
DOT.prototype.q = function(c){return this.el("q", c);}
DOT.prototype.radialgradient = function(c){return this.el("radialgradient", c);}
DOT.prototype.rect = function(c){return this.el("rect", c);}
DOT.prototype.rp = function(c){return this.el("rp", c);}
DOT.prototype.rt = function(c){return this.el("rt", c);}
DOT.prototype.ruby = function(c){return this.el("ruby", c);}
DOT.prototype.s = function(c){return this.el("s", c);}
DOT.prototype.samp = function(c){return this.el("samp", c);}
DOT.prototype.section = function(c){return this.el("section", c);}
DOT.prototype.select = function(c){return this.el("select", c);}
DOT.prototype.small = function(c){return this.el("small", c);}
DOT.prototype.source = function(c){return this.el("source", c);}
DOT.prototype.stop = function(c){return this.el("stop", c);}
DOT.prototype.strong = function(c){return this.el("strong", c);}
DOT.prototype.sub = function(c){return this.el("sub", c);}
DOT.prototype.sup = function(c){return this.el("sup", c);}
DOT.prototype.table = function(c){return this.el("table", c);}
DOT.prototype.tbody = function(c){return this.el("tbody", c);}
DOT.prototype.td = function(c){return this.el("td", c);}
DOT.prototype.text = function(c){return this.el("text", c);}
DOT.prototype.textarea = function(c){return this.el("textarea", c);}
DOT.prototype.tfoot = function(c){return this.el("tfoot", c);}
DOT.prototype.th = function(c){return this.el("th", c);}
DOT.prototype.thead = function(c){return this.el("thead", c);}
DOT.prototype.time = function(c){return this.el("time", c);}
DOT.prototype.tr = function(c){return this.el("tr", c);}
DOT.prototype.track = function(c){return this.el("track", c);}
DOT.prototype.tref = function(c){return this.el("tref", c);}
DOT.prototype.tspan = function(c){return this.el("tspan", c);}
DOT.prototype.u = function(c){return this.el("u", c);}
DOT.prototype.ul = function(c){return this.el("ul", c);}
DOT.prototype.use = function(c){return this.el("use", c);}
DOT.prototype.var = function(c){return this.el("var", c);}
DOT.prototype.video = function(c){return this.el("video", c);}
DOT.prototype.wbr = function(c){return this.el("wbr", c);}

DOT.prototype.accept = function(value){return this.attr("accept", value);}
DOT.prototype.acceptcharset = function(value){return this.attr("accept-charset", value);}
DOT.prototype.accesskey = function(value){return this.attr("accesskey", value);}
DOT.prototype.action = function(value){return this.attr("action", value);}
DOT.prototype.align = function(value){return this.attr("align", value);}
DOT.prototype.alink = function(value){return this.attr("alink", value);}
DOT.prototype.alt = function(value){return this.attr("alt", value);}
DOT.prototype.archive = function(value){return this.attr("archive", value);}
DOT.prototype.async = function(value){return this.attr("async", value);}
DOT.prototype.attributename = function(value){return this.attr("attributename", value);}
DOT.prototype.autocomplete = function(value){return this.attr("autocomplete", value);}
DOT.prototype.autofocus = function(value){return this.attr("autofocus", value);}
DOT.prototype.autoplay = function(value){return this.attr("autoplay", value);}
DOT.prototype.autosave = function(value){return this.attr("autosave", value);}
DOT.prototype.axis = function(value){return this.attr("axis", value);}
DOT.prototype.background = function(value){return this.attr("background", value);}
DOT.prototype.bgcolor = function(value){return this.attr("bgcolor", value);}
DOT.prototype.border = function(value){return this.attr("border", value);}
DOT.prototype.buffered = function(value){return this.attr("buffered", value);}
DOT.prototype.by = function(value){return this.attr("by", value);}
DOT.prototype.calcmode = function(value){return this.attr("calcmode", value);}
DOT.prototype.cellpadding = function(value){return this.attr("cellpadding", value);}
DOT.prototype.cellspacing = function(value){return this.attr("cellspacing", value);}
DOT.prototype.challenge = function(value){return this.attr("challenge", value);}
DOT.prototype.char = function(value){return this.attr("char", value);}
DOT.prototype.charoff = function(value){return this.attr("charoff", value);}
DOT.prototype.charset = function(value){return this.attr("charset", value);}
DOT.prototype.checked = function(value){return this.attr("checked", value);}
DOT.prototype.class = function(value){return this.attr("class", value);}
DOT.prototype.classid = function(value){return this.attr("classid", value);}
DOT.prototype.clear = function(value){return this.attr("clear", value);}
DOT.prototype.clippath = function(value){return this.attr("clip-path", value);}
DOT.prototype.clippathunits = function(value){return this.attr("clippathunits", value);}
DOT.prototype.codebase = function(value){return this.attr("codebase", value);}
DOT.prototype.codetype = function(value){return this.attr("codetype", value);}
DOT.prototype.color = function(value){return this.attr("color", value);}
DOT.prototype.cols = function(value){return this.attr("cols", value);}
DOT.prototype.colspan = function(value){return this.attr("colspan", value);}
DOT.prototype.compact = function(value){return this.attr("compact", value);}
DOT.prototype.content = function(value){return this.attr("content", value);}
DOT.prototype.contenteditable = function(value){return this.attr("contenteditable", value);}
DOT.prototype.contextmenu = function(value){return this.attr("contextmenu", value);}
DOT.prototype.controls = function(value){return this.attr("controls", value);}
DOT.prototype.coords = function(value){return this.attr("coords", value);}
DOT.prototype.cx = function(value){return this.attr("cx", value);}
DOT.prototype.cy = function(value){return this.attr("cy", value);}
DOT.prototype.d = function(value){return this.attr("d", value);}
DOT.prototype.datetime = function(value){return this.attr("datetime", value);}
DOT.prototype.declare = function(value){return this.attr("declare", value);}
DOT.prototype.default = function(value){return this.attr("default", value);}
DOT.prototype.defer = function(value){return this.attr("defer", value);}
DOT.prototype.dir = function(value){return this.attr("dir", value);}
DOT.prototype.dirname = function(value){return this.attr("dirname", value);}
DOT.prototype.disabled = function(value){return this.attr("disabled", value);}
DOT.prototype.download = function(value){return this.attr("download", value);}
DOT.prototype.draggable = function(value){return this.attr("draggable", value);}
DOT.prototype.dropzone = function(value){return this.attr("dropzone", value);}
DOT.prototype.dur = function(value){return this.attr("dur", value);}
DOT.prototype.dx = function(value){return this.attr("dx", value);}
DOT.prototype.dy = function(value){return this.attr("dy", value);}
DOT.prototype.enctype = function(value){return this.attr("enctype", value);}
DOT.prototype.face = function(value){return this.attr("face", value);}
DOT.prototype.fecolormatrix = function(value){return this.attr("fecolormatrix", value);}
DOT.prototype.fecomponenttransfer = function(value){return this.attr("fecomponenttransfer", value);}
DOT.prototype.fecomposite = function(value){return this.attr("fecomposite", value);}
DOT.prototype.feconvolvematrix = function(value){return this.attr("feconvolvematrix", value);}
DOT.prototype.fediffuselighting = function(value){return this.attr("fediffuselighting", value);}
DOT.prototype.fedisplacementmap = function(value){return this.attr("fedisplacementmap", value);}
DOT.prototype.fedistantlight = function(value){return this.attr("fedistantlight", value);}
DOT.prototype.feflood = function(value){return this.attr("feflood", value);}
DOT.prototype.fefunca = function(value){return this.attr("fefunca", value);}
DOT.prototype.fefuncb = function(value){return this.attr("fefuncb", value);}
DOT.prototype.fefuncg = function(value){return this.attr("fefuncg", value);}
DOT.prototype.fefuncr = function(value){return this.attr("fefuncr", value);}
DOT.prototype.fegaussianblur = function(value){return this.attr("fegaussianblur", value);}
DOT.prototype.feimage = function(value){return this.attr("feimage", value);}
DOT.prototype.femerge = function(value){return this.attr("femerge", value);}
DOT.prototype.femergenode = function(value){return this.attr("femergenode", value);}
DOT.prototype.femorphology = function(value){return this.attr("femorphology", value);}
DOT.prototype.feoffset = function(value){return this.attr("feoffset", value);}
DOT.prototype.fepointlight = function(value){return this.attr("fepointlight", value);}
DOT.prototype.fespecularlighting = function(value){return this.attr("fespecularlighting", value);}
DOT.prototype.fespotlight = function(value){return this.attr("fespotlight", value);}
DOT.prototype.fetile = function(value){return this.attr("fetile", value);}
DOT.prototype.feturbulence = function(value){return this.attr("feturbulence", value);}
DOT.prototype.fill = function(value){return this.attr("fill", value);}
DOT.prototype.fillrule = function(value){return this.attr("fillrule", value);}
DOT.prototype.fillstroke = function(value){return this.attr("fillstroke", value);}
DOT.prototype.filter = function(value){return this.attr("filter", value);}
DOT.prototype.font = function(value){return this.attr("font", value);}
DOT.prototype.fontface = function(value){return this.attr("font-face", value);}
DOT.prototype.fontfaceformat = function(value){return this.attr("font-face-format", value);}
DOT.prototype.fontfacename = function(value){return this.attr("font-face-name", value);}
DOT.prototype.fontfacesrc = function(value){return this.attr("font-face-src", value);}
DOT.prototype.fontfaceuri = function(value){return this.attr("font-face-uri", value);}
DOT.prototype.fontspecification = function(value){return this.attr("fontspecification", value);}
DOT.prototype.for = function(value){return this.attr("for", value);}
DOT.prototype.foreignobject = function(value){return this.attr("foreignobject", value);}
DOT.prototype.formaction = function(value){return this.attr("formaction", value);}
DOT.prototype.format = function(value){return this.attr("format", value);}
DOT.prototype.frame = function(value){return this.attr("frame", value);}
DOT.prototype.frameborder = function(value){return this.attr("frameborder", value);}
DOT.prototype.from = function(value){return this.attr("from", value);}
DOT.prototype.fx = function(value){return this.attr("fx", value);}
DOT.prototype.fy = function(value){return this.attr("fy", value);}
DOT.prototype.glyph = function(value){return this.attr("glyph", value);}
DOT.prototype.glyphref = function(value){return this.attr("glyphref", value);}
DOT.prototype.gradienttransform = function(value){return this.attr("gradienttransform", value);}
DOT.prototype.gradientunits = function(value){return this.attr("gradientunits", value);}
DOT.prototype.graphics = function(value){return this.attr("graphics", value);}
DOT.prototype.headers = function(value){return this.attr("headers", value);}
DOT.prototype.height = function(value){return this.attr("height", value);}
DOT.prototype.hidden = function(value){return this.attr("hidden", value);}
DOT.prototype.high = function(value){return this.attr("high", value);}
DOT.prototype.hkern = function(value){return this.attr("hkern", value);}
DOT.prototype.href = function(value){return this.attr("href", value);}
DOT.prototype.hreflang = function(value){return this.attr("hreflang", value);}
DOT.prototype.hspace = function(value){return this.attr("hspace", value);}
DOT.prototype.httpequiv = function(value){return this.attr("http-equiv", value);}
DOT.prototype.icon = function(value){return this.attr("icon", value);}
DOT.prototype.id = function(value){return this.attr("id", value);}
DOT.prototype.images = function(value){return this.attr("images", value);}
DOT.prototype.in = function(value){return this.attr("in", value);}
DOT.prototype.in2 = function(value){return this.attr("in2", value);}
DOT.prototype.ismap = function(value){return this.attr("ismap", value);}
DOT.prototype.itemprop = function(value){return this.attr("itemprop", value);}
DOT.prototype.keypoints = function(value){return this.attr("keypoints", value);}
DOT.prototype.keytype = function(value){return this.attr("keytype", value);}
DOT.prototype.kind = function(value){return this.attr("kind", value);}
DOT.prototype.lang = function(value){return this.attr("lang", value);}
DOT.prototype.language = function(value){return this.attr("language", value);}
DOT.prototype.lengthadjust = function(value){return this.attr("lengthadjust", value);}
DOT.prototype.link = function(value){return this.attr("link", value);}
DOT.prototype.list = function(value){return this.attr("list", value);}
DOT.prototype.local = function(value){return this.attr("local", value);}
DOT.prototype.longdesc = function(value){return this.attr("longdesc", value);}
DOT.prototype.loop = function(value){return this.attr("loop", value);}
DOT.prototype.low = function(value){return this.attr("low", value);}
DOT.prototype.manifest = function(value){return this.attr("manifest", value);}
DOT.prototype.marginheight = function(value){return this.attr("marginheight", value);}
DOT.prototype.marginwidth = function(value){return this.attr("marginwidth", value);}
DOT.prototype.markers = function(value){return this.attr("markers", value);}
DOT.prototype.markerunits = function(value){return this.attr("markerunits", value);}
DOT.prototype.maskunits = function(value){return this.attr("maskunits", value);}
DOT.prototype.max = function(value){return this.attr("max", value);}
DOT.prototype.maxlength = function(value){return this.attr("maxlength", value);}
DOT.prototype.media = function(value){return this.attr("media", value);}
DOT.prototype.metadata = function(value){return this.attr("metadata", value);}
DOT.prototype.method = function(value){return this.attr("method", value);}
DOT.prototype.min = function(value){return this.attr("min", value);}
DOT.prototype.missingglyph = function(value){return this.attr("missing-glyph", value);}
DOT.prototype.mode = function(value){return this.attr("mode", value);}
DOT.prototype.mpath = function(value){return this.attr("mpath", value);}
DOT.prototype.multiple = function(value){return this.attr("multiple", value);}
DOT.prototype.muted = function(value){return this.attr("muted", value);}
DOT.prototype.name = function(value){return this.attr("name", value);}
DOT.prototype.nohref = function(value){return this.attr("nohref", value);}
DOT.prototype.noresize = function(value){return this.attr("noresize", value);}
DOT.prototype.noshade = function(value){return this.attr("noshade", value);}
DOT.prototype.novalidate = function(value){return this.attr("novalidate", value);}
DOT.prototype.nowrap = function(value){return this.attr("nowrap", value);}
DOT.prototype.offset = function(value){return this.attr("offset", value);}
DOT.prototype.onblur = function(value){return this.attr("onblur", value);}
DOT.prototype.onchange = function(value){return this.attr("onchange", value);}
DOT.prototype.onclick = function(value){return this.attr("onclick", value);}
DOT.prototype.ondblclick = function(value){return this.attr("ondblclick", value);}
DOT.prototype.onfocus = function(value){return this.attr("onfocus", value);}
DOT.prototype.onkeydown = function(value){return this.attr("onkeydown", value);}
DOT.prototype.onkeypress = function(value){return this.attr("onkeypress", value);}
DOT.prototype.onkeyup = function(value){return this.attr("onkeyup", value);}
DOT.prototype.onload = function(value){return this.attr("onload", value);}
DOT.prototype.onmousedown = function(value){return this.attr("onmousedown", value);}
DOT.prototype.onmousemove = function(value){return this.attr("onmousemove", value);}
DOT.prototype.onmouseout = function(value){return this.attr("onmouseout", value);}
DOT.prototype.onmouseover = function(value){return this.attr("onmouseover", value);}
DOT.prototype.onmouseup = function(value){return this.attr("onmouseup", value);}
DOT.prototype.onreset = function(value){return this.attr("onreset", value);}
DOT.prototype.onselect = function(value){return this.attr("onselect", value);}
DOT.prototype.onsubmit = function(value){return this.attr("onsubmit", value);}
DOT.prototype.onunload = function(value){return this.attr("onunload", value);}
DOT.prototype.opacity = function(value){return this.attr("opacity", value);}
DOT.prototype.open = function(value){return this.attr("open", value);}
DOT.prototype.optimum = function(value){return this.attr("optimum", value);}
DOT.prototype.path = function(value){return this.attr("path", value);}
DOT.prototype.pathlength = function(value){return this.attr("pathlength", value);}
DOT.prototype.pattern = function(value){return this.attr("pattern", value);}
DOT.prototype.patterncontentunits = function(value){return this.attr("patterncontentunits", value);}
DOT.prototype.patterntransform = function(value){return this.attr("patterntransform", value);}
DOT.prototype.ping = function(value){return this.attr("ping", value);}
DOT.prototype.placeholder = function(value){return this.attr("placeholder", value);}
DOT.prototype.points = function(value){return this.attr("points", value);}
DOT.prototype.poster = function(value){return this.attr("poster", value);}
DOT.prototype.preload = function(value){return this.attr("preload", value);}
DOT.prototype.profile = function(value){return this.attr("profile", value);}
DOT.prototype.prompt = function(value){return this.attr("prompt", value);}
DOT.prototype.r = function(value){return this.attr("r", value);}
DOT.prototype.radiogroup = function(value){return this.attr("radiogroup", value);}
DOT.prototype.readonly = function(value){return this.attr("readonly", value);}
DOT.prototype.refx = function(value){return this.attr("refx", value);}
DOT.prototype.refy = function(value){return this.attr("refy", value);}
DOT.prototype.rel = function(value){return this.attr("rel", value);}
DOT.prototype.renderingintent = function(value){return this.attr("renderingintent", value);}
DOT.prototype.repeatcount = function(value){return this.attr("repeatcount", value);}
DOT.prototype.required = function(value){return this.attr("required", value);}
DOT.prototype.rev = function(value){return this.attr("rev", value);}
DOT.prototype.reversed = function(value){return this.attr("reversed", value);}
DOT.prototype.rotate = function(value){return this.attr("rotate", value);}
DOT.prototype.rows = function(value){return this.attr("rows", value);}
DOT.prototype.rowspan = function(value){return this.attr("rowspan", value);}
DOT.prototype.rules = function(value){return this.attr("rules", value);}
DOT.prototype.rx = function(value){return this.attr("rx", value);}
DOT.prototype.ry = function(value){return this.attr("ry", value);}
DOT.prototype.sandbox = function(value){return this.attr("sandbox", value);}
DOT.prototype.scheme = function(value){return this.attr("scheme", value);}
DOT.prototype.scope = function(value){return this.attr("scope", value);}
DOT.prototype.scoped = function(value){return this.attr("scoped", value);}
DOT.prototype.script = function(value){return this.attr("script", value);}
DOT.prototype.scrolling = function(value){return this.attr("scrolling", value);}
DOT.prototype.seamless = function(value){return this.attr("seamless", value);}
DOT.prototype.selected = function(value){return this.attr("selected", value);}
DOT.prototype.set = function(value){return this.attr("set", value);}
DOT.prototype.shape = function(value){return this.attr("shape", value);}
DOT.prototype.size = function(value){return this.attr("size", value);}
DOT.prototype.sizes = function(value){return this.attr("sizes", value);}
DOT.prototype.spellcheck = function(value){return this.attr("spellcheck", value);}
DOT.prototype.spreadmethod = function(value){return this.attr("spreadmethod", value);}
DOT.prototype.src = function(value){return this.attr("src", value);}
DOT.prototype.srcdoc = function(value){return this.attr("srcdoc", value);}
DOT.prototype.srclang = function(value){return this.attr("srclang", value);}
DOT.prototype.srcset = function(value){return this.attr("srcset", value);}
DOT.prototype.standby = function(value){return this.attr("standby", value);}
DOT.prototype.start = function(value){return this.attr("start", value);}
DOT.prototype.step = function(value){return this.attr("step", value);}
DOT.prototype.stopcolor = function(value){return this.attr("stop-color", value);}
DOT.prototype.stopopacity = function(value){return this.attr("stop-opacity", value);}
DOT.prototype.stroke = function(value){return this.attr("stroke", value);}
DOT.prototype.strokelinecap = function(value){return this.attr("strokelinecap", value);}
DOT.prototype.strokewidth = function(value){return this.attr("strokewidth", value);}
DOT.prototype.style = function(value){return this.attr("style", value);}
DOT.prototype.switch = function(value){return this.attr("switch", value);}
DOT.prototype.symbol = function(value){return this.attr("symbol", value);}
DOT.prototype.tabindex = function(value){return this.attr("tabindex", value);}
DOT.prototype.target = function(value){return this.attr("target", value);}
DOT.prototype.text = function(value){return this.attr("text", value);}
DOT.prototype.textcontentelements = function(value){return this.attr("textcontentelements", value);}
DOT.prototype.textpath = function(value){return this.attr("textpath", value);}
DOT.prototype.title = function(value){return this.attr("title", value);}
DOT.prototype.to = function(value){return this.attr("to", value);}
DOT.prototype.transform = function(value){return this.attr("transform", value);}
DOT.prototype.type = function(value){return this.attr("type", value);}
DOT.prototype.usemap = function(value){return this.attr("usemap", value);}
DOT.prototype.valign = function(value){return this.attr("valign", value);}
DOT.prototype.value = function(value){return this.attr("value", value);}
DOT.prototype.valuetype = function(value){return this.attr("valuetype", value);}
DOT.prototype.version = function(value){return this.attr("version", value);}
DOT.prototype.view = function(value){return this.attr("view", value);}
DOT.prototype.viewbox = function(value){return this.attr("viewbox", value);}
DOT.prototype.viewports = function(value){return this.attr("viewports", value);}
DOT.prototype.vkern = function(value){return this.attr("vkern", value);}
DOT.prototype.vlink = function(value){return this.attr("vlink", value);}
DOT.prototype.vspace = function(value){return this.attr("vspace", value);}
DOT.prototype.width = function(value){return this.attr("width", value);}
DOT.prototype.wrap = function(value){return this.attr("wrap", value);}
DOT.prototype.x = function(value){return this.attr("x", value);}
DOT.prototype.x1 = function(value){return this.attr("x1", value);}
DOT.prototype.x2 = function(value){return this.attr("x2", value);}
DOT.prototype.xlinkactuate = function(value){return this.attr("xlink:actuate", value);}
DOT.prototype.xlinkhref = function(value){return this.attr("xlink:href", value);}
DOT.prototype.xlinkshow = function(value){return this.attr("xlink:show", value);}
DOT.prototype.xml = function(value){return this.attr("xml", value);}
DOT.prototype.xmlns = function(value){return this.attr("xmlns", value);}
DOT.prototype.xmlnsxlink = function(value){return this.attr("xmlns:xlink", value);}
DOT.prototype.y = function(value){return this.attr("y", value);}
DOT.prototype.y1 = function(value){return this.attr("y1", value);}
DOT.prototype.y2 = function(value){return this.attr("y2", value);}
DOT.prototype.zoomandpan = function(value){return this.attr("zoomandpan", value);}



//SVG needs the xmlns attribute to be set.
DOT.prototype.svg = function(c){return this.el("svg", c).attr("xmlns", "http://www.w3.org/2000/svg");}

//Data is a special attribute.
DOT.prototype.data = function(suffix, value){
	if(arguments.length < 2){
		value = suffix;
		suffix = undefined;
		return this.attr("data", value);
	}
	else{
		return this.attr("data-" + suffix, value);
	}
}

//Special handling for names that exist as both elements and attributes.
//summary, span, label, form, cite

DOT.prototype.cite = function(arg){
	var tagType = null;
	if(this._ce != null)
		tagType = this._ce[0].nodeName.toLowerCase();
	if(tagType != null && typeof arg !== "undefined" 
		&& (tagType == "blockquote" 
		|| tagType == "del" 
		|| tagType == "ins" 
		|| tagType == "q"))
		return this.attr("cite", arg);
	else
		return this.el("cite", arg);
}

DOT.prototype.form = function(arg){
	var tagType = null;
	if(this._ce != null)
		tagType = this._ce[0].nodeName.toLowerCase();
	if(tagType != null && typeof arg !== "undefined" 
		&& (tagType == "button" 
		|| tagType == "fieldset" 
		|| tagType == "input" 
		|| tagType == "keygen" 
		|| tagType == "label" 
		|| tagType == "meter" 
		|| tagType == "object" 
		|| tagType == "output" 
		|| tagType == "progress" 
		|| tagType == "select" 
		|| tagType == "textarea" 
		))
			return this.attr("cite", arg);
	else
		return this.el("cite", arg);
}

DOT.prototype.label = function(arg){
	var tagType = null;
	if(this._ce != null)
		tagType = this._ce[0].nodeName.toLowerCase();
	if(tagType != null && typeof arg !== "undefined" 
		&& (tagType == "track"))
		return this.attr("label", arg);
	else
		return this.el("label", arg);
}

DOT.prototype.span = function(arg){
	var tagType = null;
	if(this._ce != null)
		tagType = this._ce[0].nodeName.toLowerCase();
	if(tagType != null && typeof arg !== "undefined" 
		&& (tagType == "select" 
		|| tagType == "input"))
		return this.attr("span", arg);
	else
		return this.el("span", arg);
}

	this.summary = function(arg){
	var tagType = null;
	if(this._ce != null)
		tagType = this._ce[0].nodeName.toLowerCase();
	if(tagType != null && typeof arg !== "undefined" 
		&& (tagType == "table"))
		return this.attr("summary", arg);
	else
		return this.el("summary", arg);	
}

//Jquery event wrappers
DOT.prototype.$blur = function(handler){$(this._ce).blur(handler); return DOT;}
DOT.prototype.$change = function(handler){$(this._ce).change(handler); return DOT;}
DOT.prototype.$click = function(handler){$(this._ce).click(handler); return DOT;}
DOT.prototype.$dblclick = function(handler){$(this._ce).dblclick(handler); return DOT;}
DOT.prototype.$focus = function(handler){$(this._ce).focus(handler); return DOT;}
DOT.prototype.$focusin = function(handler){$(this._ce).focusin(handler); return DOT;}
DOT.prototype.$focusout = function(handler){$(this._ce).focusout(handler); return DOT;}
DOT.prototype.$hover = function(inHandler, outHandler){$(this._ce).hover(inHandler, outHandler); return DOT;}
DOT.prototype.$keydown = function(handler){$(this._ce).keydown(handler); return DOT;}
DOT.prototype.$keypress = function(handler){$(this._ce).keypress(handler); return DOT;}
DOT.prototype.$keyup = function(handler){$(this._ce).keyup(handler); return DOT;}
DOT.prototype.$mousedown = function(handler){$(this._ce).mousedown(handler); return DOT;}
DOT.prototype.$mouseenter = function(handler){$(this._ce).mouseenter(handler); return DOT;}
DOT.prototype.$mouseleave = function(handler){$(this._ce).mouseleave(handler); return DOT;}
DOT.prototype.$mousemove = function(handler){$(this._ce).mousemove(handler); return DOT;}
DOT.prototype.$mouseout = function(handler){$(this._ce).mouseout(handler); return DOT;}
DOT.prototype.$mouseover = function(handler){$(this._ce).mouseover(handler); return DOT;}
DOT.prototype.$mouseup = function(handler){$(this._ce).mouseup(handler); return DOT;}
DOT.prototype.$on = function(event, childSelector, data, handler, map){$(this._ce).on(event, childSelector, data, handler, map); return DOT;}
DOT.prototype.$one = function(event, data, handler){$(this._ce).one(event, data, handler); return DOT;}
DOT.prototype.$resize = function(handler){$(this._ce).resize(handler); return DOT;}
DOT.prototype.$scroll = function(handler){$(this._ce).scroll(handler); return DOT;}
DOT.prototype.$select = function(handler){$(this._ce).select(handler); return DOT;}
DOT.prototype.$submit = function(handler){$(this._ce).submit(handler); return DOT;}

DOT.prototype.$animate = function(p1, p2, p3, p4){$(this._ce).animate(p1, p2, p3, p4); return DOT;}
DOT.prototype.$css = function(p1, p2){$(this._ce).css(p1, p2); return DOT;}
DOT.prototype.$empty = function(){$(this._ce).empty(); return DOT;}
DOT.prototype.$fadeIn = function(p1, p2){$(this._ce).fadeIn(p1, p2); return DOT;}
DOT.prototype.$fadeOut = function(p1, p2){$(this._ce).fadeIn(p1, p2); return DOT;}
DOT.prototype.$fadeTo = function(p1, p2, p3, p4){$(this._ce).fadeTo(p1, p2, p3, p4); return DOT;}
DOT.prototype.$hide = function(p1, p2, p3){$(this._ce).hide(p1, p2, p3); return DOT;}
DOT.prototype.$show = function(p1, p2, p3){$(this._ce).show(p1, p2, p3); return DOT;}

DOT = new DOT();