//////////////////////////////////////////////////////////////
//           Crime Marker object
//////////////////////////////////////////////////////////////
/*
    case_number,
    date,
    primary_type,
    description,
    latitude,
    longitude
 */
var CrimeMarker = function(data) {

    this.case_number = data.case_number;
    this.date = data.date;
    this.primary_type = data.primary_type;
    this.description = data.description;

    var popupstr = "<p>Type: " + this.primary_type +
                  "</p><p>Case #: "+ this.case_number +
                  "</p><p>Date: " + this.date +
                  "</p><p>Details: " + this.description + "</p>"

    var latlng = L.latLng(data.latitude, data.longitude);

    var iconOld = L.AwesomeMarkers.icon({
        icon: "frown-o",
        spin:false,
        markerColor: "darkred",
        iconColor: "white"
    });

    var iconNew = L.AwesomeMarkers.icon({
        icon: "frown-o",
        spin:true,
        markerColor: "red",
        iconColor: "white"
    });

    this.setIconNew(iconNew);
    this.setIconOld(iconOld);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.viewNewIcon();
};









