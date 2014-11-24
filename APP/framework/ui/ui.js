var ui = function(menutag,mapcontroltag,radiuscontroltag,timerangetag) {

	this.menutag = menutag;
	this.mapcontroltag = mapcontroltag;
	this.radiuscontroltag = radiuscontroltag;
	this.timerangetag = timerangetag;

	// Defining parameters for drawing
	this.viewBoxWidth = 1000;
	this.viewBoxMenuHeight = 1600;
	this.viewBoxMapControlHeight = 240;

	this.zoomButtonSize = 800;
	this.zoomButtonMargin = 100;

	this.buttonStrokeColor = "#222";

	this.textpadding = 180;
	this.font1size = 60;
	this.font2size = 50;

	this.linewidth = 42;
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
	this.buttonSelectionList = [];

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

	this.buttonSelection = new level1Button(this,"Selection","distance1",emptyCallback,"SELECTION");
	this.buttonSelection.setPreviousButton(null);
	this.button1List.push(this.buttonSelection);
	
	setTimeout(function() {
			for(c in context.ui.buttonSelection.childButtons) {
				context.ui.buttonSelectionList.push(context.ui.buttonSelection.childButtons[c]);
				console.log("SELECTION BUTTONS: " + c + " - " + context.ui.buttonSelectionList[c].textStr);
			}
		},1000)

	this.buttonLayers = new level1Button(this,"Layers","stack9",emptyCallback,"LAYERS");
	this.buttonLayers.setPreviousButton(this.buttonSelection);
	this.button1List.push(this.buttonLayers);
	
	this.buttonYelp = new level1Button(this,"Yelp","yelp",emptyCallback,"YELP");
	this.buttonYelp.setPreviousButton(this.buttonLayers);
	this.button1List.push(this.buttonYelp);


	this.buttonGraphs = new level1Button(this,"Graphs","inconsistent",emptyCallback,"GRAPHSLAYER");
	this.buttonGraphs.setPreviousButton(this.buttonYelp);
	this.button1List.push(this.buttonGraphs);
	
	this.buttonWeather = new level1Button(this,"Weather","cloudy19",emptyCallback,"WEATHERLAYER");
	this.buttonWeather.setPreviousButton(this.buttonGraphs);
	this.button1List.push(this.buttonWeather);

	this.buttonTwitter = new level1Button(this,"Twitter", "twitter2", emptyCallback, "TWITTER");
	this.buttonTwitter.setPreviousButton(this.buttonWeather);
	this.button1List.push(this.buttonTwitter);

	// SUBMENU SELECTION
	this.buttonSelection.addChildButton("Path","distance1",emptyCallback,"PATHSELECTION",emptyArray,"#fc6");
	this.buttonSelection.addChildButton("Bounding Box","stack9",emptyCallback,"BOUNDINGBOXSELECTION",emptyArray,"#fc6");
	this.buttonSelection.addChildButton("Rectangle","stack9",emptyCallback,"RECTANGLESELECTION",emptyArray,"#fc6");
	this.buttonSelection.addChildButton("Clear","stack9",context.clearAll.bind(context),"CLEAR",emptyArray,"#fc6");
	

	// SUBMENU LAYERS
	this.buttonLayers.addChildButton("Traffic","traffic17",emptyCallback,"TRAFFICLAYER",context.ctaArray,"#fc6");
	this.buttonLayers.addChildButton("Crime","crime1",emptyCallback,"CRIMELAYER",context.crimeContainer,"red");
	this.buttonLayers.addChildButton("Potholes","road22",emptyCallback,"POTHOLELAYER",context.potholesArray,"#fc6");
	this.buttonLayers.addChildButton("Abandoned Vehicles","criminal20",emptyCallback,"ABANDONEDVEHICLESLAYER",context.carsArray,"#fc6");
	this.buttonLayers.addChildButton("Street Lights Out","street9",emptyCallback,"STREETLIGHTSOUTLAYER",context.lights1Array,"#fc6"); // TODO: add lights all
	this.buttonLayers.addChildButton("Divvy Bike Stations","regular2",emptyCallback,"DIVVYLAYER",context.divvyArray,divvyBlue);
	this.buttonLayers.addChildButton("Places of Interest","information38",emptyCallback,"PLACESOFINTERESTLAYER",context.pointsOfInterestArray,"#fc6");
	this.buttonLayers.addChildButton("Uber","stack9",emptyCallback,"UBERLAYER",emptyArray,"#fc6");

	// SUBMENU YELP
	this.buttonYelp.addChildButton("Restaurants","criminal20",emptyCallback,"YELPRESTAURANTLAYER",context.yelpFoodContainer,"#fc6");
	this.buttonYelp.addChildButton("Bars","crime1",emptyCallback,"YELPBARLAYER",context.yelpBarContainer,"#fc6");
	this.buttonYelp.addChildButton("Clubs", "crime1", emptyCallback,"YELPCLUBLAYER",context.yelpClubsContainer, "#fc6");
	
	// SUBMENU GRAPHS
	this.buttonGraphs.addChildButton("Abandoned Vehicles","criminal20",context.updateGraphs.bind(context),"ABANDONEDVEHICLESGRAPH",emptyArray,"#fc6");
	this.buttonGraphs.addChildButton("Crime","crime1",context.updateGraphs.bind(context),"CRIMEGRAPH",emptyArray,"#fc6");
	this.buttonGraphs.addChildButton("Potholes","road22",context.updateGraphs.bind(context),"POTHOLEGRAPH",emptyArray,"#fc6");
	this.buttonGraphs.addChildButton("Street Lights","street9",context.updateGraphs.bind(context),"STREETLIGHTSOUTGRAPH",emptyArray,"#fc6");

	

	// Drawing Buttons
	this.buttonSelection.create(svgmenu);
	this.buttonLayers.create(svgmenu);
	this.buttonYelp.create(svgmenu);
	this.buttonGraphs.create(svgmenu);
	this.buttonWeather.create(svgmenu);
	this.buttonTwitter.create(svgmenu);
	


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







	// Header

	var headerFontSize = 2*this.font1size;

	var svgheader = d3.select("#divheader").append("svg:svg")
		.attr("id","timerange")
		.attr("class","uisvgelement")
		.attr("viewBox", "0 0 " + this.viewBoxWidth + " " + this.viewBoxWidth/6)
		.attr("preserveAspectRatio", "xMinYMin meet")

	svgheader.append("svg:text")
		.text("Right")
		.attr("transform","translate(" + .4*headerFontSize + "," + 1.2*headerFontSize + ")")
		.attr("fill",this.textColor).attr("class","buttontext").attr("text-anchor","bottom")
		.attr("font-size", headerFontSize).attr("font-variant", "small-caps").attr("font-family", "Roboto")
	
	svgheader.append("svg:text")
		.text("Here")
		.attr("transform","translate(" + 3.4*headerFontSize + "," + 1.2*headerFontSize + ")")
		.attr("fill","#fc6").attr("class","buttontext").attr("text-anchor","bottom")
		.attr("font-size", 1.2*headerFontSize).attr("font-variant", "small-caps").attr("font-family", "Roboto")
	
	svgheader.append("svg:text")
		.text("Right")
		.attr("transform","translate(" + 2.2*headerFontSize + "," + 2.4*headerFontSize + ")")
		.attr("fill",this.textColor).attr("class","buttontext").attr("text-anchor","bottom")
		.attr("font-size", headerFontSize).attr("font-variant", "small-caps").attr("font-family", "Roboto")

	svgheader.append("svg:text")
		.text("Now")
		.attr("transform","translate(" + 5.2*headerFontSize + "," + 2.4*headerFontSize + ")")
		.attr("fill","#fc6").attr("class","buttontext").attr("text-anchor","bottom")
		.attr("font-size", 1.2*headerFontSize).attr("font-variant", "small-caps").attr("font-family", "Roboto")
/*	
	svgheader.append("svg:text")
		.text("city of")
		.attr("transform","translate(" + 1.2*headerFontSize + "," + 3.4*headerFontSize + ")")
		.attr("fill",this.textColor).attr("class","buttontext").attr("text-anchor","bottom")
		.attr("font-size", .7*headerFontSize).attr("font-variant", "small-caps").attr("font-family", "Roboto")
	
	svgheader.append("svg:text")
		.text("Chicago")
		.attr("transform","translate(" + 3.4*headerFontSize + "," + 3.4*headerFontSize + ")")
		.attr("fill","#fc6").attr("class","buttontext").attr("text-anchor","bottom")
		.attr("font-size", .8*headerFontSize).attr("font-variant", "small-caps").attr("font-family", "Roboto")
*/






	// Switch between Week and Month Filter

	var week = false;

	var svgtimerange = d3.select(this.timerangetag).append("svg:svg")
		.attr("id","timerange")
		.attr("class","uisvgelement")
		.attr("viewBox", "0 0 " + this.viewBoxWidth + " " + this.viewBoxWidth/6)
		.attr("preserveAspectRatio", "xMinYMin meet")

	var gWeek = svgtimerange.append("svg:g")
		.attr("fill","#aaa")
		.attr("class","level1button")
		.attr("transform","translate(0,0)")
		.on("click", function() {
			context.setQueryDuration("week");
			gWeek/*.transition().duration(this.dt)*/.attr("fill","#aaa");
			gMonth/*.transition().duration(this.dt)*/.attr("fill","#888");
		});

	gWeek.append("rect")
		.attr("x",this.button1dx)
		.attr("y",this.button1dy)
		.attr("width",this.button1width/2-2*this.button1dy)
		.attr("height",this.button1height);
	
	gWeek.append("svg:text")
		.attr("fill",this.textColor)
		.attr("class","buttontext")
		.attr("transform","translate(" + (2*this.button1dx) + "," + (this.font1size+this.button1dy+(this.button1height-this.font1size)/2) + ")")
		.text("Week")
		.attr("text-anchor","bottom")
		.attr("font-size", this.font1size)
		.attr("font-variant", "small-caps")
		.attr("font-family", "Roboto")
		.attr("cursor","default");
	

	var gMonth = svgtimerange.append("svg:g")
		.attr("fill","#888")
		.attr("class","level1button")
		.attr("transform","translate(" + this.button1width/2 + ",0)")
		.on("click", function() { 
			context.setQueryDuration("month");
			gWeek/*.transition().duration(this.dt)*/.attr("fill","#888");
			gMonth/*.transition().duration(this.dt)*/.attr("fill","#aaa");
		});

	gMonth.append("rect")
		.attr("x",this.button1dy)
		.attr("y",this.button1dy)
		.attr("width",this.button1width/2-2*this.button1dy)
		.attr("height",this.button1height);

	gMonth.append("svg:text")
		.attr("fill",this.textColor)
		.attr("class","buttontext")
		.attr("transform","translate(" + this.button1dx + "," + (this.font1size+this.button1dy+(this.button1height-this.font1size)/2) + ")")
		.text("Month")
		.attr("text-anchor","bottom")
		.attr("font-size", this.font1size)
		.attr("font-variant", "small-caps")
		.attr("font-family", "Roboto")
		.attr("cursor","default");







	// RADIUSCONTROL

	var svgmapcontrol = d3.select(this.radiuscontroltag).append("svg:svg")
		.attr("id","radiuscontrol")
		.attr("class","uisvgelement")
		.attr("viewBox", "0 0 " + (this.zoomButtonSize + 2*this.zoomButtonMargin) + " " + (4*this.zoomButtonSize + 4*this.zoomButtonMargin))
		.attr("preserveAspectRatio", "xMinYMin meet")
//		.attr("width",this.zoomButtonSize + 2*this.zoomButtonMargin).attr("height",5*this.zoomButtonSize + 4*this.zoomButtonMargin)


	// Radius Up Button
	var gRadiusUp = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + this.zoomButtonMargin + ",0)")
		.style("fill","#222")
		.on("click", function() { 
			context.increaseRadius();	
			updateRadiusStatusBar();
		})
		.on("mouseover", function() {
			d3.select(this).style("fill",divvyBlue)
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","#222");
		});

	gRadiusUp.append("polygon")
		.attr("points",.2*this.zoomButtonSize + "," + .5*this.zoomButtonSize + " " + .8*this.zoomButtonSize + "," + .5*this.zoomButtonSize + " " + .5*this.zoomButtonSize + ",0")
		// .attr("transform","translate(" + (this.zoomButtonSize/2) + "," + (this.zoomButtonSize/2) + ")")
		.attr("r",this.zoomButtonSize/2)
		.attr("stroke",this.buttonStrokeColor)
		.attr("stroke-width",this.linewidth)
	


	// Radius Down Button
	var gRadiusDown = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (this.zoomButtonMargin) + "," + (3.5*this.zoomButtonSize - this.zoomButtonMargin) + ")")
		.style("fill","#222")
		.on("click", function() { 
			context.decreaseRadius();	
			updateRadiusStatusBar();
		})
		.on("mouseover", function() {
			d3.select(this).style("fill",divvyBlue)
		})
		.on("mouseout", function() {
			d3.select(this).style("fill","#222");
		});

	gRadiusDown.append("polygon")
		.attr("points", .2*this.zoomButtonSize + ",0 " + .8*this.zoomButtonSize + ",0 " + .5*this.zoomButtonSize + "," + .5*this.zoomButtonSize)
		.attr("r",this.zoomButtonSize/2)
		.attr("stroke",this.buttonStrokeColor)
		.attr("stroke-width",this.linewidth)

	// Radius Status bar	
	var gRadius = svgmapcontrol.append("svg:g")
		.attr("transform","translate(" + (this.zoomButtonMargin) + "," + (.5*this.zoomButtonSize + 2*this.zoomButtonMargin) + ")")
		.style("fill","transparent")

	gRadius.append("rect")
		.attr("x",this.zoomButtonSize/2-.1*this.zoomButtonSize).attr("y",this.linepadding)
		.attr("width",.2*this.zoomButtonSize).attr("height",3*this.zoomButtonSize-4*this.linepadding)
		.attr("rx",.2*this.zoomButtonSize).attr("ry",.2*this.zoomButtonSize)
		.attr("fill",this.buttonStrokeColor)

	var totalHeightRadiusBar = (3*this.zoomButtonSize-4*this.linepadding);
	var linepadding = this.linepadding;

	var radiusStatus = gRadius.append("rect")
		.attr("x",this.zoomButtonSize/2-.1*this.zoomButtonSize)
		.attr("y",function() {
			return (1-context.getRadiusPercentage()) * totalHeightRadiusBar + linepadding;
		})
		.attr("width",.2*this.zoomButtonSize)
		.attr("height",function() {
			return context.getRadiusPercentage() * (totalHeightRadiusBar-linepadding);
		})
		.attr("rx",.2*this.zoomButtonSize).attr("ry",.2*this.zoomButtonSize)
		.attr("fill",divvyBlue)
	
	gRadius.append("svg:text")
		.attr("fill","#fc6")
		.attr("class","buttontext")
		.attr("transform","translate(" + .2*this.zoomButtonSize + "," + (2.5*this.zoomButtonSize - this.zoomButtonMargin) + ")rotate(270)")
		.text("Radius:")
		.attr("font-size", 4*this.font1size)
		.attr("font-variant", "small-caps")
		.attr("font-family", "Roboto")
		.attr("cursor","default");
	
	var radiusText = gRadius.append("svg:text")
		.attr("fill","#fc6")
		.attr("class","buttontext")
		.attr("transform","translate(" + .2*this.zoomButtonSize + "," + (1.4*this.zoomButtonSize - this.zoomButtonMargin) + ")rotate(270)")
		.attr("font-size", 4*this.font1size)
		.attr("font-variant", "small-caps")
		.attr("font-family", "Roboto")
		.attr("cursor","default");


	var updateRadiusStatusBar = function() {
		radiusStatus.attr("y",function() {
			return (1-context.getRadiusPercentage()) * totalHeightRadiusBar + linepadding;
		})
		.attr("height",function() {
			return context.getRadiusPercentage() * (totalHeightRadiusBar);
		})
		radiusText.text(Math.round(context.perimeterRadiusInKm/0.2) + " Blocks");
	}

	updateRadiusStatusBar();



	// MAPCONTROL

	var svgmapcontrol = d3.select(this.mapcontroltag).append("svg:svg")
		.attr("id","mapcontrol")
		.attr("class","uisvgelement")
		.attr("viewBox", "0 0 " + (this.zoomButtonSize + 2*this.zoomButtonMargin) + " " + (3*this.zoomButtonSize + 5*this.zoomButtonMargin))
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
