var redMarker = L.AwesomeMarkers.icon({
    icon: "bicycle",
    prefix: "fa",
    spin:true,
    markerColor: "red",
    iconColor: "white"
});

var lightred = L.AwesomeMarkers.icon({
    icon: "bicycle",
    prefix: "fa",
    spin:true,
    markerColor: "lightred",
    iconColor: "white"
});

var orangeMarker = L.AwesomeMarkers.icon({
    icon: "bicycle",
    prefix: "fa",
    spin:true,
    markerColor: "orange",
    iconColor: "white"
});

var pinkMarker = L.AwesomeMarkers.icon({
    icon: "bicycle",
    prefix: "fa",
    spin:true,
    markerColor: "pink",
    iconColor: "white"
});

var purpleMarker = L.AwesomeMarkers.icon({
    icon: "bicycle",
    prefix: "fa",
    spin:true,
    markerColor: "purple",
    iconColor: "white"
});

var greenMarker = L.AwesomeMarkers.icon({
    icon: "bicycle",
    prefix: "fa",
    spin:true,
    markerColor: "green",
    iconColor: "white"
});
var lightgreenMarker = L.AwesomeMarkers.icon({
    icon: "bicycle",
    prefix: "fa",
    spin:true,
    markerColor: "lightgreen",
    iconColor: "white"
});

var blueMarker = L.AwesomeMarkers.icon({
    icon: "bicycle",
    prefix: "fa",
    spin:true,
    markerColor: "blue",
    iconColor: "white"
});

var lightblueMarker = L.AwesomeMarkers.icon({
    icon: "bicycle",
    prefix: "fa",
    spin:true,
    markerColor: "lightblue",
    iconColor: "white"
});

var cadetblueMarker = L.AwesomeMarkers.icon({
    icon: "bicycle",
    prefix: "fa",
    spin:true,
    markerColor: "pink",
    iconColor: "white"
});

// Make a new EVL Icon of Andy's head... this code will assist in the
var evlMarker = L.icon({
    iconUrl: 'Johnson-Brown2.png',
    iconSize: [39.0109,50],
    iconAnchor: [22, 50],
    popupAnchor: [-3, -76],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/images/marker-shadow.png",
    shadowSize: [68, 95],
    shadowAnchor: [22, 95]
});


var markers10 = d3.scale.ordinal()
    .range([redMarker,
        lightred,
        orangeMarker,
        pinkMarker,
        purpleMarker,
        greenMarker,
        lightgreenMarker,
        blueMarker,
        lightblueMarker,
        cadetblueMarker]);