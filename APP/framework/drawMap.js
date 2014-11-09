drawMap =  function() {
	/**
	 * Created by krbalmryde on 11/2/14.
	 */
	// Necessary stuff...
	var MapID = {
		"street": "krbalmryde.jk1dm68f",
		"aerial": "krbalmryde.jko2k1c4"
	};

	var mapboxURL = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
	var mapboxAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'


	// Our focus points
	var LatLon = {
		"EVL": [41.869912359714654, -87.64772415161133],  // The Electronic Visualization Lab
		"Field": [41.86624, -87.61702],  // The Field Natural History Museum
		"Shedd": [41.86761, -87.61365],  // The Shedd Aquarium
		"Alder": [41.86635, -87.60659],  // The Alder Planetarium
		"Focus": [41.864755, -87.631474]  // This is between EVL and Soldiers Field
	};

	// Create our street and aerial view base layers
	var streetLayer = L.tileLayer(mapboxURL, {id: MapID.street, attribution: mapboxAttribution});
	var aerialLayer = L.tileLayer(mapboxURL, {id: MapID.aerial, attribution: mapboxAttribution});

	// an empty popup object
	var popup = L.popup();

	var placesOfInterest = L.layerGroup([
		L.marker(LatLon.EVL).bindPopup("Electronic Visualization Lab"),
		L.marker(LatLon.Field).bindPopup("The Field Museum of Natural History"),
		L.marker(LatLon.Shedd).bindPopup("The Shedd Aquarium"),
		L.marker(LatLon.Alder).bindPopup("The Alder Planetarium")
	]);


	var baseMaps = {
		"Aerial": aerialLayer,
		"Street": streetLayer
	};

	var overlayMaps = {
		"Places of Interest": placesOfInterest
	};

	function onMapClick(e) {
		popup
			.setLatLng(e.latlng)
			.setContent("You have clicked the map at " + e.latlng.toString())
			.openOn(divmap);
	}



	this.map = L.map('divmap', {
		center: LatLon.Focus,  // Pretty sure these two calls are
		zoom: 16,        // the same as .setView(latlon 13)
		layers: [streetLayer, placesOfInterest],
		zoomControl:false
	});


	this.map.on('click', onMapClick);

	L.control.layers(baseMaps, overlayMaps).addTo(this.map);  // This is the feature which controls the map layers,
															  // remove this and we shouldnt have to see that icon anymore

}
