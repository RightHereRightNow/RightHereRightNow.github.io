/* remember to include:
 <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
 <script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
 <script type="text/javascript" src="xml2json.js"></script>

 <script src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/hmac-sha1.js"></script>
 <script src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/enc-base64-min.js"></script>
 <script src="oauth-1.0a.js"></script>
 */

/*
 CALLBACK is the function used to manage the data
 iden is an id used to recognize what data we are handling
 */
function Database(){
	var this_db = this;
	this.busRoute = null;
}

var keyCTA1 = 'nBy7EWCMF5qH2bJ3x5NyXpL6N';
var keyCTA2 = 'jgfD8euazQYDTiGeQhP6NKPYj';
var key = keyCTA1;
var CtaData;
var drawn = [];
var _busRoute = [];


/*
 Generic query function, take as input all the parameters needed
 from -> address of the data you are interested in
 callback -> function that handles the vales
 iden -> id of the function, in order to recognize what are you working on.
 */
Database.prototype.genericQuery = function(select, where, order, group, limit, offset, from, callback, iden){

	//var filters = "$select="+select+"&$where="+where+"&$order="+order+"&$group="+group+"&$limit="+limit+"&$offset="+offset;

	var filters = "$select="+select+"&$where="+where+"&$limit=5000";
	//console.log("from" + from);
	//console.log("normal filter " + iden);
	//console.log(filters);


	// //filters = encodeURI(filters);
	// console.log("modified filter");
	// console.log(filters);
	$.ajax({
		url: from,
		data: filters,
		dataType: "json",
		success: function(data) {
			callback(data, iden);
		}
	});
};

Database.prototype.currentDate = function(filter){
	var today = new Date();
	var dd;
	var mm;
	var yyyy;
	var timestamp = today.getTime();

	var oneWeek = 604800000;
	var oneMonth = 2592000000; // 30 days
	var twoWeeks = oneWeek * 2;

	var timestampFromWeek = timestamp - oneWeek;
	var timestampFromMonth = timestamp - oneMonth;
	var timestampFrom2Weeks = timestamp - twoWeeks;

	switch(filter){
		case 'now': today = new Date();
			break;
		case 'oneWeekAgo': today = new Date();
			today.setTime(timestampFromWeek);
			break;
		case 'twoWeeksAgo': today = new Date();
			today.setTime(timestampFrom2Weeks);
			break;
		case 'oneMonthAgo': today = new Date(timestampFromMonth);
			break;
		default: console.log("DB error");
			break;

	}

	dd = today.getDate();
	mm = today.getMonth() + 1; //january is 0
	yyyy = today.getFullYear();


	if(dd<10) {
		dd='0'+dd
	}

	if(mm<10) {
		mm='0'+mm
	}

	today = yyyy+'-'+mm+'-'+dd+"T00:00:00";

	return today;

};

/*
 weekOrMonth: type 'week' if you want to see data of the last week
 type 'month' if you want to see data of the last month
 fromLat : first point of latitude
 fromLong : first point of longitude
 toLat : last point of latitude
 toLong : last point of longitude

 returns latitude,longitude and status of the operation
 */
Database.prototype.potHoles = function(weekOrMonth,fromLat, fromLong, toLat, toLong, callback,iden){

	var date;

	switch(weekOrMonth){
		case 'week': date = this.currentDate('oneWeekAgo');
			break;
		case 'month': date = this.currentDate('oneMonthAgo');
			break;
		default: console.log("errore db");
			break;
	}

	if(fromLat == 0 && fromLong == 0 && toLat == 0 && toLong == 0){
		this.genericQuery("service_request_number,creation_date, status, latitude, longitude", "creation_date>='"+date+"'","","","","","http://data.cityofchicago.org/resource/7as2-ds3y.json", callback,iden );
	}else{
		this.genericQuery("service_request_number,creation_date, status, latitude, longitude", "within_box(location,"+fromLat+" , "+fromLong+", "+toLat+", "+toLong+") AND creation_date>='"+date+"'","","","","","http://data.cityofchicago.org/resource/7as2-ds3y.json", callback,iden );
	}


};

/*
 same as before, returns the day it has been stolen, the make model & the vechicle color, latitude and longitude
 */
Database.prototype.abandonedVehicle = function(weekOrMonth,fromLat, fromLong, toLat, toLong, callback,iden){
	var date;

	switch(weekOrMonth){
		case 'week': date = this.currentDate('oneWeekAgo');
			break;
		case 'month': date = this.currentDate('oneMonthAgo');
			break;
		default: console.log("errore db");
			break;
	}

	if(fromLat == 0 && fromLong == 0 && toLat == 0 && toLong == 0){
		this.genericQuery("service_request_number,creation_date,vehicle_make_model,vehicle_color, latitude, longitude", "creation_date>='"+date+"'","","","","","http://data.cityofchicago.org/resource/3c9v-pnva.json", callback,iden );
	}else{
		this.genericQuery("service_request_number,creation_date,vehicle_make_model,vehicle_color, latitude, longitude", "within_box(location,"+fromLat+" , "+fromLong+", "+toLat+", "+toLong+") AND creation_date>='"+date+"'","","","","","http://data.cityofchicago.org/resource/3c9v-pnva.json", callback,iden );
	}
};

/*
 I am only taking the one that has not been completed.
 return latitude and longitude
 */
Database.prototype.lightOutAllNotCompleted = function(weekOrMonth, fromLat,fromLong, toLat, toLong, callback, iden){
	var date;

	switch(weekOrMonth){
		case 'week': date = this.currentDate('oneWeekAgo');
			break;
		case 'month': date = this.currentDate('oneMonthAgo');
			break;
		default: console.log("errore db");
			break;
	}
	if(fromLat == 0 && fromLong == 0 && toLat == 0 && toLong == 0){
		this.genericQuery("service_request_number,latitude, longitude", "creation_date>='"+date+"' AND status ='Open'","","","","","http://data.cityofchicago.org/resource/zuxi-7xem.json", callback,iden );
	}else{
		this.genericQuery("service_request_number,latitude, longitude", "within_box(location,"+fromLat+" , "+fromLong+", "+toLat+", "+toLong+") AND creation_date>='"+date+"' AND status ='Open'","","","","","http://data.cityofchicago.org/resource/zuxi-7xem.json", callback,iden );
	}

};

/*
 Here I am only taking the completed ones...
 */
Database.prototype.lightOutAllCompleted = function(weekOrMonth, fromLat,fromLong, toLat, toLong, callback, iden){
	var date;

	switch(weekOrMonth){
		case 'week': date = this.currentDate('oneWeekAgo');
			break;
		case 'month': date = this.currentDate('oneMonthAgo');
			break;
		default: console.log("errore db");
			break;
	}

	if(fromLat == 0 && fromLong == 0 && toLat == 0 && toLong == 0){
		this.genericQuery("service_request_number,latitude, longitude", "creation_date>='"+date+"' AND status !='Open'","","","","","http://data.cityofchicago.org/resource/zuxi-7xem.json", callback,iden );
	}else{
		this.genericQuery("service_request_number,latitude, longitude", "within_box(location,"+fromLat+" , "+fromLong+", "+toLat+", "+toLong+") AND creation_date>='"+date+"' AND status !='Open'","","","","","http://data.cityofchicago.org/resource/zuxi-7xem.json", callback,iden );
	}

};

/*
 taking only the one that has not been completed.
 returns latitude and longitude
 */
Database.prototype.lightOut1NotCompleted = function(weekOrMonth, fromLat,fromLong, toLat, toLong, callback, iden){
	var date;

	switch(weekOrMonth){
		case 'week': date = this.currentDate('oneWeekAgo');
			break;
		case 'month': date = this.currentDate('oneMonthAgo');
			break;
		default: console.log("errore db");
			break;
	}
	//this.genericQuery("latitude, longitude", "within_box(location,"+fromLat+" , "+fromLong+", "+toLat+", "+toLong+") AND creation_date>='"+date+"' AND status !='Completed'","","","","","http://data.cityofchicago.org/resource/3aav-uy2v.json", callback,iden );
	var fromLa,fromLo,toLa,toLo;
	if(fromLat < toLat){
		fromLa = fromLat;
		toLa = toLat;
	}else{
		fromLa = toLat;
		toLa = fromLat;
	}
	//console.log("fromLong " + fromLong);
	//console.log("tolong " + toLong);

	if(fromLong < toLong){
		//console.log("from minore di to!");
		fromLo = fromLong;
		toLo = toLong;
	}else{
		//console.log("to minore uguale di from!");
		fromLo = toLong;
		toLo = fromLong;
	}

	if(fromLat == 0 && fromLong == 0 && toLat == 0 && toLong == 0){
		this.genericQuery("service_request_number,latitude, longitude", "creation_date >= '"+date+"' AND status = 'Open'", "","","","","http://data.cityofchicago.org/resource/3aav-uy2v.json", callback,iden );
	}else{
		this.genericQuery("service_request_number,latitude, longitude", "latitude >= "+fromLa+" AND latitude <= "+toLa+" AND longitude >= "+fromLo+" AND longitude <= "+toLo+" AND creation_date >= '"+date+"' AND status = 'Open'", "","","","","http://data.cityofchicago.org/resource/3aav-uy2v.json", callback,iden );
	}

};

/*
 taking only the one that has been completed.
 returns latitude and longitude
 */
Database.prototype.lightOut1Completed = function(weekOrMonth, fromLat,fromLong, toLat, toLong, callback, iden){
	var date;

	switch(weekOrMonth){
		case 'week': date = this.currentDate('oneWeekAgo');
			break;
		case 'month': date = this.currentDate('oneMonthAgo');
			break;
		default: console.log("errore db");
			break;
	}
	//this.genericQuery("latitude, longitude", "within_box(location,"+fromLat+" , "+fromLong+", "+toLat+", "+toLong+") AND creation_date>='"+date+"' AND status !='Completed'","","","","","http://data.cityofchicago.org/resource/3aav-uy2v.json", callback,iden );
	var fromLa,fromLo,toLa,toLo;
	if(fromLat < toLat){
		fromLa = fromLat;
		toLa = toLat;
	}else{
		fromLa = toLat;
		toLa = fromLat;
	}
	//console.log("fromLong " + fromLong);
	//console.log("tolong " + toLong);

	if(fromLong < toLong){
		//console.log("from minore di to!");
		fromLo = fromLong;
		toLo = toLong;
	}else{
		//console.log("to minore uguale di from!");
		fromLo = toLong;
		toLo = fromLong;
	}

	if(fromLat == 0 && fromLong == 0 && toLat == 0 && toLong == 0){
		this.genericQuery("service_request_number,latitude, longitude", "creation_date >= '"+date+"' AND status != 'Open'", "","","","","http://data.cityofchicago.org/resource/3aav-uy2v.json", callback,iden );
	}else{
		this.genericQuery("service_request_number,latitude, longitude", "latitude >= "+fromLa+" AND latitude <= "+toLa+" AND longitude >= "+fromLo+" AND longitude <= "+toLo+" AND creation_date >= '"+date+"' AND status != 'Open'", "","","","","http://data.cityofchicago.org/resource/3aav-uy2v.json", callback,iden );
	}


};


/*
 for whole chicago, pass latitudes and longitudes = 0
 returns
 - date
 - type of crime
 - description of the crime
 - latitude
 - longitude
 */

/*
 Query without parameter in filtering.
 from -> website where to get the data
 dataType -> type of data that is returning : json, jsonP etc etc
 */

Database.prototype.crimes = function(weekOrMonth, fromLat,fromLong, toLat, toLong, callback, iden){
	var date;



	switch(weekOrMonth){
		case 'week2': date = this.currentDate('twoWeeksAgo');
			break;
		case 'month': date = this.currentDate('oneMonthAgo');
			break;
		default: console.log("errore db");
			break;
	}
	if(fromLong == 0 && fromLat == 0 && toLong == 0 && toLat == 0 ){
		this.genericQuery("case_number,date,primary_type, description, latitude, longitude", "date>='"+date+"' AND primary_type != 'homicide'","","","","","http://data.cityofchicago.org/resource/ijzp-q8t2.json", callback,iden );
	}else{
		this.genericQuery("case_number,date,primary_type, description, latitude, longitude", "within_box(location,"+fromLat+" , "+fromLong+", "+toLat+", "+toLong+") AND date>='"+date+"' AND primary_type != 'homicide' ","","","","","http://data.cityofchicago.org/resource/ijzp-q8t2.json", callback,iden );
	}


};

/*
 get other two weeks
 */
Database.prototype.crimesOthers = function(fromLat,fromLong,toLat,toLong,callback,iden){
	var startDate, endDate;
	startDate = this.currentDate('oneMonthAgo');
	endDate = this.currentDate('twoWeeksAgo');

	if(fromLong == 0 && fromLat == 0 && toLong == 0 && toLat == 0 ){
		this.genericQuery("case_number,date,primary_type, description, latitude, longitude", "date>='"+startDate+"' AND date <='"+endDate+"' AND primary_type != 'homicide'","","","","","http://data.cityofchicago.org/resource/ijzp-q8t2.json", callback,iden );
	}else{
		this.genericQuery("case_number,date,primary_type, description, latitude, longitude", "within_box(location,"+fromLat+" , "+fromLong+", "+toLat+", "+toLong+") AND date>='"+startDate+"' AND date <='"+endDate+"' AND primary_type != 'homicide' ","","","","","http://data.cityofchicago.org/resource/ijzp-q8t2.json", callback,iden );
	}

}

Database.prototype.queryNoParam = function(from,dataType, callback, iden){
	$.ajax({
		url: from,
		dataType: dataType,
		success: function(data) {
			callback(data, iden);
		}
	});
};

/*
 Return the whole object given from the website
 PAY ATTENTION: we have a limited amount of queries per day.
 */
Database.prototype.currentWeather = function(callback,iden){
	var from = "http://api.wunderground.com/api/726259969c570f02/geolookup/conditions/q/IA/Chicago.json";
	this.queryNoParam(from,'jsonp',callback,iden);
};



/*
 VERY EXPENSIVE
 Given those data, retrieve all the routes, direction, stops and buses filtered by latitude and longitude
 Not used as we are using the second version.

 IF USE -> return both direction, not only one!
 */
Database.prototype.getCTAData = function (fromLat,fromLong, toLat, toLong, callback,iden){
	$.ajaxSetup({
		async: false
	});
	drawn = [];
	var busData = [];

	//first get all the routes..
	var baseSite = "http://www.ctabustracker.com/bustime/api/v1/";
	var routes = baseSite + "getroutes?key="+key;

	var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + routes + '"') + '&format=xml&callback=?';
	$.getJSON(yql, function(data){
		//var x2js = new X2JS();
		//var json = x2js.xml_str2json(data.results);
		//console.log("inside getCTAData.....");
		//console.log(json);

		var xml = data.results[0];
		$(xml).find('route').each(function(){
			var rtrt = $(this).find('rt').text();
			var rtname = $(this).find('rtnm').text();
			var route = {
				rt : rtrt,
				name : rtname,
				stops: ''
			};

			busData.push(route);

		});

		getDirectionsFromRoute(fromLat,fromLong,toLat,toLong,callback,iden,busData);
	});
	$.ajaxSetup({
		async: true
	});

};

function getDirectionsFromRoute(fromLat,fromLong, toLat, toLong, callback, iden, busData) {

	$.ajaxSetup({
		async: false
	});

	//now for each route, get directions...

	for (var i = 0; i < busData.length; i++) {
		busData[i].stops = [];
		getDirections(busData[i],callback,iden,fromLat,fromLong, toLat, toLong);
		$.ajaxSetup({
			async: true
		});


	}
}



function getDirections(busData,callback,iden,fromLat,fromLong, toLat, toLong){
	var site = "http://www.ctabustracker.com/bustime/api/v1/getdirections?key="+key+"&rt="+busData.rt;
	var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + site + '"') + '&format=xml&callback=?';

	$.getJSON(yql, function(data){
		var xml = data.results[0];
		$(xml).find('dir').each(function(){
			var dir = $(this).text();

			getStops(busData,dir,callback,iden,fromLat,fromLong, toLat, toLong);
		});

	});
}

function getStops(busData, direction,callback,iden,fromLat,fromLong, toLat, toLong){
	$.ajaxSetup({
		async: false
	});

	var site = "http://www.ctabustracker.com/bustime/api/v1/getstops?key="+key+"&rt="+busData.rt+"&dir="+direction;
	var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + site + '"') + '&format=xml&callback=?';

	$.getJSON(yql,function(data){
		var xml = data.results[0];
		$(xml).find('stop').each(function(){
			var stop_id = $(this).find('stpid').text();
			var stop_name = $(this).find('stpnm').text();
			var lat = $(this).find('lat').text();
			var lon = $(this).find('lon').text();

			var stops = {
				stopid: stop_id,
				stopname: stop_name,
				latitude: lat,
				longitude: lon
			};

			busData.stops.push(stops);
			checkCTAReturn(busData,callback,iden,fromLat,fromLong, toLat, toLong);

		});

	});

	console.log(busData);
	$.ajaxSetup({
		async: true
	});

}

function checkCTAReturn(busData,callback,iden,fromLat,fromLong, toLat, toLong){
	//check which one (latitudes & longs) is greater
	var fromLo,toLo,fromLa,toLa;
	if(fromLat < toLat){
		fromLa = fromLat;
		toLa = toLat;
	}else{
		fromLa = toLat;
		toLa = fromLat;
	}

	if(fromLong < toLong){
		fromLo = fromLong;
		toLo = toLong;
	}else{
		fromLo = toLong;
		toLo = fromLong;
	}
	var flag = false;
	for(var i = 0; i< busData.stops.length; i++){
		var data = busData.stops[i];
		/*
		 console.log(data);
		 console.log("********LATITUDE 1ST -> DATA 2ND FROMLA 3RD TOLA");
		 console.log(data.latitude);
		 console.log(fromLa);
		 console.log(toLa);
		 console.log("********LONGITUDE 1ST -> DATA 2ND FROMLA 3RD TOLA");
		 console.log(data.longitude);
		 console.log(fromLo);
		 console.log(toLo);
		 */
		if(data.latitude >= fromLa && data.latitude <=toLa && data.longitude >= fromLo && data.longitude <= toLo){
			//TO-DO RITORNA TROPPI!
			for(var j = 0; j < drawn.length && flag == false; j++){
				if(drawn[j] == busData.rt){
					//already here...
					flag = true;
				}

			}
			if(flag == false){
				drawn.push(busData.rt);
				callback(busData,iden);
				i=60000000;//break
			}
			//callback(busData,iden);
			//i=60000000;//break
			//console.log("YES!");
		}
		//console.log("NOO");
	}
}

/*
 Should be called at the beginning of the program, take all the routes and then call getVehicles per each route.
 */
Database.prototype.getCTAData2 = function (busRoute,fromLat,fromLong, toLat, toLong, callback,iden){
	drawn = [];
	_busRoute = [];
	var self = this;
	//first get all the routes..
	var baseSite = "http://www.ctabustracker.com/bustime/api/v1/";
	var routes = baseSite + "getroutes?key="+key;

	var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + routes + '"') + '&format=xml&callback=?';
	$.getJSON(yql, function(data){

		var xml = data.results[0];
		$(xml).find('route').each(function(){
			var rtrt = $(this).find('rt').text();
			var rtname = $(this).find('rtnm').text();
			var route = {
				rt : rtrt,
				name : rtname
			};
			getVehicles(route.rt, fromLat,fromLong,toLat,toLong,callback,iden);

			_busRoute.push(route);
		});
	});
	busRoute = _busRoute;
};

/*
 Given all the parameters, returns only the vehicle that, in that ROUTE, are inside the boundaries of latitude and longitude.
 The vehicle is an object with :
 - vehicle id
 - timestamp
 - latitude
 - longitude
 - head direction -> where is actually pointing the face of the bus (in degrees)
 - pid : Pattern ID of trip currently being executed.
 - pdist: distance done on the pattern
 - route : actual route
 - destination
 */
Database.prototype.getVehiclesPublic = function(route, fromLat, fromLong, toLat, toLong, callback, iden){
	getVehicles(route, fromLat,fromLong, toLat, toLong, callback, iden);
};

/*
 look the public function
 */
function getVehicles (route,fromLat, fromLong, toLat, toLong, callback, iden){
	//return vehicles only if the lat && long specified...
	var vehicles = [];

	var fromLo,toLo,fromLa,toLa;
	if(fromLat < toLat){
		fromLa = fromLat;
		toLa = toLat;
	}else{
		fromLa = toLat;
		toLa = fromLat;
	}

	if(fromLong < toLong){
		fromLo = fromLong;
		toLo = toLong;
	}else{
		fromLo = toLong;
		toLo = fromLong;
	}

	//http://www.ctabustracker.com/bustime/api/v1/getvehicles?key=nBy7EWCMF5qH2bJ3x5NyXpL6N&rt=6
	var site = "http://www.ctabustracker.com/bustime/api/v1/getvehicles?key="+key+"&rt="+route;
	var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + site + '"') + '&format=xml&callback=?';
	$.getJSON(yql, function(data){

		var xml = data.results[0];
		$(xml).find('vehicle').each(function(){
			var vid = $(this).find('vid').text();
			var tmstmp = $(this).find('tmstmp').text();
			var lat = $(this).find('lat').text();
			var lon = $(this).find('lon').text();
			var hdg = $(this).find('hdg').text();
			var pid = $(this).find('pid').text();
			var pdist = $(this).find('pdist').text();
			var rt = $(this).find('rt').text();
			var des = $(this).find('des').text();


			if(lat >= fromLa && lat <= toLa && lon >= fromLo && lon <= toLo){
				console.log("IN RANGE");
				var vehicle = {
					vehicleid : vid,
					timestamp : tmstmp,
					latitude : lat,
					longitude : lon,
					headdirect: hdg,
					pid : pid,
					pdist: pdist,
					route : rt,
					destination : des

				};
				//console.log(vehicle);
				vehicles.push(vehicle);
			}
		});

		callback(vehicles,iden);
	});
}


/*
 get the prediction of a set of stopids

 stopIds is a comma delimited stopids string

 returning:
 -tmstmp : date and time when the prediction was generated
 -typ :	A = arrival
 D = departure prediction
 -stpnm: name of the stop for wich the prediction was generated
 -stpid: unique id!! of the stop
 -vid:
 */

Database.prototype.getPredictionsFromStopids = function(stopIds, callback, iden){
	var idString = []
	for (k in stopIds){
		idString.push(k)
	}

	var predictions = [];

	var baseSite = "http://www.ctabustracker.com/bustime/api/v1/";
	var routes = baseSite + "getpredictions?key="+key+"&stpid="+idString.join();

	var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from xml where url="' + routes + '"') + '&format=xml&callback=?';
	$.getJSON(yql, function(data){

		var xml = data.results[0];
		$(xml).find('prd').each(function(){
			var tmstmp = $(this).find('tmstmp').text();
			var typ = $(this).find('typ').text();
			var stpnm = $(this).find('stpnm').text();
			var stpid = $(this).find('stpid').text();
			var vid = $(this).find('vid').text();
			var dstp= $(this).find('dstp').text();
			var rt = $(this).find('rt').text();
			var rtdir = $(this).find('rtdir').text();
			var des = $(this).find('des').text();
			var prdtm = $(this).find('prdtm').text();
			var tablockid = $(this).find('tablockid').text();
			var tatripid = $(this).find('tatripid').text();

			var prediction = {
				tmstmp: tmstmp,
				typ : typ,
				stpnm : stpnm,
				stpid :stpid,
				vid: vid,
				dstp: dstp,
				rt: rt,
				rtdir: rtdir,
				des: des,
				prdtm: prdtm,
				tablockid: tablockid,
				tatripid: tatripid
			};

			predictions.push(prediction);


		});

		callback(predictions, iden);
	});
};

/*
 ustime-response
 Root element of the response document.
 error
 Child element of the root element. Message if the processing of the request resulted in an error.
 prd
 Child element of the root element. Encapsulates a predicted arrival or
 ￼￼￼￼￼transitchicago.com v1.1 / rev. 2011-06-16 / p.22
 ￼￼￼￼￼￼￼￼￼￼
 departure time for the specified set of stops or vehicles.
 tmstmp
 Child element of the prd element. Date and time (local) the prediction was generated. Date and time is represented in the following format: YYYYMMDD HH:MM. Month is represented as two digits where January is equal to “01” and December is equal to “12”. Time is represented using a 24-hour clock.
 typ
 Child element of the prd element. Type of prediction. ‘A’ for an arrival prediction (prediction of when the vehicle will arrive at this stop). ‘D’ for a departure prediction (prediction of when the vehicle will depart this stop, if applicable). Predictions made for first stops of a route or layovers are examples of departure predictions.
 stpid
 Child element of the prd element. Unique identifier representing the stop for which this prediction was generated.
 ￼
 stpnm
 Child element of the prd element. Display name of the stop for which this prediction was generated.
 vid
 ￼
 Child element of the prd element. Unique ID of the vehicle for which this prediction was generated.
 dstp
 ￼
 Child element of the prd element. Linear distance (feet) left to be traveled by the vehicle before it reaches the stop associated with this prediction.
 ￼
 rt
 Child element of the prd element. Alphanumeric designator of the route (ex. “20” or “X20”) for which this prediction was generated.
 rtdir
 ￼
 Child element of the prd element. Direction of travel of the route associated with this prediction (ex. “East Bound”).
 des
 ￼
 Child element of the prd element. Final destination of the vehicle associated with this prediction.
 prdtm
 Child element of the prd element. Predicted date and time (local) of a vehicle’s arrival or departure to the stop associated with this prediction. Date and time is represented in the following format: YYYYMMDD HH:MM. Month is represented as two digits where January is equal to “01” and December is equal to “12”. Time is represented using a 24-hour clock.
 dly
 Child element of the prd element. “true” if the vehicle is delayed. The dly element is only present if the vehicle that generated this prediction is delayed.
 */


///*
//Returns all data regarding divvy bikes
// */
//Database.prototype.divvyBikes = function(callback,iden){
//	var site = "http://www.divvybikes.com/stations/json/";
//	var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + site + '"') + '&format=xml&callback=?';
//	$.getJSON(yql, function(data){
//		var x2js = new X2JS();
//		var json = x2js.xml_str2json(data.results);
//		callback(json.json,iden);
//	});
//};



/*
 Returns all data regarding filtered divvy bikes
 */
Database.prototype.divvyBikes = function(fromLat, fromLong, toLat, toLong, callback,iden){
	var filtered_divvy = [];
	var fromLo,toLo,fromLa,toLa;
	if(fromLat < toLat){
		fromLa = fromLat;
		toLa = toLat;
	}else{
		fromLa = toLat;
		toLa = fromLat;
	}

	if(fromLong < toLong){
		fromLo = fromLong;
		toLo = toLong;
	}else{
		fromLo = toLong;
		toLo = fromLong;
	}



	var site = "http://www.divvybikes.com/stations/json/";
	var yql = 'http://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent('select * from json where url="' + site + '"') + '&format=xml&callback=?';
	$.getJSON(yql, function(data){
		var x2js = new X2JS();
		var json = x2js.xml_str2json(data.results);
		/*FILTERING*/
		var divvy = json.json.stationBeanList;
		for(var i = 0; i< divvy.length; i++){

			if(divvy[i].latitude >= fromLa && divvy[i].latitude <= toLa && divvy[i].longitude >= fromLo && divvy[i].longitude <= toLo){
				var divvy_element = {
					availableBikes : divvy[i].availableBikes,
					availableDocks : divvy[i].availableDocks,
					id : divvy[i].id,
					lastCommunicationTime : divvy[i].lastCommunicationTime,
					latitude : divvy[i].latitude,
					longitude : divvy[i].longitude,
					location : divvy[i].location,
					stAddress1: divvy[i].stAddress1,
					stationName : divvy[i].stationName,
					statusKey : divvy[i].statusKey,
					statusValue : divvy[i].statusValue,
					testStation : divvy[i].testStation,
					totalDocks : divvy[i].totalDocks
				}
				filtered_divvy.push(divvy_element);
			}
		}
		/**/
		//callback(json.json,iden);
		callback(filtered_divvy,iden);
	});
};


/*
 * *****************************************
 *  				YELP
 * *****************************************
 */

/*
 YELP : http://api.yelp.com/v2/search?term=food&location=San+Francisco&oauth_consumer_key=vQDt1XRP96cp8PKpSoTjng&oauth_token=zUTnrBovkPeORRyRWdDcrjY7jS_L2h29&oauth_signature_method=HMAC-SHA1&oauth_signature=A5L5DIi0t6B_AJEi16jcxUUCheE&oauth_timestamp=1415487690&oauth_nonce=1234
 */
/*
 Function to query on yelp API
 term: the term to search.. Ex. Hamburger, food...
 location: (ONLY IF CLL AND BOUNDS == '') city to query on Ex. Chicago, IL
 sort : how we want the results sorted (maybe useless) 0=Best Matched, 1=Distance, 2=Highest Rated
 radius_filter : radius filter to query on. max 4000(m) (25miles)
 cll : (ONLY IF LOCATION is SET AND BOUNDS == '') latitude and longitude
 bounds : geographical bounding box, format -> sw_latitude,sw_longitude|ne_latitude,ne_longitude
 */
Database.prototype.yelp = function(term, location, sort, radius_filter, cllLat,cllLong, sw_lat,sw_long, ne_lat,ne_long, callback, iden){
	console.log("calling yelp data", callback);
	$.ajax({
		url: 'data/apiYelp.php',
		data:"term="+term+ "&location="+location+"&sort="+sort+"&radius="+radius_filter+"&cllLat="+cllLat+"&cllLong="+cllLong+"&swlat="+sw_lat+"&swlong="+sw_long+"&nelat="+ne_lat+"&nelong="+ne_long,
		dataType: "json",
		success: function(data){
			callback(data.businesses,iden);
		}
	})
};

/*
 * *****************************************
 *  				UBER
 * *****************************************
 */


//Uber API allow us only to query on products, estimate time and estimate price

/*
 The Products endpoint returns information about the Uber products offered at a given location.
 The response includes the display name and other details about each product, and lists the products in the proper display order.
 */
Database.prototype.uberProducts= function(lat, long, callback, iden){
	$.ajax({
		url: 'data/apiUber.php',
		data:"filter=products&latitude="+lat+"&longitude="+long,
		dataType: "json",
		success: function(data){
			callback(data,iden);
		}
	});
};

/*
 The Time Estimates endpoint returns ETAs for all products offered at a given location, with the responses expressed as integers in seconds.
 We recommend that this endpoint be called every minute to provide the most accurate, up-to-date ETAs.

 start_latitude	float	Latitude component of start location.
 start_longitude	float	Longitude component of start location.
 */
Database.prototype.uberEstTime = function(start_latitude,start_longitude,callback){
	$.ajax({
		url: 'data/apiUber.php',
		data:"filter=time&start_latitude="+start_latitude+"&start_longitude="+start_longitude,
		dataType: "json",
		success: function(data){
			data.latitude = start_latitude;
			data.longitude = start_longitude;
			callback(data);
		}
	});
};

/*

 The Price Estimates endpoint returns an estimated price range for each product offered at a given location.
 The price estimate is provided as a formatted string with the full price range and the localized currency symbol.

 The response also includes low and high estimates, and the ISO 4217 currency code for situations requiring currency conversion.
 When surge is active for a particular product, its surge_multiplier will be greater than 1, but the price estimate already factors in this multiplier.


 start_latitude	float	Latitude component of start location.
 start_longitude	float	Longitude component of start location.
 end_latitude	float	Latitude component of end location.
 end_longitude	float	Longitude component of end location.
 */
Database.prototype.uberEstPrice = function(start_latitude,start_longitude, end_latitude,end_longitude,callback){
	$.ajax({
		url: 'data/apiUber.php',
		data:"filter=price&start_latitude="+start_latitude+"&start_longitude="+start_longitude+"&end_latitude="+end_latitude+"&end_longitude="+end_longitude,
		dataType: "json",
		success: function(data){
			data.latitude = start_latitude;
			data.longitude = start_longitude;
			callback(data);
		}
	});
};

/*
 * *****************************************
 *  				TWITTER
 * *****************************************
 */

/*
 paramQuery = must be an ARRAY of elements (keywords) that you want to search.
 an example could be 'chicaho' or 'redLightDistrict'.
 if you want to search for an hashtag (#chicago) type %23chicago
 latitude = latitude of the center of the area where to search the tweets
 longitude = longitude of the center of the area where to search the tweets
 radius = radius of the circle

 return a json with all the data regarding the tweets
 */

Database.prototype.twitter = function(paramQuery,latitude,longitude,radius,callback,iden){
	var address = "";
	for(var i = 0; i<paramQuery.length; i++){
		if(i!=0){
			address += '&';
		}
		address += "qparam[]="+ "" +paramQuery[i];
	}

	$.ajax({
		url: 'data/apiTwitter.php',
		//data: 'latitude='+latitude+"&longitude="+longitude+"&radius="+radius+address,
		data: address,
		dataType: "json",
		success: function(data){
			callback(data,iden);
		}
	});
};

/************** SUPPORT FUNCTIONS *************************/
// var x2js = new X2JS();


function convertXml2JSon(data,callback,iden) {
	var x2js = new X2JS();
	var json = x2js.xml_str2json(data);
	//console.log("json...");
	//console.log(json);
	callback(json, iden);
}

function convertJSon2XML() {
	$("#xmlArea").val(x2js.json2xml_str($.parseJSON($("#jsonArea").val())));
}



// Changes XML to JSON
function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
			obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};
