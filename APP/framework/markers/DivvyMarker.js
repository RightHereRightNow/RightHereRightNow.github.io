
//////////////////////////////////////////////////////////////
//           Divvy Marker object
//////////////////////////////////////////////////////////////

function DivvyMarker(data) {
    this.id = data.id;
    this.stationName = data.stationName;
    this.availableDocks = data.availableDocks;
    this.totalDocks = data.totalDocks;
    this.statusValue = data.statusValue;
    this.statusKey = data.statusKey;
    this.availableBikes = data.availableBikes;
    this.stAddress1 = data.stAddress1;
    this.location = data.location;
    this.testStation = data.testStation;
    this.lastCommunicationTime = data.lastCommunicationTime;
    this.landMark = data.landMark;

    var popupstr = "<p>Id: " + this.id +
                "</p><p>StationName: " + this.stationName +
                "</p><p>AvailableDocks: " + this.availableDocks +
                "</p><p>TotalDocks: " + this.totalDocks +
                "</p><p>StatusValue: " + this.statusValue +
                "</p><p>StatusKey: " + this.statusKey +
                "</p><p>AvailableBikes: " + this.availableBikes +
                "</p><p>StAddress1: " + this.stAddress1 +
                "</p><p>Location: " + this.location +
                "</p><p>TestStation: " + this.testStation +
                "</p><p>LastCommunicationTime: " + this.lastCommunicationTime +
                "</p><p>LandMark: " + this.landMark + "</p>";


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
    this.setPopupString(popupstr);
}