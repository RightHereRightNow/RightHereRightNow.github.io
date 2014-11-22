var ui = function(menutag,mapcontroltag) {

	this.menutag = menutag;
	this.mapcontroltag = mapcontroltag;

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

	this.textColor = "black"; // "#ccc";

	this.buttonOneList = [];
	this.buttonAllList = [];

	this.dt = 1000; // Transition duration
}

ui.prototype.update = function() {
	for (b in this.buttonAllList) {
		this.buttonAllList[b].update();
	}
}


ui.prototype.draw = function() {

	console.log('Draw UI');

	// MENU

	var svgmenu = d3.select(this.menutag).append("svg:svg")
		.attr("id","menu")
		.attr("class","uisvgelement")
		.attr("viewBox", "0 0 " + this.viewBoxWidth + " " + this.viewBoxMenuHeight)
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("width",this.viewBoxWidth).attr("height",this.viewBoxMenuHeight)

	// Selection Button

		/*
	function clickHomepage() { console.log("TODO: link to homepage");
		window.location.href = "../"; }
	function clickSelection() { context.toggleSelectionMode(); }
*/
	var emptyCallback = function() {};

	var clickGraphs = function() { console.log("TODO: implement"); };
	clickGraphs = clickGraphs.bind(this);
	

	var ystart = 0; var yend = this.button1height;
	var emptyArray = {};

/*
	this.buttonHome = new level1Button(this,"Project Homepage",ystart,yend,"house28",clickHomepage);
	this.buttonHome.create(svgmenu,0);

	ystart = yend + this.button1dy; yend = ystart + this.button1height;
	*/


	this.buttonSelection = new level1Button(this,"Selection",ystart,yend,"distance1",emptyCallback,"SELECTION",emptyArray);
	this.buttonSelection.setPreviousButton(null);
	this.buttonOneList.push(this.buttonSelection);

	ystart = yend + this.button1dy; yend = ystart + this.button1height;
	
	this.buttonLayers = new level1Button(this,"Layers",ystart,yend,"stack9",emptyCallback,"LAYERS",emptyArray);
	this.buttonLayers.setPreviousButton(this.buttonSelection);
	this.buttonOneList.push(this.buttonLayers);
	
	ystart = yend + this.button1dy; yend = ystart + this.button1height;
	
	this.buttonYelp = new level1Button(this,"Yelp",ystart,yend,"distance1",emptyCallback,"YELP",emptyArray);
	this.buttonYelp.setPreviousButton(this.buttonLayers);
	this.buttonOneList.push(this.buttonYelp);
	
	ystart = yend + this.button1dy; yend = ystart + this.button1height;
	
	this.buttonGraphs = new level1Button(this,"Graphs",ystart,yend,"stack9",clickGraphs,"GRAPHS",emptyArray);
	this.buttonGraphs.setPreviousButton(this.buttonYelp);
	this.buttonOneList.push(this.buttonGraphs);


	// SUBMENU LAYERS
	
	this.buttonAllList = this.buttonOneList.slice(0);

	var ystart = 0; var yend = this.button2height;
	
	this.buttonTraffic = new level2Button(this.buttonLayers,"Traffic",ystart,yend,"stack9",emptyCallback,"TRAFFICLAYER",emptyArray);
	this.buttonTraffic.setPreviousButton(null);
	this.buttonAllList.push(this.buttonTraffic);

	ystart = yend + this.button2dy; yend = ystart + this.button2height;

	this.buttonCrime = new level2Button(this.buttonLayers,"Crimes",ystart,yend,"crime1",emptyCallback,"CRIMELAYER",emptyArray);
	this.buttonCrime.setPreviousButton(this.buttonTraffic);
	this.buttonAllList.push(this.buttonCrime);

	ystart = yend + this.button2dy; yend = ystart + this.button2height;
	
	this.buttonPlacesOfInterest = new level2Button(this.buttonLayers,"Places of Interest",ystart,yend,"information38",emptyCallback,"PLACESOFINTEREST",emptyArray);
	this.buttonPlacesOfInterest.setPreviousButton(this.buttonCrime);
	this.buttonAllList.push(this.buttonPlacesOfInterest);

	ystart = yend + this.button2dy; yend = ystart + this.button2height;
	
	this.buttonDivvyBikes = new level2Button(this.buttonLayers,"Divvy Bike Stations",ystart,yend,"regular2",emptyCallback,"DIVVYBIKES",emptyArray);
	this.buttonDivvyBikes.setPreviousButton(this.buttonPlacesOfInterest);
	this.buttonAllList.push(this.buttonDivvyBikes);

	ystart = yend + this.button2dy; yend = ystart + this.button2height;
	
	this.buttonAbandonedVehicles = new level2Button(this.buttonLayers,"Abandoned Vehicles",ystart,yend,"criminal20",emptyCallback,"ABANDONEDVEHICLES",emptyArray);
	this.buttonAbandonedVehicles.setPreviousButton(this.buttonDivvyBikes);
	this.buttonAllList.push(this.buttonAbandonedVehicles);

	ystart = yend + this.button2dy; yend = ystart + this.button2height;
	
	this.buttonStreetLightsOut = new level2Button(this.buttonLayers,"Streetlights Out",ystart,yend,"street9",emptyCallback,"STREETLIGHTSOUT",emptyArray);
	this.buttonAbandonedVehicles.setPreviousButton(this.buttonAbandonedVehicles);
	this.buttonAllList.push(this.buttonStreetLightsOut);

	ystart = yend + this.button2dy; yend = ystart + this.button2height;
	
	this.buttonPotholes = new level2Button(this.buttonLayers,"Streetlights Out",ystart,yend,"road22",emptyCallback,"POTHOLES",emptyArray);
	this.buttonAbandonedVehicles.setPreviousButton(this.buttonStreetLightsOut);
	this.buttonAllList.push(this.buttonPotholes);

	ystart = yend + this.button2dy; yend = ystart + this.button2height;

	// TODO: Submenu buttons should be managed by main buttons
	// TODO: remove ystart yend completely from constructor
	
	
	
	// SUBMENU GRAPHS
	
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
	
	
	// Draw level1buttons last, so they are on top
	this.buttonSelection.create(svgmenu);
	this.buttonLayers.create(svgmenu);
	this.buttonYelp.create(svgmenu);
	this.buttonGraphs.create(svgmenu);





















	// MAPCONTROL

	var svgmapcontrol = d3.select(this.mapcontroltag).append("svg:svg")
		.attr("id","mapcontrol")
		.attr("class","uisvgelement")
		.attr("viewBox", "0 0 " + this.viewBoxWidth + " " + (this.zoomButtonSize + 5*this.zoomButtonMargin))
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("width",this.viewBoxWidth).attr("height",this.viewBoxMapControlHeight)
		.attr("background-color","blue")


	// ZoomIn Button
	var gZoomIn = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (this.zoomButtonMargin) + "," + (this.zoomButtonMargin) + ")")
		.style("fill","transparent")
		// .attr("class","level1button")
		.on("click", function() { 
			context.map.zoomIn(1);
		})
		.on("mouseover", function() {
			d3.select(this).style("fill","#3db7e4")
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
			d3.select(this).style("fill","#3db7e4");
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
			d3.select(this).style("stroke","#3db7e4")
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
