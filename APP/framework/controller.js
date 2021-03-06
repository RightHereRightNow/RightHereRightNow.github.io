function Controller() {

	console.log("CONTROLLER initialized");
	var self = this;
	// this.mapId = null;
	this.base = 1;

	this.map = new MapManager();
	this.dataManager = new Database();
	this.ui = new ui("#divmenu","#divmapcontrol","#divradiuscontrol","#divtimerange");
	this.modes = null;

	this.busRoutes = [];



	weatherBox = null;
	this.twitterBox = null;

	this.minRadius = 0.2;
	this.maxRadius = 2.0;
	this.perimeterRadiusInKm = 0.4;
	this.perimeterCircles = [];

	this.showDataAlongPathOnly = true; // Need a button to turn this on and off
	this.routePoints = null;
	// Possible modes of our application

	this.mode = {
		SELECTION: false,
		PATHSELECTION: false,
		BOUNDINGBOXSELECTION: false,
		RECTANGLESELECTION: false,
		LAYERS: false,
		YELP: false,
		OTHER: false
	};
	this.layersFlags = {
		TRAFFICLAYER: false,
		CRIMELAYER:	false,
		PLACESOFINTERESTLAYER: true,
		DIVVYLAYER: false,
		ABANDONEDVEHICLESLAYER: false,
		STREETLIGHTSOUTLAYER: false,
		POTHOLELAYER: false,
		YELPRESTAURANTLAYER: false,
		YELPBARLAYER: false,
		YELPCLUBLAYER: false,
		WEATHERLAYER: false,
		GRAPHSLAYER: false,
		UBERLAYER: false,
		TWITTER: false
	};

	this.graphsFlags = {
		CRIMEGRAPH:	false,
		ABANDONEDVEHICLESGRAPH: false,
		STREETLIGHTSOUTGRAPH: false,
		POTHOLEGRAPH: false
	};

	window.map = this.map;  // I do not understand why this has to be initiated in order for th map markers to work
	//thisController.activeMode = 0;


	this.locations = [];
	this.rectangle = [];
	this.rectangleLayer = null;
	this.rectangleConstructed = false;

	var response;
	this.mapCenter = new L.LatLng(41.864755, -87.631474);
	this.pathLine = null;
	this.pathLineConstructed = false;

	this.boundingBoxLayer = null;
	this.boundingBoxConstructed = false;



	this.firstload = true;

	this.updateCounter = 0; // counts number of updates - only for debugging

	this.cycles = -1;  // Keeps track of the number of update cycles, mostly important for the initial cycle
	this.queryDuration = "week";
	//
	this.pointsOfInterestArray = {};
	this.potholesArray = {};
	this.crimeContainer = {}; //new CrimeContainer();
	this.divvyArray = {};
	this.carsArray = {};
	this.lightsAllArray = {};
	this.lights1Array = {};
	this.ctaArray = {};
	this.uberArray = {};

	this.ctaStopsArray = {};
	this.ctaStopsData = [];
	this.ctaStopsDataLoaded = false;
	this.yelpFoodContainer = {};
	this.yelpBarContainer = {};
	this.yelpClubContainer = {};
	this.getUpdates();


	this.busRoutes = [];

	//svg handles for graphs and other data

	this.crimeGraph = null;
	this.crimeGraphSVG = null;
	this.potHoleGraph = null;
	this.potHoleGraphSVG = null;
	this.abandonedVehicleGraph = null;
	this.abandonedVehicleGraphSVG = null;
	this.streetLightGraph = null;
	this.streetLightGraphSVG = null;

	this.weatherBox = null;
	this.twitterBox = null;
	this.uberBox = null;
	this.miscBox = null;

	this.chicagoData = {
		crimesWeek: null,
		potHolesWeek: null,
		abandonedVehiclesWeek: null,
		streetLightsAllWeek: null,
		streetLightsOneWeek: null,
		crimesMonth: null,
		potHolesMonth: null,
		abandonedVehiclesMonth: null,
		streetLightsAllMonth: null,
		streetLightsOneMonth: null
	};
	this.selectionData = {
		crimesWeek: null,
		potHolesWeek: null,
		abandonedVehiclesWeek: null,
		streetLightsAllWeek: null,
		streetLightsOneWeek: null,
		crimesMonth: null,
		potHolesMonth: null,
		abandonedVehiclesMonth: null,
		streetLightsAllMonth: null,
		streetLightsOneMonth: null
	};
}


Controller.prototype.getBusStopDataFromFile = function(){
	d3.json("data/busstops.json",function(data){
		var reg = new RegExp ("<td>STOP ID<\/td>[^\/]*");//*<\/td>");
		var numExp = /\d+/;
		var features = data.features;
		for (var i=0;i<features.length;i++){
			var temp = features[i].properties.Description.match(reg);
			if (temp){
				var ID = (temp[0]).match(numExp)[0];
				var latitude = features[i].geometry.coordinates[1],
					longitude = features[i].geometry.coordinates[0];
				this.ctaStopsData.push({stopID:ID,latitude:latitude, longitude:longitude});
			}

		}
		this.ctaStopsDataLoaded = true;
		//console.log(this.ctaStopsData);
		//console.log(data);
	}.bind(this));
};

//var twitterBox = new Twitter();
var indexTwitter = 0;
var numOfShowTwitter = 1;
var tweetData = null;
var twitterBox = null;
var twitterInterval;
var weatherBox;

Controller.prototype.getUpdates = function(){
	var refreshrate = 10000; // Rate at which new data is queried
	this.getData();
	//this.updateWeather();
	this.updateId = setInterval(this.getData.bind(this), refreshrate);
};

Controller.prototype.stopUpdates = function(){
	clearInterval(this.updateId);
};


Controller.prototype.getCTAUpdates = function() {
  var refreshrate = 30000; // 30 seconds
  this.getDataCTA();
  this.updateCTAId = setInterval(this.getDataCTA().bind(this), refreshrate)
};

Controller.prototype.stopCTAUpdates = function() {
    clearInterval(this.updateCTAId);
};

Controller.prototype.updateWeather = function(){
	// if(this.weatherBox != null){
	// 	this.weatherBox.remove()
	// }

	console.log("data weather...");
	if(this.layersFlags.WEATHERLAYER){
		if(weatherBox == undefined){
			console.log("it's on, querying...");
			this.dataManager.currentWeather(this.weatherFun,'weather');

		}
	}else{
		console.log("it's off");
		if(weatherBox != undefined){
			console.log("not null, clearing...");
			weatherBox.clear();
			weatherBox = undefined;
		}
	}

};

Controller.prototype.weatherFun =  function (data, iden){
	//console.log(this.weatherBox);
	//if(this.weatherBox != undefined){
	//	this.weatherBox.svg.remove();
	//	console.log("removed");
	//}

	//if(this.weatherBox != null){
	//	//SEEK AND DESTROY!
	//	this.weatherBox.clear();
	//}else{

	console.log("updating...");
		weatherBox = new Weather("#weather");
		weatherBox.create("100%","100%", '0.7', data);
	//}

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

	//this is out because we do not want to be able to show weather only if a path is constructed! <3
	//if(this.layersFlags.WEATHERLAYER) {
	//	console.log("getting data weather...");
	//	this.updateWeather();
	//}

	this.updateWeather();

	if (this.pathLineConstructed || this.rectangleConstructed){

		this.updateCounter+=1;

		var bounds;
		var northWest;
		var southEast;
		if (this.pathLineConstructed){
			bounds = this.pathLine.getBounds();
			northWest = getNewPointInLatLng(bounds.getNorth(),bounds.getWest(),this.perimeterRadiusInKm,-45); //Increase the bounding box by radius
			southEast = getNewPointInLatLng(bounds.getSouth(),bounds.getEast(),this.perimeterRadiusInKm,135);
		}
		else{// this.rectangleConstructed is true
			bounds = this.rectangleLayer.getBounds();
			northWest = bounds.getNorthWest();
			southEast = bounds.getSouthEast();
		}


		var north = northWest.lat;
		var west = northWest.lng;
		var south = southEast.lat;
		var east = southEast.lng;

		var dataCallback = this.filterByPerimeter.bind(this);
		var uberCallback = this.updateUberMarkers.bind(this);

		console.log("fetching data");

		// Sending requests to database

		if (this.layersFlags.CRIMELAYER) this.dataManager.crimes((this.queryDuration==="week" ? "week2" : this.queryDuration),north,west,south,east,dataCallback, "crimes" );

		if (this.layersFlags.POTHOLELAYER) this.dataManager.potHoles(this.queryDuration,north,west,south,east,dataCallback, "potHoles" );

		if (this.layersFlags.ABANDONEDVEHICLESLAYER) this.dataManager.abandonedVehicle(this.queryDuration,north,west,south,east,dataCallback, "abandonedVehicles" );

		if (this.layersFlags.STREETLIGHTSOUTLAYER) {
			this.dataManager.lightOutAllNotCompleted(this.queryDuration,north,west,south,east,dataCallback, "lightOutAll" );
			this.dataManager.lightOut1NotCompleted(this.queryDuration,north,west,south,east,dataCallback, "lightOutOne" );
		}
		if (this.layersFlags.DIVVYLAYER) this.dataManager.divvyBikes(north,west,south,east,dataCallback, "divvyStations" );

		if (this.layersFlags.YELPRESTAURANTLAYER) this.dataManager.yelp('food', '', 0, '4000','','', north,west,south,east,dataCallback, 'yelpFood');
		if (this.layersFlags.YELPBARLAYER) this.dataManager.yelp('bar', '', 0, '4000','','', north,west,south,east,dataCallback, 'yelpBar');
		if (this.layersFlags.YELPCLUBLAYER) this.dataManager.yelp('club', '', 0, '4000','','', north,west,south,east,dataCallback, 'yelpClub');

		var self = this;
		if (this.layersFlags.TRAFFICLAYER) {
			//if(this.updateCounter >= 8) {
				//var data = {destination: "Congress Plaza", headdirect: "87",latitude: 41.86635, longitude: -87.60659,pdist: "37681",pid: "4506",route: "126",timestamp: "20141121 22:48",vehicleid: "1701"};
				//this.ctaArray["1701"].updateMarkerData(data);
			//}
			if(this.busRoutes.length == 0) {
				this.dataManager.getCTAData2(this.busRoutes, north, west, south, east, dataCallback, "cta");
			}else{
				for(var i = 0; i< this.busRoutes.length; i++){
					this.dataManager.getVehiclesPublic(this.busRoutes[i], north,west,south,east,dataCallback,"cta");
				}
			}


			if(!this.ctaStopsDataDrawn){
				this.filterByPerimeter(this.ctaStopsData, 'busStop');
				this.ctaStopsDataDrawn = true;
			}
			//this.dataManager.busRoute.forEach(function(route){
			//	self.dataManager.getVehiclesPublic(route,north,west,south,east,dataCallback, "cta" );
			//})
		}

		if(this.layersFlags.UBERLAYER) {
			var points = this.pathLine.getLatLngs();
			this.dataManager.uberEstPrice(points[0].lat,points[0].lng, points[points.length-1].lat, points[points.length-1].lng,uberCallback);
			this.dataManager.uberEstTime(points[0].lat, points[0].lng,uberCallback);
		}

	}
	this.firstload = false;
};


Controller.prototype.getDataCTA = function() {

};

Controller.prototype.getTwitters = function(queryParam){

	var hashed = this.makeHashTag(queryParam);
	var chicago = '#chicago';

	hashed = encodeURIComponent(hashed);
	chicago = encodeURIComponent(chicago);


	console.log(hashed);
	console.log(chicago);

	var varTweet = [];
	varTweet.push(hashed);
	varTweet.push(chicago);

	//database.twitter(varTweet,'','','',fringuello_tweets, 'tweets');
	this.dataManager.twitter(varTweet,'','','',this.twitterCallBack,'tweets');
};

Controller.prototype.twitterCallBack = function(data,iden){
	clearInterval(twitterInterval);

	indexTwitter = 0;
	numOfShowTwitter = 1;
	tweetData = data;

	switchTweet();
	twitterInterval = setInterval(switchTweet, 5000);

};

function switchTweet() {
	if(twitterBox != null){
		twitterBox.deleteText();
	}

	twitterBox = new Twitter();
	if(tweetData.statuses.length == 0){
		return;
	}
	if(context.layersFlags.TWITTER){
		for(var i =0; i < numOfShowTwitter; i++){
			console.log(indexTwitter);
			if(tweetData.statuses.length <= (indexTwitter)){
				indexTwitter = 0;
			}
			if(twitterBox.flag != 0){
				console.log("is not zero!");
				twitterBox.deleteText();
			}

			twitterBox.showTweets(tweetData.statuses[indexTwitter]);
			console.log(tweetData.statuses[indexTwitter].user.created_at);
			console.log(tweetData.statuses[indexTwitter].user.screen_name);
			console.log(tweetData.statuses[indexTwitter].text);


			indexTwitter ++;
		}
	}else{
		if(twitterBox != null){}
	}

}

Controller.prototype.makeHashTag = function (string){

	var nameArray = string.split(" ");
	var finalString = '#';
	for(var i = 0; i<nameArray.length; i++){
		finalString += nameArray[i];
	}

	return finalString;
};

Controller.prototype.getTrafficFlow = function(bounds) {
	var url = "http://www.mapquestapi.com/traffic/v2/flow?key=Fmjtd%7Cluurn962n0%2Cr0%3Do5-9w85da&inFormat=json&json={mapState: { center: { lat:39.739028996383965 , lng:-104.98479299999998}, height:400, width:400, scale:433342}}";
};

Controller.prototype.onMapClick = function(e){
	
	var point = e.latlng;

	if (this.mode.PATHSELECTION === true ||	this.mode.BOUNDINGBOXSELECTION === true){
		//if (this.rectangleConstructed===true){
		//	this.removeRectangle();
		//	this.rectangle = {ul:null,lr:null};
		//}
		
		this.locations.push({latLng: {lat:point.lat,lng:point.lng}});
		if (this.locations.length > 2)
			this.locations.splice(0,1);
		var locObj = { locations:this.locations };
		this.getRoute(locObj);
	}
	else if (this.mode.RECTANGLESELECTION === true) {
		var minLat;
		var maxLat;
		var minLng;
		var maxLng;
		if (this.rectangleConstructed===true){
			this.removeRectangle();
		}

		console.log("rect!!");
		if (this.rectangle.length < 2)
			this.rectangle.push(point);
		
		if (this.rectangle.length === 2){
			
			if (this.rectangle[0].lat > this.rectangle[1].lat){
				minLat = this.rectangle[1].lat;
				maxLat = this.rectangle[0].lat; 
			}
			else{
				minLat = this.rectangle[0].lat;
				maxLat = this.rectangle[1].lat; 
			}
			if (this.rectangle[0].lng > this.rectangle[1].lng){
				minLng = this.rectangle[1].lng;
				maxLng = this.rectangle[0].lng; 
			}
			else{
				minLng = this.rectangle[0].lng;
				maxLng = this.rectangle[1].lng;
			}
						
			northWest = getNewPointInLatLng(maxLat,minLng,this.perimeterRadiusInKm,-45); //Increase the bounding box by radius
			southEast = getNewPointInLatLng(minLat,maxLng,this.perimeterRadiusInKm,135);
			var rectBounds = [[southEast.lat, northWest.lng], [northWest.lat, southEast.lng]];
			// create an orange rectangle
			this.rectangleConstructed = true;
			this.rectangleLayer = new L.rectangle(rectBounds, {color: "#ff7800", weight: 1});
			this.map.map.addLayer(this.rectangleLayer);
			
		}

	
		
	}
	
};

Controller.prototype.drawBoundingBox = function(){
	
	if (this.pathLineConstructed===true && this.mode.BOUNDINGBOXSELECTION === true){
		if (this.boundingBoxConstructed === true)
			this.removeBoundingBox();
		bounds = this.pathLine.getBounds();

		northWest = getNewPointInLatLng(bounds.getNorth(),bounds.getWest(),this.perimeterRadiusInKm,-45); //Increase the bounding box by radius
		southEast = getNewPointInLatLng(bounds.getSouth(),bounds.getEast(),this.perimeterRadiusInKm,135);
		console.log(bounds.getNorthWest(),bounds.getSouthEast());
		console.log(northWest,southEast);
		var rectBounds = [[southEast.lat, northWest.lng], [northWest.lat, southEast.lng]];
		this.boundingBoxLayer = new L.rectangle(rectBounds, {color: "#ff7800", weight: 1});
		this.boundingBoxConstructed = true;
		this.map.map.addLayer(this.boundingBoxLayer);
	}
}

Controller.prototype.removeBoundingBox = function(){
	if (this.boundingBoxConstructed === true){
		this.map.map.removeLayer(this.boundingBoxLayer);
		this.boundingBoxConstructed = false;
	}
}

Controller.prototype.removePath = function(){

	this.locations = [];
	if (this.pathLineConstructed){
		this.map.map.removeLayer(this.pathLine);
		this.pathLine = null;
		this.pathLineConstructed = false;
		for (var i=0;i<this.perimeterCircles.length;i++){
			this.map.map.removeLayer(this.perimeterCircles[i]);
		}
		this.perimeterCircles = [];
	}

};

Controller.prototype.clearAll = function(){
	console.log("clearing");
	this.removePath();
	this.removeBoundingBox();
	this.removeRectangle();
	this.removeAllMarkers();
}


Controller.prototype.removeRectangle = function(){
	if (this.rectangleConstructed === true){
		console.log("removing rectangle");
		this.map.map.removeLayer(this.rectangleLayer);
		this.rectangleConstructed = false;
		this.rectangle = [];
	}
	
};

Controller.prototype.removeAllMarkers = function(){
	console.log("removeAllMarkers");
	var markerContainers = [
		//this.pointsOfInterestArray,
		this.potholesArray,
		this.crimeContainer,  //new CrimeContainer();
		this.divvyArray,
		this.carsArray,
		this.lights1Array,
		this.ctaArray,
		this.ctaStopsArray,
		this.yelpFoodContainer,
		this.yelpBarContainer,
		this.yelpClubContainer
	];

	var self = this;
	markerContainers.forEach(function(container){
		for (key in container){
			//console.log(container[key]);
			self.map.removeLayer(container[key]);
			delete container[key];
		}
	})
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

Controller.prototype.getChicagoData = function(){ // One time pull of the city wide data
	var dataCallback1 = this.storeChicagoWeekData.bind(this);
	this.dataManager.crimes("week2",0,0,0,0,dataCallback1, "crimes" );
    this.dataManager.potHoles("week",0,0,0,0,dataCallback1, "potHoles" );
    this.dataManager.abandonedVehicle("week",0,0,0,0,dataCallback1, "abandonedVehicles" );
	this.dataManager.lightOutAllNotCompleted("week",0,0,0,0,dataCallback1, "lightOutAll" );
	this.dataManager.lightOut1NotCompleted("week",0,0,0,0,dataCallback1, "lightOutOne" );
	var dataCallback2 = this.storeChicagoMonthData.bind(this);
	this.dataManager.crimes("month",0,0,0,0,dataCallback2, "crimes" );
    this.dataManager.potHoles("month",0,0,0,0,dataCallback2, "potHoles" );
    this.dataManager.abandonedVehicle("month",0,0,0,0,dataCallback2, "abandonedVehicles" );
	this.dataManager.lightOutAllNotCompleted("month",0,0,0,0,dataCallback2, "lightOutAll" );
	this.dataManager.lightOut1NotCompleted("month",0,0,0,0,dataCallback2, "lightOutOne" );

}

Controller.prototype.storeChicagoWeekData = function(data, id){
	switch(id){
		case "crimes":
			this.chicagoData.crimesWeek = data;
			break;
		case "potHoles":
			this.chicagoData.potHolesWeek = data;
			break;
		case "abandonedVehicles":
			this.chicagoData.abandonedVehiclesWeek = data;
			break;
		case "lightOutAll":
			this.chicagoData.streetLightsAllWeek = data;
			break;
		case "lightOutOne":
			this.chicagoData.streetLightsOneWeek = data;
			break;
	}
}

Controller.prototype.storeChicagoMonthData = function(data, id){
	switch(id){
		case "crimes":
			this.chicagoData.crimesMonth = data;
			break;
		case "potHoles":
			this.chicagoData.potHolesMonth = data;
			break;
		case "abandonedVehicles":
			this.chicagoData.abandonedVehiclesMonth = data;
			break;
		case "lightOutAll":
			this.chicagoData.streetLightsAllMonth = data;
			break;
		case "lightOutOne":
			this.chicagoData.streetLightsOneMonth = data;
			break;
	}
};

Controller.prototype.filterByPerimeter = function(data,identifierStr){
	console.log("filterByPerimeter", data,identifierStr);

	if (this.pathLineConstructed === true && this.mode.BOUNDINGBOXSELECTION === false){
		var filteredData = [];
		var points = this.pathLine.getLatLngs();
		for (var d=0;d<data.length;d++){
			var dist = 100; // Too far away!
			var dataPoint = data[d];
			dataPoint.idenType = identifierStr;

			if(dataPoint.hasOwnProperty("location") && dataPoint.location.hasOwnProperty("coordinate")){
				dataPoint.latitude = dataPoint.location.coordinate.latitude;
				dataPoint.longitude = dataPoint.location.coordinate.longitude;
			}
			//console.log(dataPoint);
			var dataRange = false;
			for(var i=0;i<points.length;i++){
				var tempDist = distance(points[i].lat,points[i].lng,dataPoint.latitude,dataPoint.longitude);

				if (tempDist <= this.perimeterRadiusInKm){
					//console.log(tempDist,this.perimeterRadiusInKm);
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
			(this.queryDuration==="week"? this.selectionData.crimesWeek = data : this.selectionData.crimesMonth = data)
			this.updateMarkers(data,this.crimeContainer,'case_number',CrimeMarker);
			break;
		case 'divvyStations':
			this.updateMarkers(data,this.divvyArray,'id',DivvyMarker);
			break;
		case 'potHoles':
			(this.queryDuration==="week"? this.selectionData.potHolesWeek = data : this.selectionData.potHolesMonth = data)
			this.updateMarkers(data,this.potholesArray,'service_request_number',PotholeMarker);
			break;
		case 'abandonedVehicles':
			(this.queryDuration==="week"? this.selectionData.abandonedVehiclesWeek = data : this.selectionData.abandonedVehiclesMonth = data)
			this.updateMarkers(data,this.carsArray,'service_request_number',AbandonedVehicleMarker);
			break;
		case 'lightOutAll':
			(this.queryDuration==="week"? this.selectionData.streetLightsAllWeek = data : this.selectionData.streetLightsAllMonth = data)
			this.updateMarkers(data,this.lights1Array,'service_request_number',LightsOutMarker);
			break;
		case 'lightOutOne':
			(this.queryDuration==="week"? this.selectionData.streetLightsOneWeek = data : this.selectionData.streetLightsOneMonth = data)
			this.updateMarkers(data,this.lights1Array,'service_request_number',LightsOutMarker);
			break;

		case 'yelpFood':
			this.updateMarkers(data,this.yelpFoodContainer,'id',YelpMarker);
			break;
		case 'yelpBar':
			this.updateMarkers(data,this.yelpBarContainer,'id',YelpMarker);
			break;
		case 'yelpClub':
			this.updateMarkers(data,this.yelpClubContainer,'id',YelpMarker);

			break;
		case 'cta':
			this.updateMarkers(data,this.ctaArray,'vehicleid',CTAMarker);
			break;
		case 'busStop':
			this.updateMarkers(data,this.ctaStopsArray,'stopID',BusStopMarker);
			break;
		default:
			console.log('Invalid string');
			break;
	}
};

Controller.prototype.updateUberMarkers  = function(data) {
	var uberX;
	if ( data.hasOwnProperty('times'))
		uberX = data.times[0];
	else if ( data.hasOwnProperty('prices'))
		uberX = data.prices[0];

	uberX.latitude = data.latitude;
	uberX.longitude = data.longitude;

	console.log("updateUberMarkers", uberX, data);

	if(!this.uberArray[0]) {
		this.uberArray[0] = new UberMarker(uberX);
		this.uberArray[0].addTo(this.map);
	} else
		this.uberArray[0].updateMarkerData(uberX);
};


Controller.prototype.updateCTAStations = function(data) {
	for(var i = 0; i< data.length; i++){
		var key = data[i][idstr];
		// A - B: Add new marker
		if(!markerCollection[key]) {
			markerCollection[key] = new marker(data[i],context);
			markerCollection[key].viewNewIcon();
			markerCollection[key].addTo(this.map);
			// B in A: update!
		} else if(markerCollection[key]){
			if (markerCollection[key] instanceof CTAMarker){
				markerCollection[key].updateMarkerData(data[i]);
			}
			// Remove B!
		}
	}
}

// Generic function to write new data to markers
// TODO: handle updated icons
// 'data' is the (filtered) data that needs to be written to markers
// 'array' is the array that will hold the markers, e.g. potholesArray
// 'idstr' is the name of the field of the object that is used to uniquely identify the marker as a string
// 'marker' is the class name of the marker object to be created, e.g. PotholeMarker, ect.
Controller.prototype.updateMarkers = function(data,markerCollection,idstr,marker) {
	console.log("update markers, data length is ",data.length);
	if (data.length > 0) {
		var iKey = {};
		data.forEach(
			function(datum){
				iKey[datum[idstr]] = datum[idstr];
				//console.log("iKey list",idstr, datum,datum[idstr], iKey[datum[idstr]]);
			}
		);

		var iKeySize = getSizeOfMarkerContainer(iKey);
		var markerSize = getSizeOfMarkerContainer(markerCollection);



		for(var i = 0; i< data.length; i++){
			var key = data[i][idstr];
			// A - B: Add new marker
			if(!markerCollection[key]) {
				markerCollection[key] = new marker(data[i],context);
				markerCollection[key].viewNewIcon();
				markerCollection[key].addTo(this.map);
			// B in A: update!
			} else if(markerCollection[key]){
				if (markerCollection[key] instanceof CTAMarker){
					markerCollection[key].updateMarkerData(data[i]);
				}
			// Remove B!
			}
		}

		var markerSize2 = getSizeOfMarkerContainer(markerCollection);

		for ( k in markerCollection){
			//console.log(k, iKey[k], markerCollection[k], (marker instanceof CTAMarker));
			if (!iKey[k]){
				if ((markerCollection[key] instanceof CTAMarker) === false) {
					console.log("Kill the Marker!!");
					map.removeLayer(markerCollection[k]); // markerCollection.remove(k) acts like pop or slice. It returns the marker, then deletes it from the collection
					delete markerCollection[k];
				} else {
					console.log("Its a CTAmarker", markerCollection[k]);
				}

			}
		}
		var markerSize3 = getSizeOfMarkerContainer(markerCollection);
		console.log("iKey: ", iKeySize, "markerCollection before:", markerSize, "after:", markerSize2, "pruned:", markerSize3);
	} else
		console.log("data is zero!")

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
		if (this.mode.BOUNDINGBOXSELECTION === false){
			var circle = new L.circle(new L.LatLng(points[0],points[1]), this.perimeterRadiusInKm*1000, {color: "#ff7800", weight: 1});
			this.map.map.addLayer(circle);
			this.perimeterCircles.push(circle);	
		}
		
	}
    // console.log(points);
    for(var i=0;i<points.length/2;i++){
    	this.pathLine.addLatLng(new L.LatLng(points[2*i],points[2*i+1]));
    }
    this.pathLineConstructed = true;
    this.pathLine.redraw();
    if (this.mode.BOUNDINGBOXSELECTION === false){
	    var circle = new L.circle(new L.LatLng(points[points.length-2],points[points.length-1]), this.perimeterRadiusInKm*1000, {color: "#ff7800", weight: 1});
		this.map.map.addLayer(circle);
		this.perimeterCircles.push(circle);
	}
    // console.log(this.pathLine.getBounds());
    this.map.fitBounds(this.pathLine.getBounds());
    this.drawBoundingBox();
	this.ctaStopsDataDrawn = false;
    //this.getPerimeterAroundPath(30);
};



Controller.prototype.init = function(){
	this.map.init(this.mapCenter, 11);

	this.pointsOfInterestArray[0] =	new SimpleMarker({latitude: 41.869912359714654, longitude:-87.64772415161133, description:"Electronic Visualization Lab" });
	this.pointsOfInterestArray[1] = new SimpleMarker({latitude: 41.86624, longitude: -87.61702, description: "The Field Museum of Natural History"});
	this.pointsOfInterestArray[2] = new SimpleMarker({latitude: 41.86761, longitude: -87.61365, description: "The Shedd Aquarium"});
	this.pointsOfInterestArray[3] = new SimpleMarker({latitude: 41.86635, longitude: -87.60659, description: "The Alder Planetarium"});

	//console.log(this.pointsOfInterestArray[5]);
	for( var key in this.pointsOfInterestArray){
		this.pointsOfInterestArray[key].addTo(this.map);
	}

	console.log("animating marker!");
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


Controller.prototype.setMode = function(modeName,array,b) {
	// 'modeName' is the name of the layer to be set, e.g. DIVVYLAYER, PLACESOFINTERESTLAYER, CRIMELAYER, etc.
	// 'array' is the array that holds the markers for the associated object, e.g. divvyArray, pointsOfInterestArray, crimeContainer
	// 'b' is the Boolean value to which the layer is set (true or false)

	///////////////////////////////////////////////////////////////
	if (modeName === "CLEAR") return;
	if (modeName in this.mode) {
		console.log("MODENAME = " + modeName + ":\t" + this.mode[modeName] + " --> " + b);
		this.mode[modeName] = b;
		// Only one main mode can be selected at a time
		for(var key in this.mode) {
			if(b === true && this.mode[key] != this.mode[modeName]) {
				this.mode[key] = false;
			}
		}
		console.log(this.mode);
	} else if (modeName in this.layersFlags) {
		console.log("MODENAME = " + modeName + ":\t" + this.layersFlags[modeName] + " --> " + b);
		this.layersFlags[modeName] = b;
		// add or remove layers accordingly	
		for(var key in array) {
			(b ?
				this.map.addLayer(array[key]) :
				this.map.removeLayer(array[key])
			)
		}
		if (modeName === "TRAFFICLAYER") {
			for(var key in this.ctaStopsArray) {
				(b ?
					this.map.addLayer(this.ctaStopsArray[key]) :
					this.map.removeLayer(this.ctaStopsArray[key])
				)
			}
		}
	} else if (modeName in this.graphsFlags) {
		console.log("MODENAME = " + modeName + ":\t" + this.graphsFlags[modeName] + " --> " + b);
		this.graphsFlags[modeName] = b;
	} else {
		console.log("ERROR: Cannot Set Mode:\t" + modeName + " not defined");
	}
};

Controller.prototype.setWeather = function(b) {
	this.layersFlags.WEATHERLAYER = b;
};

Controller.prototype.getMode = function(modeName) {
	if (modeName in this.mode) {
		return this.mode[modeName];
	} else if (modeName in this.layersFlags) {
		return this.layersFlags[modeName];
	} else if (modeName in this.graphsFlags) {
		return this.graphsFlags[modeName];
	} else {
		console.log("Mode " + modeName + " not defined");
		return null;
	}
};

Controller.prototype.getLayerFlag = function(layerName) {
	if (layerName in this.layersFlags) {
		return this.layersFlags[layerName];
	}
	return null;
};


Controller.prototype.makePotholeGraph = function(data){
	if (this.potHoleGraphSVG){
		if (this.potHoleGraph === null){
			this.potHoleGraph = new PieChart(this.potHoleGraphSVG);
			console.log("Creating Pie");
		}
		if (this.layersFlags.POTHOLELAYER === true && (this.pathLineConstructed || this.rectangleConstructed)){
			var data ;
			console.log("Creating Pie");
			if (this.queryDuration==="week"){
				data = {
					values: [this.selectionData.potHolesWeek.length,this.chicagoData.potHolesWeek.length-this.selectionData.potHolesWeek.length],
					names: ["Selection","Chicago"]
				};
			}
			else{
				data = {
					values: [this.selectionData.potHolesMonth.length,this.chicagoData.potHolesMonth.length-this.selectionData.potHolesMonth.length],
					names: ["Selection","Chicago"]
				};
			}
			
			this.potHoleGraph.setData(data.values, data.names, "potholes", "Area");
			this.potHoleGraph.setTitle("Potholes");
			this.potHoleGraph.setColor(["rgba(150,150,100,0.8)","rgba(51,185,213,1.0)"])
			this.potHoleGraph.draw();	
		}
		
	}
};

Controller.prototype.makeAbandonedVehicleGraph = function(){
	if (this.abandonedVehicleGraphSVG){
		if (this.abandonedVehicleGraph === null){
			this.abandonedVehicleGraph = new PieChart(this.abandonedVehicleGraphSVG);
			console.log("Creating Pie");
		}
		if (this.layersFlags.ABANDONEDVEHICLESLAYER === true && (this.pathLineConstructed || this.rectangleConstructed)){
			var data ;
			console.log("Creating Pie");
			if (this.queryDuration==="week"){
				data = {
					values: [this.selectionData.abandonedVehiclesWeek.length,this.chicagoData.abandonedVehiclesWeek.length-this.selectionData.abandonedVehiclesWeek.length],
					names: ["Selection","Chicago"]
				};
			}
			else{
				data = {
					values: [this.selectionData.abandonedVehiclesMonth.length,this.chicagoData.abandonedVehiclesMonth.length-this.selectionData.abandonedVehiclesMonth.length],
					names: ["Selection","Chicago"]
				};
			}
			
			this.abandonedVehicleGraph.setData(data.values, data.names, "abandonedvehicles", "Area");
			this.abandonedVehicleGraph.setTitle("Abandoned Vehicles");
			this.abandonedVehicleGraph.setColor(["rgba(150,150,100,0.8)","rgba(51,185,213,1.0)"])
			this.abandonedVehicleGraph.draw();	
		}
		
	}
}

Controller.prototype.makeStreetlightGraph = function(){
	if (this.streetLightGraphSVG){
		if (this.streetLightGraph === null){
			this.streetLightGraph = new BarChart(this.streetLightGraphSVG);
			console.log("Creating Pie");
		}
		if (this.layersFlags.STREETLIGHTSOUTLAYER === true && (this.pathLineConstructed || this.rectangleConstructed)){
			var data = [{key:"One", value:0},{key:"All", value:0}];
			var chicagoData =  [{key:"One", value:0},{key:"All", value:0}];
			console.log("Creating Pie");
			if (this.queryDuration==="week"){
				chicagoData[0].value = this.chicagoData.streetLightsOneWeek.length;
				chicagoData[1].value = this.chicagoData.streetLightsAllWeek.length;
				data[0].value = this.selectionData.streetLightsOneWeek.length;
				data[1].value = this.selectionData.streetLightsAllWeek.length;
			}
			else{
				chicagoData[0].value = this.chicagoData.streetLightsOneMonth.length;
				chicagoData[1].value = this.chicagoData.streetLightsAllMonth.length;
				data[0].value = this.selectionData.streetLightsOneMonth.length;
				data[1].value = this.selectionData.streetLightsAllMonth.length;
			}
			
			this.streetLightGraph.setData(chicagoData, data, "streetlight", ["Selection","Chicago"], "Area");
			this.streetLightGraph.setAxes("key","Type","value","# of cases");
			this.streetLightGraph.setTitle("Street Lights Out");
			this.streetLightGraph.setColor(["rgba(150,150,100,0.8)","rgba(51,185,213,1.0)"]);
			this.streetLightGraph.draw();	
		}
		
	}
}

Controller.prototype.makeCrimeGraph = function(){
	if (this.crimeGraphSVG){
		if (this.crimeGraph === null){
			this.crimeGraph = new BarChart(this.crimeGraphSVG);
			console.log("Creating Pie");
		}
		if (this.layersFlags.CRIMELAYER === true && (this.pathLineConstructed || this.rectangleConstructed)){
			var data ;
			var dataChicago;
			console.log("Creating Pie");
			if (this.queryDuration==="week"){
				data = this.selectionData.crimesWeek;
				chicagoData = this.chicagoData.crimesWeek;
			}
			else{
				data = this.selectionData.crimesMonth;
				chicagoData = this.chicagoData.crimesMonth;
			}
			data = getCrimeTypeCount(data);
			chicagoData = getCrimeTypeCount(chicagoData);
			console.log(data);
			this.crimeGraph.setData(chicagoData, data, "crime",["Selection","Chicago"], "Area");
			this.crimeGraph.setAxes("key","Type","value","# of crimes");
			this.crimeGraph.setTitle("Crimes");
			this.crimeGraph.setColor(["rgba(150,150,100,0.8)","rgba(51,185,213,1.0)"])
			this.crimeGraph.draw();
		}
		
	}
}



Controller.prototype.addGraph = function(drawTo,idStr) {

	var svg = d3.select(drawTo).append("svg:svg")
		.attr("viewBox", "0 0 160 90")
		.attr("preserveAspectRatio", "xMinYMin meet");
	return svg;
}

Controller.prototype.removeGraphs = function(){
	d3.select("#divgraphs1").selectAll(".graphs").remove();
	d3.select("#divgraphs2").selectAll(".graphs").remove();
};

function getCrimeTypeCount(data){
	var groupedData = d3.nest()
		.key(function(d) { return d.primary_type; })
		.rollup(function(leaves) { return leaves.length; })
		.entries(data);
	var crimeList = [{key:"Theft", value:0},{key:"Assault", value:0},{key:"Battery", value:0},{key:"Other", value:0},{key:"Burglary", value:0},{key:"Robbery", value:0}];

	for (var i=0;i<groupedData.length;i++){
		switch(groupedData[i].key){
			case "PUBLIC PEACE VIOLATION":
			case "DECEPTIVE PRACTICE":
			case "OTHER OFFENSE":
			case "STALKING":
			case "PROSTITUTION":			
			case "SEX OFFENSE":
			case "NARCOTICS":
					crimeList[3].value += groupedData[i].values;
					break;
			case "ASSAULT":
			case "WEAPONS VIOLATION":
			case "CRIMINAL DAMAGE":
			case "CRIMINAL TRESPASS":
			case "CRIM SEXUAL ASSAULT":
			case "OFFENSE INVOLVING CHILDREN":
					crimeList[1].value += groupedData[i].values;
					break;
			case "BURGLARY":
					crimeList[4].value += groupedData[i].values;
					break;
			case "ROBBERY":
					crimeList[5].value += groupedData[i].values;
					break;
			
			case "BATTERY":
					crimeList[2].value += groupedData[i].values;
					break;
			case "THEFT":
			case "MOTOR VEHICLE THEFT":
					crimeList[0].value += groupedData[i].values;
					break;

			case "HOMICIDE":
					break;
			default:
					crimeList[3].value += groupedData[i].values;
					break;
		}
	}
	return crimeList;
};

Controller.prototype.increaseRadius = function() {
	var newRadius = this.perimeterRadiusInKm + 0.2;
	if(newRadius <= this.maxRadius) {
		this.perimeterRadiusInKm = newRadius;
		for (var i=0;i<this.perimeterCircles.length;i++){
    		this.perimeterCircles[i].setRadius(this.perimeterRadiusInKm*1000);
    	}
	}
};

Controller.prototype.decreaseRadius = function() {
	var newRadius = this.perimeterRadiusInKm - 0.2;
	if(newRadius >= this.minRadius) {
		this.perimeterRadiusInKm = newRadius;
		for (var i=0;i<this.perimeterCircles.length;i++){
    		this.perimeterCircles[i].setRadius(this.perimeterRadiusInKm*1000);
    	}
	}
};

Controller.prototype.getRadiusPercentage = function() {
	return this.perimeterRadiusInKm/this.maxRadius;
};

Controller.prototype.updateGraphs = function() {
	// TODO: implement
	if (this.graphsFlags.CRIMEGRAPH === true)
		this.makeCrimeGraph();
	else{
		this.crimeGraphSVG.selectAll("*").remove();
		this.crimeGraph = null;
	}
	if (this.graphsFlags.ABANDONEDVEHICLESGRAPH === true)
		this.makeAbandonedVehicleGraph();
	else{
		this.abandonedVehicleGraphSVG.selectAll("*").remove();
		this.abandonedVehicleGraph = null;
	}
	if (this.graphsFlags.POTHOLEGRAPH === true)
		this.makePotholeGraph();
	else{
		this.potHoleGraphSVG.selectAll("*").remove();
		this.potHoleGraph = null;
	}

	if (this.graphsFlags.STREETLIGHTSOUTGRAPH === true)
		this.makeStreetlightGraph();
	else{
		this.streetLightGraphSVG.selectAll("*").remove();
		this.streetLightGraph = null;
	}
	console.log("THIS FUNCTION IS CALLED EVERYTIME A GRAPH FLAG IS CHANGED");
};

Controller.prototype.updateTwitter = function() {

};

Controller.prototype.setQueryDuration = function(qd) {
	console.log("Set queryDuration to " + qd);
	if(qd === "week") {
		this.queryDuration = "week";
	} else if(qd === "month") {
		this.queryDuration = "month";
	} else {
		console.log("ERROR: invalid query duration " + qd);
	}
};


function getSizeOfMarkerContainer(markerCollection){
	var count = 0;
	for ( el in markerCollection){
		count++
	}
	return count;
}
