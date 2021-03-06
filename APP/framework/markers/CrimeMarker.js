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
function CrimeMarker(data,context) {

    this.case_number = data.case_number;
    this.date = data.date;
    this.primary_type = data.primary_type;
    this.description = data.description;
    this.controller = context;

    var crimeClick = function(e){
        context.getTwitters('crime');
    };

    var popupstr = "<p><b>Type:</b> " + this.primary_type +
                  "</br><b>Case #:</b> "+ this.case_number +
                  "</br><b>Date:</b> " + this.date +
                  "</br><b>Details:</b> " + this.description + "</p>"

    var latlng = L.latLng(data.latitude, data.longitude);

    var iconOld = L.AwesomeMarkers.icon({
        icon: "frown-o",
        spin:false,
        markerColor: "darkred",
        iconColor: "white"
    });

    //var iconNew = L.MakiMarkers.icon({
    //    icon: "rocket",
    //    color: "#FF66CC",
    //    size: "l"
    //});


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
    //this.pulse();
    this.marker.on("click", crimeClick);

}


function CrimeContainer() {
    this.crimeTypeCount = {};

    this.add = function(key, data){
        this.container[key] = new CrimeMarker(data);
    }
}










