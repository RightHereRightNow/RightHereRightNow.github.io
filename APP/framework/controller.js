function Controller() {

	console.log("CONTROLLER initialized");

	this.map = null;
	this.mapId = null;
	this.layers = [];
	this.dataManager = new Database();
	this.modes = null;

	//thisController.refreshrate = 5000; // Rate at which new data is queried

	this.routePoints = null;
	// Possible modes of our application
	this.modes = {
		SELECTION:		0,
		TRAFFICLAYER:	1,
		CRIMELAYER:		2
	};

	//thisController.activeMode = 0;

	// thisController.map = new map();
	// thisController.layer = new layer();

	this.locations = [];
	var response;
	this.mapCenter = new L.LatLng(41.8369, -87.6847);
	this.pathLine = null;

	
	
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
}

			
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
    console.log(this.pathLine.getBounds());
    this.map.fitBounds(this.pathLine.getBounds());
}
			


Controller.prototype.init = function(){
	this.map = new L.Map('divmap');

	// create the tile layer with correct attribution
	var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 16, attribution: osmAttrib});		

	this.map.setView(this.mapCenter,11);
	this.map.addLayer(osm);
	
}

Controller.prototype.drawMap =  function() {
	/**
	 * Created by krbalmryde on 11/2/14.
	 */
	// Necessary stuff...

	var MapID = {
		"street": "krbalmryde.jk1dm68f",
		"arial": "krbalmryde.jko2k1c4"
	};

	var mapboxURL = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
	var mapboxAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'


	// Our focus points
	var LatLon = {
		"EVL": [41.869912359714654, -87.64772415161133],  // The Electronic Visualization Lab
		"Field": [41.86624, -87.61702],  // The Field Natural History Museum
		"Shedd": [41.86761, -87.61365],  // The Shedd Aquarium
		"Alder": [41.86635, -87.60659],  // The Alder Planetarium
		"Focus": [41.864755, -87.631474]  // This is between EVL and Soldiers Field
	};

	// Create our street and arial view base layers
	var streetLayer = L.tileLayer(mapboxURL, {id: MapID.street, attribution: mapboxAttribution});
	var arialLayer = L.tileLayer(mapboxURL, {id: MapID.arial, attribution: mapboxAttribution});

	// an empty popup object
	var popup = L.popup();

	var placesOfInterest = L.layerGroup([
		L.marker(LatLon.EVL).bindPopup("Electronic Visualization Lab"),
		L.marker(LatLon.Field).bindPopup("The Field Museum of Natural History"),
		L.marker(LatLon.Shedd).bindPopup("The Shedd Aquarium"),
		L.marker(LatLon.Alder).bindPopup("The Alder Planetarium")
	]);


	var baseMaps = {
		"Arial": arialLayer,
		"Street": streetLayer
	};

	var overlayMaps = {
		"Places of Interest": placesOfInterest
	};

	/*function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent("You have clicked the map at " + e.latlng.toString())
			.openOn(divmap);
	}*/



	this.map = L.map('divmap', {
		center: LatLon.Focus,  // Pretty sure these two calls are
		zoom: 16,        // the same as .setView(latlon 13)
		layers: [streetLayer, placesOfInterest],
		zoomControl:false
	});


	//this.map.on('click', onMapClick);

	//L.control.layers(baseMaps, overlayMaps).addTo(this.map);

}

Controller.prototype.getPerimeterAroundPath = function(radius){

}

Controller.prototype.addRouteLayer = function(){

}



Controller.prototype.attachLayerToMap = function(){
	
}

// This function automatically calls itself in regular intervals
Controller.prototype.update = function() {

	/*thisController.getData();

	// Automatically calls itself in regular intervals
	setTimeout(thisController.update, thisController.refreshrate); */

};



// Queries Data from Database and writes to Marker Objects
Controller.prototype.getData = function() {

	console.log("\tCONTROLLER - getData");
	
	// TODO: Query data from database
	// TODO: write data to marker objects
	// TODO: update layer

};


// Sets current mode
Controller.prototype.setMode = function(newmode) {
	console.log("\tSet mode: " + newmode);
	//thisController.activeMode = newmode;
}

// Returns current mode
Controller.prototype.getMode = function() {
	//return thisController.activeMode;
}
