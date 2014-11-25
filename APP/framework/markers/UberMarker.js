/**
 * Created by krbalmryde on 11/22/14.
 */
//////////////////////////////////////////////////////////////
//           Uber Marker object
//////////////////////////////////////////////////////////////

var UberMarker = function(data) {

    this.display_name = data.display_name; // "uberX"
    this.estimate = Math.ceil(data.estimate/60.0); // 203
    this.latitude = data.latitude; // 41.927062
    this.longitude = data.longitude; // -87.66114
    this.product_id = data.product_id; // "4bfc6c57-98c0-424f-a72e-c1e2a1d49939"

    this.currency_code = null;
    this.display_name = null;
    this.distance = null;
    this.duration = null;
    this.price = null;
    this.high_estimate = null;
    this.latitude = null;
    this.longitude = null;
    this.low_estimate = null;
    this.product_id = null;
    this.surge_multiplier = null;

    var latlng = L.latLng(data.latitude, data.longitude);

    var iconNew = L.AwesomeMarkers.icon({
        icon: "circle",
        spin:false,
        markerColor: "#444",
        iconColor: "white"
    });

    var iconOld = L.AwesomeMarkers.icon({
        icon: "circle",
        spin:false,
        markerColor: "white",
        iconColor: "black"
    });


    this.updateMarkerData = function(data){
        this.currency_code = data.currency_code; // "USD"
        this.display_name = data.display_name; // "uberX"
        this.distance = data.distance; // 5.88
        this.duration = Math.ceil(data.duration/60.0); // 844
        this.price = data.estimate; // "$9-13"
        this.high_estimate = data.high_estimate; // "13"
        this.latitude = data.latitude; // 41.902641
        this.longitude = data.longitude; // -87.643989
        this.low_estimate = data.low_estimate; // "9"
        this.product_id = data.product_id; // "4bfc6c57-98c0-424f-a72e-c1e2a1d49939"
        this.surge_multiplier = data.surge_multiplier; // 1

        var popupstr = "<p><b>Product:</b> " + this.display_name+
            "</br><b>Estimated Price:</b> "+ this.price +
            "</br><b>Estimated Distance:</b> "+ this.distance + " miles" +
            "</br><b>UberX Arrival Time:</b> "+ this.estimate + " mins" +
            "</br><b>Estimated Travel Time:</b> "+ this.duration + " mins" +
            "</br><b>Surge Multiplier:</b> x" + this.surge_multiplier + "</p>";

        console.log(popupstr);
        this.setPopupString(popupstr);
        this.update();
    };

    this.setIconNew(iconNew);
    this.setIconOld(iconOld);
    this.setLatLng(latlng);
    this.init();
};
