function Weather(location){
    this.location = location;
}

Weather.prototype.create = function (dimx, dimy,opacity,weatherData){
    //console.log(weatherData.current_observation.dewpoint_string);
    //console.log(weatherData.current_observation);
    var h = 400;
    var w = 400;
    var step = 70;
    var svg = d3.select(this.location)
                .append("svg:svg")
                .attr("id", "menu")
                .attr("viewBox", "0 0 " + w + " " + h)
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("width", dimx)
                .attr("height", dimy)
                .attr("fill", "rgba(68,68,68,"+opacity+")");
                //.attr("fill-opacity", opacity);

    d3.select("#weather").
        style("opacity","0.7").
        style("background","black");

    svg.append("svg:image")
        .attr("xlink:href", weatherData.current_observation.icon_url)
        .attr("x",w/2)
        .attr("y",0)
        .attr("width", 100)
        .attr("height", 100);

    svg
        .append("text")
        .text("Current Temperature:"+weatherData.current_observation.dewpoint_string)
        .attr("transform", "translate(" + (h/2) + " , " + 2*step + " )")
        .attr("class", "curr-temp")
        .attr("fill", "white")
        .attr("font-size", "200%");

    svg
        .append("text")
        .text("Feels Like:"+weatherData.current_observation.feelslike_string)
        .attr("transform", "translate(" + (h/2) + " , " + (3.5*step) + " )")
        .attr("class", "curr-feelslike")
        .attr("fill", "white")
        .attr("font-size", "200%");








};

Weather.prototype.clear = function(){
    d3.select(this.location).selectAll('*').remove();
    d3.select("#weather").
        style("opacity","0.0");
        //style("background","black");

}
