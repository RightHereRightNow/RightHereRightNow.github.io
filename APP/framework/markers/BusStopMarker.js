/**
 * Created by krbalmryde on 11/22/14.
 */
//////////////////////////////////////////////////////////////
//           Bus Stop Marker object
//////////////////////////////////////////////////////////////

var BusStopMarker = function(data) {
    this.stopID = data.stopID;
    this.latitude = data.latitude;
    this.latitude = data.longitude;




    var popupstr = "<p><b>Stop ID: " + this.stopID + " </b></p>"

    var latlng = L.latLng(data.latitude, data.longitude);

    //var iconNew = L.AwesomeMarkers.icon({
    //    icon: "wifi",
    //    spin:false,
    //    markerColor: "purple",
    //    iconColor: "white"
    //});

    var iconNew = L.MakiMarkers.icon({
        icon: "embassy",
        color: "#0842FF",
        size: "s"
    });

    this.setIconNew(iconNew);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.init();
    //this.pulse();
};