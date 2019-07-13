
function dothtmlLogo(targetSelector){
	return new InteractiveEmblem(targetSelector, 2, {
		draw: function(emblem, dot, dotcss){
			emblem.hasPlayed = false;
			//dotcss(emblem.outerNode).backgroundColor("#5588BB");
			var ret = dot.div(
				dot.div(function(){
					var ret2 = dot.div("&lt;").style(dotcss.position("relative").leftP(1.7).heightP(100).lineHeightP(200).display("inline-block").verticalAlign("middle"))
					emblem.lt = ret2.getLast();
					ret2.div()
						.style(dotcss.position("relative").display("inline-block").topP(60).lineHeightP(12.5).heightP(100).widthP(1.7).verticalAlign("middle")
						.backgroundImage("./images/bigdot.png").backgroundSize("contain").backgroundRepeat("no-repeat").opacity(0)
						.color("white").textAlign("center").fontFamily("Impact, Charcoal, sans-serif").fontWeight("normal"));
					emblem.html = ret2.getLast();
					ret2.div("html").style(dotcss.heightP(100).lineHeightP(200).display("inline-block").verticalAlign("middle"))
					.div("&gt;").style(dotcss.heightP(100).lineHeightP(200).display("inline-block").verticalAlign("middle"));
					emblem.gt = ret2.getLast();
					/*.wait(1000, function(){
						return dot.$hide(500);
					});*/

					return ret2;
				}).style(dotcss.position("relative").display("table-cell").verticalAlign("middle").heightP(100))
			).style(dotcss.position("relative").display("table").widthP(100).marginTopP(3.75).marginBottomP(3.75).heightP(55).fontSize(emblem.innerNode.offsetHeight * 0.2689).whiteSpace("nowrap").fontFamily("\"Arial\", Gadget, sans-serif").color("black").fontWeight(900));
			emblem.mainLogo = ret.getLast();
			ret.div(dot.div("A human-friendly way to build highly-dynamic web pages<br />in pure JavaScript.").style(dotcss.display("table-cell").verticalAlign("middle")))
				.style(dotcss.display("table").heightP(25).widthP(100).opacity(0.1).fontSize(emblem.innerNode.offsetHeight * 0.07563).color("#EEEEEE").fontFamily("\"Arial\", Gadget, sans-serif"));
			emblem.slogan = ret.getLast();
			return ret;
		},
		play: function(emblem, dot, dotcss){
			if(emblem.hasPlayed) return;
			emblem.hasPlayed = true;

			dot.wait(1000, function(){
				dotcss(emblem.lt).hide({duration: 500, hideStyle: "shrink"});
				dotcss(emblem.gt).hide({duration: 500, hideStyle: "shrink"});
			})
			.wait(1500, function(){
				dotcss(emblem.html).opacity.animate(1, 300, "ease", function(){
					dot.wait(500, function(){
						dotcss(emblem.html).lineHeight.animate("200%", 500, "ease");
						dotcss(emblem.html).width.animate("27%", 500, "ease");
						dotcss(emblem.html).top.animate(0, 500, "ease");
						dotcss(emblem.html).marginTop.animate(0, 500, "ease");
							dot.wait(500, function(){
								dot(emblem.html).span("DOT").$hide().$fadeIn()
							})
					})
				})
			})
			.wait(3000, function(){
				dotcss(emblem.slogan).opacity.animate(1, 500, "ease");
			});
		},
		skip: function(emblem, dot, dotcss){

		},
		resize: function(emblem, dot, dotcss){
			if(emblem.innerNode.offsetHeight < 100){
				//console.log(emblem.outerNode);
				var s = 1.6;
				dotcss(emblem.innerNode).left(0);
				dotcss(emblem.innerNode.children[0]).height(emblem.innerNode.offsetHeight * 0.55 * s).width(emblem.innerNode.offsetWidth * s);
				dotcss(emblem.mainLogo).fontSize(emblem.innerNode.offsetHeight * 0.2689 * s);
				dotcss(emblem.slogan).hide();
			}
			else{
				dotcss(emblem.innerNode.children[0]).heightP(55).widthP(100);
				dotcss(emblem.mainLogo).fontSize(emblem.innerNode.offsetHeight * 0.2689);
				dotcss(emblem.slogan).show().fontSize(emblem.innerNode.offsetHeight * 0.07563);
			}
		}
	});
}