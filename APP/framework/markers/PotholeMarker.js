//////////////////////////////////////////////////////////////
//           Divvy Marker object
//////////////////////////////////////////////////////////////

var PotholeMarker = function(data) {

    var latlng = L.latLng(data.latitude, data.longitude);

    var iconOld = L.AwesomeMarkers.icon({
        icon: "bicycle",
        spin:false,
        markerColor: "green",
        iconColor: "white"
    });

    var iconNew = L.AwesomeMarkers.icon({
        icon: "bicycle",
        spin:true,
        markerColor: "green",
        iconColor: "white"
    });

    this.setIconNew(iconNew);
    this.setIconOld(iconOld);
    this.setLatLng(latlng);
    //this.viewNewIcon();
};
