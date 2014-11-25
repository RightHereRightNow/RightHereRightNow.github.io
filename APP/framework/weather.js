function Weather(location){
    this.location = location;
}

Weather.prototype.create = function (dimx, dimy,opacity,weatherData){
    //console.log(weatherData.current_observation.dewpoint_string);
    //console.log(weatherData.current_observation);
    var h = 100;
    var w = 200;
    
    var svg = d3.select(this.location)
                .style("display", "block")
                .append("svg:svg")
                .attr("id", "menu")
                .attr("viewBox", "0 0 " + w + " " + h)
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("width", dimx)
                .attr("height", dimy)
                .attr("fill", "rgba(68,68,68,"+opacity+")");
                //.attr("fill-opacity", opacity);
    var width = parseFloat(svg.style("width")) ;
    var height = parseFloat(svg.style("height")) ;
    var step = h / 4.0;
    svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "rgba(68,68,68,0.9)");
     
    svg.append("svg:image")
        .attr("xlink:href", weatherData.current_observation.icon_url)
        .attr("x",w*0.75)
        .attr("y",0)
        .attr("width", 50)
        .attr("height", 50);

    svg
        .append("text")
        .text("Current Temperature:"+weatherData.current_observation.dewpoint_string)
        .attr("transform", "translate(" + 10 + " , " + 2*step + " )")
        .attr("class", "curr-temp")
        .attr("fill", "white")
        .attr("font-size", "0.8em");

    svg
        .append("text")
        .text("Feels Like:"+weatherData.current_observation.feelslike_string)
        .attr("transform", "translate(" + 10 + " , " + (3*step) + " )")
        .attr("class", "curr-feelslike")
        .attr("fill", "white")
        .attr("font-size", "0.8em");

};

Weather.prototype.clear = function(){
    d3.select(this.location).selectAll('*').remove();
    d3.select("#weather").style("display", "none");
}
