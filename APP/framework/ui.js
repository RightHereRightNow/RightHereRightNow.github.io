function ui(menutag,mapcontroltag) {

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

}


ui.prototype.createLevel1Button = function(svg,yOffset,str,iconname,fOnClick) {

	var g = svg.append("svg:g")
		.attr("fill","#444")
		.attr("class","level1button")
		.attr("transform","translate(0," + yOffset + ")")
		.on("click", function() { 
			fOnClick();	
		});

	g.append("rect")
		.attr("x",this.button1dx).attr("y",this.button1dy)
		.attr("width",this.button1width).attr("height",this.button1height);

	g.append("svg:text")
		.attr("fill","#ccc")
		// .attr("class","buttontext")
		.attr("transform","translate(" + (this.button1dx+this.textpadding) + "," + (this.font1size+this.button1dy+(this.button1height-this.font1size)/2) + ")")
		.text(str)
		.attr("text-anchor","bottom")
		.attr("font-size", this.font1size)
		.attr("font-variant", "small-caps")
		.attr("font-family", "Roboto")
		.attr("cursor","default");

	g.append("svg:image")
		.attr("xlink:href", "img/" + iconname + ".svg")
		.attr("x",this.button1dx+.1*this.button1height)
		.attr("y",this.button1dy+.1*this.button1height)
		.attr("width", .8*this.button1height)
		.attr("height", .8*this.button1height)

}


ui.prototype.createLevel2Button = function(svg,yOffset,str,iconname,fOnClick) {

	var g = svg.append("svg:g")
		.attr("class","level2button")
		.attr("transform","translate(0," + yOffset + ")")
		.attr('opacity',0)
		.on("click", function() { 
			fOnClick();	
		});

	g.append("rect")
		.attr("x",this.button2dx).attr("y",this.button2dy)
		.attr("width",this.button2width).attr("height",this.button2height);

	g.append("svg:text")
		.attr("class","buttontext")
		.attr("transform","translate(" + (this.button2dx+this.textpadding) + "," + (this.font1size+this.button2dy+(this.button2height-this.font1size)/2) + ")")
		.text(str)
		.attr("fill","#ccc")
		.attr("text-anchor","bottom")
		.attr("font-size", this.font1size)
		.attr("font-family", "Roboto")
		.attr("font-variant", "small-caps")
		.attr("cursor","default");

	g.append("svg:image")
		.attr("xlink:href", "img/" + iconname + ".svg")
		.attr("x",this.button2dx+.1*this.button2height)
		.attr("y",this.button2dy+.1*this.button2height)
		.attr("width", .8*this.button2height)
		.attr("height", .8*this.button2height)

}

ui.prototype.fadeOutLevel2Buttons = function() {
	d3.select(this.menutag).selectAll(".level2button")
		.transition()
		.duration(1000)
		.attr('opacity', 0)
		// .attr("transform","translate(" + 100 + "," + 200 + ")");
}

ui.prototype.fadeInLevel2Buttons = function() {
	d3.select(this.menutag).selectAll(".level2button")
		.transition()
		.duration(1000)
		.attr('opacity', 1);
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

	var layersActive = false;

	function clickHomepage() { console.log("TODO: link to homepage");
		window.location.href = "../"; }
	function clickSelection() { context.toggleMode("SELECTION"); }
	
	var clickLayer = function() {
		if(layersActive) {
			this.fadeOutLevel2Buttons();
			layersActive = false;
		} else {
			this.fadeInLevel2Buttons();
			layersActive = true;
		}
	}

	clickLayer = clickLayer.bind(this);

	function clickTrafficLayer() { context.toggleMode("TRAFFICLAYER"); }
	function clickCrimeLayer() { context.toggleMode("CRIMELAYER"); }
	function clickPlacesOfInterestLayer() { context.toggleMode("PLACESOFINTEREST"); }
	function clickDivvyBikes() { context.toggleMode("DIVVYBIKES");}
	function clickAbandonedVehicles() { context.toggleMode("ABANDONEDVEHICLES"); }
	function clickStreetLightsOut() {context.toggleMode("STREETLIGHTSOUT"); }
	function clickCurrentWeather() {context.toggleMode("CURRENTWEATHER"); }

	this.createLevel1Button(svgmenu,0,"Project Homepage","house28",clickHomepage)
	this.createLevel1Button(svgmenu,(this.button1height+3*this.button1dy),"Selection Mode","distance1",clickSelection)
	this.createLevel1Button(svgmenu,(2*this.button1height+4*this.button1dy),"Layers","stack9",clickLayer)

	this.createLevel2Button(svgmenu,(3*this.button1height+6*this.button1dy),"Traffic Layer","front1",clickTrafficLayer)
	this.createLevel2Button(svgmenu,(4*this.button1height+7*this.button1dy),"Crime Layer","crime1",clickCrimeLayer)
	this.createLevel2Button(svgmenu,(5*this.button1height+8*this.button1dy),"Places of Interest","information38",clickPlacesOfInterestLayer)
	this.createLevel2Button(svgmenu,(6*this.button1height+9*this.button1dy), "Divvy Bikes", "regular2", clickDivvyBikes);
	this.createLevel2Button(svgmenu,(7*this.button1height+10*this.button1dy), "Abandoned Vehicles", "criminal20", clickAbandonedVehicles);
	this.createLevel2Button(svgmenu,(8*this.button1height+11*this.button1dy), "Street Lights Out", "street9", clickStreetLightsOut);
	this.createLevel2Button(svgmenu,(9*this.button1height+12*this.button1dy), "Current Weather", "cold5", clickCurrentWeather);



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
}
