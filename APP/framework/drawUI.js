var viewBoxWidth = 1000;
var viewBoxMenuHeight = 1000;
var viewBoxMapControlHeight = 240;

var button1height = 200;
var button1width = 900;

var zoomButtonSize = 200;
var zoomButtonMargin = 20;

var textpadding = 50;
var font1size = 100;

var linewidth = 10;
var linepadding = 40;

var button1dx = 50;
var button1dy = 50;



function createLevel1Button(svg,yOffset,str,fOnClick) {
	

	var g = svg.append("svg:g")
		.attr("fill","green")
		.attr("class","level1button")
		.attr("transform","translate(0," + yOffset + ")")
		.on("click", function() { 
			fOnClick();	
		});

	g.append("rect")
		.attr("x",button1dx).attr("y",button1dy)
		.attr("width",button1width).attr("height",button1height)

	g.append("svg:text")
		.attr("fill","blue")
		// .attr("class","buttontext")
		.attr("transform","translate(" + (button1dx+textpadding) + "," + (font1size+button1dy+(button1height-font1size)/2) + ")")
		.text(str)
		.attr("text-anchor","bottom")
		.attr("font-size", font1size)
		.attr("cursor","default")

}



function drawUI() {

	console.log('Draw UI');




	// MENU

	var svgmenu = d3.select("#divmenu").append("svg:svg")
		.attr("id","menu")
		.attr("viewBox", "0 0 " + viewBoxWidth + " " + viewBoxMenuHeight)
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("width",viewBoxWidth).attr("height",viewBoxMenuHeight)

	// Selection Button

	function setSelection() { context.setMode(context.modes.SELECTION); }
	function setTrafficLayer() { context.setMode(context.modes.TRAFFICLAYER); }
	function setCrimeLayer() { context.setMode(context.modes.CRIMELAYER); }
	function setPlacesOfInterestLayer() { context.setMode(context.modes.PLACESOFINTEREST); }

	createLevel1Button(svgmenu,0,"Selection",setSelection)
	createLevel1Button(svgmenu,(button1height),"Traffic Layer",setTrafficLayer)
	createLevel1Button(svgmenu,(2*button1height),"Crime Layer",setCrimeLayer)
	createLevel1Button(svgmenu,(3*button1height),"Places of Interest",setPlacesOfInterestLayer)
	







	// MAPCONTROL
	
	var svgmapcontrol = d3.select("#divmapcontrol").append("svg:svg")
		.attr("id","mapcontrol")
		.attr("viewBox", "0 0 " + viewBoxWidth + " " + viewBoxMapControlHeight)
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("width",viewBoxWidth).attr("height",viewBoxMapControlHeight)
		.attr("background-color","blue")


	// ZoomIn Button
	var gZoomIn = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (viewBoxWidth-zoomButtonSize-zoomButtonMargin) + "," + (zoomButtonMargin) + ")")
		.style("fill","transparent")
		// .attr("class","level1button")
		.on("click", function() { 
			map.zoomIn(1);
		})
		.on("mouseover", function() {
			d3.select(this).style("fill","#3db7e4")
				.attr("stroke-width",2*linewidth) // TODO: implement
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","transparent");
		});

	gZoomIn.append("circle")
		.attr("transform","translate(" + (zoomButtonSize/2) + "," + (zoomButtonSize/2) + ")")
		.attr("r",zoomButtonSize/2)
		.attr("stroke","#444")
		.attr("stroke-width",linewidth)
	
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


	// ZoomOut Button
	var gZoomOut = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (viewBoxWidth-2*zoomButtonSize-2*zoomButtonMargin) + "," + (zoomButtonMargin) + ")")
		.attr("fill","transparent")
		// .attr("class","level1button")
		.on("click", function() { 
			map.zoomOut(1);
		})
		.on("mouseover", function() {
			d3.select(this).style("fill","#3db7e4");
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","transparent");
		});

	gZoomOut.append("circle")
		.attr("transform","translate(" + (zoomButtonSize/2) + "," + (zoomButtonSize/2) + ")")
		.attr("x",0).attr("y",0)
		.attr("r",zoomButtonSize/2)
		.attr("stroke","#444")
		.attr("stroke-width",linewidth)

	gZoomOut.append("line")
		.attr("x1",linepadding).attr("y1",zoomButtonSize/2)
		.attr("x2",zoomButtonSize-linepadding).attr("y2",zoomButtonSize/2)
		.attr("stroke","#444")
		.attr("stroke-width",linewidth)

	
	// Toggle SatelliteView Button
	var toggler = true;
	
	var gSatelliteView = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (zoomButtonMargin) + "," + (zoomButtonMargin) + ")")
		.style("stroke-width","10")
		// .attr("class","level1button")
		.on("click", function() { 
			// map.zoomOut(1);
			// TODO: change layer
			// should be possible using addLayer().
			if(toggler /*map.satelliteLayer()*/) {
				toggler = false;
				console.log("TODO: remove satellite Layer");
				appendSatelliteRect();
			} else {
				toggler = true;
				console.log("TODO: add satellite Layer");
				appendSatelliteRect();
			}

			console.log("Clicked!");
		})
		.on("mouseover", function() {
			d3.select(this).style("stroke","magenta")
		})
		.on("mouseout", function() {
			d3.select(this).style("stroke","none")
		});

	gSatelliteView.append('defs')
	  .append('pattern')
		.attr('id', 'imgsatellite')
		.attr('patternUnits', 'userSpaceOnUse')
		.attr('width', 2.1*zoomButtonSize)
		.attr('height', 2.1*zoomButtonSize)
		.append("svg:image")
			.attr("xlink:href", "img/chicagosatellite.png")
			.attr("width", 2.1*zoomButtonSize)
			.attr("height", 2.1*zoomButtonSize)
			.attr("transform","translate(0," + (-.5*zoomButtonSize) + ")")
	
	gSatelliteView.append('defs')
	  .append('pattern')
		.attr('id', 'imgmap')
		.attr('patternUnits', 'userSpaceOnUse')
		.attr('width', 2.1*zoomButtonSize)
		.attr('height', 2.1*zoomButtonSize)
		.append("svg:image")
			.attr("xlink:href", "img/chicagomap.png")
			.attr("width", 2.1*zoomButtonSize)
			.attr("height", 2.1*zoomButtonSize)
			.attr("transform","translate(0," + (-.5*zoomButtonSize) + ")")


	function appendSatelliteRect() {
	
		gSatelliteView.selectAll("rect").remove();
		
		gSatelliteView.append("rect")
			.attr("x",0).attr("y",0)
			.attr("width",2*zoomButtonSize).attr("height",zoomButtonSize)
			.attr("fill", function() {
				if(toggler) {
					return 'url(#imgsatellite)';
				} else {
					return 'url(#imgmap)';
				}
			});
	
	}

	appendSatelliteRect();


}
