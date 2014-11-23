function Twitter() {
    this.svg = d3.select('#graphTwitter');
    this.flag = 0; //all clean
}

Twitter.prototype.showTweets = function(tweets){
    //var svg = d3.select('#graphTwitter');

    this.svg
        .append("text")
        .text("Current Temperature:")
        .attr("transform", "translate(" + (100/2) + " , " + 2*100 + " )")
        .attr("class", "curr-temp")
        .attr("fill", "white")
        .attr("font-size", "200%");

    this.flag = 1;
};

Twitter.prototype.deleteText = function(){
    this.svg.select('.curr-temp').exit();
    this.flag = 0;
};