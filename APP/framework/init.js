function init() {

	console.log("Initializing...");

	// initialize stuff...
	context = new Controller();
	
	context.init();
	context.getChicagoData();
	context.map.on("click", context.onMapClick.bind(context));
	
	// Initialize controller in selection mode
	context.mode.PATHSELECTION = true;

	context.ui.draw();
	context.getBusStopDataFromFile();


	// Make UI consistent
	context.ui.buttonSelection.setActive();
	context.ui.update();


	// Adding Graph SVG's
	context.crimeGraphSVG = context.addGraph("#divgraphs1","graphCrime");
	context.potHoleGraphSVG = context.addGraph("#divgraphs1","graphPotholes");
	context.abandonedVehicleGraphSVG = context.addGraph("#divgraphs1","graphAbandonedVehicles");
	context.streetLightGraphSVG = context.addGraph("#divgraphs1","graphStreetLights");

	context.weatherBox = context.addGraph("#divgraphs2","weatherBox");
	context.twitterBox = context.addGraph("#divgraphs2","twitterBox");
	context.uberBox = context.addGraph("#divgraphs2","uberBox");
	context.miscBox = context.addGraph("#divgraphs2","miscBox");

}
