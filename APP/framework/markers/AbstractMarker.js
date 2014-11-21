/////////////////////////////////////////////////////////////////
//           Abstract Marker object
//
// Also include definition for Abstract Marker Container object
/////////////////////////////////////////////////////////////////

function AbstractMarker() {
    this.marker = null;   // The actual marker object itself
    this.LatLng = null;        // This will contain the markers LatLng object coordinates
    this.iconOld = null;       // For the icon indicating its "Old-ness"
    this.iconNew = null;      // Icon for representing new
    this.popupString = null;  // The text to which goes into the popup string
    this.ID = null;  // This will be the markers ID in order to keep track of it and its data
    this.type = null;  // String to identify what type of marker it is.
    this.popupString = null;  // Info to be placed in the popup
    this.opacity = 0.0;
    this._counter = 0;
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
        this.marker = L.marker(this.LatLng, {icon: this.iconNew});
        this.ID = setInterval(this.pulse.bind(this), 100);
        if (this.popupString) {
            this.bindPopup();
        }
        this.setZIndexOffset(1000) && this.update();
        this.pulse();
        this.setZIndexOffset(0) && this.update();
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
    },

    setOpacity: function(inc){
        this.marker.setOpacity(inc);
    },

    setZIndexOffset: function(z){
      this.marker.setZIndexOffset(z);
    },

    pulse: function() {
        //console.log("calling Pulse", this.ID, this.opacity, this._counter);
        this._counter+=1;

        if((this._counter / 2) % 2 > 0)
            this.opacity -= 1.0;
        else
            this.opacity = 1.0;

        this.setOpacity(this.opacity);

        if (this._counter == 20){
            //console.log("clear interval");
            clearInterval(this.ID);
        }
    }
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////                           Abstract Container class lives here!
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * Created by krbalmryde on 11/20/14.
 */
function AbstractMarkerContainer() {
    this.container = null;
    this.countByWeek = null;
    this.countByMonth = null;

}

AbstractMarkerContainer.prototype = {

    init: function() {
        this.container = {};
        this.countByWeek = 0;
        this.countByMonth = 0;
    },

    hasKey: function(key) {
        return !!this.container[key];  // ? interesting syntax
    },

    get: function(key) {
        return this.container[key];
    },

    // add function needs to be implemented on a per marker basis
    // add: function(key, data) {
    //      this.container[key] = new Marker(data);
    // }

    remove: function(key) {
        var marker = this.container[key];
        delete this.container[key];
        return marker;
    },

    keys: function() {
        var keys = [];

        for ( k in this.container){
            keys.push(k);
        }

        return keys;
    }

};





//  'red',      'blue',      'green',      'purple',     'orange', 'gray',      'white', 'pink', ,  'black',
//  'darkred',  'darkblue',  'darkgreen',  'darkpurple', 'beige',  'lightgray'
//  'lightred', 'lightblue', 'lightgreen'
//              'cadetblue',
//
