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
		PLACESOFINTEREST: false,
		DIVVYBIKES: false,
		ABANDONEDVEHICLES: false,
		STREETLIGHTSOUT: false,
		CURRENTWEATHER:false,
		POTHOLES: false,
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

Controller.prototype.updateWeather = function(){
	// if(this.weatherBox != null){
	// 	this.weatherBox.remove()
	// }
	this.dataManager.currentWeather(this.weatherFun,'weather');
}

Controller.prototype.weatherFun =  function (data, iden){
	console.log(this.weatherBox);
	if(this.weatherBox != undefined){
		this.weatherBox.svg.remove();
		console.log("removed");
	}
	this.weatherBox = new Weather();
	this.weatherBox.create('#weather', "100%","100%", '0.7', data);
}

Controller.prototype.stopUpdates = function(){
	clearInterval(this.updateId);
};

// Queries Data from Database and writes to Marker Objects
// Function calls itself in regular intervals of length "refreshrate"

Controller.prototype.getData = function() {

	if (this.updateCounter < 4) {

		this.updateCounter++;

	console.log("\tCONTROLLER - getData");

	console.log(this.pathLineConstructed);

		console.log(this.pathLineConstructed);

	if (this.pathLineConstructed === true){
		var bounds = this.pathLine.getBounds();
		console.log("fetching data");
		if (this.mode.POTHOLES===true)
			this.dataManager.potHoles("week",bounds.getNorth(),bounds.getWest(),bounds.getSouth(),bounds.getEast(),this.filterByPerimeter.bind(this), "potHoles" );
		if (this.mode.ABANDONEDVEHICLES===true)
			this.dataManager.abandonedVehicle("week",bounds.getNorth(),bounds.getWest(),bounds.getSouth(),bounds.getEast(),this.filterByPerimeter.bind(this), "abandonedVehicles" );
		if (this.mode.STREETLIGHTSOUT===true){
			this.dataManager.lightOutAllNotCompleted("week",bounds.getNorth(),bounds.getWest(),bounds.getSouth(),bounds.getEast(),this.filterByPerimeter.bind(this), "lightOutAll" );
			this.dataManager.lightOut1NotCompleted("week",bounds.getNorth(),bounds.getWest(),bounds.getSouth(),bounds.getEast(),this.filterByPerimeter.bind(this), "lightOutOne" );	
		}

		if (this.mode.DIVVYBIKES===true){
			var getStationBeanArray = function (data, iden){
				this.filterByPerimeter(data.stationBeanList,iden);
			}
			this.dataManager.divvyBikes(getStationBeanArray.bind(this), "divyStations" );
		}
	}	

	// TODO: remove - only for testing
	this.dataManager.potHoles("week",41.87,-87.68,41.83,-87.64,this.filterByPerimeter.bind(this), "potHoles" );
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

Controller.prototype.normalModeClick = function(e){

}

Controller.prototype.filterByPerimeter = function(data,identifierStr){

	var filteredData = [];

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
	
	
	// TODO: add more cases....
	switch(identifierStr) {
		case 'potHoles':
			this.updateMarkers(data,this.potholesArray,'service_request_number',PotholeMarker);
			break;
		case 'potHoles':
			this.updateMarkers(data,this.potholesArray,'service_request_number',PotholeMarker);
			break;
		default:
			console.log('Invalid string');
			break;
	}

	// console.log(identifierStr,data);
	// console.log(filteredData);
};


// Generic function to write new data to markers
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

		// Our focus points
	var markerData = {
		"Divvy": {"id":5,"stationName":"State St & Harrison St","availableDocks":13,"totalDocks":19,"latitude":41.8739580629,"longitude":-87.6277394859,"statusValue":"In Service","statusKey":1,"availableBikes":6,"stAddress1":"State St & Harrison St","stAddress2":"","city":"","postalCode":"","location":"620 S. State St.","altitude":"","testStation":false,"lastCommunicationTime":null,"landMark":"030"},
		"Simple": {latitude: 41.869912359714654, longitude: -87.64772415161133, description: "Electronic Visualization Lab"},
		"Car": { service_request_number: 12345, creation_date: "11/09/2014", vehicle_make_model: "Ferrari", vehicle_color: "Red", latitude: 41.86761, longitude: -87.61365},
		"Crime": {case_number: 56789, date: "11-9-2014", primary_type: "Assault with a deadly weapon", description: "Victim got punched by Chuck Norris", latitude: 41.86635, longitude: -87.60659 }
	};
	var data2 = {"id":13,"stationName":"Wilton Ave & Diversey Pkwy","availableDocks":15,"totalDocks":19,"latitude":41.93250008,"longitude":-87.65268082,"statusValue":"In Service","statusKey":1,"availableBikes":4,"stAddress1":"Wilton Ave & Diversey Pkwy","stAddress2":"","city":"Chicago","postalCode":"","location":"2790 N.Wilton Ave","altitude":"","testStation":false,"lastCommunicationTime":null,"landMark":"066"}

	var divy = new DivvyMarker(markerData.Divvy);
	var markerArray = [
		new DivvyMarker(markerData.Divvy),
		new SimpleMarker(markerData.Simple),
		new AbandonedVehicleMarker(markerData.Car),
		new CrimeMarker(markerData.Crime)
	];
	divy.addTo(this.map);
	markerArray.forEach(function(marker){
		console.log(marker);
		marker.addTo(this.map);
	});

	markerArray.forEach(function(marker){
		console.log("removing ", marker);
		map.removeLayer(marker);
	});

	markerArray.forEach(function(marker){
		console.log("adding ", marker);
		map.addLayer(marker);
	});

	for (var i = 0; i < 5000; i++){}
	divy.updateData(data2);

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

Controller.prototype.addRouteLayer = function(){

};



Controller.prototype.attachLayerToMap = function(){

};


Controller.prototype.toggleMode = function(mode) {
	switch(mode){
		case "SELECTION":
						this.mode.SELECTION = !this.mode.SELECTION;						
						break;
		case "TRAFFICLAYER":
						this.mode.TRAFFICLAYER = !this.mode.TRAFFICLAYER;
						break;
		case "CRIMELAYER":
						this.mode.CRIMELAYER = !this.mode.CRIMELAYER;
						break;
		case "PLACESOFINTEREST":
						this.mode.PLACESOFINTEREST = !this.mode.PLACESOFINTEREST;
						break;
		case "DIVVYBIKES":
						this.mode.DIVVYBIKES = !this.mode.DIVVYBIKES;
						break;
		case "ABANDONEDVEHICLES":
						this.mode.ABANDONEDVEHICLES = !this.mode.ABANDONEDVEHICLES;
						break;
		case "STREETLIGHTSOUT":
						this.mode.STREETLIGHTSOUT = !this.mode.STREETLIGHTSOUT;
						break;
		case "CURRENTWEATHER":
						this.mode.CURRENTWEATHER = !this.mode.CURRENTWEATHER;
						break;
		case "POTHOLES":
						this.mode.POTHOLES = !this.mode.POTHOLES;
						break;
		default:
				break;
	}
};




Controller.prototype.getMode = function(mode) {
	if (mode in this.mode)
		return this.mode[mode];
	return null;
};

