var ui = function(menutag,mapcontroltag) {

	this.menutag = menutag;
	this.mapcontroltag = mapcontroltag;

	// Defining parameters for drawing
	this.viewBoxWidth = 1000;
	this.viewBoxMenuHeight = 1000;
	this.viewBoxMapControlHeight = 240;

	this.zoomButtonSize = 200;
	this.zoomButtonMargin = 20;

	this.textpadding = 180;
	this.font1size = 60;
	this.font2size = 50;

	this.linewidth = 10;
	this.linepadding = 40;

	this.button1height = 120;
	this.button1width = 900;
	this.button1dx = 50;
	this.button1dy = 20;

	this.button2height = this.button1height;
	this.button2width = this.button1width - this.button1dx;
	this.button2dx = 2*this.button1dx;
	this.button2dy = this.button1dy;

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
	
	this.buttonGraphs = new level1Button(this,"Graphs",ystart,yend,"stack9",clickGraphs,"GRAPHS",emptyArray);
	this.buttonGraphs.setPreviousButton(this.buttonLayers);
	this.buttonOneList.push(this.buttonGraphs);

	/*
	function clickTrafficLayer() { context.setLayer("TRAFFICLAYER",context.ctaArray,!context.getMode("TRAFFICLAYER")); context.getData(); }
	function clickCrimeLayer() { context.setLayer("CRIMELAYER",context.crimeContainer,!context.getMode("CRIMELAYER")); context.getData(); }
	function clickPlacesOfInterestLayer() { context.setLayer("PLACESOFINTEREST",context.pointsOfInterestArray,!context.getMode("PLACESOFINTEREST")); context.getData(); }
	function clickDivvyBikes() { context.setLayer("DIVVYBIKES",context.divvyArray,!context.getMode("DIVVYBIKES")); context.getData();}
	function clickAbandonedVehicles() { context.setLayer("ABANDONEDVEHICLES",context.carsArray,!context.getMode("ABANDONEDVEHICLES")); context.getData(); }
	function clickStreetLightsOut() {context.setLayer("STREETLIGHTSOUT",context.lights1Array,!context.getMode("STREETLIGHTSOUT")); context.getData(); }
	function clickPotholes() {context.setLayer("POTHOLES",context.potholesArray,!context.getMode("POTHOLES")); context.getData();}
	function clickCurrentWeather() {context.setWeather(!context.getMode("CURRENTWEATHER")); }
	*/

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
	
	/*
	this.createLevel2Button(svgmenu,(6*this.button1height+9*this.button1dy), "Divvy Bikes", "regular2", clickDivvyBikes);
	this.createLevel2Button(svgmenu,(7*this.button1height+10*this.button1dy), "Abandoned Vehicles", "criminal20", clickAbandonedVehicles);
	this.createLevel2Button(svgmenu,(8*this.button1height+11*this.button1dy), "Street Lights Out", "street9", clickStreetLightsOut);
	this.createLevel2Button(svgmenu,(9*this.button1height+12*this.button1dy), "Potholes" ,"road22", clickPotholes);
	this.createLevel2Button(svgmenu,(10*this.button1height+15*this.button1dy), "Current Weather", "cold5", clickCurrentWeather);
	*/

	// Drawing buttons
	this.buttonTraffic.create(svgmenu);
	this.buttonCrime.create(svgmenu);
	this.buttonPlacesOfInterest.create(svgmenu);
	
	// Draw level1buttons last, so they are on top
	this.buttonSelection.create(svgmenu);
	this.buttonLayers.create(svgmenu);
	this.buttonGraphs.create(svgmenu);





















	/*
	// MAPCONTROL
	
	var svgmapcontrol = d3.select(this.mapcontroltag).append("svg:svg")
		.attr("id","mapcontrol")
		.attr("class","uisvgelement")
		.attr("viewBox", "0 0 " + this.viewBoxWidth + " " + this.viewBoxMapControlHeight)
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("width",this.viewBoxWidth).attr("height",this.viewBoxMapControlHeight)
		.attr("background-color","blue")


	// ZoomIn Button
	var gZoomIn = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (.75*this.viewBoxWidth+this.zoomButtonMargin) + "," + (this.zoomButtonMargin) + ")")
		.style("fill","transparent")
		// .attr("class","level1button")
		.on("click", function() { 
			context.map.zoomIn(1);
		})
		.on("mouseover", function() {
			d3.select(this).style("fill","#3db7e4")
				.attr("stroke-width",2*this.linewidth) // TODO: implement
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","transparent");
		});

	gZoomIn.append("circle")
		.attr("transform","translate(" + (this.zoomButtonSize/2) + "," + (this.zoomButtonSize/2) + ")")
		.attr("r",this.zoomButtonSize/2)
		.attr("stroke","#444")
		.attr("stroke-width",this.linewidth)
	
	gZoomIn.append("line")
		.attr("x1",this.zoomButtonSize/2).attr("y1",this.linepadding)
		.attr("x2",this.zoomButtonSize/2).attr("y2",this.zoomButtonSize-this.linepadding)
		.attr("stroke","#444")
		.attr("stroke-width",this.linewidth)
	
	gZoomIn.append("line")
		.attr("x1",this.linepadding).attr("y1",this.zoomButtonSize/2)
		.attr("x2",this.zoomButtonSize-this.linepadding).attr("y2",this.zoomButtonSize/2)
		.attr("stroke","#444")
		.attr("stroke-width",this.linewidth)


	// ZoomOut Button
	var gZoomOut = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (.75*this.viewBoxWidth-this.zoomButtonSize-this.zoomButtonMargin) + "," + (this.zoomButtonMargin) + ")")
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
		.attr("stroke","#444")
		.attr("stroke-width",this.linewidth)

	gZoomOut.append("line")
		.attr("x1",this.linepadding).attr("y1",this.zoomButtonSize/2)
		.attr("x2",this.zoomButtonSize-this.linepadding).attr("y2",this.zoomButtonSize/2)
		.attr("stroke","#444")
		.attr("stroke-width",this.linewidth)

	
	// Toggle SatelliteView Button
	var gSatelliteView = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (this.zoomButtonMargin) + "," + (this.zoomButtonMargin) + ")")
		.style("stroke-width","10")
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
		.attr('width', this.viewBoxWidth/2)
		.attr('height', this.viewBoxWidth/2)
		.append("svg:image")
			.attr("xlink:href", "img/chicagosatellite.png")
			.attr("width", this.viewBoxWidth/2)
			.attr("height", this.viewBoxWidth/2)
			.attr("transform","translate(0," + (-.25*this.viewBoxWidth) + ")")
	
	gSatelliteView.append('defs')
	  .append('pattern')
		.attr('id', 'imgmap')
		.attr('patternUnits', 'userSpaceOnUse')
		.attr('width', this.viewBoxWidth/2)
		.attr('height', this.viewBoxWidth/2)
		.append("svg:image")
			.attr("xlink:href", "img/chicagomap.png")
			.attr("width", this.viewBoxWidth/2)
			.attr("height", this.viewBoxWidth/2)
			.attr("transform","translate(0," + (-.25*this.viewBoxWidth) + ")")

	function appendSatelliteRect() {
	
		gSatelliteView.selectAll("rect").remove();
		
		gSatelliteView.append("rect")
			.attr("x",0).attr("y",0)
			.attr("width", this.viewBoxWidth/2 - 2*this.zoomButtonMargin).attr("height",this.zoomButtonSize)
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

	*/
}
