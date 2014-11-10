//////////////////////////////////////////////////////////////
//           Divvy Marker object
//////////////////////////////////////////////////////////////

var PotholeMarker = function(data) {

    var latlng = L.latLng(data.latitude, data.longitude);

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
    this.setLatLng(latlng);
    this.viewNewIcon();
};