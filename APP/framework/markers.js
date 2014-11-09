// Markers 


var greenIcon = L.icon({
    iconUrl: 'img/bike15.svg',

    iconSize:     [100, 100], // size of the icon
    shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});




// Constructor for abstract marker
function abstractMarker() {
	var o = {
		lat: 0,
		lon: 0,
		dist: function(posLat,posLon){
			// Returns distance between marker position (lat,lon)
			// and input position (posLat,posLon)
			if (posLon === undefined) posLon = 0;
			if (posLat === undefined) posLat = 0;
			var dLat = posLat - this.lat;
			var dLon = posLon - this.lon;
			return Math.sqrt(dLon*dLon + dLat*dLat);
		},
		draw: function(c) {
			// Draws Marker to map
			L.marker([this.lat,this.lon], {icon: greenIcon}).addTo(c.map);

		}
	};

	return o;

}
