//////////////////////////////////////////////////////////////
//           Divvy Marker object
//////////////////////////////////////////////////////////////

function AbstractMarker() {
    this.marker = null;   // The actual marker object itself
    this.LatLng = null;        // This will contain the markers LatLng object coordinates
    this.iconOld = null;       // For the icon indicating its "Old-ness"
    this.iconNew = null;      // Icon for representing new
    this.popupString = null;  // The text to which goes into the popup string
    this.ID = null;  // This will be the markers ID in order to keep track of it and its data
    this.type = null;  // String to identify what type of marker it is.
    this.popupString = null;  // Info to be placed in the popup
}

// top level method which allows the setting of a markers latitude/longitude
AbstractMarker.prototype = {
    setLatLng: function(newLatLngObj) {
        this.LatLng = newLatLngObj; // This should be a LatLng leaflets object!!
    },

    setPopupString: function(popupString) {
        this.popupString = popupString;
    },

    // Top level method to set a new Icon. Assumes a Icon object!
    setIconOld: function(oldIcon) {
        this.iconOld = oldIcon;  //
    },

    // Top level method to set a new Icon. Assumes a Icon object!
    setIconNew: function(newIcon) {
        this.iconNew = newIcon;  //
    },

    init: function() {
        this.marker = L.marker(this.LatLng, {icon: this.iconNew})
        if (this.popupString) {
            // console.log(this.popupString);
            this.bindPopup();
        }

    },
    viewOldIcon: function() {
        this.marker.setIcon(this.iconOld );
        this.update();
    },

    viewNewIcon: function() {
        this.marker.setIcon(this.iconNew );
        this.update();
    },

    getMarker: function() {
        return this.marker;
    },

    // Calls the marker's update() method to update its state (if necessary)
    update: function() {
        this.marker.setLatLng(this.LatLng);
        if (this.popupString) {
            // console.log(this.popupString);
            this.bindPopup();
        }

        this.marker.update();
    },

    addTo: function(map){
        this.marker.addTo(map.map);  // So we can add it to the map!
    },

    bindPopup: function(){
        this.marker.bindPopup(this.popupString);
    }

};


//  'red',      'blue',      'green',      'purple',     'orange', 'gray',      'white', 'pink', ,  'black',
//  'darkred',  'darkblue',  'darkgreen',  'darkpurple', 'beige',  'lightgray'
//  'lightred', 'lightblue', 'lightgreen'
//              'cadetblue',
//
