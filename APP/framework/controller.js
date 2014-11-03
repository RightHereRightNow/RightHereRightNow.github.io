function controller() {

	console.log("CONTROLLER initialized");

	thisController = this;

	thisController.refreshrate = 1000; // Rate at which new data is queried

	thisController.mode = 0; // 0 for selection mode

	// thisController.map = new map();
	// thisController.layer = new layer();
	
	thisController.update();

}


// This function automatically calls itself in regular intervals
controller.prototype.update = function() {

	thisController.getData();

	// Automatically calls itself in regular intervals
	setTimeout(thisController.update, thisController.refreshrate); 

};



// Queries Data from Database and writes to Marker Objects
controller.prototype.getData = function() {

	console.log("\tCONTROLLER - getData");
	
	// TODO: Query data from database
	// TODO: write data to marker objects
	// TODO: update layer

};


// Sets current mode
controller.prototype.setMode = function() {
	// TODO: return mode
}

// Returns current mode
controller.prototype.getMode = function() {
	// TODO: return mode
}
