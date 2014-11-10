/**
 * Created by krbalmryde on 11/8/14.
 */

function extend(ChildClass, ParentClass) {
	ChildClass.prototype = new ParentClass();
	ChildClass.prototype.constructor = ChildClass;
}

extend(DivvyMarker, AbstractMarker);
extend(AbandonedVehicleMarker, AbstractMarker);
extend(SimpleMarker, AbstractMarker);
extend(CrimeMarker, AbstractMarker);
extend(PotholeMarker, AbstractMarker);
//extend(CTAMarker, AbstractMarker);



//
//
//	setLatLng( <LatLng> latlng )
//	setIcon( <Icon> icon )
//	setZIndexOffset( <Number> offset )
//	update()
//	bindPopup( <String> html | <HTMLElement> el | <Popup> popup, <Popup options> options? )
//
//
//
//
//
//
//
//
//
//
//this.case_number = data.case_number;
//this.date = data.date;
//this.primary_type = data.primary_type;
//this.description = data.description;
//
//var popupstr = "<p>Type: " + this.primary_type +
//	"</p><p>Case #: "+ this.case_number +
//	"</p><p>Date: " + this.date +
//	"</p><p>Details: " + this.description + "</p>"
//
//var latlng = L.latLng(data.latitude, data.longitude);
//
//var iconOld = L.AwesomeMarkers.icon({
//	icon: "frown-o",
//	spin:false,
//	markerColor: "darkred",
//	iconColor: "white"
//});
//
//var iconNew = L.AwesomeMarkers.icon({
//	icon: "frown-o",
//	spin:true,
//	markerColor: "red",
//	iconColor: "white"
//});
//
//this.setIconNew(iconNew);
//this.setIconOld(iconOld);
//this.setLatLng(latlng);
//this.setPopupString(popupstr);
//this.viewNewIcon();




//lightOutAllNotCompleted
//lightOutAllCompleted
//lightOut1NotCompleted
//lightOut1Completed
//Crimes