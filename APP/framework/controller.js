function Controller() {

	console.log("CONTROLLER initialized");

	// this.mapId = null;
	this.base = 1;

	this.map = new MapManager();
	this.dataManager = new Database();
	this.ui = new ui("#divmenu","#divmapcontrol");
	this.modes = null;

	this.perimeterRadiusInMiles = 0.25;

	this.routePoints = null;
	// Possible modes of our application
	this.modes = {
		SELECTION:		0,
		TRAFFICLAYER:	1,
		CRIMELAYER:		2,
		PLACESOFINTEREST: 3,
		DIVVYBIKES:		4,
		ABANDONEDVEHICLES:	5,
		STREETLIGHTSOUT:	6,
		CURRENTWEATHER: 7,
		POTHOLES:		8
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
	this.getUpdates();

	// TODO: remove and implement as layer object
	// temporary container for crime data
	this.oldPotholes = [];
	this.newPotholes = ['t','e','s','t'];
	
}

Controller.prototype.getUpdates = function(){
	var refreshrate = 5000; // Rate at which new data is queried
	this.getData();
	this.updateId = setInterval(this.getData.bind(this), refreshrate);
}

Controller.prototype.stopUpdates = function(){
	clearInterval(this.updateId);
};

// Queries Data from Database and writes to Marker Objects
// Function calls itself in regular intervals of length "refreshrate"

Controller.prototype.getData = function() {

	console.log("\tCONTROLLER - getData");

	// TODO: Query data from database
	// TODO: check which data has changed from previous update
	// TODO: write data to marker objects
	// TODO: update layer
	//
	console.log(this.pathLineConstructed);
	//

	if (this.pathLineConstructed === true){
		var bounds = this.pathLine.getBounds();
		console.log("fetching data");
		this.dataManager.potHoles("week",bounds.getNorth(),bounds.getWest(),bounds.getSouth(),bounds.getEast(),this.filterByPerimeter.bind(this), "potHoles" );
		this.dataManager.abandonedVehicle("week",bounds.getNorth(),bounds.getWest(),bounds.getSouth(),bounds.getEast(),this.filterByPerimeter.bind(this), "abandonedVehicles" );
		this.dataManager.lightOutAllNotCompleted("week",bounds.getNorth(),bounds.getWest(),bounds.getSouth(),bounds.getEast(),this.filterByPerimeter.bind(this), "lightOutAll" );
		this.dataManager.lightOut1NotCompleted("week",bounds.getNorth(),bounds.getWest(),bounds.getSouth(),bounds.getEast(),this.filterByPerimeter.bind(this), "lightOutOne" );
		var getStationBeanArray = function (data, iden){
			this.filterByPerimeter(data.stationBeanList,iden);
		}
		this.dataManager.divvyBikes(getStationBeanArray.bind(this), "divyStations" );
	}

	// TODO: remove - only for testing
	this.dataManager.potHoles("week",41.9,-87.7,41.8,-87.6,this.filterByPerimeter.bind(this), "potHoles" );


	//
	//
	//


}


Controller.prototype.filterByPerimeter = function(data,identifierStr){

	var filteredData = [];

	// TODO: not filtering for path yet - only for debugging
/*
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
	
*/
	filteredData = data; // TODO: remove
	
	
	// TODO: add more cases....
	switch(identifierStr) {
		case 'potHoles':
			this.updatePotholes(filteredData);
			break;
		default:
			console.log('Invalid string');
			break;
	}

	console.log(identifierStr,data);
	console.log(filteredData);
};

Controller.prototype.updatePotholes = function(data){

	console.log('updatePothoooooooooooooooooooooooooooooooooooooooooooles');

	// TODO: edit to recognize updated values
	for(var i = 0; i< data.length; i++){
		this.newPotholes[i] = new PotholeMarker(data[i]);
		this.newPotholes[i].addTo(this.map);
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
		"Divvy": {latitude: 41.86624, longitude: -87.61702},
		"Simple": {latitude: 41.869912359714654, longitude: -87.64772415161133, description: "Electronic Visualization Lab"},
		"Car": { service_request_number: 12345, creation_date: "11/09/2014", vehicle_make_model: "Ferrari", vehicle_color: "Red", latitude: 41.86761, longitude: -87.61365},
		"Crime": {case_number: 56789, date: "11-9-2014", primary_type: "Assault with a deadly weapon", description: "Victim got punched by Chuck Norris", latitude: 41.86635, longitude: -87.60659 }
	};

	window.divy = new DivvyMarker(markerData.Divvy);
	divy.init(); divy.addTo(this.map);
	var markerArray = [
		//new DivvyMarker(markerData.Divvy),
		new SimpleMarker(markerData.Simple),
		new AbandonedVehicleMarker(markerData.Car),
		new CrimeMarker(markerData.Crime)
	];

	markerArray.forEach(function(marker){
		marker.init();
		console.log(marker)
		marker.addTo(this.map);
	});



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


// Sets current mode
Controller.prototype.setMode = function(newmode) {
	console.log("\tSet mode: " + newmode);
	//thisController.activeMode = newmode;
};

// Returns current mode
Controller.prototype.getMode = function() {
	//return thisController.activeMode;
};
