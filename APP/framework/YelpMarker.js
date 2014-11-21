/**
 * Created by krbalmryde on 11/20/14.
 */
//coffee
function YelpMarker(data) {

    this.case_number = data.case_number;
    this.date = data.date;
    this.primary_type = data.primary_type;
    this.description = data.description;

    var popupstr = "<p><b>Type:</b> " + this.primary_type +
        "</br><b>Case #:</b> "+ this.case_number +
        "</br><b>Date:</b> " + this.date +
        "</br><b>Details:</b> " + this.description +
        "</br><img src='http://s3-media2.fl.yelpcdn.com/assets/2/www/img/a5221e66bc70/ico/stars/v1/stars_small_4_half.png'/></p>"

    var latlng = L.latLng(data.latitude, data.longitude);

    var iconOld = L.AwesomeMarkers.icon({
        icon: "yelp",
        spin:false,
        markerColor: "darkred",
        iconColor: "white"
    });

    var iconNew = L.AwesomeMarkers.icon({
        icon: "frown-o",
        spin:false,
        markerColor: "red",
        iconColor: "white"
    });

    this.setIconNew(iconNew);
    this.setIconOld(iconOld);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.init();

}

