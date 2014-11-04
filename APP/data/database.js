/* remember to include:
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="http://d3js.org/d3.v3.min.js" charset="utf-8"></script>
	*/

/*
CALLBACK is the function used to manage the data
iden is an id used to recognize what data we are handling
*/
function database(){

	
}


/*
	Generic query function, take as input all the parameters needed
	from -> address of the data you are interested in
	callback -> funciton that handles the vales
	iden -> id of the function, in order to recognize what are you working on.
	*/
database.prototype.genericQuery = function(select, where, order, group, limit, offset, from, callback, iden){

		//var filters = "$select="+select+"&$where="+where+"&$order="+order+"&$group="+group+"&$limit="+limit+"&$offset="+offset;
		
		var filters = "$select="+select+"&$where="+where;
		console.log("normal filter " + iden);
		console.log(filters);
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
	}	
database.prototype.currentDate = function(filter){
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
	yyyy = today.getFullYear()


	if(dd<10) {
	    dd='0'+dd
	} 

	if(mm<10) {
	    mm='0'+mm
	} 

	today = yyyy+'-'+mm+'-'+dd+"T00:00:00";

	return today;

}

/*
weekOrMonth: type 'week' if you want to see data of the last week
			 type 'month' if you want to see data of the last month
fromLat : first point of latitude
fromLong : first point of longitude
toLat : last point of latitude
toLong : last point of longitude

returns latitude,longitude and status of the operation
*/
database.prototype.potHoles = function(weekOrMonth,fromLat, fromLong, toLat, toLong, callback,iden){

	var date;

	switch(weekOrMonth){
		case 'week': date = this.currentDate('oneWeekAgo');
						break;
		case 'month': date = this.currentDate('oneMonthAgo');
						break;
		default: console.log("errore db");
					break;
	}
	this.genericQuery("status, latitude, longitude", "within_box(location,"+fromLat+" , "+fromLong+", "+toLat+", "+toLong+") AND creation_date>='"+date+"'","","","","","http://data.cityofchicago.org/resource/7as2-ds3y.json", callback,iden );

}

/*
same as before, returns the day it has been stoled, the make model & the vechicle color, latitude and longitude
*/
database.prototype.abandonedVehicle = function(weekOrMonth,fromLat, fromLong, toLat, toLong, callback,iden){
	var date;

	switch(weekOrMonth){
		case 'week': date = this.currentDate('oneWeekAgo');
						break;
		case 'month': date = this.currentDate('oneMonthAgo');
						break;
		default: console.log("errore db");
					break;
	}
	this.genericQuery("creation_date,vehicle_make_model,vehicle_color, latitude, longitude", "within_box(location,"+fromLat+" , "+fromLong+", "+toLat+", "+toLong+") AND creation_date>='"+date+"'","","","","","http://data.cityofchicago.org/resource/3c9v-pnva.json", callback,iden );
}

/*
I am only taking the one that has not been completed.
return latitude and longitude
*/
database.prototype.lightOutAll = function(weekOrMonth, fromLat,fromLong, toLat, toLong, callback, iden){
	var date;

	switch(weekOrMonth){
		case 'week': date = this.currentDate('oneWeekAgo');
						break;
		case 'month': date = this.currentDate('oneMonthAgo');
						break;
		default: console.log("errore db");
					break;
	}
	this.genericQuery("latitude, longitude", "within_box(location,"+fromLat+" , "+fromLong+", "+toLat+", "+toLong+") AND creation_date>='"+date+"' AND status !='Completed'","","","","","http://data.cityofchicago.org/resource/zuxi-7xem.json", callback,iden );
}

/*
PROBLEM : LOCATION IS PLAIN TEXT, THE FUNCTION WITHIN_BOX DOES NOT WORK!
*/
database.prototype.lightOut1 = function(weekOrMonth, fromLat,fromLong, toLat, toLong, callback, iden){
	var date;

	switch(weekOrMonth){
		case 'week': date = this.currentDate('oneWeekAgo');
						break;
		case 'month': date = this.currentDate('oneMonthAgo');
						break;
		default: console.log("errore db");
					break;
	}
	this.genericQuery("latitude, longitude", "within_box(location,"+fromLat+" , "+fromLong+", "+toLat+", "+toLong+") AND creation_date>='"+date+"' AND status !='Completed'","","","","","http://data.cityofchicago.org/resource/3aav-uy2v.json", callback,iden );
}

/*
for whole chicago, pass latitues and longitudes = 0
*/

database.prototype.crimes = function(weekOrMonth, fromLat,fromLong, toLat, toLong, callback, iden){
	var date;

	if(fromLong == 0 && fromLat == 0 && toLong == 0 && toLat == 0 ){
		//TO DO QUERY WHOLE CHICAGO...
	}

	switch(weekOrMonth){
		case 'week2': date = this.currentDate('twoWeeksAgo');
						break;
		case 'month': date = this.currentDate('oneMonthAgo');
						break;
		default: console.log("errore db");
					break;
	}

	this.genericQuery("date,primary_type, description, latitude, longitude", "within_box(location,"+fromLat+" , "+fromLong+", "+toLat+", "+toLong+") AND date>='"+date+"'","","","","","http://data.cityofchicago.org/resource/ijzp-q8t2.json", callback,iden );
}

