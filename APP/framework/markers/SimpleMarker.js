/**
 * Created by krbalmryde on 11/9/14.
 */
//////////////////////////////////////////////////////////////
//           Crime Marker object
//////////////////////////////////////////////////////////////
/*
 latitude,
 longitude,
 description,
 */
var SimpleMarker = function(data) {

    this.description = data.description;

    var popupstr = this.description;

    var latlng = L.latLng(data.latitude, data.longitude);

    var iconNew = L.AwesomeMarkers.icon({
        icon: "circle",
        spin:true,
        markerColor: "blue",
        iconColor: "white"
    });

    var iconOld = L.AwesomeMarkers.icon({
        icon: "circle",
        spin:false,
        markerColor: "cadetblue",
        iconColor: "white"
    });
    this.setIconNew(iconNew);
    this.setIconOld(iconOld);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.viewNewIcon();
};









