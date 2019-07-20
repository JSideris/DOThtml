if(dot.featurePreview) dot.removeComponent("featurePreview");
dot.component({
	name: "featurePreview",
	builder: function(title, description, color){
		return dot.div(
			dot.h3(title).style(dotcss.fontSize(30).margin(0).backgroundColor(255,255,255,0.6).borderRadius(5))
			.p(description).style(dotcss.fontSize(18).whiteSpace("normal").color("black"))
		).style(dotcss.display("inline-block").whiteSpace("nowrap").border("4px solid #333").backgroundColor(color).color("black").padding(5).width(320));
	}
});

exports = dot.div(
	dot.div("DOThtml is a client-side framework for building single-page applications.")
	//.br()
	.div(
		dot.t("It is designed to be ").b("intuitive").t(", ").b("light-weight").t(", and ").b("extensible").t(".")
		//.br().t("With a succinct syntax resembling HTML.")
	).style(dotcss.fontSize(24).fontStyle("italic"))
	.br()
	.a("Download DOThtml &#x2b73;").href("https://github.com/JSideris/DOThtml/releases/latest").target("_blank").class("btn btn-primary download-dot-button")//.download()
	.br()
	.br()
	.hr()
	.h2("This is what it can do.")
	.featurePreview("Routing", "Build SPAs for any platform with routing that just works.", "#FCA")
	.featurePreview("Data Binding", "Bind your model and your view and forget about it.", "#AAF")
	.featurePreview("Components", "Expand DOThtml with custom components.", "#3BB")
	.featurePreview("No more HTML", "Dynamic page-building makes it easy to build dynamic apps.", "#D6D")
	.h2("And here's why you'll love it.")
	.featurePreview("Succinct", "The most succinct HTML-building syntax out there that is still JavaScript.", "#8F8")
	.featurePreview("Pure JavaScript", "Develop awesome apps faster by not having to wait for a compiler.", "#FF5")
	.featurePreview("Tiny", "No more 100mb+ for \"Hello, world\". Client-side library is only a few kb!", "#D66")
).id("download-dot-banner")

