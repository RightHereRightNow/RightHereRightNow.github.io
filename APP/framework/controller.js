function Controller() {

	console.log("CONTROLLER initialized");

	// this.mapId = null;
	this.base = 1;

	this.map = new MapManager();
	this.dataManager = new Database();
	this.ui = new ui("#divmenu","#divmapcontrol");
	this.modes = null;

	this.weatherBox = null;

	this.perimeterRadiusInMiles = 0.25;

	this.routePoints = null;
	// Possible modes of our application

	this.mode = {
		SELECTION: false,
		TRAFFICLAYER: false,
		CRIMELAYER:	false,
		PLACESOFINTEREST: true,
		DIVVYBIKES: false,
		ABANDONEDVEHICLES: false,
		STREETLIGHTSOUT: false,
		CURRENTWEATHER:false,
		POTHOLES: false
	};

	window.map = this.map;  // I do not understand why this has to be initiated in order for th map markers to work
	//thisController.activeMode = 0;

	// thisController.map = new map();
	// thisController.layer = new layer();

	this.locations = [];
	var response;
	this.mapCenter = new L.LatLng(41.864755, -87.631474);
	this.pathLine = null;
	this.pathLineConstructed = false;

	this.firstload = true;
	
	this.updateCounter = 0; // counts number of updates - only for debugging
	
	this.cycles = -1;  // Keeps track of the number of update cycles, mostly important for the initial cycle

	this.pointsOfInterestArray = {};
	this.potholesArray = {};
	this.crimeArray = {};
	this.divvyArray = {};
	this.carsArray = {};
	this.lightsAllArray = {};
	this.lights1Array = {};
	this.ctaArray = {};
	
	this.getUpdates();

}

Controller.prototype.getUpdates = function(){
	var refreshrate = 5000; // Rate at which new data is queried
	this.getData();
	this.updateWeather();
	this.updateId = setInterval(this.getData.bind(this), refreshrate);
}

Controller.prototype.stopUpdates = function(){
	clearInterval(this.updateId);
};


Controller.prototype.updateWeather = function(){
	// if(this.weatherBox != null){
	// 	this.weatherBox.remove()
	// }
	this.dataManager.currentWeather(this.weatherFun,'weather');
}

Controller.prototype.weatherFun =  function (data, iden){
	//console.log(this.weatherBox);
	//if(this.weatherBox != undefined){
	//	this.weatherBox.svg.remove();
	//	console.log("removed");
	//}
	this.weatherBox = new Weather();
	this.weatherBox.create('#weather', "100%","100%", '0.7', data);
}

// Queries Data from Database and writes to Marker Objects
// Function calls itself in regular intervals of length "refreshrate"

Controller.prototype.getData = function() {

	// REDUCES NUMBER OF UPDATES - REMOVE IN FINAL VERSION
	// IMPORTANT: don't remove while debugging, or we will make too many queries!!
	if (this.updateCounter > 4) { 
		this.stopUpdates();
	}
	
	console.log("\tCONTROLLER - getData");
	console.log("Path line constructed:\t" + this.pathLineConstructed);
	
	if (this.pathLineConstructed){
		
		this.updateCounter++;
		
		var bounds = this.pathLine.getBounds();
		var north = bounds.getNorth();
		var west = bounds.getWest();
		var south = bounds.getSouth();
		var east = bounds.getEast();

		var dataCallback = this.filterByPerimeter.bind(this);

		console.log("fetching data");
		
		// Sending requests to database
		if(this.mode.CURRENTWEATHER) {
			// this.updateWeather();	
		}
		if (this.mode.CRIMELAYER) {
			this.dataManager.crimes("week2",north,west,south,east,dataCallback, "crimes" );
		}
		if (this.mode.POTHOLES) {
			this.dataManager.potHoles("week",north,west,south,east,dataCallback, "potHoles" );
		}
		if (this.mode.ABANDONEDVEHICLES) {
			this.dataManager.abandonedVehicle("week",north,west,south,east,dataCallback, "abandonedVehicles" );
		}
		if (this.mode.STREETLIGHTSOUT) {
			this.dataManager.lightOutAllNotCompleted("week",north,west,south,east,dataCallback, "lightOutAll" );
			this.dataManager.lightOut1NotCompleted("week",north,west,south,east,dataCallback, "lightOutOne" );	
		}
		if (this.mode.DIVVYBIKES) {
			//var getStationBeanArray = function (data, iden){
			//	this.filterByPerimeter(data.stationBeanList,iden);
			//};
			this.dataManager.divvyBikes(north,west,south,east,dataCallback, "divyStations" );
		}
	}
}

Controller.prototype.onMapClick = function(e){
	if (this.mode.SELECTION === true){
		var point = e.latlng;
		this.locations.push({latLng: {lat:point.lat,lng:point.lng}});
		if (this.locations.length > 2)
			this.locations.splice(0,1);
		var locObj = { locations:this.locations };
		this.getRoute(locObj);
	}
	else{
		//Do stuff like clicking on marker and popups
	}
}

Controller.prototype.normalModeClick = function(e){};

Controller.prototype.filterByPerimeter = function(data,identifierStr){

	var filteredData = [];

	// TODO: not filtering for path yet - only for debugging
	var points = this.pathLine.getLatLngs();
	var radiusInLng = this.perimeterRadiusInMiles/53.00;
	var radiusInLat = this.perimeterRadiusInMiles/68.90;
	var radius = Math.sqrt(radiusInLng*radiusInLng + radiusInLat * radiusInLat);
	function distance (x1,y1,x2,y2) {
		return Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
	}

	for (var d=0;d<data.length;d++){
		var dist = 100; // Too far away!
		for(var i=0;i<points.length;i++){
			var tempDist = distance(points[i].lat,points[i].lng,data[d].latitude,data[d].longitude);
			if (tempDist <= radius){
				filteredData.push(data[d]);
				break;
			}
			else if (tempDist < dist)
				dist = tempDist;
			else
				break;
		}
	}

	switch(identifierStr) {
		case 'crimes':
			this.updateMarkers(data,this.crimeArray,'case_number',CrimeMarker);
			break;
		case 'divvyStations':
			this.updateMarkers(data,this.divvyArray,'id',DivvyMarker);
			break;
		case 'potHoles':
			this.updateMarkers(data,this.potholesArray,'service_request_number',PotholeMarker);
			break;
		case 'abandonedVehicles':
			this.updateMarkers(data,this.carsArray,'service_request_number',AbandonedVehicleMarker);
			break;
		case 'lightOutAll':
			// TODO: add special marker for 'LightsOutAll' (maybe just with another icon indicating several lights out)
			// this.updateMarkers(data,this.lights1Array,'service_request_number',LightsOutAllMarker);
			break;
		case 'lightOutOne':
			this.updateMarkers(data,this.lights1Array,'service_request_number',LightsOutMarker);
			break;
		case 'cta':
			this.updateMarkers(data,this.ctaArray,'service_request_number',CTAMarker);
			break;
		default:
			console.log('Invalid string');
			break;
	}
};


// Generic function to write new data to markers
// TODO: add particular event for updated icon
// 'data' is the (filtered) data that needs to be written to markers
// 'array' is the array that will hold the markers, e.g. potholesArray
// 'idstr' is the name of the field of the object that is used to uniquely identify the marker as a string
// 'marker' is the class name of the marker object to be created, e.g. PotholeMarker, ect.
Controller.prototype.updateMarkers = function(data,array,idstr,marker) {
	for(var i = 0; i< data.length; i++){
		var key = data[i][idstr];
		if(!array[key]) {
			array[key] = new marker(data[i]);
			(this.firstload ? array[key].viewOldIcon() : array[key].viewNewIcon);
			array[key].addTo(this.map);
		} else {
			array[key].viewOldIcon()
		}
	}
}


Controller.prototype.getRoute = function(locations){
	this.pathLineConstructed = false;
	var locJsonStr = JSON.stringify(locations);
	var url = "http://www.mapquestapi.com/directions/v2/route?key=Fmjtd%7Cluurn962n0%2Cr0%3Do5-9w85da&options={outShapeFormat:cmp}&generalize=250&json=" + locJsonStr + "&narrativeType=none";
	this.httpGet(url, this.getRouteShape);
}

Controller.prototype.getRouteShape = function(routeObject){
	console.log(routeObject);
	if (!routeObject) return;
	if (routeObject.info.statuscode===0){
		var url = "http://www.mapquestapi.com/directions/v2/routeShape?key=Fmjtd%7Cluurn962n0%2Cr0%3Do5-9w85da&options={outShapeFormat:cmp}&fullShape=true&sessionId=" + routeObject.route.sessionId ; //"&narrativeType=none";
		this.httpGet(url,this.getRouteShapePoints);
	}
}

Controller.prototype.getRouteShapePoints = function(shapeResponse){
	if (shapeResponse===null) return;
	if (shapeResponse.info.statuscode === 0){
		this.drawPath(shapeResponse.route.shape.shapePoints);
	}
}

Controller.prototype.startNewPath = function(){
	this.map.removeLayer(this.pathLine);
	this.pathLine = null;
}

Controller.prototype.httpGet = function (sURL, fCallback)
{
	fCallback = fCallback.bind(this);
	$.ajax({
		url: sURL,
		dataType: "json",
		success: function(data) {
			fCallback(data);
		}
	});
};


Controller.prototype.drawPath = function(points){

	if (!points) return;
    if (this.pathLine === null){
    	this.pathLine = L.polyline([],{className:"route"});
    	this.map.addLayer(this.pathLine,false);
    	this.pathLine.bringToFront();
    }
    console.log(points);
    for(var i=0;i<points.length/2;i++){
    	this.pathLine.addLatLng(new L.LatLng(points[2*i],points[2*i+1]));
    }
    this.pathLineConstructed = true;
    this.pathLine.redraw();
    console.log(this.pathLine.getBounds());
    this.map.fitBounds(this.pathLine.getBounds());
    
    //this.getPerimeterAroundPath(30);
}
			
Controller.prototype.init = function(){
	this.map.init(this.mapCenter, 11);

	this.pointsOfInterestArray[0] =	new SimpleMarker({latitude: 41.869912359714654, longitude:-87.64772415161133, description:"Electronic Visualization Lab" });
	this.pointsOfInterestArray[1] = new SimpleMarker({latitude: 41.86624, longitude: -87.61702, description: "The Field Museum of Natural History"});
	this.pointsOfInterestArray[2] = new SimpleMarker({latitude: 41.86761, longitude: -87.61365, description: "The Shedd Aquarium"});
	this.pointsOfInterestArray[3] = new SimpleMarker({latitude: 41.86635, longitude: -87.60659, description: "The Alder Planetarium"});
	this.pointsOfInterestArray[4] = new CrimeMarker({case_number: 56789, date: "11-9-2014", primary_type: "Assault with a deadly weapon", description: "Victim got punched by Chuck Norris", latitude: 41.873519, longitude: -87.720375 });

	for( var key in this.pointsOfInterestArray){
		this.pointsOfInterestArray[key].addTo(this.map);
	}

};

Controller.prototype.getPerimeterAroundPath = function(radius){
	var points = this.pathLine.getLatLngs();
	var pointsXY = [];
	var firstHalfOfPerimeter = [];
	var secondHalfOfPerimeter = [];
	pointsXY.push(this.map.latLngToLayerPoint(points[0]));
	var slopeFlag ;
	var i;
	for (i=1;i<points.length;i++){
		pointsXY.push(this.map.latLngToLayerPoint(points[i]));
		if (Math.abs(pointsXY[i].y-pointsXY[i-1].y)<=Math.abs(pointsXY[i].x-pointsXY[i-1].x)){
			firstHalfOfPerimeter.push(this.map.layerPointToLatLng(new L.point(pointsXY[i-1].x,pointsXY[i-1].y - radius)));
			secondHalfOfPerimeter.splice(0,0,this.map.layerPointToLatLng(new L.point(pointsXY[i-1].x,pointsXY[i-1].y + radius)));
			slopeFlag = 1;
		}
		else{
			firstHalfOfPerimeter.push(this.map.layerPointToLatLng(new L.point(pointsXY[i-1].x + radius,pointsXY[i-1].y)));
			secondHalfOfPerimeter.splice(0,0,this.map.layerPointToLatLng(new L.point(pointsXY[i-1].x - radius,pointsXY[i-1].y)));
			slopeFlag = 0;
		}
	}
	if (slopeFlag===1){
		firstHalfOfPerimeter.push(this.map.layerPointToLatLng(new L.point(pointsXY[i-1].x,pointsXY[i-1].y - radius)));
		secondHalfOfPerimeter.splice(0,0,this.map.layerPointToLatLng(new L.point(pointsXY[i-1].x,pointsXY[i-1].y + radius)));
	}
	else{
		firstHalfOfPerimeter.push(this.map.layerPointToLatLng(new L.point(pointsXY[i-1].x + radius,pointsXY[i-1].y)));
		secondHalfOfPerimeter.splice(0,0,this.map.layerPointToLatLng(new L.point(pointsXY[i-1].x - radius,pointsXY[i-1].y)));
	}

	this.pathPerimeter = firstHalfOfPerimeter.concat(secondHalfOfPerimeter);
	this.map.addLayer(new L.polygon(this.pathPerimeter,{color:"red",stroke:false}));
	console.log(this.pathPerimeter);

};

Controller.prototype.addRouteLayer = function(){};

Controller.prototype.setLayer = function(layerName,array,b) {
	// 'layerName' is the name of the layer to be set, e.g. DIVVYBIKES, PLACESOFINTEREST, CRIMELAYER, etc.
	// 'array' is the array that holds the markers for the associated object, e.g. divvyArray, pointsOfInterestArray, crimeArray
	// 'b' is the Boolean value to which the layer is set (true or false)
	
	console.log("MODENAME = " + layerName + ":\t" + this.mode[layerName] + " --> " + b);
	console.log( (b ? "SHOW " : "HIDE ") + layerName );
	
	this.mode[layerName] = b;

	for(var key in this.array) {
		(this.mode[layerName] ?
				this.map.addLayer(this.array[key]) :
				this.map.removeLayer(this.array[key])
		);
	}
};

Controller.prototype.setSelection = function(b) {
	this.mode.SELECTION = b;
};

Controller.prototype.setWeather = function(b) {
	this.mode.CURRENTWEATHER = b;
};

Controller.prototype.getMode = function(modeName) {
	if (modeName in this.mode) {
		return this.mode[modeName];
	}
	return null;
}
