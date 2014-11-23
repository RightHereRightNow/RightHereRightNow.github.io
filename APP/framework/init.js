function init() {

	console.log("Initializing...");

	// initialize stuff...
	context = new Controller();
	
	
	/*
	TODO: I'm not sure this is needed anymore at all - we can check on monday
	*/
	/*var onMapClick = function (e) {
  		var point = e.latlng;
		this.locations.push({latLng: {lat:point.lat,lng:point.lng}});
		if (this.locations.length > 2)
			this.locations.splice(0,1);
		var locObj = { locations:this.locations };
		this.getRoute(locObj);
		/*if (context.base === 0) {
			context.map.viewAerial();
		} else{
			context.map.viewStreet();
		};

	};
	var onMapClickCallBack = onMapClick.bind(context);*/
	

	context.init();
	context.getChicagoData();
	context.map.on("click", context.onMapClick.bind(context));
	
	// Initialize controller in selection mode
	context.setSelectionMode();

	context.ui.draw();
	context.getBusStopDataFromFile();
	context.makePotholeGraph();

	context.ui.buttonSelection.setActive();
	context.ui.update();

}
