function Controller() {

	console.log("CONTROLLER initialized");

	this.map = null;
	this.layers = [];
	this.dataManager = null;
	this.modes = null;

	thisController.refreshrate = 5000; // Rate at which new data is queried

	// Possible modes of our application
	thisController.modes = {
		SELECTION:		0,
		TRAFFICLAYER:	1,
		CRIMELAYER:		2
	};

	thisController.activeMode = 0;

	// thisController.map = new map();
	// thisController.layer = new layer();
	
	
}

Controller.prototype.addMap = function(){

}

Controller.prototype.addLayer = function(){

}

Controller.prototype.attachLayerToMap = function(){
	
}

// This function automatically calls itself in regular intervals
Controller.prototype.update = function() {

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
