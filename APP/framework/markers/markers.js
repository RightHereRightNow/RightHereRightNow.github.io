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
//extend(PotholeMarker, AbstractMarker);
//extend(CTAMarker, AbstractMarker);



//lightOutAllNotCompleted
//lightOutAllCompleted
//lightOut1NotCompleted
//lightOut1Completed
//Crimes