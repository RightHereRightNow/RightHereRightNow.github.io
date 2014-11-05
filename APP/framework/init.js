function init() {

	console.log("Initializing...");

	// initialize stuff...
	context = new controller();

	// Initialize controller in selection mode
	context.setMode(context.modes.SELECTION);

	// TODO: create buttons
	drawUI();

	drawMap();

}
