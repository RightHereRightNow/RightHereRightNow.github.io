function init() {

	console.log("Initializing...");

	// initialize stuff...
	context = new Controller();
	var onMapClick = function (e) {
  		var point = e.latlng;
		this.locations.push({latLng: {lat:point.lat,lng:point.lng}});
		var locObj = { locations:this.locations };
		this.drawPath(this.getRouteShapePoints(locObj));
	};

	var onMapClickCallBack = onMapClick.bind(context);
	context.drawMap();
	context.map.on("click", onMapClickCallBack);

	// Initialize controller in selection mode
	context.setMode(context.modes.SELECTION);

	context.ui.draw();

}
