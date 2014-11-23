var ui = function(menutag,mapcontroltag,radiuscontroltag) {

	this.menutag = menutag;
	this.mapcontroltag = mapcontroltag;
	this.radiuscontroltag = radiuscontroltag;

	// Defining parameters for drawing
	this.viewBoxWidth = 1000;
	this.viewBoxMenuHeight = 1000;
	this.viewBoxMapControlHeight = 240;

	this.zoomButtonSize = 800;
	this.zoomButtonMargin = 100;

	this.buttonStrokeColor = "#222";

	this.textpadding = 180;
	this.font1size = 60;
	this.font2size = 50;

	this.linewidth = 32;
	this.linepadding = 150;

	this.button1height = 120;
	this.button1width = 900;
	this.button1dx = 50;
	this.button1dy = 20;

	this.button2height = .8*this.button1height;
	this.button2width = this.button1width - this.button1dx;
	this.button2dx = 2*this.button1dx;
	this.button2dy = .5*this.button1dy;

	this.textColor = "black";
	divvyBlue = "#3db7e4";

	this.button1List = [];

	this.dt = 1000; // Transition duration
}

ui.prototype.update = function() {
	for (b in this.button1List) {
		this.button1List[b].update();
	}
}


ui.prototype.draw = function() {

	console.log('Draw UI');

	var emptyCallback = function() {};
	var emptyArray = {};
	
	// MENU

	var svgmenu = d3.select(this.menutag).append("svg:svg")
		.attr("id","menu")
		.attr("class","uisvgelement")
		.attr("viewBox", "0 0 " + this.viewBoxWidth + " " + this.viewBoxMenuHeight)
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("width",this.viewBoxWidth).attr("height",this.viewBoxMenuHeight)

	this.buttonSelection = new level1Button(this,"Path Selection","distance1",emptyCallback,"SELECTION",emptyArray);
	this.buttonSelection.setPreviousButton(null);
	this.button1List.push(this.buttonSelection);

	this.buttonLayers = new level1Button(this,"Layers","stack9",emptyCallback,"LAYERS",emptyArray);
	this.buttonLayers.setPreviousButton(this.buttonSelection);
	this.button1List.push(this.buttonLayers);
	
	this.buttonYelp = new level1Button(this,"Yelp","distance1",emptyCallback,"YELP",emptyArray);
	this.buttonYelp.setPreviousButton(this.buttonLayers);
	this.button1List.push(this.buttonYelp);

	
	// SUBMENU LAYERS
	
	this.buttonLayers.addChildButton("A","stack9",emptyCallback,"TRAFFICLAYER",emptyArray);
	this.buttonLayers.addChildButton("B","crime1",emptyCallback,"CRIMELAYER",emptyArray);
	this.buttonLayers.addChildButton("C","information38",emptyCallback,"POTHOLELAYER",emptyArray);
	this.buttonLayers.addChildButton("D","regular2",emptyCallback,"ABANDONEDVEHICLES",emptyArray);
	this.buttonLayers.addChildButton("E","criminal20",emptyCallback,"STREETLIGHTSOUT",emptyArray);
	this.buttonLayers.addChildButton("F","street9",emptyCallback,"DIVVYBIKES",emptyArray);
	this.buttonLayers.addChildButton("G","road22",emptyCallback,"PLACESOFINTEREST",emptyArray);
	
	// Draw Buttons
	this.buttonSelection.create(svgmenu);
	this.buttonLayers.create(svgmenu);
	this.buttonYelp.create(svgmenu);

	
	/*
	this.buttonGraphs = new level1Button(this,"Graphs","stack9",emptyCallback,"GRAPHS",emptyArray);
	this.buttonGraphs.setPreviousButton(this.buttonYelp);
	this.button1List.push(this.buttonGraphs);

	this.buttonBla = new level1Button(this,"Bla","stack9",emptyCallback,"GRAPHS",emptyArray);
	this.buttonBla.setPreviousButton(this.buttonGraphs);
	this.button1List.push(this.buttonBla);

	this.buttonBlub = new level1Button(this,"Bla","stack9",emptyCallback,"GRAPHS",emptyArray);
	this.buttonBlub.setPreviousButton(this.buttonBla);
	this.button1List.push(this.buttonBlub);
	
	this.buttonGraphs.create(svgmenu);
	this.buttonBla.create(svgmenu);
	this.buttonBlub.create(svgmenu);
*/	


	
/*	

	var ystart = 0; var yend = this.button2height;
	
	this.buttonTraffic = new level2Button(this.buttonLayers,"Traffic",ystart,yend,"stack9",emptyCallback,"TRAFFICLAYER",emptyArray);
	this.buttonTraffic.setPreviousButton(null);

	this.buttonCrime = new level2Button(this.buttonLayers,"Crimes",ystart,yend,"crime1",emptyCallback,"CRIMELAYER",emptyArray);
	this.buttonCrime.setPreviousButton(this.buttonTraffic);

	this.buttonPlacesOfInterest = new level2Button(this.buttonLayers,"Places of Interest",ystart,yend,"information38",emptyCallback,"PLACESOFINTEREST",emptyArray);
	this.buttonPlacesOfInterest.setPreviousButton(this.buttonCrime);
	
	this.buttonDivvyBikes = new level2Button(this.buttonLayers,"Divvy Bike Stations",ystart,yend,"regular2",emptyCallback,"DIVVYBIKES",emptyArray);
	this.buttonDivvyBikes.setPreviousButton(this.buttonPlacesOfInterest);
	
	this.buttonAbandonedVehicles = new level2Button(this.buttonLayers,"Abandoned Vehicles",ystart,yend,"criminal20",emptyCallback,"ABANDONEDVEHICLES",emptyArray);
	this.buttonAbandonedVehicles.setPreviousButton(this.buttonDivvyBikes);
	
	this.buttonStreetLightsOut = new level2Button(this.buttonLayers,"Streetlights Out",ystart,yend,"street9",emptyCallback,"STREETLIGHTSOUT",emptyArray);
	this.buttonAbandonedVehicles.setPreviousButton(this.buttonAbandonedVehicles);
	
	this.buttonPotholes = new level2Button(this.buttonLayers,"Streetlights Out",ystart,yend,"road22",emptyCallback,"POTHOLES",emptyArray);
	this.buttonAbandonedVehicles.setPreviousButton(this.buttonStreetLightsOut);

	// TODO: level1buttons are mutually exclusive, level2buttons are not
	// TODO: level2buttons have layers, arrays, etc., level1buttons dont - modify in controller
	*/


	// SUBMENU GRAPHS
/*	
	var ystart = 0; var yend = this.button2height;
	
	this.buttonWeatherGraph = new level2Button(this.buttonGraphs,"Weather",ystart,yend,"cold5",emptyCallback,"CURRENTWEATHER",emptyArray);
	this.buttonWeatherGraph.setPreviousButton(null);
	this.buttonAllList.push(this.buttonWeatherGraph);

	ystart = yend + this.button2dy; yend = ystart + this.button2height;

	this.buttonPotholeGraph = new level2Button(this.buttonLayers,"Crimes",ystart,yend,"crime1",emptyCallback,"CRIMELAYER",emptyArray);
	this.buttonCrime.setPreviousButton(this.buttonWeatherGraph);
	this.buttonAllList.push(this.buttonPotholeGraph);
	
	
	// Drawing buttons
	this.buttonTraffic.create(svgmenu);
	this.buttonCrime.create(svgmenu);
	this.buttonPlacesOfInterest.create(svgmenu);
	this.buttonDivvyBikes.create(svgmenu);
	this.buttonAbandonedVehicles.create(svgmenu);
	this.buttonStreetLightsOut.create(svgmenu);
	this.buttonPotholes.create(svgmenu);
	
	this.buttonWeatherGraph.create(svgmenu);
	this.buttonPotholeGraph.create(svgmenu);
*/	
	



















	// RADIUSCONTROL

	var svgmapcontrol = d3.select(this.radiuscontroltag).append("svg:svg")
		.attr("id","radiuscontrol")
		.attr("class","uisvgelement")
		.attr("viewBox", "0 0 " + this.viewBoxWidth + " " + (5*this.zoomButtonSize + 4*this.zoomButtonMargin))
		.attr("preserveAspectRatio", "xMinYMin meet")


	// Radius "+" Button
	var gZoomIn = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (this.zoomButtonMargin) + "," + (this.zoomButtonMargin) + ")")
		.style("fill","transparent")
		.on("click", function() { 
			console.log("TODO: increase radius");
		})
		.on("mouseover", function() {
			d3.select(this).style("fill",divvyBlue)
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","transparent");
		});

	gZoomIn.append("circle")
		.attr("transform","translate(" + (this.zoomButtonSize/2) + "," + (this.zoomButtonSize/2) + ")")
		.attr("r",this.zoomButtonSize/2)
		.attr("stroke",this.buttonStrokeColor)
		.attr("stroke-width",this.linewidth)
	
	gZoomIn.append("line")
		.attr("x1",this.zoomButtonSize/2).attr("y1",this.linepadding)
		.attr("x2",this.zoomButtonSize/2).attr("y2",this.zoomButtonSize-this.linepadding)
		.attr("stroke",this.buttonStrokeColor)
		.attr("stroke-width",this.linewidth)
	
	gZoomIn.append("line")
		.attr("x1",this.linepadding).attr("y1",this.zoomButtonSize/2)
		.attr("x2",this.zoomButtonSize-this.linepadding).attr("y2",this.zoomButtonSize/2)
		.attr("stroke",this.buttonStrokeColor)
		.attr("stroke-width",this.linewidth)

	
		


	// Radius "-" Button
	var gZoomOut = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (this.zoomButtonMargin) + "," + (4*this.zoomButtonSize + 3*this.zoomButtonMargin) + ")")
		.attr("fill","transparent")
		.on("click", function() { 
			console.log("TODO: Implement decrease radius");
		})
		.on("mouseover", function() {
			d3.select(this).style("fill",divvyBlue);
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","transparent");
		});

	gZoomOut.append("circle")
		.attr("transform","translate(" + (this.zoomButtonSize/2) + "," + (this.zoomButtonSize/2) + ")")
		.attr("x",0).attr("y",0)
		.attr("r",this.zoomButtonSize/2)
		.attr("stroke",this.buttonStrokeColor)
		.attr("stroke-width",this.linewidth)

	gZoomOut.append("line")
		.attr("x1",this.linepadding).attr("y1",this.zoomButtonSize/2)
		.attr("x2",this.zoomButtonSize-this.linepadding).attr("y2",this.zoomButtonSize/2)
		.attr("stroke",this.buttonStrokeColor)
		.attr("stroke-width",this.linewidth)


	// Radius Status bar	
	var gRadius = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (this.zoomButtonMargin) + "," + (this.zoomButtonSize + 2*this.zoomButtonMargin) + ")")
		.style("fill","transparent")

	gRadius.append("rect")
		.attr("x",this.zoomButtonSize/2-.2*this.zoomButtonSize).attr("y",this.linepadding)
		.attr("width",.4*this.zoomButtonSize).attr("height",3*this.zoomButtonSize-2*this.linepadding)
		.attr("rx",.2*this.zoomButtonSize).attr("ry",.2*this.zoomButtonSize)
		.attr("fill",this.buttonStrokeColor)

	gRadius.append("rect")
		.attr("x",this.zoomButtonSize/2-.2*this.zoomButtonSize)
		.attr("y",function() {
			return 20;
			// (1- radiusPercentage) * (3*this.zoomButtonSize-2*this.linepadding) + this.linepadding;
		})
		.attr("width",.4*this.zoomButtonSize)
		.attr("height",function() {
			return 500;
			// radiusPercentage * (3*this.zoomButtonSize-2*this.linepadding);
		})
		.attr("rx",.2*this.zoomButtonSize).attr("ry",.2*this.zoomButtonSize)
		.attr("fill",divvyBlue)


	// MAPCONTROL

	var svgmapcontrol = d3.select(this.mapcontroltag).append("svg:svg")
		.attr("id","mapcontrol")
		.attr("class","uisvgelement")
		.attr("viewBox", "0 0 " + this.viewBoxWidth + " " + (3*this.zoomButtonSize + 5*this.zoomButtonMargin))
		.attr("preserveAspectRatio", "xMinYMin meet")


	// ZoomIn Button
	var gZoomIn = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (this.zoomButtonMargin) + "," + (this.zoomButtonMargin) + ")")
		.style("fill","transparent")
		// .attr("class","level1button")
		.on("click", function() { 
			context.map.zoomIn(1);
		})
		.on("mouseover", function() {
			d3.select(this).style("fill",divvyBlue)
				// .attr("stroke-width",2*this.linewidth) // TODO: implement
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","transparent");
		});

	gZoomIn.append("circle")
		.attr("transform","translate(" + (this.zoomButtonSize/2) + "," + (this.zoomButtonSize/2) + ")")
		.attr("r",this.zoomButtonSize/2)
		.attr("stroke",this.buttonStrokeColor)
		.attr("stroke-width",this.linewidth)
	
	gZoomIn.append("line")
		.attr("x1",this.zoomButtonSize/2).attr("y1",this.linepadding)
		.attr("x2",this.zoomButtonSize/2).attr("y2",this.zoomButtonSize-this.linepadding)
		.attr("stroke",this.buttonStrokeColor)
		.attr("stroke-width",this.linewidth)
	
	gZoomIn.append("line")
		.attr("x1",this.linepadding).attr("y1",this.zoomButtonSize/2)
		.attr("x2",this.zoomButtonSize-this.linepadding).attr("y2",this.zoomButtonSize/2)
		.attr("stroke",this.buttonStrokeColor)
		.attr("stroke-width",this.linewidth)



	// ZoomOut Button
	var gZoomOut = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (this.zoomButtonMargin) + "," + (1*this.zoomButtonSize + 2*this.zoomButtonMargin) + ")")
		.attr("fill","transparent")
		// .attr("class","level1button")
		.on("click", function() { 
			context.map.zoomOut(1);
		})
		.on("mouseover", function() {
			d3.select(this).style("fill",divvyBlue);
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","transparent");
		});

	gZoomOut.append("circle")
		.attr("transform","translate(" + (this.zoomButtonSize/2) + "," + (this.zoomButtonSize/2) + ")")
		.attr("x",0).attr("y",0)
		.attr("r",this.zoomButtonSize/2)
		.attr("stroke",this.buttonStrokeColor)
		.attr("stroke-width",this.linewidth)

	gZoomOut.append("line")
		.attr("x1",this.linepadding).attr("y1",this.zoomButtonSize/2)
		.attr("x2",this.zoomButtonSize-this.linepadding).attr("y2",this.zoomButtonSize/2)
		.attr("stroke",this.buttonStrokeColor)
		.attr("stroke-width",this.linewidth)

	
	// Toggle SatelliteView Button
	var gSatelliteView = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (this.zoomButtonMargin) + "," + (2*this.zoomButtonSize + 3*this.zoomButtonMargin) + ")")
		.style("stroke",this.buttonStrokeColor)
		.style("stroke-width","2")
		// .attr("class","level1button")
		.on("click", function() { 
			console.log(context.base);
			if(context.base === 0) {
				context.map.viewStreet();
				context.base = 1;
				appendSatelliteRect();
			} else {
				context.map.viewAerial();
				context.base = 0;
				appendSatelliteRect();
			}

			console.log("Clicked!");
		})
		.on("mouseover", function() {
			d3.select(this).style("stroke",divvyBlue)
		})
		.on("mouseout", function() {
			d3.select(this).style("stroke","none")
		});

	gSatelliteView.append('defs')
	  .append('pattern')
		.attr('id', 'imgsatellite')
		.attr('patternUnits', 'userSpaceOnUse')
		.attr('width', this.zoomButtonSize)
		.attr('height', this.zoomButtonSize)
		.append("svg:image")
			.attr("xlink:href", "img/chicagosatellite.png")
			.attr("width", this.zoomButtonSize)
			.attr("height", this.zoomButtonSize)
	
	gSatelliteView.append('defs')
	  .append('pattern')
		.attr('id', 'imgmap')
		.attr('patternUnits', 'userSpaceOnUse')
		.attr('width', this.zoomButtonSize)
		.attr('height', this.zoomButtonSize)
		.append("svg:image")
			.attr("xlink:href", "img/chicagomap.png")
			.attr("width", this.zoomButtonSize)
			.attr("height", this.zoomButtonSize)

	function appendSatelliteRect() {
	
		gSatelliteView.selectAll("rect").remove();
		
		gSatelliteView.append("rect")
			.attr("x",0).attr("y",0)
			.attr("width", this.zoomButtonSize).attr("height",this.zoomButtonSize)
			.style("stroke",this.buttonStrokeColor)
			.style("stroke-width","8")
			.attr("fill", function() {
				if(context.base === 0) {
					return 'url(#imgmap)';
				} else {
					return 'url(#imgsatellite)';
				}
			});
	
	}
	
	appendSatelliteRect = appendSatelliteRect.bind(this);

	appendSatelliteRect();

}
