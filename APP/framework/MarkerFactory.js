/**
 * Created by krbalmryde on 11/8/14.
 */
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
AbstractMarker.prototype.setLatLng = function(newLatLngObj) {
    this.LatLng = newLatLngObj; // This should be a LatLng leaflets object!!
    this.marker.setLatLng(this.LatLng);
};

// Overloaded method which accepts latitude/longitude as an array
//AbstractMarker.prototype.setLatLng = function(newLatLngArray) {
//    this.LatLng = L.latLng(newLatLngArray[0],newLatLngArray[1]);
//    this.marker.setLatLng(this.LatLng);
//};

// Top level method to set a new Icon. Assumes a Icon object!
AbstractMarker.prototype.setIcon = function(newIcon) {
    this.iconOld = newIcon;  //
    this.marker.setIcon(newIcon)
};

// Calls the marker's update() method to update its state (if necessary)
AbstractMarker.prototype.update = function() {
    this.marker.update();
};

AbstractMarker.prototype.addTo = function(map){
    this.marker.addTo(map);  // So we can add it to the map!
};

AbstractMarker.prototype.marker = function() {
    return this.marker;
};



function DivvyMarker(data) {

    AbstractMarker.call(this);

    var self = this;

    self.iconOld = L.AwesomeMarkers.icon({
        icon: "bicycle",
        spin:false,
        markerColor: "cadetblue",
        iconColor: "white"
    });

    self.iconNew = L.AwesomeMarkers.icon({
        icon: "bicycle",
        spin:true,
        markerColor: "cadetblue",
        iconColor: "white"
    });

    self.setIcon(self.iconNew);
    self.setLatLng(data.latlng);


    //var init = function(){
    //    self.setIcon(self.iconNew);
    //    self.setLatLng(data.latlng)
    //}();
}

DivvyMarker.prototype = Object.create(AbstractMarker.prototype);
