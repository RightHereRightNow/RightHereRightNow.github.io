function init() {

	console.log("Initializing...");

	// initialize stuff...
	context = new Controller();
	
	
	/*
	TODO: I'm not sure this is needed anymore at all - we can check on monday
	var onMapClick = function (e) {
  		var point = e.latlng;
		this.locations.push({latLng: {lat:point.lat,lng:point.lng}});
		if (this.locations.length > 2)
			this.locations.splice(0,1);
		var locObj = { locations:this.locations };
		this.getRoute(locObj);
		if (context.base === 0) {
			context.map.viewAerial();
		} else{
			context.map.viewStreet();
		};

	};
	var onMapClickCallBack = onMapClick.bind(context);
	context.map.on("click", onMapClickCallBack);
	*/

	context.init();

	// Initialize controller in selection mode
	context.setMode(context.modes.SELECTION);

	context.ui.draw();

}
