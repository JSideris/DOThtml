//Tabs
dot.createWidget("tabs", function(tabsArray){
	var first = true;
	var useFragment = false;
	//Check if we should use the fragment.
	//Requires that one of the items in tabsArray has the window's current fragmentIdentifier name.
	if(window.location.hash){
		for(var i = 0; i < tabsArray.length; i++){
			if(window.location.hash === "#" + tabsArray[i].fragmentIdentifier){
				useFragment = true;
				break;
			}
		}
	}
	var widgetBodyDot = dot
	.div(
		dot.div(dot.each(tabsArray, function(c){
			return c.tab.if((first & !useFragment) || (useFragment && window.location.hash === "#" + c.fragmentIdentifier), dot.class("selected")).script(function(){first = false;})
		})).class("dot-tab-button-container")
		.script(function(){ first = true; })
		//.br()
		.div(dot.each(tabsArray, function(c){return c.content.if(!((first & !useFragment) || (useFragment && window.location.hash ===  "#" + c.fragmentIdentifier)), dot.style("display: none;")).script(function(){first = false;});})).class("dot-tab-content-container")
	).class("dot-tabs");
	
	return widgetBodyDot;
});
dot.createWidget("tab", function(name, fragmentIdentifier, content){
	if(!content) {content = fragmentIdentifier; fragmentIdentifier = undefined;}
	
	var contentContainerDot = dot.div(content).class("dot-tab-content");
	var contentContainerNode = contentContainerDot.getLast();
	
	var tabDot = dot.div(name).onclick(function(e){
		var div = e.target;
		var parentNode = div.parentNode;
		
		//Remove selected class from all siblings.
		var node = parentNode.firstChild;
		while( node && node.nodeType === 1 ) {
			node.className = "";
			node = node.nextElementSibling || node.nextSibling;
		}
		div.className = "selected";
		
		//Hide all the other containers.
		node = contentContainerNode.parentNode.firstChild;
		while( node && node.nodeType === 1 ) {
			if(node == contentContainerNode) node.style.display = "";
			else node.style.display = "none";
			node = node.nextElementSibling || node.nextSibling;
		}
		
		/*$(div).parent().next().children().not(contentContainerNode).hide(100, function(){
			$(contentContainerNode).show(100);
		});*/
		
		if(fragmentIdentifier) window.location.hash = fragmentIdentifier;
	});
	var tabNode = tabDot.getLast();
	return {
		tab: tabDot,
		content: contentContainerDot,
		fragmentIdentifier: fragmentIdentifier
	};
});

dot.createWidget("wrappedList", function(array, wrapperBuilder){
	return dot.each(array, function(element){
		return wrapperBuilder(element);
	});
});

/*dot.createWidget("scrolledTo", function(){
	if(this._document){
		var le = this._document.lastChild;
		jo[name](handler);
		return this;
	}
	else{
		var pD = (this._pendingCalls.length > 0 ? this : new _dot(this._document));
		if(!pD._pendingCalls) pD._pendingCalls = [];
		pD._pendingCalls.push({type: "jQuery event", name: name, params: arguments});
		return pD;
	}
});*/

//window.location.hash