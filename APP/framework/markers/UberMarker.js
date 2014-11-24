/**
 * Created by krbalmryde on 11/22/14.
 */
//////////////////////////////////////////////////////////////
//           Uber Marker object
//////////////////////////////////////////////////////////////

var UberMarker = function(data) {
    this.description = data.description;

    var popupstr = this.description;

    var latlng = L.latLng(data.latitude, data.longitude);

    var iconNew = L.AwesomeMarkers.icon({
        icon: "circle",
        spin:false,
        markerColor: "black",
        iconColor: "white"
    });

    var iconOld = L.AwesomeMarkers.icon({
        icon: "circle",
        spin:false,
        markerColor: "white",
        iconColor: "black"
    });
    this.setIconNew(iconNew);
    this.setIconOld(iconOld);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.init();
    //this.pulse();
};
