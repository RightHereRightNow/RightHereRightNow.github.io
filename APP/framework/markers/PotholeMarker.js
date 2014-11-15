//////////////////////////////////////////////////////////////
//           Divvy Marker object
//////////////////////////////////////////////////////////////

var PotholeMarker = function(data) {

    this.service_request_number = data.service_request_number;
    this.creation_date = data.creation_date
    this.status = data.status;

    var latlng = L.latLng(data.latitude, data.longitude);

    var popupstr = "<p><b>Service #:</b> "+ this.service_request_number +
                    "</br><b>Creation Date:</b> " + this.creation_date +
                    "</br><b>Status:</b> " + this.status + "</p>"


    var iconOld = L.AwesomeMarkers.icon({
        icon: "exclamation-triangle",
        spin:false,
        markerColor: "green",
        iconColor: "white"
    });

    var iconNew = L.AwesomeMarkers.icon({
        icon: "exclamation-triangle",
        spin:false,
        markerColor: "darkgreen",
        iconColor: "white"
    });

    this.setIconNew(iconNew);
    this.setIconOld(iconOld);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.init();
};
