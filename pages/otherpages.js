exports = dot.tabs(
	[
		dot.tab("DOThtml", "main",

		), 
		dot.tab("Getting Started", "start",

		), 
		/*dot.tab("Plugins & Addons", "plugins",
			dot.h1("This documentation is not complete yet. Please check back later!")
		),*/ 
		dot.tab("Compatibility & Support", "support",
			dot.h1("Browser Compatibility")
			//.h("Maximum forward-and-backward browser compatibility is a priority of DOThtml. Please refer to the following table for more information on browser compatibility testing. Browser testing is an ongoing chore but here are the results of the latest tests. Browsers with a checkmark have passed all test cases. Version numbers are in the following format: \"browser-version | latest-DOThtml-version-tested\"")
			.h("Maximum forward-and-backward browser compatibility is a priority of DOThtml. DOThtml has been tested on a wide range of desktop and mobile browsers including IE 8+. Note: IE8 does not support jQuery, so all jQuery wrappers will not work. Also, two-way binding in IE8 is a work in progress.")
			// .div(
			// 	dot.each([
			// 		{name: "Chrome", versionData: [{b: "57", d: "1.2.1"}, {b: "56", d: "1.2.1"}]}, 
			// 		{name: "Edge", versionData: [{b: "38", d: "1.2.1"}]},
			// 		{name: "Internet Explorer", versionData: [{b: "11", d: "1.2.1"}]},
			// 		//{name: "Safari", versionData: [{b: "", d: "1.2.1"}]}, 
			// 		{name: "Firefox", versionData: [{b: "51", d: "1.2.1"}]}, 
			// 		{name: "Android Browser", versionData: [{b: "", d: "1.2.1"}]}, 
			// 		//{name: "Opera", versionData: [{b: "", d: "1.2.1"}]},
			// 		{name: "BlackBerry Browser", versionData: [{b: "OS 10.3", d: "1.2.1"}]},
			// 		//{name: "Sea Monkey", versionData: [{b: "", d: "1.2.1"}]},
			// 		//{name: "K-Meleon", versionData: [{b: "", d: "1.2.1"}]},
			// 		//{name: "OmniWeb", versionData: [{b: "", d: "1.2.1"}]},
			// 		//{name: "iCab", versionData: [{b: "", d: "1.2.1"}]},
			// 		//{name: "Konqueror", versionData: [{b: "", d: "1.2.1"}]},
			// 		//{name: "Epiphany", versionData: [{b: "", d: "1.2.1"}]},
			// 	], function(row){
			// 		return dot.div(
			// 			dot.div(row.name).style(dotcss.fontWeight("bold").display("inline-block").padding(8).borderRight("2px solid black").marginRight(4))
			// 			.each(row.versionData, function(versionDatum){
			// 				return dot.div(versionDatum.b + " | " + versionDatum.d).style(dotcss.fontStyle("italic").backgroundColor(0xAAFFAA).display("inline-block").padding(4).border("1px solid black"))
			// 			})
			// 		).style(dotcss.whiteSpace("nowrap"));
			// 	})
			// ).style(dotcss.widthP(100)/*.height(1024)*/.overflowX("scroll").backgroundColor(200, 200, 200).padding(8))
			.br().br()
			.h("To test DOThtml on any JavaScript-enabled browser, simply visit the <a href=\"./unittests/tests.html\" target=\"_blank\">test case page</a>.")

			.h1("What About SEO?")
			.h("You might be wondering if using dynamic content will affect the way that search engines index your website. First, know that <a href=\"http://searchengineland.com/tested-googlebot-crawls-javascript-heres-learned-220157\" target=\"_blank\">testing has been done which validated the effectiveness of Googlebot on dynamically generated content</a>, revealing that Google actually waits for the entire page to render before reading the DOM.").br().br()
			.h("You should also be aware that DOThtml is not the only dynamic page builder. The most popular library designed specifically for dynamic JavaScript-based page building (and the second most popular JavaScript library aside from JQuery itself) is JQuery-UI, which has been around for a decade and is used by almost 200 000 of the world's top 1 000 000 websites.").br().br()
			.h("Having a dynamic website can actually increase your site's SEO score in a number of ways, for instance, by reducing your bounce rate, or by katering to accessibility and mobile-friendliness. Interactive, dynamic web applications are the future and are worth not overlooking.")
		)/*, 
		dot.tab("Donate", "donate",
			dot.h1("This documentation is not complete yet. Please check back later!")
		)*/
	])