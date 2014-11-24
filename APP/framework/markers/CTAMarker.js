//////////////////////////////////////////////////////////////
//           CTA Marker object
//////////////////////////////////////////////////////////////

var CTAMarker = function(data,context) {
    console.log("In CTA init, ", data);
    this.timestamp = data.timestamp; // "20141121 19:46"
    this.route = data.route; // "76"
    this.vehicleid = data.vehicleid; // "6665"
    this.headdirect = data.headdirect;  // "109"
    this.destination = data.destination; // "Harlem"
    this.latitude = data.latitude; // "41.927040100097656"
    this.longitude = data.longitude; // "-87.63453674316406"
    this.pdist = data.pdist; // "56"
    this.pid = data.pid; // "4621"
    this.controller = context;

    var ctaClick = function(e){
        context.getTwitters('cta');
    };


    /*
     Child element of the vehicle element. Heading of vehicle as a 360º value,
     where 0º is North, 90º is East, 180º is South and 270º is West.

     */
    var direction;
    this.setIconDirection = function() {
        if (this.headdirect > 315 && this.headdirect < 45) {
            direction = "<img src='../../img/arrow_down.svg'/>"
            this.setIconNew(cta_north);
        }
        else if (this.headdirect > 45 && this.headdirect < 135) {
            this.setIconNew(cta_east);
        }
        else if (this.headdirect > 135 && this.headdirect < 225) {

            this.setIconNew(cta_south);
        }
        else if (this.headdirect > 225 && this.headdirect < 315){

            this.setIconNew(cta_west);
        }
    };

    var popupstr = "<p><b>Destination:</b> " + this.destination +
        "</br><b>Route #:</b> "+ this.route +
        "</br><b>Head Direction:</b> "+ this.headdirect +
        "</br><b>Vehicle ID:</b> "+ this.vehicleid +
        "</br><b>Timestamp:</b> " + this.timestamp + "</p>"

    var latlng = L.latLng(data.latitude, data.longitude);

    var iconOld = L.AwesomeMarkers.icon({
        icon: "bus",
        spin:false,
        markerColor: "cadetblue",
        iconColor: "white"
    });

    var iconNew = L.AwesomeMarkers.icon({
        icon: "bus",
        spin:false,
        markerColor: "cadetblue",
        iconColor: "white"
    });

    this.updateMarkerData = function(data){
        this.timestamp = data.timestamp; // "20141121 19:46"
        this.route = data.route; // "76"
        this.vehicleid = data.vehicleid; // "6665"
        this.headdirect = data.headdirect;  // "109"
        this.destination = data.destination; // "Harlem"
        this.latitude = data.latitude; // "41.927040100097656"
        this.longitude = data.longitude; // "-87.63453674316406"
        this.pdist = data.pdist; // "56"
        this.pid = data.pid; // "4621"

        popupstr = "<p><b>Destination:</b> " + this.destination +
            "</br><b>Route #:</b> "+ this.route +
            "</br><b>Head Direction:</b> "+ this.headdirect +
            "</br><b>Vehicle ID:</b> "+ this.vehicleid +
            "</br><b>Timestamp:</b> " + this.timestamp + "</p>";

        latlng = L.latLng(data.latitude, data.longitude);

        this.setLatLng(latlng);
        this.setPopupString(popupstr);
        this.update();
    };

    this.setIconNew(iconNew);
    this.setIconOld(iconOld);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.init();
    this.marker.on("click", ctaClick);
};
