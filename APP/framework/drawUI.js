function drawUI() {

	console.log('Draw UI');

	var viewBoxWidth = 1000;
	var viewBoxMenuHeight = 1000;
	var viewBoxMapControlHeight = 360;

	var button1height = 200;
	var button1width = 900;
	var button1dx = 50;
	var button1dy = 50;

	var zoomButtonSize = 100;
	var zoomButtonMargin = 20;

	var textpadding = 50;
	var font1size = 100;

	var linewidth = 10;
	var linepadding = 20;



	// MENU
	
	var svgmenu = d3.select("#divmenu").append("svg:svg")
		.attr("id","menu")
		.attr("viewBox", "0 0 " + viewBoxWidth + " " + viewBoxMenuHeight)
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("width",viewBoxWidth).attr("height",viewBoxMenuHeight)

	var g = svgmenu.append("svg:g")
		.attr("fill","green")
		.attr("class","level1button")

	g.append("rect")
		.attr("x",button1dx).attr("y",button1dy)
		.attr("width",button1width).attr("height",button1height)
		.on("click", function() { 
			context.setMode(context.modes.SELECTION)
		});

	g.append("svg:text")
		.attr("fill","blue")
		// .attr("class","buttontext")
		.attr("transform","translate(" + (button1dx+textpadding) + "," + (button1dy+font1size) + ")")
		.text("Selection")
		.attr("text-anchor","bottom")
		.attr("font-size", font1size)




	// MAPCONTROL
	
	var svgmapcontrol = d3.select("#divmapcontrol").append("svg:svg")
		.attr("id","mapcontrol")
		.attr("viewBox", "0 0 " + viewBoxWidth + " " + viewBoxMapControlHeight)
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("width",viewBoxWidth).attr("height",viewBoxMapControlHeight)
		.attr("background-color","blue")
	
	var gZoomIn = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (viewBoxWidth-zoomButtonSize-zoomButtonMargin) + "," + (zoomButtonMargin) + ")")
		.attr("fill","magenta")
		// .attr("class","level1button")
		.on("click", function() { 
			map.zoomIn(1);
		});

	gZoomIn.append("rect")
		// .attr("fill","#3db7e4")
		.attr("x",0).attr("y",0)
		.attr("width",zoomButtonSize).attr("height",zoomButtonSize)
	
	gZoomIn.append("line")
		.attr("x1",zoomButtonSize/2).attr("y1",linepadding)
		.attr("x2",zoomButtonSize/2).attr("y2",zoomButtonSize-linepadding)
		.attr("stroke","#444")
		.attr("stroke-width",linewidth)
	
	gZoomIn.append("line")
		.attr("x1",linepadding).attr("y1",zoomButtonSize/2)
		.attr("x2",zoomButtonSize-linepadding).attr("y2",zoomButtonSize/2)
		.attr("stroke","#444")
		.attr("stroke-width",linewidth)


	var gZoomOut = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (viewBoxWidth-zoomButtonSize-zoomButtonMargin) + "," + (zoomButtonSize + 2*zoomButtonMargin) + ")")
		.attr("fill","magenta")
		// .attr("class","level1button")
		.on("click", function() { 
			map.zoomOut(1);
		});

	gZoomOut.append("rect")
		// .attr("fill","#3db7e4")
		.attr("x",0).attr("y",0)
		.attr("width",zoomButtonSize).attr("height",zoomButtonSize)

	gZoomOut.append("line")
		.attr("x1",linepadding).attr("y1",zoomButtonSize/2)
		.attr("x2",zoomButtonSize-linepadding).attr("y2",zoomButtonSize/2)
		.attr("stroke","#444")
		.attr("stroke-width",linewidth)


}
