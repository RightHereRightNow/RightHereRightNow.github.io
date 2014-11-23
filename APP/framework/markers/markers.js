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
extend(CTAMarker, AbstractMarker);
extend(YelpMarker, AbstractMarker);
extend(LightsOutMarker, AbstractMarker);



extend(SimpleContainer, AbstractMarkerContainer);
extend(CrimeContainer, AbstractMarkerContainer);

//extend(DivvyContainer, AbstractMarkerContainer);
//extend(AbandonedVehicleContainer, AbstractMarkerContainer);
//
//extend(PotholeContainer, AbstractMarkerContainer);
//extend(CTAContainer, AbstractMarkerContainer);
//extend(LightsOutContainer, AbstractMarkerContainer);