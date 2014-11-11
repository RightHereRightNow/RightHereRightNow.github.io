//////////////////////////////////////////////////////////////
//           Abandoned Vehicle Marker object
//////////////////////////////////////////////////////////////

var AbandonedVehicleMarker = function(data) {
    this.service_request_number = data.service_request_number;
    this.creation_date = data.creation_date;
    this.vehicle_make_model = data.vehicle_make_model;
    this.vehicle_color =  data.vehicle_color;

    var latlng = L.latLng(data.latitude, data.longitude);

    var popupstr = "<p><b>Request #:</b> " + this.service_request_number +
                   "</br><b>Date Stolen:</b>" + this.creation_date +
                   "</br><b>Vehicle Make/Model:</b> " + this.vehicle_make_model +
                   "</br><b>Vehicle Color:</b> " + this.vehicle_color + "</p>";

    var iconOld = L.AwesomeMarkers.icon({
        icon: "car",
        spin:false,
        markerColor: "gray",
        iconColor: "white"
    });

    var iconNew = L.AwesomeMarkers.icon({
        icon: "car",
        spin:false,
        markerColor: "lightgray",
        iconColor: "white"
    });

    this.setIconNew(iconNew);
    this.setIconOld(iconOld);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.init();
};