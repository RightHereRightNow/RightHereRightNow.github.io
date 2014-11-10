
//////////////////////////////////////////////////////////////
//           Divvy Marker object
//////////////////////////////////////////////////////////////

function DivvyMarker(data) {
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
    //this.viewNewIcon();
}

//{
//    "id":5,
//    "stationName":"State St & Harrison St",
//    "availableDocks":9,
//    "totalDocks":19,
//    "latitude":41.8739580629,
//    "longitude":-87.6277394859,
//    "statusValue":"In Service",
//    "statusKey":1,
//    "availableBikes":10,
//    "stAddress1":"State St & Harrison St",
//    "stAddress2":"",
//    "city":"",
//    "postalCode":"",
//    "location":"620 S. State St.",
//    "altitude":"",
//    "testStation":false,
//    "lastCommunicationTime":null,
//    "landMark":"030"
//}