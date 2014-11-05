function controller() {

	console.log("CONTROLLER initialized");

	thisController = this;

	thisController.refreshrate = 10000; // Rate at which new data is queried

	// Possible modes of our application
	thisController.modes = {
		SELECTION:		0,
		TRAFFICLAYER:	1,
		CRIMELAYER:		2
	};

	thisController.activeMode = 0;

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
controller.prototype.setMode = function(newmode) {
	console.log("\tSet mode: " + newmode);
	thisController.activeMode = newmode;
}

// Returns current mode
controller.prototype.getMode = function() {
	return thisController.activeMode;
}
