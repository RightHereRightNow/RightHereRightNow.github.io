function Controller() {

	console.log("CONTROLLER initialized");

	// this.map = null;
	// this.mapId = null;
	this.base = 0;

	// this.map = new MapManager();
	this.dataManager = new Database();
	this.ui = new ui("#divmenu","#divmapcontrol");
	this.modes = null;

	this.routePoints = null;
	// Possible modes of our application
	this.modes = {
		SELECTION:		0,
		TRAFFICLAYER:	1,
		CRIMELAYER:		2
	};

	window.map = this.map;  // I do not understand why this has to be initiated in order for th map markers to work
	//thisController.activeMode = 0;

	// thisController.map = new map();
	// thisController.layer = new layer();

	this.locations = [];
	var response;
	this.mapCenter = new L.LatLng(41.8369, -87.6847);
	this.pathLine = null;

	var refreshrate = 5000; // Rate at which new data is queried
	this.getData();
	setInterval(this.getData, refreshrate);

}

// Queries Data from Database and writes to Marker Objects
// Function calls itself in regular intervals of length "refreshrate"

Controller.prototype.getData = function() {

	console.log("\tCONTROLLER - getData");

	// TODO: Query data from database
	// TODO: check which data has changed from previous update
	// TODO: write data to marker objects
	// TODO: update layer
	//
	//

	// this.dataManager.potHoles();

	//
	//
	//


}


Controller.prototype.getRoute = function(locations){
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
    	this.pathLine = L.polyline([],{color: "red", opacity:"0.8"});
    	this.map.addLayer(this.pathLine);
    }
    console.log(points);
    for(var i=0;i<points.length/2;i++){
    	this.pathLine.addLatLng(new L.LatLng(points[2*i],points[2*i+1]));
    }
    console.log("Get bounds", this.pathLine.getBounds());
    this.map.fitBounds(this.pathLine.getBounds());
};



Controller.prototype.init = function(){
	// this.map.init(this.mapCenter, 16);

		// Our focus points
	var markerData = {
		"Divvy": {latitude: 41.869912359714654, longitude: -87.64772415161133},
		"Simple": {latitude: 41.86624, longitude: -87.61702, description: "Electronic Visualization Lab"},
		"Car": { service_request_number: 12345, creation_date: "11/09/2014", vehicle_make_model: "Ferrari", vehicle_color: "Red", latitude: 41.86761, longitude: -87.61365},
		"Crime": {case_number: 56789, date: "11-9-2014", primary_type: "Assault with a deadly weapon", description: "Victim got punched by Chuck Norris", latitude: 41.86635, longitude: -87.60659 }
	};

	var markerArray = [
	/*	new DivvyMarker(markerData.Divvy),
		new SimpleMarker(markerData.Simple),
		new AbandonedVehicleMarker(markerData.Car),
		new CrimeMarker(markerData.Crime)
	*/];

	markerArray.forEach(function(marker){
		console.log(marker)
		marker.addTo(this.map);
	});



};

Controller.prototype.getPerimeterAroundPath = function(radius){

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
