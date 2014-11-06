var viewBoxWidth = 1000;
var viewBoxMenuHeight = 1000;
var viewBoxMapControlHeight = 240;

var zoomButtonSize = 200;
var zoomButtonMargin = 20;

var textpadding = 180;
var font1size = 60;

var linewidth = 10;
var linepadding = 40;

var button1height = 120;
var button1width = 900;
var button1dx = 50;
var button1dy = 20;

var button2height = button1height;
var button2width = button1width - button1dx;
var button2dx = 2*button1dx;
var button2dy = button1dy;


function createLevel1Button(svg,yOffset,str,iconname,fOnClick) {

	var g = svg.append("svg:g")
		.attr("fill","#444")
		.attr("class","level1button")
		.attr("transform","translate(0," + yOffset + ")")
		.on("click", function() { 
			fOnClick();	
		});

	g.append("rect")
		.attr("x",button1dx).attr("y",button1dy)
		.attr("width",button1width).attr("height",button1height);

	g.append("svg:text")
		.attr("fill","#ccc")
		// .attr("class","buttontext")
		.attr("transform","translate(" + (button1dx+textpadding) + "," + (font1size+button1dy+(button1height-font1size)/2) + ")")
		.text(str)
		.attr("text-anchor","bottom")
		.attr("font-size", font1size)
		.attr("font-variant", "small-caps")
		.attr("cursor","default");

	g.append("svg:image")
		.attr("xlink:href", "img/" + iconname + ".svg")
		.attr("x",button1dx+.1*button1height)
		.attr("y",button1dy+.1*button1height)
		.attr("width", .8*button1height)
		.attr("height", .8*button1height)

}


function createLevel2Button(svg,yOffset,str,iconname,fOnClick) {

	var g = svg.append("svg:g")
		.attr("fill","#333")
		.attr("class","level2button")
		.attr("transform","translate(0," + yOffset + ")")
		.on("click", function() { 
			fOnClick();	
		});

	g.append("rect")
		.attr("x",button2dx).attr("y",button2dy)
		.attr("width",button2width).attr("height",button2height);

	g.append("svg:text")
		.attr("fill","#ccc")
		// .attr("class","buttontext")
		.attr("transform","translate(" + (button2dx+textpadding) + "," + (font1size+button2dy+(button2height-font1size)/2) + ")")
		.text(str)
		.attr("text-anchor","bottom")
		.attr("font-size", font1size)
		.attr("font-variant", "small-caps")
		.attr("cursor","default");

	g.append("svg:image")
		.attr("xlink:href", "img/" + iconname + ".svg")
		.attr("x",button2dx+.1*button2height)
		.attr("y",button2dy+.1*button2height)
		.attr("width", .8*button2height)
		.attr("height", .8*button2height)

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

	createLevel1Button(svgmenu,0,"Project Homepage","house28",function() {})
	createLevel1Button(svgmenu,(button1height+3*button1dy),"Selection Mode","distance1",setSelection)
	createLevel1Button(svgmenu,(2*button1height+4*button1dy),"Layers","stack9",setTrafficLayer)

	createLevel2Button(svgmenu,(3*button1height+6*button1dy),"Traffic Layer","front1",setTrafficLayer)
	createLevel2Button(svgmenu,(4*button1height+7*button1dy),"Crime Layer","crime1",setCrimeLayer)
	createLevel2Button(svgmenu,(5*button1height+8*button1dy),"Places of Interest","information38",setPlacesOfInterestLayer)








	// MAPCONTROL
	
	var svgmapcontrol = d3.select("#divmapcontrol").append("svg:svg")
		.attr("id","mapcontrol")
		.attr("viewBox", "0 0 " + viewBoxWidth + " " + viewBoxMapControlHeight)
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("width",viewBoxWidth).attr("height",viewBoxMapControlHeight)
		.attr("background-color","blue")


	// ZoomIn Button
	var gZoomIn = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (.75*viewBoxWidth+zoomButtonMargin) + "," + (zoomButtonMargin) + ")")
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
		.attr("transform","translate(" + (.75*viewBoxWidth-zoomButtonSize-zoomButtonMargin) + "," + (zoomButtonMargin) + ")")
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
			d3.select(this).style("stroke","#3db7e4")
		})
		.on("mouseout", function() {
			d3.select(this).style("stroke","none")
		});

	gSatelliteView.append('defs')
	  .append('pattern')
		.attr('id', 'imgsatellite')
		.attr('patternUnits', 'userSpaceOnUse')
		.attr('width', viewBoxWidth/2)
		.attr('height', viewBoxWidth/2)
		.append("svg:image")
			.attr("xlink:href", "img/chicagosatellite.png")
			.attr("width", viewBoxWidth/2)
			.attr("height", viewBoxWidth/2)
			.attr("transform","translate(0," + (-.25*viewBoxWidth) + ")")
	
	gSatelliteView.append('defs')
	  .append('pattern')
		.attr('id', 'imgmap')
		.attr('patternUnits', 'userSpaceOnUse')
		.attr('width', viewBoxWidth/2)
		.attr('height', viewBoxWidth/2)
		.append("svg:image")
			.attr("xlink:href", "img/chicagomap.png")
			.attr("width", viewBoxWidth/2)
			.attr("height", viewBoxWidth/2)
			.attr("transform","translate(0," + (-.25*viewBoxWidth) + ")")


	function appendSatelliteRect() {
	
		gSatelliteView.selectAll("rect").remove();
		
		gSatelliteView.append("rect")
			.attr("x",0).attr("y",0)
			.attr("width", viewBoxWidth/2 - 2*zoomButtonMargin).attr("height",zoomButtonSize)
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
