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
        spin:false,
        markerColor: "orange",
        iconColor: "white"
    });

    var iconOld = L.AwesomeMarkers.icon({
        icon: "circle",
        spin:false,
        markerColor: "orange",
        iconColor: "white"
    });
    this.setIconNew(iconNew);
    this.setIconOld(iconOld);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.init();
    //this.pulse();
};



function SimpleContainer() {
    this.add = function (key, data) {
        this.container[key] = new SimpleMarker(data);
        this.container[key] = new SimpleMarker(data);
    }
};