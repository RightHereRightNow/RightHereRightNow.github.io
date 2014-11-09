/**
 * Created by krbalmryde on 11/8/14.
 */

function extend(ChildClass, ParentClass) {
	ChildClass.prototype = new ParentClass();
	ChildClass.prototype.constructor = ChildClass;
}

colors = ['red', 'blue', 'green', 'purple', 'orange',
	      'darkred', 'lightred', 'beige', 'darkblue',
	      'darkgreen', 'cadetblue', 'darkpurple', 'white',
		  'pink', 'lightblue', 'lightgreen', 'gray', 'black',
		  'lightgray'];

//////////////////////////////////////////////////////////////
//           Divvy Marker object
//////////////////////////////////////////////////////////////
function AbstractMarker() {
	this.marker = L.marker();   // The actual marker object itself
	this.LatLng = null;        // This will contain the markers LatLng object coordinates
	this.iconOld = null;       // For the icon indicating its "Old-ness"
	this.iconNew = null;      // Icon for representing new
	this.ID = null;  // This will be the markers ID in order to keep track of it and its data
	this.type = null;  // String to identify what type of marker it is.
	this.popupInfo = null;  // Info to be placed in the popup
}

// top level method which allows the setting of a markers latitude/longitude
AbstractMarker.prototype = {
	setLatLng: function(newLatLngObj) {
		this.LatLng = newLatLngObj; // This should be a LatLng leaflets object!!
		this.marker.setLatLng(this.LatLng);
		this.update();
	},

	// Top level method to set a new Icon. Assumes a Icon object!
	setIconOld: function(oldIcon) {
		this.iconOld = oldIcon;  //
	},

	// Top level method to set a new Icon. Assumes a Icon object!
	setIconNew: function(newIcon) {
		this.iconNew = newIcon;  //
	},

	setToOldIcon: function() {
		this.marker.setIcon(this.iconOld );
		this.update();
	},

	setToNewIcon: function() {
		this.marker.setIcon(this.iconNew );
		this.update();
	},

	// Calls the marker's update() method to update its state (if necessary)
	update: function() {
		this.marker.update();
	},

	addTo: function(map){
		this.marker.addTo(map);  // So we can add it to the map!
	},

	marker: function() {
		return this.marker;
	}
};
//////////////////////////////////////////////////////////////
//           Divvy Marker object
//////////////////////////////////////////////////////////////

var DivvyMarker = function(data) {
	var iconOld = L.AwesomeMarkers.icon({
		icon: "bicycle",
		spin:false,
		markerColor: "cadetblue",
		iconColor: "white"
	});

	var iconNew = L.AwesomeMarkers.icon({
		icon: "bicycle",
		spin:true,
		markerColor: "blue",
		iconColor: "white"
	});

	this.setIconNew(iconNew);
	this.setIconOld(iconOld);
	this.setLatLng(data.latlng);
};


var PotholeMarker = function(data) {
	var iconOld = L.AwesomeMarkers.icon({
		icon: "circle-o",
		spin:false,
		markerColor: "cadetblue",
		iconColor: "white"
	});

	var iconNew = L.AwesomeMarkers.icon({
		icon: "circle-o",
		spin:true,
		markerColor: "blue",
		iconColor: "white"
	});

	this.setIconNew(iconNew);
	this.setIconOld(iconOld);
	this.setLatLng(data.latlng);

}



extend(DivvyMarker, AbstractMarker);
