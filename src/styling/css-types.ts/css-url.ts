import CssDataType from "./css-data-type";

export default class CssUrl extends CssDataType{
	url: Array<string>;
	constructor(value){
		super("url");
		this.url = null;
		if(!value || value.length == 0 || (value.length == 1 && value[0] == "" || value[0] == "none" || value[0] == "initial" || value[0] == "inherit")){
			this.url = null;
		}
		else{
			this.url = [];
			for(var i = 0; i < value.length; i++){
				var currentURL = "";
				if(value[i].toLowerCase().indexOf("url") === 0){
					var url = value[i].substring(value[i].indexOf("("), value[i].lastIndexOf(")")).trim();
					if((url.indexOf("\"") && url.lastIndexOf("\"") == url.length - 1) || 
						(url.indexOf("'") && url.lastIndexOf("'") == url.length - 1)){
						url = url.substring(1, url.length - 1);
					}
					this.url.push(url);
				}
				else{
					this.url.push(value[i]);
				}
			}
		}
	}
	
	toString(): string{
		if(!this.url) return "none";
		else 
		{
			var ret = [];
			for(var i = 0; i < this.url.length; i++){
				ret.push("url(\"" + this.url[i] + "\")");
			}
			return ret.join(", ");
		}
	}
}