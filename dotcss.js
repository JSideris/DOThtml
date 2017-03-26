var _dotcssbuilder = function(target){
	this.currentCss = "";
	this.target = target;
}

var dotcss = function(target){
	this.currentCss = "";
	var n = new _dotcssbuilder();
	n.target = target;
	return n;
}

var _allDotCssProperties = [
{prop:"color", type:"color"},
{prop:"opacity"},
{prop:"background"},
{prop:"background-Attachment"},
{prop:"background-Blend-Mode"},
{prop:"background-Color", type:"color"},
{prop:"background-Image", type:"url"},
{prop:"background-Position"},
{prop:"background-Repeat"},
{prop:"background-Clip"},
{prop:"background-Origin"},
{prop:"background-Size", type:"length"},
{prop:"border"},
{prop:"border-Bottom"},
{prop:"border-Bottom-Color", type:"color"},
{prop:"border-Bottom-Left-Radius", type:"length"},
{prop:"border-Bottom-Right-Radius", type:"length"},
{prop:"border-Bottom-Style"},
{prop:"border-Bottom-Width", type:"length"},
{prop:"border-Color", type:"color"},
{prop:"border-Image", type:"url"},
{prop:"border-Image-Outset"},
{prop:"border-Image-Repeat"},
{prop:"border-Image-Slice"},
{prop:"border-Image-Source"},
{prop:"border-Image-Width", type:"length"},
{prop:"border-Left"},
{prop:"border-Left-Color", type:"color"},
{prop:"border-Left-Style"},
{prop:"border-Left-Width", type:"length"},
{prop:"border-Radius", type:"length"},
{prop:"border-Right"},
{prop:"border-Right-Color", type:"color"},
{prop:"border-Right-Style"},
{prop:"border-Right-Width", type:"length"},
{prop:"border-Style"},
{prop:"border-Top"},
{prop:"border-Top-Color", type:"color"},
{prop:"border-Top-Left-Radius", type:"length"},
{prop:"border-Top-Right-Radius", type:"length"},
{prop:"border-Top-Style"},
{prop:"border-Top-Width", type:"length"},
{prop:"border-Width", type:"length"},
{prop:"box-Decoration-Break"},
{prop:"box-Shadow"},
{prop:"bottom", type:"length"},
{prop:"clear"},
{prop:"clip"},
{prop:"display"},
{prop:"float"},
{prop:"height", type:"length"},
{prop:"left", type:"length"},
{prop:"margin", type:"length"},
{prop:"margin-Bottom", type:"length"},
{prop:"margin-Left", type:"length"},
{prop:"margin-Right", type:"length"},
{prop:"margin-Top", type:"length"},
{prop:"max-Height", type:"length"},
{prop:"max-Width", type:"length"},
{prop:"min-Height", type:"length"},
{prop:"min-Width", type:"length"},
{prop:"overflow"},
{prop:"box"},
{prop:"overflow-X"},
{prop:"overflow-Y"},
{prop:"padding", type:"length"},
{prop:"padding-Bottom", type:"length"},
{prop:"padding-Left", type:"length"},
{prop:"padding-Right", type:"length"},
{prop:"padding-Top", type:"length"},
{prop:"position"},
{prop:"right", type:"length"},
{prop:"top", type:"length"},
{prop:"visibility"},
{prop:"width", type:"length"},
{prop:"vertical-Align"},
{prop:"z-Index"},
{prop:"align-Content"},
{prop:"align-Items"},
{prop:"align-Self"},
{prop:"flex"},
{prop:"flex-Basis"},
{prop:"flex-Direction"},
{prop:"flex-Flow"},
{prop:"flex-Grow"},
{prop:"flex-Shrink"},
{prop:"flex-Wrap"},
{prop:"justify-Content"},
{prop:"order"},
{prop:"hanging-Punctuation"},
{prop:"hyphens"},
{prop:"letter-Spacing"},
{prop:"line-Break"},
{prop:"line-Height", type:"length"},
{prop:"overflow-Wrap"},
{prop:"tab-Size"},
{prop:"text-Align"},
{prop:"text-Align-Last"},
{prop:"text-Combine-Upright"},
{prop:"text-Indent"},
{prop:"text-Justify"},
{prop:"text-Transform"},
{prop:"white-Space"},
{prop:"word-Break"},
{prop:"word-Spacing"},
{prop:"word-Wrap"},
{prop:"text-Decoration"},
{prop:"text-Decoration-Color", type:"color"},
{prop:"text-Decoration-Line"},
{prop:"text-Decoration-Style"},
{prop:"text-Shadow"},
{prop:"text-Underline-Position"},
{prop:"font"},
{prop:"font-Family"},
{prop:"font-Feature-Settings"},
{prop:"font-Kerning"},
{prop:"font-Language-Override"},
{prop:"font-Size", type:"length"},
{prop:"font-Size-Adjust"},
{prop:"font-Stretch"},
{prop:"font-Style"},
{prop:"font-Synthesis"},
{prop:"font-Variant"},
{prop:"font-Variant-Alternates"},
{prop:"font-Variant-Caps"},
{prop:"font-Variant-East-Asian"},
{prop:"font-Variant-Ligatures"},
{prop:"font-Variant-Numeric"},
{prop:"font-Variant-Position"},
{prop:"font-Weight"},
{prop:"direction"},
{prop:"text-Orientation"},
{prop:"text-Combine-Upright"},
{prop:"unicode-Bidi"},
{prop:"user-Select"},
{prop:"writing-Mode"},
{prop:"border-Collapse"},
{prop:"border-Spacing"},
{prop:"caption-Side"},
{prop:"empty-Cells"},
{prop:"table-Layout"},
{prop:"counter-Increment"},
{prop:"counter-Reset"},
{prop:"list-Style"},
{prop:"list-Style-Image", type:"url"},
{prop:"list-Style-Position"},
{prop:"list-Style-Type"},
{prop:"animation"},
{prop:"animation-Delay"},
{prop:"animation-Direction"},
{prop:"animation-Duration"},
{prop:"animation-Fill-Mode"},
{prop:"animation-Iteration-Count"},
{prop:"animation-Name"},
{prop:"animation-Play-State"},
{prop:"animation-Timing-Function"},
{prop:"backface-Visibility"},
{prop:"perspective"},
{prop:"perspective-Origin"},
{prop:"transform"},
{prop:"transform-Origin"},
{prop:"transform-Style"},
{prop:"transition"},
{prop:"transition-Property"},
{prop:"transition-Duration"},
{prop:"transition-Timing-Function"},
{prop:"transition-Delay"},
{prop:"box-Sizing"},
{prop:"content", type:"url"},
{prop:"cursor"},
{prop:"ime-Mode"},
{prop:"nav-Down"},
{prop:"nav-Index"},
{prop:"nav-Left"},
{prop:"nav-Right"},
{prop:"nav-Up"},
{prop:"outline"},
{prop:"outline-Color", type:"color"},
{prop:"outline-Offset"},
{prop:"outline-Style"},
{prop:"outline-Width"},
{prop:"resize"},
{prop:"text-Overflow"},
{prop:"break-After"},
{prop:"break-Before"},
{prop:"break-Inside"},
{prop:"column-Count"},
{prop:"column-Fill"},
{prop:"column-Gap"},
{prop:"column-Rule"},
{prop:"column-Rule-Color", type:"color"},
{prop:"column-Rule-Style"},
{prop:"column-Rule-Width"},
{prop:"column-Span"},
{prop:"column-Width"},
{prop:"columns"},
{prop:"widows"},
{prop:"orphans"},
{prop:"page-Break-After"},
{prop:"page-Break-Before"},
{prop:"page-Break-Inside"},
{prop:"marks"},
{prop:"quotes"},
{prop:"filter"},
{prop:"image-Orientation", type:"url"},
{prop:"image-Rendering"},
{prop:"image-Resolution"},
{prop:"object-Fit"},
{prop:"object-Position"},
{prop:"mask"},
{prop:"mask-Type"},
{prop:"mark"},
{prop:"mark-After"},
{prop:"mark-Before"},
{prop:"phonemes"},
{prop:"rest"},
{prop:"rest-After"},
{prop:"rest-Before"},
{prop:"voice-Balance"},
{prop:"voice-Duration"},
{prop:"voice-Pitch"},
{prop:"voice-Pitch-Range"},
{prop:"voice-Rate"},
{prop:"voice-Stress"},
{prop:"voice-Volume"},
{prop:"marquee-Direction"},
{prop:"marquee-Play-Count"},
{prop:"marquee-Speed"},
{prop:"marquee-Style"}];

var _allDotCssLengthUnits = [
	{unit:"Em"},
	{unit:"Ex"},
	{unit:"Ch"},
	{unit:"Rem"},
	{unit:"Vw"},
	{unit:"Vh"},
	{unit:"Vmin"},
	{unit:"Vmax"},
	{unit:"%", jsName:"P"},
	{unit:"Cm"},
	{unit:"Mm"},
	{unit:"In"},
	{unit:"Px"},
	{unit:"Pt"},
	{unit:"Pc"}
]

function _addDotCssFunctionToDotCssObject(funcName){
	dotcss[funcName] = function(){
		var n = new _dotcssbuilder();
		return n[funcName].apply(n, arguments);
	}
}

function _makeDotCssFunction (prop, jsFriendlyProp, type){
	_dotcssbuilder.prototype[jsFriendlyProp] = function(){
		if(arguments.length == 0) return this;
		var value = arguments[0];
		switch(type){
			case "url":
				if(("" + value).trim().indexOf("url") != 0) 
					value = "url(" + value + ")";
				break;
			case "color":
				if(arguments.length == 3 && !isNaN(arguments[0]) && !isNaN(arguments[1]) && !isNaN(arguments[2]))
					value = "rgb(" 
						+ Math.min(255, Math.max(0, Math.round(arguments[0]))) + ", "
						+ Math.min(255, Math.max(0, Math.round(arguments[1]))) + ", " 
						+ Math.min(255, Math.max(0, Math.round(arguments[2]))) 
						+ ")";
				else if(arguments.length == 4 && !isNaN(arguments[0]) && !isNaN(arguments[1]) && !isNaN(arguments[2]) && !isNaN(arguments[3]))
					value = "rgba(" 
						+ Math.min(255, Math.max(0, Math.round(arguments[0]))) + ", "
						+ Math.min(255, Math.max(0, Math.round(arguments[1]))) + ", "
						+ Math.min(255, Math.max(0, Math.round(arguments[2]))) + ", "
						+ Math.min(1, Math.max(0, arguments[3]))
						+ ")";
				else if(!isNaN(value)){
					value = Math.round(1 * value);
					var b = value & 0xFF;
					value >>= 8;
					var g = value & 0xFF;
					value >>= 8;
					var r = value & 0xFF;
					value = "rgb(" + r + "," + g + "," + b + ")";
				}
				break;
			case "length":
				value = "";
				for (var i = 0; i < arguments.length; i++){
					if(!isNaN(arguments[i]))
						value += arguments[i] + "px ";
					else
						value += arguments[i] + " ";
				}
				value = value.trim();
				break;
			default:
				value = "";
				for (var i = 0; i < arguments.length; i++){
					value += arguments[i] + " ";
				}
				value = value.trim();
				break;
		}
		
		var newCss = prop + ":" + value + ";";
		this.currentCss += newCss;
		
		if(this.target){
			var query = document.querySelectorAll(this.target);
			console.log(query); //TODO: test this.
			for(var q = 0; q < query.length; q++){
				query[q].style += newCss;
			}
			
		}
		
		return this;
	}
	_addDotCssFunctionToDotCssObject(jsFriendlyProp);
	
	if(type == "length"){
		for(var u = 0; u < _allDotCssLengthUnits.length; u++){
			var uu = _allDotCssLengthUnits[u];
			(function(uu){
				_dotcssbuilder.prototype[jsFriendlyProp + (uu.jsName || uu.unit)] = function(){
					for(var i = 0; i < arguments.length; i++) arguments[i] = arguments[i] + uu.unit.toLowerCase();
					return _dotcssbuilder.prototype[jsFriendlyProp].apply(this, arguments);
				}
			})(uu);
			_addDotCssFunctionToDotCssObject(jsFriendlyProp + (uu.jsName || uu.unit));
		}
	}
	
}

dotcss.prototype.url = function(url){
	return "url('" + url + "')";
}

dotcss.prototype.rgb = function(r, g, b){
	return "rgb('" + r + ", " + g + ", " + b + "')";
}

dotcss.prototype.rgba = function(r, g, b, a){
	return "rgb('" + r + ", " + g + ", " + b + ", " + a + "')";
}

_dotcssbuilder.prototype.toString = dotcss.prototype.toString = function(){
	return this.currentCss;
}

for(var i = 0; i < _allDotCssProperties.length; i++){
	var prop = _allDotCssProperties[i].prop.toLowerCase();
	var jsFriendlyProp = _allDotCssProperties[i].prop.replace(new RegExp("-", "g"), "");
	
	_makeDotCssFunction(prop, jsFriendlyProp, _allDotCssProperties[i].type);
}

//dotcss = new dotcss();