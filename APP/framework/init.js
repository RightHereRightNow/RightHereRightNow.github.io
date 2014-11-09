function init() {

	console.log("Initializing...");

	// initialize stuff...
	context = new Controller();
	var onMapClick = function (e) {
  		var point = e.latlng;
		this.locations.push({latLng: {lat:point.lat,lng:point.lng}});
		if (this.locations.length > 2)
			this.locations.splice(0,1);
		var locObj = { locations:this.locations };
		this.getRoute(locObj);
	};

	var onMapClickCallBack = onMapClick.bind(context);
	context.init();
	context.map.on("click", onMapClickCallBack);

	// Initialize controller in selection mode
	context.setMode(context.modes.SELECTION);

	context.ui.draw();

}
