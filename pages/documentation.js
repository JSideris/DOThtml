if(dot.doccategory) dot.removeComponent("doccategory");
dot.component("doccategory", function(title, links){
	this.hidden = false;
	return dot.a(title).class("documentation-category-button open")
	.onclick(function(e){
		if(this.hidden) {
			$(e.target).removeClass("closed").addClass("open")
			$(e.target.nextSibling).show(100);
		}
		else {
			$(e.target).removeClass("open").addClass("closed")
			$(e.target.nextSibling).hide(100);
		}

		this.hidden = !this.hidden;
	})
	.div(
		links
	).style(dotcss.marginLeft(30));
});

if(dot.doclink) dot.removeComponent("doclink");
dot.component("doclink", function(title, folder, file){
	pageCategoryMap[file] = folder;
	routes.push({title: title, path: "documentation/" + file, component: dot.mdviewer});
	return dot.a(title).id("doclink-" + file).class("documentation-doclink").href("/documentation/" + file).onclick(function(e){
		e.preventDefault();
		dot.navigate("/documentation/" + file);
		if(window.innerWidth <= 600) hidePages();
	});
});

if(dot.apiSample) dot.removeComponent("apiSample");
dot.component("apiSample", function(funcName, description, namespaces, params, returns, sampleCode){
	var paramNames = [];
	for(var i = 0; i < params.length; i++){
		var pName = params[i].name;
		if(pName.indexOf(".") != -1){
			// pName = "&#x21AA;" + pName.split(".")[1];
			// params[i].name = pName;
			continue;
		}
		else if(pName.indexOf("(") != -1){
			pName = pName.split("(")[0];
		}
		else if(pName.indexOf("[") != -1){
			pName = pName.split("[")[0];
		}
		else if(pName.indexOf("{") != -1){
			pName = pName.split("{")[0];
		}
		paramNames.push(pName);
	}
	var paramList = paramNames.join(", ");

	var exampleArea = dot;
	var exampleParts = sampleCode.split("```");
	exampleArea = exampleArea.t(exampleParts[0]);
	for(var i = 1; i < exampleParts.length; i++){
		if(i % 2 == 1){
			// Code area.
			// Language on first line:
			var firstLinebreak = exampleParts[i].indexOf("\n");
			var language = exampleParts[i].substring(0, firstLinebreak).trim();
			var code = exampleParts[i].substring(firstLinebreak).trim();
			exampleArea = exampleArea.pre(dot.code(dot.t(code)).class(language + " language-" + language));
		}
		else{
			// Text.
			exampleArea = exampleArea.t(exampleParts[i]);
		}
	}

	return dot.div(
		dot.h1(funcName + "(" + paramList + ")")
		.p(description)
		.h(function(){
			if(params.length > 0){
				return dot.hr().h2("Parameters")
				.table(dot.tbody(dot.each(params, function(p){
					return dot.tr(dot.td(
						dot.h(function(){
							if(p.name.indexOf(".") == -1) return dot.pre(dot.code(p.name))
							else if(p.name.indexOf("..") == -1) return dot.h("&nbsp;&nbsp;&nbsp;&nbsp;&#x21AA;&nbsp;").pre(dot.code(p.name.split(".")[1]))
							else return dot.h("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#x21AA;&nbsp;").pre(dot.code(p.name.split("..")[1]))
						})
					).class("prop-name")
					.td(dot.i(p.description))).class(p.name.indexOf(".") == -1 ? "" : (p.name.indexOf("..") == -1 ? "argument-or-field" : "deep-argument-or-field"));
				})))
			}
			else return dot;
		})
		.hr().h2("Returns")
		.p(returns)
		.hr().h2("Available in Namespaces ")
		.ul(dot.each(namespaces, function(ns){
			return dot.li(ns.replace("-", "").trim());
		}))
		.hr().h2("Example")
		.h(exampleArea)
		
	).class("api-sample")
});

var converter = new showdown.Converter();
var pageCategoryMap = {};

if(!dot.mdviewer) dot.component({
	name:"mdviewer",
	builder: function(route){
		this.route = route;
		return dot.div();
	},
	ready: function(){
		var xhttp = new XMLHttpRequest();
		var self = this;
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {

				var split1 = this.responseText.split("!!!API!!!");
				var newStr = split1[0];
				for(var i = 1; i < split1.length; i++){
					var split2 = split1[i].split("!!!/API!!!");
					var apiSplit = split2[0].split("---");
					var splitName = apiSplit[0].split(" - ");
					var name = splitName[0];
					var description = splitName[1] || "";

					var namespaces = apiSplit[1].trim().split("\n");

					var params = [];
					var splitParams = apiSplit[2].split("\n");
					for(var j = 0; j < splitParams.length; j++){
						var thisParam = splitParams[j].trim();
						if(thisParam.trim().length == 0) continue;
						else{
							var paramDescription = thisParam.split(" - ");
							params.push({name: paramDescription[0], description: paramDescription[1]});
						}
					}

					var returns = apiSplit[3];

					var sampleCode = apiSplit[4];

					var apiHtml = dot.apiSample(name, description, namespaces, params, returns, sampleCode)._document.innerHTML;
					newStr += apiHtml + split2[1];
				}

				dot(self.element).h(converter.makeHtml(newStr));
				
				// TURN LINKS INTO NAV BUTTONS.
				var links = self.element.querySelectorAll("a");
				for(var i = 0; i < links.length; i++){
					var a = links[i];
					var href = $(a).attr("href");
					if(href.indexOf("/") == "/"){

						var onclick = function(e){
							e.preventDefault();
							dot.navigate(href);
						}

						if (a.addEventListener) a.addEventListener("click", onclick, false);
						else a.attachEvent("onclick", onclick); //compatibility with old browsers.
					}
				}

				// CODE HIGHLIGHTING.
				var codes = self.element.querySelectorAll("code");
				for(var i = 0; i < codes.length; i++){
					
					if(codes[i].parentElement.tagName != "PRE" && codes[i].parentElement.className.length == 0){
						if(codes[i].innerHTML.indexOf("&lt;") == 0) {
							$(codes[i]).addClass("HTML");
							$(codes[i]).addClass("language-HTML");
						}
						else {
							$(codes[i]).addClass("JavaScript");
							$(codes[i]).addClass("language-JavaScript");
						}
						hljs.highlightBlock(codes[i]);
						$(codes[i]).removeClass("hljs");
					}
					else hljs.highlightBlock(codes[i]);
				}
			}
			else if(this.readyState == 4 && this.status == 404){
				dot(self.element).h1("Help file not found.");
			}
		};
		var pathSegments = self.route.path.split("/");
		var page = pathSegments[pathSegments.length - 1] || pathSegments[pathSegments.length - 2];
		if(page != "documentation") page = pageCategoryMap[page] + "/" + page;
		else page = "quickstart/overview";
		xhttp.open("GET", "/pages/documentation/" + page + ".md", true);
		xhttp.send();
	}
})

var routes = [];

routes.push({title: "Overview", path: "documentation", component: dot.mdviewer});

function hidePages(){
	dotcss("#documentation-directory").hide();
	dotcss("#documentation-container").show();
}
function showPages(){
	dotcss("#documentation-container").hide();
	dotcss("#documentation-directory").show();
}

exports = dot
.div(
	dot.div(
		dot
		.button("[ Close ]").style(dotcss.fontSize(16).padding(10).widthP(100).backgroundColor("#222").color("#fff").border("none").marginBottom(10)).class("close-pages-btn").onclick(function(){
			hidePages();
		})
		.doccategory("Quick Start", [
			dot.doclink("Overview", "quickstart", "overview"),
			dot.doclink("General Concepts", "quickstart", "concepts"),
			dot.doclink("Setup", "quickstart", "setup")
		])
		.doccategory("Reference", [
			dot.doclink("Targeting", "reference", "targeting"),
			dot.doclink("Tags and Attributes", "reference", "tagsandattributes"),
			dot.doclink("Events", "reference", "events"),
			//dot.doclink("Special Tags", "reference", ""),
			dot.doclink("Special Functions", "reference", "specialfunctions"),
			dot.doclink("Components", "reference", "components"),
			dot.doclink("Data Binding", "reference", "bindings"),
			dot.doclink("Routing", "reference", "routing"),
			dot.doclink("jQuery Helpers", "reference", "jquery"),

		])
		.doccategory("More Information", [
			//dot.doclink("Comparison with Other Frameworks", "moreinformation", "comparison"),
			dot.doclink("Browser Support", "moreinformation", "support"),
			dot.doclink("DOThtml on Github", "moreinformation", "github"),
			//dot.doclink("Contribute", "moreinformation", "contribute"),

		])
		.doccategory("Version History", [
			dot.doclink("v3.0 - Routing, Bindings Redo", "versionhistory", "v3.0"),
			dot.doclink("v2.0 - Bindings, Components, ++", "versionhistory", "v2.0"),
			dot.doclink("v1.3 - Usability Patch", "versionhistory", "v1.3"),
			dot.doclink("v1.2 - Initial Official Release", "versionhistory", "v1.2"),

		])
		.button("[ Close ]").style(dotcss.fontSize(16).padding(10).widthP(100).backgroundColor("#222").color("#fff").border("none").marginTop(10)).class("close-pages-btn").onclick(function(){
			hidePages();
		})
	).id("documentation-directory").style(dotcss.display("inline-block").height(Math.max(window.innerHeight-200, 600)))
	.div(
		dot.button("[ All Pages ]").style(dotcss.fontSize(20).padding(20).widthP(100).backgroundColor("#222").color("#fff").border("none")).class("show-pages-btn").onclick(function(){
			showPages();
		})
		.router({
			routes: routes,
			onNavigateInit: function(navParams){
				$(".documentation-doclink.active").removeClass("active");
				var pathSegments = navParams.path.split("/");
				var page = pathSegments[pathSegments.length - 1] || pathSegments[pathSegments.length - 2];
				if(page == "documentation") page = "overview";
				$("#doclink-" + page).addClass("active");
			}
		}).class("md-out")
		.button("[ All Pages ]").style(dotcss.fontSize(20).padding(20).widthP(100).backgroundColor("#222").color("#fff").border("none")).class("show-pages-btn").onclick(function(){
			showPages();
		})
	).id("documentation-container").style(dotcss.display("inline-block"))
).style(dotcss.position("relative").widthP(100).whiteSpace("nowarp")).id("documentation-page")