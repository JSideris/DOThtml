//v2: mobile friendly version
(function(){
	var windowHash = window.location.hash.substr(1);
	var currentVidIndex = 0;
	var currentVidArray = [];
	var overlayon = false;
	var bodyOverflowY = null;
	var bodyOverflowX = null;
	var bodyOverflow = null;
	var startVideo = null;
	var allVids = [];
	/*var touchStarted = false;
	var touchMoved = false;*/
	function playVideo(array, index){
		window.location.hash = array[index];
		var player = $("#video-player")[0];
		console.log(index);
		if(!player) {console.log("Video player hasn't loaded yet."); return;} //didn't load yet?
		currentVidArray = array;
		currentVidIndex = index;
		if(currentVidIndex == 0) dotcss("#video-browser-lt").hide();
		else dotcss("#video-browser-lt").show().display("table");
		if(currentVidIndex == currentVidArray.length - 1) dotcss("#video-browser-gt").hide();
		else dotcss("#video-browser-gt").show().display("table");
		player.src = "https://www.youtube.com/embed/" + array[index] ;//+ "?autoplay=1";
		if (!overlayon) dotcss("#absolute-video-player-container").fadeIn();

		if (bodyOverflow === null) bodyOverflow = document.body.style.overflow;
		if (bodyOverflowX === null) bodyOverflowX = document.body.style.overflowX;
		if (bodyOverflowY === null) bodyOverflowY = document.body.style.overflowY;
		document.body.style.overflow = "hidden";
		document.body.style.overflowX = "hidden";
		document.body.style.overflowY = "hidden";
		overlayon = true;
	}
	function stopVideo(){
		window.location.hash = "1";
		//console.log("closing");
		currentVidArray = 0;
		$("#absolute-video-player-container").fadeOut(function () {
			$("#video-player")[0].src = "";
		});

		document.body.style.overflow = bodyOverflow;
		document.body.style.overflowX = bodyOverflowX;
		document.body.style.overflowY = bodyOverflowY;
		bodyOverflowY = null;
		bodyOverflowX = null;
		bodyOverflow = null;

		overlayon = false;
	}
	function prevVid(e){if(e) e.stopPropagation(); currentVidIndex = Math.max(0, currentVidIndex - 1); playVideo(currentVidArray, currentVidIndex);}
	function nextVid(e){if(e) e.stopPropagation(); currentVidIndex = Math.min(currentVidArray.length - 1, currentVidIndex + 1); playVideo(currentVidArray, currentVidIndex);}

	var playerExpanding = false;
	var playerContracting = false;
	function resizePlayer(){
		var desiredNavWidth = Math.min(200, window.innerWidth / 3);
		if (window.innerWidth < 1024) {
			dotcss("#video-player").height(window.innerHeight - 240).width(window.innerWidth - 40).left(20).top(20);
			if (!playerExpanding) {
				playerContracting = false;
				playerExpanding = true;
				dotcss("#video-browser-lt").height.animate(200);
				dotcss("#video-browser-gt").height.animate(200,null,null, function () { playerExpanding = false;});
			}
		}
		else {
			setTimeout(function(){
				dotcss("#video-player").height(window.innerHeight - 200).width(window.innerWidth - (desiredNavWidth + 20) * 2).left(desiredNavWidth + 20).top(20);
				if (!playerContracting){
					playerContracting = true;
					playerExpanding = false;
					dotcss("#video-browser-lt").height.animate(window.innerHeight);
					dotcss("#video-browser-gt").height.animate(window.innerHeight, null, null, function () { playerContracting = false; });
				}
			}, 100);
		}
		dotcss("#video-browser-lt").fontSize(desiredNavWidth).width.animate(desiredNavWidth);
		dotcss("#video-browser-gt").fontSize(desiredNavWidth).width.animate(desiredNavWidth);
	}

	dot.createWidget("videolist", function(videoIds, numbPerRow){
		allVids = videoIds;
		numbPerRow = numbPerRow || 3;
		var vidGrid = [];
		var vidRow = [];
		for(var i = 0; i < videoIds.length; i++){
			vidRow.push(videoIds[i]);
			if((i+1) % numbPerRow == 0) {
				vidGrid.push(vidRow); 
				vidRow = [];
			}
		}
		//This is a buffer to add to the bottom of the grid
		//so that the page doesn't appear ugly on large screens.
		if(vidRow != []) vidGrid.push(vidRow);
		return dot.each(vidGrid, function(row){
			return dot.div(
				dot.each(row, function(element){
					return dot.div(
						function(){
							var ret = dot.a().name(element).img().src("https://img.youtube.com/vi/" + element + "/0.jpg").style(dotcss.widthP(100).cursor("pointer"))
							$(ret.getLast()).on("click", function(){
								playVideo(videoIds, videoIds.indexOf(element));
							});
							if(windowHash == element) startVideo = element;
							return ret;
						}
					).class("video-thumbnail").style(dotcss.widthP(100 / numbPerRow).display("inline-block"));
				})
			).style(dotcss.widthP(100)/*.border("1px solid white")*/);
		});
	});

	dotcss(".video-browser{}")
		.display("table")
		.position("absolute")
		.bottom(0)
		.backgroundColor(0, 0, 0, 0.2)
		.zIndex(2);

	dotcss(".video-browser>span{}")
		.display("table-cell")
		.verticalAlign("middle")
		.textAlign("center")
		.fontSize(200)
		.lineHeight(200)
		.width(200)
		.color("#666666")
		.backgroundColor(0, 0, 0, 0)
		.fontFamily("Impact, Charcoal, sans-serif")
		.userSelect("none");

	/*dotcss(".video-browser:hover{}")
		.backgroundColor(255, 255, 255, 0.1);
	dotcss(".video-thumbnail{}")
		.opacity(0.8)
	dotcss(".video-thumbnail:hover{}")
		.opacity(1)*/

	$(function(){
		dot("body").div(
			//TODO: just changed width and height from dot.iframe.width(420).height(315)
			dot
			.span("Close Player").style(dotcss.position("absolute").bottom(0).left(0).right(0).color("#AAA").fontWeight("bold").fontSize(14).textAlign("center").userSelect("none").backgroundColor(0,0,0,0))
			.div(dot.span("<")).id("video-browser-lt").class("video-browser").style(dotcss.width(200).height(window.innerHeight || 0).left(0)).onclick(prevVid)
			.div(dot.span(">")).id("video-browser-gt").class("video-browser").style(dotcss.width(200).height(window.innerHeight || 0).right(0)).onclick(nextVid)
			.iframe().id("video-player").attr("allowfullscreen").style(dotcss.position("absolute"))
		).id("absolute-video-player-container").onclick(stopVideo).style(
			dotcss.display("none")
			.position("fixed")
			.top(0).bottom(0).left(0).right(0)
			.verticalAlign("top")
			.textAlign("center")
			.backgroundColor(0,0,0,0.7)
			.cursor("pointer")
			.zIndex(1)
		);
		resizePlayer();
		if(startVideo) playVideo(allVids, allVids.indexOf(startVideo));
	});
	$(window).resize(resizePlayer);
})();