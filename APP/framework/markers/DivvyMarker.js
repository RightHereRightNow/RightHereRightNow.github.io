
//////////////////////////////////////////////////////////////
//           Divvy Marker object
//////////////////////////////////////////////////////////////

function DivvyMarker(data) {
    this.id = data.id;
    this.stationName = data.stationName;
    this.availableDocks = data.availableDocks;
    this.totalDocks = data.totalDocks;
    this.statusValue = data.statusValue;
    this.availableBikes = data.availableBikes;

    var popupstr = "<p><b>Id:</b> " + this.id +
                    "</br><b>Station Name:</b> " + this.stationName +
                    "</br><b>Available Docks:</b> " + this.availableDocks +
                    "</br><b>Total Docks:</b> " + this.totalDocks +
                    "</br><b>Status:</b> " + this.statusValue +
                    "</br><b>Available Bikes:</b> " + this.availableBikes + "</p>";


    var latlng = L.latLng(data.latitude, data.longitude);

    var iconOld = L.AwesomeMarkers.icon({
        icon: "bicycle",
        spin:false,
        markerColor: "cadetblue",
        iconColor: "white"
    });

    var iconNew = L.AwesomeMarkers.icon({
        icon: "bicycle",
        spin:false,
        markerColor: "blue",
        iconColor: "white"
    });

    this.updateData = function(data) {
        this.id = data.id;
        this.stationName = data.stationName;
        this.availableDocks = data.availableDocks;
        this.totalDocks = data.totalDocks;
        this.statusValue = data.statusValue;
        this.availableBikes = data.availableBikes;

        var popupstr = "<p><b>Id:</b> " + this.id +
            "</br><b>Station Name:</b> " + this.stationName +
            "</br><b>Available Docks:</b> " + this.availableDocks +
            "</br><b>Total Docks:</b> " + this.totalDocks +
            "</br><b>Status:</b> " + this.statusValue +
            "</br><b>Available Bikes:</b> " + this.availableBikes + "</p>";

        this.setPopupString(popupstr);
        this.viewOldIcon();
    };

    this.setIconNew(iconNew);
    this.setIconOld(iconOld);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.init();
}

