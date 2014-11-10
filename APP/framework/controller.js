function Controller() {

	console.log("CONTROLLER initialized");

	// this.mapId = null;
	this.base = 1;

	this.map = new MapManager();
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
	//setInterval(this.getData, refreshrate);


}


potHolesArray = [];

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


	 this.dataManager.potHoles('month',41.8747107, -87.6968277, 41.8710629, -87.6758785, callback,'potHoles');

	//
	//
	//


}

function callback(data,iden){
		switch(iden){
			case 'potHoles': this.generatePotholes(data,this);
							break;
			default: console.log("error callback");
						break;
		}
}

function generatePotholes(data,ref){
	for(var i = 0; i< data.length; i++){
		ref.potHolesArray.push(new PotholeMarker(data[i]));
		console.log("HERE!!!");
		console.log(ref.potHolesArray[i]);
		ref.potHolesArray[i].addTo(this.map);
	}
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
    	this.pathLine = L.polyline([],{className:"route"});
    	this.map.addLayer(this.pathLine,false);
    	this.pathLine.bringToFront();
    }
    console.log(points);
    for(var i=0;i<points.length/2;i++){
    	this.pathLine.addLatLng(new L.LatLng(points[2*i],points[2*i+1]));
    }
    this.pathLine.redraw();
    console.log(this.pathLine.getBounds());
    this.map.fitBounds(this.pathLine.getBounds());
    
    //this.getPerimeterAroundPath(30);
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
    console.log("Get bounds", this.pathLine.getBounds());
    this.map.fitBounds(this.pathLine.getBounds());
};




Controller.prototype.init = function(){
	this.map.init(this.mapCenter, 16);

		// Our focus points
	var markerData = {
		"Divvy": {latitude: 41.86624, longitude: -87.61702},
		"Simple": {latitude: 41.869912359714654, longitude: -87.64772415161133, description: "Electronic Visualization Lab"},
		"Car": { service_request_number: 12345, creation_date: "11/09/2014", vehicle_make_model: "Ferrari", vehicle_color: "Red", latitude: 41.86761, longitude: -87.61365},
		"Crime": {case_number: 56789, date: "11-9-2014", primary_type: "Assault with a deadly weapon", description: "Victim got punched by Chuck Norris", latitude: 41.86635, longitude: -87.60659 }
	};

	var markerArray = [
		new DivvyMarker(markerData.Divvy),
		new SimpleMarker(markerData.Simple),
		new AbandonedVehicleMarker(markerData.Car),
		new CrimeMarker(markerData.Crime)
	];

	markerArray.forEach(function(marker){
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
