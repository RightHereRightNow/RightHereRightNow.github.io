function Controller() {

	console.log("CONTROLLER initialized");

	// this.mapId = null;
	this.base = 1;

	this.map = new MapManager();
	this.dataManager = new Database();
	this.ui = new ui("#divmenu","#divmapcontrol");
	this.modes = null;

	this.weatherBox = null;

	this.perimeterRadiusInKm = 0.4;
	this.showDataAlongPathOnly = false; // Need a button to turn this on and off
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
};

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
};

function getNewPointInLatLng(lat,lng,distance,angle){
	var dByR = toRad(distance/6378.0);
	angle = toRad(angle);
	lat = toRad(lat);
	lng = toRad(lng);
	var lat2 = Math.asin( Math.sin(lat)*Math.cos(dByR) +
            Math.cos(lat)*Math.sin(dByR)*Math.cos(angle) );
	var lng2 = lng + Math.atan2(Math.sin(angle)*Math.sin(dByR)*Math.cos(lat),
                 Math.cos(dByR)-Math.sin(lat)*Math.sin(lat2));
	return {lat:lat2*180.0/Math.PI,lng:lng2*180.0/Math.PI};
}


// Queries Data from Database and writes to Marker Objects
// Function calls itself in regular intervals of length "refreshrate"

Controller.prototype.getData = function() {

	// REDUCES NUMBER OF UPDATES - REMOVE IN FINAL VERSION
	// IMPORTANT: don't remove while debugging, or we will make too many queries!!
	if (this.updateCounter > 10) {
		this.stopUpdates();
	}

	console.log("\tCONTROLLER - getData -- WOOT", this.updateCounter++);
	// console.log("Path line constructed:\t" + this.pathLineConstructed);
	
	if (this.pathLineConstructed){
		
		this.updateCounter+=1;
		
		var bounds = this.pathLine.getBounds();
		
		var northWest = getNewPointInLatLng(bounds.getNorth(),bounds.getWest(),this.perimeterRadiusInKm,-45); //Increase the bounding box by radius
		var southEast = getNewPointInLatLng(bounds.getSouth(),bounds.getEast(),this.perimeterRadiusInKm,135);
		var north = northWest.lat;
		var west = northWest.lng;
		var south = southEast.lat;
		var east = southEast.lng;


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
			this.dataManager.divvyBikes(north,west,south,east,dataCallback, "divvyStations" );
		}
		if (this.mode.TRAFFICLAYER) {
			this.dataManager.getCTAData2(north,west,south,east,dataCallback, "cta" );

			this.dataManager.busRoute.forEach(function(route){
				this.dataManager.getVehiclesPublic(route,north,west,south,east,dataCallback, "cta" );
			})

		}
	}

	this.firstload = false;

};

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
};

Controller.prototype.normalModeClick = function(e){};

var toRad = function(val){
	return val*Math.PI/180.0;
};
function distance (lat1,lng1,lat2,lng2) {
	var R = 6378; // km
	var phi1 = toRad(lat1);
	var phi2 = toRad(lat2);
	var deltaPhi = toRad(lat2-lat1);
	var deltaLambda = toRad(lng2-lng1);

	var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
	        Math.cos(phi1) * Math.cos(phi2) *
	        Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	return R * c;
}
Controller.prototype.filterByPerimeter = function(data,identifierStr){

	if (this.showDataAlongPathOnly == true){
		var filteredData = [];
		var points = this.pathLine.getLatLngs();
		for (var d=0;d<data.length;d++){
			var dist = 100; // Too far away!
			var dataPoint = data[d];
			var dataRange = false;
			for(var i=0;i<points.length;i++){
				var tempDist = distance(points[i].lat,points[i].lng,dataPoint.latitude,dataPoint.longitude);
				
				if (tempDist <= this.perimeterRadiusInKm){
					console.log(tempDist,this.perimeterRadiusInKm);
					filteredData.push(dataPoint);
					break;
				}
				else if (tempDist < 2*this.perimeterRadiusInKm && dataRange === false)
					dataRange = true;
				else if (dataRange=== true && tempDist > 2*this.perimeterRadiusInKm)
					break;
			}
		}
		data = filteredData;
	}
	

	console.log(identifierStr,data);
	console.log(filteredData);
	

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
			//this.updateMarkers(data,this.ctaArray,'vehicleid',CTAMarker);
			break;
		default:
			console.log('Invalid string');
			break;
	}
};


// Generic function to write new data to markers
// TODO: handle updated icons
// 'data' is the (filtered) data that needs to be written to markers
// 'array' is the array that will hold the markers, e.g. potholesArray
// 'idstr' is the name of the field of the object that is used to uniquely identify the marker as a string
// 'marker' is the class name of the marker object to be created, e.g. PotholeMarker, ect.
Controller.prototype.updateMarkers = function(data,markerCollection,idstr,marker) {
	console.log(data);
	if (data.length != 0) {
		var iKey = {};
		data.forEach(
			function(d){
				console.log(idstr, d,d[idstr]);
				iKey[d[idstr]] = d[idstr]
			}
		);

		//console.log(iKey.length, iKey);
		for(var i = 0; i< data.length; i++){
			var key = data[i][idstr];
			// A - B: Add new marker
			if(!markerCollection[key]) {
				console.log("Add new Marker!!");
				markerCollection[key] = new marker(data[i]);
				markerCollection[key].viewNewIcon();
				markerCollection[key].addTo(this.map);
			// B in A: update!
			} else { //if(markerCollection[key]){
				console.log("Marker is in the collection!!");
				if (marker instanceof CTAMarker){
					console.log(" updateMarkers",idstr, data[i][idstr], data[i], markerCollection[key] );
					//markerCollection[key].updateLine(data[i]);
				} //else
			// Remove B!
			}
		}
		for ( k in markerCollection){
			if (!iKey[k]){
				console.log("Kill the Marker!!");
				map.removeLayer(markerCollection[k]);
				delete markerCollection[k]; // Remove the object 'property' from the collection so we dont have any accidents
			}
		}
	}
};


Controller.prototype.getRoute = function(locations){
	this.pathLineConstructed = false;
	var locJsonStr = JSON.stringify(locations);
	var url = "http://www.mapquestapi.com/directions/v2/route?key=Fmjtd%7Cluurn962n0%2Cr0%3Do5-9w85da&options={outShapeFormat:cmp}&generalize=250&json=" + locJsonStr + "&narrativeType=none";
	this.httpGet(url, this.getRouteShape);
};

Controller.prototype.getRouteShape = function(routeObject){
	// console.log(routeObject);
	if (!routeObject) return;
	if (routeObject.info.statuscode===0){
		var url = "http://www.mapquestapi.com/directions/v2/routeShape?key=Fmjtd%7Cluurn962n0%2Cr0%3Do5-9w85da&options={outShapeFormat:cmp}&fullShape=true&sessionId=" + routeObject.route.sessionId ; //"&narrativeType=none";
		this.httpGet(url,this.getRouteShapePoints);
	}
};

Controller.prototype.getRouteShapePoints = function(shapeResponse){
	if (shapeResponse===null) return;
	if (shapeResponse.info.statuscode === 0){
		this.drawPath(shapeResponse.route.shape.shapePoints);
	}
};

Controller.prototype.startNewPath = function(){
	this.map.removeLayer(this.pathLine);
	this.pathLine = null;
};

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
    // console.log(points);
    for(var i=0;i<points.length/2;i++){
    	this.pathLine.addLatLng(new L.LatLng(points[2*i],points[2*i+1]));
    }
    this.pathLineConstructed = true;
    this.pathLine.redraw();
    // console.log(this.pathLine.getBounds());
    this.map.fitBounds(this.pathLine.getBounds());
    
    //this.getPerimeterAroundPath(30);
};
			
Controller.prototype.init = function(){
	this.map.init(this.mapCenter, 11);

	this.pointsOfInterestArray[0] =	new SimpleMarker({latitude: 41.869912359714654, longitude:-87.64772415161133, description:"Electronic Visualization Lab" });
	this.pointsOfInterestArray[1] = new SimpleMarker({latitude: 41.86624, longitude: -87.61702, description: "The Field Museum of Natural History"});
	this.pointsOfInterestArray[2] = new SimpleMarker({latitude: 41.86761, longitude: -87.61365, description: "The Shedd Aquarium"});
	this.pointsOfInterestArray[3] = new SimpleMarker({latitude: 41.86635, longitude: -87.60659, description: "The Alder Planetarium"});
	//this.pointsOfInterestArray[4] = new CrimeMarker({case_number: 56789, date: "11-9-2014", primary_type: "Assault with a deadly weapon", description: "Victim got punched by Chuck Norris", latitude: 41.873519, longitude: -87.720375 });

	//var points = { destination: "Belmont/Halsted", headdirect: "81", latitude: "41.87791534208915", longitude: "-87.63376499229753", pdist: "4227", pid: "6425", route: "156", timestamp: "20141117 13:51", vehicleid: "4198" };
	//this.pointsOfInterestArray[5] = new CTAMarker(points);
	//console.log(this.pointsOfInterestArray[5]);
	for( var key in this.pointsOfInterestArray){
		this.pointsOfInterestArray[key].addTo(this.map);
	}

	//var points = [ [ 41.869912359714654, -87.64772415161133], [41.86624, -87.61702], [41.86761, -87.61365], [41.86635, -87.60659] ];
	//routes = L.polyline(points);


	console.log("animating marker!");
	//map.addLayer(cta);
	//cta.beingAnimation();

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

	for(var key in array) {
		(b ?
			this.map.addLayer(array[key]) :
			this.map.removeLayer(array[key])
		)
	}
};

Controller.prototype.toggleSelectionMode = function() {
	this.mode.SELECTION = !this.mode.SELECTION;
};
Controller.prototype.setSelectionMode = function() {
	this.mode.SELECTION = true;
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
