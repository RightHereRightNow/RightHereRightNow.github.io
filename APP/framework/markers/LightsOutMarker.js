/**
 * Created by krbalmryde on 11/10/14.
 */
//////////////////////////////////////////////////////////////
//           Pothole Marker object
//////////////////////////////////////////////////////////////

var LightsOutMarker = function(data, type) {

    this.lightType = type;
    this.service_request_number = data.service_request_number;

    var latlng = L.latLng(data.latitude, data.longitude);

    var popupstr = "<p>Type: " + type +
                   "</br>Service #: " + this.service_request_number + "</p>"

    var colorNew, colorOld, iconStr;

    switch (type){
        case "lightOutAll":
            iconStr = "lightbulb-o";
            colorNew = "darkpurple";
            break;
        case "lightOutOne":
            iconStr = "lightbulb-o";
            colorNew = "purple";
            break;
    }


    var iconNew = L.AwesomeMarkers.icon({
        icon: iconStr,
        spin:false,
        markerColor: colorNew,
        iconColor: "white"
    });

    this.setIconNew(iconNew);
    this.setIconOld(iconOld);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.init();
};
