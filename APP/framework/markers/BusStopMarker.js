/**
 * Created by krbalmryde on 11/22/14.
 */
//////////////////////////////////////////////////////////////
//           Bus Stop Marker object
//////////////////////////////////////////////////////////////

var BusStopMarker = function(data) {
    this.stopID = data.stopID;
    this.latitude = data.latitude;
    this.latitude = data.longitude;

    var popupstr = "<p><b>Stop ID: " + this.stopID + " </b></p>"

    var latlng = L.latLng(data.latitude, data.longitude);


    var iconNew = L.MakiMarkers.icon({
        icon: "embassy",
        color: "#0842FF",
        size: "s"
    });


    this.updateMarkerData = function(data){
        var popupstr = "<p><b>Stop ID: " + this.stopID + " </b></p>";
        //tmstmp: tmstmp,
        //    typ : typ,
        //    stpnm : stpnm,
        //    stopID :stpid,
        //    vid: vid,
        //    dstp: dstp,
        //    rt: rt,
        //    rtdir: rtdir,
        //    des: des,
        //    prdtm: prdtm,
        //    tablockid: tablockid,
        //    tatripid: tatripid

        this.setPopupString(popupstr);
        this.update();
    };

    this.setIconNew(iconNew);
    this.setLatLng(latlng);
    this.setPopupString(popupstr);
    this.init();
    //this.pulse();
};