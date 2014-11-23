function Twitter() {
    this.svg = d3.select('#twitterBox');
    this.flag = 0; //all clean
}

Twitter.prototype.showTweets = function(tweets){
    //var svg = d3.select('#graphTwitter');

    this.svg.append("svg:image")
        .attr("xlink:href","./img/twitter.svg")
        .attr("x",5)
        .attr("y",0)
        .attr("width", 100)
        .attr("height", 100)
        .attr("class", "pidgeon")
        .attr("opacity", 0.5);

    this.svg
        .append("text")
        .text(""+tweets.user.screen_name)
        .attr("transform", "translate(" + (45) + " , " + 5 + " )")
        .attr("dx", 1)
        .attr("dy", 1)
        .attr("class", "tweet-user")
        .attr("fill", "white")
        .attr("font-size", "0.4em");

    this.svg
        .append("text")
        .text(""+tweets.user.created_at)
        .attr("transform", "translate(" + (10) + " , " + 15 + " )")
        .attr("dx", 1)
        .attr("dy", 1)
        .attr("class", "tweet-date")
        .attr("fill", "white")
        .attr("font-size", "0.4em");

    this.svg
        .append("text")
        .text(""+tweets.text)
        .attr("transform", "translate(" + (1) + " , " + 20 + " )")
        .attr("dx", 1)
        .attr("dy", 1)
        .attr("class", "tweet-text")
        .attr("fill", "white")
        .attr("font-size", "0.4em");

    this.svg.select(".tweet-text").call(wrap,150);
    this.flag = 1;
};

Twitter.prototype.deleteText = function(){
    this.svg.select('.tweet-text').remove();
    this.svg.select('.tweet-user').remove();
    this.svg.select('.tweet-date').remove();
    this.svg.select('.pidgeon').remove();
    this.flag = 0;
};

function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}