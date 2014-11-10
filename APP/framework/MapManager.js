/**
 * Created by krbalmryde on 11/9/14.
 */
function MapManager() {

    this.map = new L.Map("divmap", {zoomControl: false} );


    var MapID = {
        "street": "krbalmryde.jk1dm68f",
        "aerial": "krbalmryde.jko2k1c4"
    };

    var mapboxURL = 'http://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png'
    var mapboxAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>'

    // var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    // var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';

    // Create our street and aerial view base layers
    // Keeping these as public parameters so we can turn them on and off at will;
    this.streetBaseLayer = L.tileLayer(mapboxURL, {id: MapID.street, attribution: mapboxAttribution});
    this.aerialBaseLayer = L.tileLayer(mapboxURL, {id: MapID.aerial, attribution: mapboxAttribution});


    /*
        FeatureGroup is an extended LayerGroup, which acts as a container for holding collections of layers,
         such as markers. FeatureGroups have a few more methods which are useful.

         Methods of interest:
            bringToFront() -- Brings the layer group to the top of all other layers
            bringToBack() -- Brings layer group to the bottom of all layers
            eachLayer( fn{..} ) -- Iterates over the layers of the group
            *addLayer( layer ) -- Adds the given layer to the Group
            *removeLayer( layer ) -- Removes the given layer from the Group

            *: Adding or removing a layer form the group ALSO adds/removes layer from the map as well
     */
    this.layerGroups = {
        potholes: {},
        crime: {},
        divvy: {},
        abandonedVehicles: {},
        placesOfInterest: {}
    };
}

/*
     Adds a new layer group to the layersGroup object. A LayerGroup is a collection of layers
     usage:
        map.addLayers("murders", [<array of Marker objects>]

     This would create a new group of layers containing markers of murders, for example
 */

MapManager.prototype.init = function(mapCenter, zoom){

    this.map.setView(mapCenter, zoom);

    this.map.addLayer(this.streetBaseLayer);
    this.map.addLayer(this.aerialBaseLayer);
    this.viewStreet();
};

MapManager.prototype.addLayers = function(layerGroupName, arrayOfLayers) {

    var layers = arrayOfLayers.map(function(layer) {
        if (layer instanceof AbstractMarker)
            return layer.getMarker();
        else
            return layer;
    } );

    //L.layerGroup(layers).addTo(this.map);
    this.layerGroups[layerGroupName] = L.layerGroup(layers);
    this.layerGroups[layerGroupName].addTo(this.map);
};

// This appends a single layer to an existing layer group.
MapManager.prototype.appendLayer = function(layerGroupName, singleLayer) {
    var layer;
    if (singleLayer instanceof AbstractMarker)
        layer = singleLayer.getMarker();
    else
        layer = singleLayer;

    this.layerGroups[layerGroupName].addLayer(layer);
};


// This wipes out all individual layers in a layer group. For example, if you wanted to clear all markers from
// the map (in order to add new ones, in a different region on the map) you would call this method in the following
// way:
//      map.clearLayers("divvy")
// This would effectively remove all divvy markers from the map
MapManager.prototype.clearLayers = function(layerGroupName) {
    var layerGroup = this.layerGroups[layerGroupName];

    layerGroup.eachLayer(function(layer){
        layerGroup.removeLayer(layer)
    })
};


MapManager.prototype.on = function(eventType, callBack) {
    this.map.on(eventType, callBack);
};


MapManager.prototype.addLayer = function(singleLayer) {
    var layer;
    if (singleLayer instanceof AbstractMarker)
        layer = singleLayer.getMarker();
    else
        layer = singleLayer;
    this.map.addLayer(layer);
};

MapManager.prototype.removeLayer = function(singleLayer) {
    var layer;
    if (singleLayer instanceof AbstractMarker)
        layer = singleLayer.getMarker();
    else
        layer = singleLayer;
    this.map.removeLayer(layer);
};

MapManager.prototype.fitBounds = function(bounds){
    this.map.fitBounds(bounds);
};

MapManager.prototype.viewAerial = function(){
    this.map.removeLayer(this.streetBaseLayer);
    this.map.addLayer(this.aerialBaseLayer);
};

MapManager.prototype.viewStreet = function(){
    this.map.removeLayer(this.aerialBaseLayer);
    this.map.addLayer(this.streetBaseLayer);
};

MapManager.prototype.bringToBack = function(layerGroupName){
    this.map.layerGroups[layerGroupName].bringToBack();
};

MapManager.prototype.bringToFront = function(layerGroupName){
    this.map.layerGroups[layerGroupName].bringToFront();
};

MapManager.prototype.zoomIn = function(factor){
    this.map.zoomIn(factor);
};

MapManager.prototype.zoomOut = function(factor){
    this.map.zoomOut(factor);
};
