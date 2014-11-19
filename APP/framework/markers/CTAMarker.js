//////////////////////////////////////////////////////////////
//           CTA Marker object
//////////////////////////////////////////////////////////////

var CTAMarker = function(data) {

    //var latlng = L.latLng(data.latitude, data.longitude);
    /*
        startPosition represents the starting point within the array of points for the bus route.
        endPostion represents the LAST point within the array of points for the bus route. For a
        bus to move forward, it requires these two points to be initialized with data. After every
        update, the endPosition becomes the startPosition. At each update, check to see whether the
        start and end point are the same, if they are, then update the end point. If they are not,
        animate, then set them to be the same.

        On initialization of the Marker, the endPosition should be Null, to ensure it does

    */
    var self = this;
    this.startPosition = [data.latitude, data.longitude];
    this.endPosition = null;
    this.destination = data.destination;

    //Child element of the vehicle element. Heading of vehicle as a 360º value,
    //where 0º is North, 90º is East, 180º is South and 270º is West.
    this.headdirect = data.headdirect;
    this.pdist = data.pdist;
    this.pid = data.pid;
    this.route = data.route;
    this.timestamp = data.timestamp;
    this.vehicleid = data.vehicleid;

    var iconOld = L.AwesomeMarkers.icon({
        icon: "frown-o",
        spin:false,
        markerColor: "darkred",
        iconColor: "white"
    });

    this.setIconDirection = function() {
        if (this.headdirect > 315 && this.headdirect < 45) {
            console.log(cta_north);
            this.setIconOld(cta_north);
            this.setIconNew(cta_north);
        }
        else if (this.headdirect > 45 && this.headdirect < 135) {
            console.log(cta_east);
            this.setIconOld(cta_east);
            this.setIconNew(cta_east);
        }
        else if (this.headdirect > 135 && this.headdirect < 225) {
            console.log(cta_south)
            this.setIconOld(cta_south);
            this.setIconNew(cta_south);
        }
        else if (this.headdirect > 225 && this.headdirect < 315){
            console.log(cta_west)
            this.setIconOld(cta_west);
            this.setIconNew(cta_west);
        }
    };

    this.beingAnimation = function() {
        console.log("we be startin animations now!");
        this.marker.start();
    };

    this.updateLine = function(data) {
        this.headdirect = data.headdirect;
        this.endPosition = [data.latitude, data.longitude];

        this.setIconDirection();
        var line = [];
        line.push(this.startPosition); line.push(this.startPosition);
        var routes = L.polyline(line);
        console.log(routes);
        this.marker.setLine(routes.getLatLngs());

    };

    // Overloaded init() function for CTA markers since they use L.AnimatedMarkers
    this.init = function() {
        var points = [];

        for(var i=0; i < data.length; i+=2){
            points.push([data[i], data[i+1]]);
            console.log("points", points);
        }
        console.log("init CTA Marker!",this.startPosition);
        var routes = L.polyline(this.startPosition, this.startPosition);

        this.marker = L.animatedMarker(routes.getLatLngs(), {
            icon: self.iconNew,
            autoStart: false,
            interval: 100,
            onEnd: function() {
                self.startPosition = self.endPosition;
                self.endPosition = null;
            }
        });
        if (this.popupString) {
            // console.log(this.popupString);
            this.bindPopup();
        }
    };

    this.setIconDirection();
    this.setIconOld(iconOld);
    this.init();

    //this.setLatLng(latlng);
};
