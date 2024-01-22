export default function formatHTML(html){
	if(!html){
		throw new Error("HTML can't be null.");
	}
	html = html.toString().toLowerCase();
	var html2 = "";
	for(var i = 0; i < html.length; i++){
		var chr = html.charAt(i);
		var chrC = chr.charCodeAt(0);
		if(chrC >= 32 && chrC <= 126){
			html2 += chr;
		}
	}
	html = html2;
	// html = html.split("=\"disabled\"").join("");
	html = html.split(" value=\"\"").join("");
	html = html.split(" type=submit").join("");
	html = html.split("\"").join("");
	html = html.split("\'").join("");
	// html = html.split("<!---->").join("");
	return html;
}