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
		console.log("normal filter");
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

	var timestampFromWeek = timestamp - oneWeek;
	var timestampFromMonth = timestamp - oneMonth;

	switch(filter){
		case 'now': today = new Date();
					break;
		case 'oneWeekAgo': today = new Date();
							today.setTime(timestampFromWeek);
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

