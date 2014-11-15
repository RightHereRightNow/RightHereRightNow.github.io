//////////////////////////////////////////////////////////////
//           CTA Marker object
//////////////////////////////////////////////////////////////

var CTAMarker = function(data) {

    var latlng = L.latLng(data.latitude, data.longitude);

    var iconOld = L.AwesomeMarkers.icon({
        icon: "bus",
        spin:false,
        markerColor: "cadetblue",
        iconColor: "white"
    });

    var iconNew = L.AwesomeMarkers.icon({
        icon: "bus",
        spin:false,
        markerColor: "blue",
        iconColor: "white"
    });

    this.setIconNew(iconNew);
    this.setIconOld(iconOld);
    this.setLatLng(latlng);
    this.init();
};