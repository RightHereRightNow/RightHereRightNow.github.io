function Twitter() {
    this.svg = d3.select('#graphTwitter');
    this.flag = 0; //all clean
}

Twitter.prototype.showTweets = function(tweets){
    //var svg = d3.select('#graphTwitter');

    this.svg
        .append("text")
        .text(""+tweets.text)
        .attr("transform", "translate(" + (100/2) + " , " + 2*100 + " )")
        .attr("class", "tweet-text")
        .attr("fill", "white")
        .attr("font-size", "100%");

    this.flag = 1;
};

Twitter.prototype.deleteText = function(){
    this.svg.select('.tweet-text').remove();
    this.flag = 0;
};