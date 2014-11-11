//////////////////////////////////////////////////////////////
//           Abandoned Vehicle Marker object
//////////////////////////////////////////////////////////////
/*
    data: Json Object which assumes the following fields
        service_request_number,
        creation_date,  // aka date vehicle was reported missing
        vehicle_make_model,
        vehicle_color,
        latitude,
        longitude

 */

var AbandonedVehicleMarker = function(data) {
    this.service_request_number = data.service_request_number;
    this.creation_date = data.creation_date;
    this.vehicle_make_model = data.vehicle_make_model;
    this.vehicle_color =  data.vehicle_color;

    var latlng = L.latLng(data.latitude, data.longitude);

    var popupstr = "<p>Request #: " + this.service_request_number + "</p>" +
                   "<p>Date Stolen: " + this.creation_date + "</p>" +
                   "<p>Vehicle Make/Model: " + this.vehicle_make_model + "</p>" +
                   "<p>Vehicle Color: " + this.vehicle_color + "</p>";


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
};