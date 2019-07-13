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

dot.component("doclink", function(title, folder, file){
	pageCategoryMap[file] = folder;
	routes.push({title: title, path: "documentation/" + file, component: dot.mdviewer});
	return dot.a(title).id("doclink-" + file).class("documentation-doclink").onclick(function(e){
		dot.navigate("/documentation/" + file);
		if(window.innerWidth <= 600) hidePages();
	});
});

var converter = new showdown.Converter();
var pageCategoryMap = {};

dot.component({
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
				dot(self.element).h(converter.makeHtml(this.responseText));
				
				// TURN LINKS INTO NAV BUTTONS.
				var links = self.element.querySelectorAll("a");
				for(var i = 0; i < links.length; i++){
					var a = links[i];
					var href = $(a).attr("href");
					if(href.indexOf("/") == "/"){
						a.removeAttribute("href");

						var onclick = function(){
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
			dot.doclink("Tags and Attributes", "reference", "tagsandattributes"),
			dot.doclink("Targeting", "reference", "targeting"),
			dot.doclink("Events", "reference", "events"),
			dot.doclink("Custom Tags and Attributes", "reference", "custom"),
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
	).id("documentation-directory").style(dotcss.display("inline-block"))
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