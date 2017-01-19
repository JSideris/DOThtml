//Tabs
DOT.createWidget("tabs", function(tabsArray){
	var first = true;
	return DOT
	.div(
		DOT.div(DOT.each(tabsArray, function(c){return c.tab.if(first, DOT.class("selected")).script(function(){first = false;})})).class("dot-tab-button-container")
		.script(function(){ first = true; })
		//.br()
		.div(DOT.each(tabsArray, function(c){return c.content.if(!first, DOT.style("display: none;")).script(function(){first = false;});})).class("dot-tab-content-container")
	).class("dot-tabs")
});
DOT.createWidget("tab", function(name, content){
	var contentContainerDot = DOT.div(content).class("dot-tab-content");
	var contentContainerNode = contentContainerDot.getLast();
	return {
		tab: DOT.div(name).$click(function(){
			//console.log($(this).parent().next().next().children());//.children().removeClass("selected");
			$(this).siblings().removeClass("selected");//.children().removeClass("selected");
			$(this).addClass("selected");
			$(this).parent().next()/*.next()*/.children().not(contentContainerNode).hide(100, function(){
				$(contentContainerNode).show(100);
			});
		}),
		content: contentContainerDot
	};
});