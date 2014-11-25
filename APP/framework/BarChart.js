/*
	BarChart:-
	X Axis : Ordinal scale on the values present in the json property(of the data), specified against x axis
	Y Axis : Linear scale on the values present in the json property(of the data), specified against y axis
*/
function BarChart (svg){
	this.svg = svg;
	this.chartName = null;
	this.chartName2 = null;
	this.newName = null;
	this.newName2 = null;
	this.title = null;
	this.color = null;
	this.border = {
		left: 25, 
		right: 155, 
		top: 10, 
		bottom: 70 
	};
	this.svg.attr("viewBox","0 0 160 90");
	var width = parseFloat(svg.style("width")) ;
	var height = parseFloat(svg.style("height")) ;
	this.svg.append("rect")
		.attr("x", 0)
	    .attr("y", 0)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "rgba(68,68,68,0.9)");
	
}

BarChart.prototype.setColor = function(colorLst){
	this.color = colorLst;
}


BarChart.prototype.setTitle = function(title){
	this.title = title;
}

BarChart.prototype.setData = function(json, json2, className, nameLst, legendLabel) {
	this.data = json;
	this.data2 = json2;

	if(this.chartName!== null){ 
		this.newName = className;
		this.newName2 = className + "small";
	}
	else{
		this.chartName = className;
		this.chartName2 = className + "small";
		this.newName =className;
		this.newName2 = className + "small";
	}
	this.legendNames = nameLst;
	this.legendLabel = legendLabel;
}

BarChart.prototype.setAxes = function(propertyX, labelX, propertyY, labelY){
	this.axisX = propertyX;
	this.axisY = propertyY;
	this.labelX = labelX;
	this.labelY = labelY;
	this.xScale = d3.scale.ordinal()
		.domain(this.data.map(function(d,i){ return d[propertyX];}))
		.rangeRoundBands([this.border.left, this.border.right], 0.4, 0.6);
	this.yScale = d3.scale.linear()
		.domain([0, d3.max(this.data, function(d){return +d[propertyY];})])
		.range([this.border.bottom, this.border.top]);
	this.xAxis = d3.svg.axis()
    	.scale(this.xScale)
      	.orient("bottom");
    this.yAxis = d3.svg.axis()
    	.scale(this.yScale)
    	.ticks(5)
      	.orient("left");

}

BarChart.prototype.draw = function(){
	
	var _this = this;
	this.removeLegend();
	bars = this.svg.selectAll("." + this.chartName)
		.data(this.data);

	bars.attr("class",this.newName)
		.attr("x", function(d,i){
			return _this.xScale(d[_this.axisX]);
		})
		.attr("y", function(d,i){
			return _this.yScale(d[_this.axisY]);
		})
		.attr("width", _this.xScale.rangeBand())
		.style("fill", _this.color[1])
		.attr("height", function(d){
			return _this.border.bottom - _this.yScale(d[_this.axisY]);
		});


	bars.enter().append("rect")
		.attr("class",this.newName)
		.attr("x", function(d,i){
			return _this.xScale(d[_this.axisX]);
		})
		.attr("y", function(d,i){
			return _this.yScale(d[_this.axisY]);
		})
		.attr("width", _this.xScale.rangeBand())
		.style("fill", _this.color[1])
		.attr("height", function(d){
			return _this.border.bottom - _this.yScale(d[_this.axisY]);
		})
	bars.exit().remove();

	bars2 = this.svg.selectAll("." + this.chartName2)
		.data(this.data2);

	bars2.attr("class",this.newName2)
		.attr("x", function(d,i){
			return _this.xScale(d[_this.axisX]);
		})
		.attr("y", function(d,i){
			return _this.yScale(d[_this.axisY]);
		})
		.attr("width", _this.xScale.rangeBand())
		.style("fill", _this.color[0])
		.attr("height", function(d){
			return _this.border.bottom - _this.yScale(d[_this.axisY]);
		});


	bars2.enter().append("rect")
		.attr("class",this.newName2)
		.attr("x", function(d,i){
			return _this.xScale(d[_this.axisX]);
		})
		.attr("y", function(d,i){
			return _this.yScale(d[_this.axisY]);
		})
		.attr("width", _this.xScale.rangeBand())
		.style("fill", _this.color[0])
		.attr("height", function(d){
			return _this.border.bottom - _this.yScale(d[_this.axisY]);
		})
	bars2.exit().remove();

	this.svg.selectAll(".axis").remove();

	// create X axis
	var xaxis = this.svg.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + 0 +","+ (this.border.bottom) + ")")
	    .call(this.xAxis);
	if (this.data.length > 4){
		xaxis.selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-15)" 
        });
	}
	
	xaxis.append("text")
    	.attr("x", this.border.right-5 )
    	.attr("y", -this.border.top/2.0)
    	.style("text-anchor", "middle")
	    	.text(this.labelX);
	this.svg.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + (this.border.left) +","+ 0+ ")")
	    .call(this.yAxis)
	    .append("text")
	    	.attr("x", -this.border.top)
	    	.attr("y", 8)
	    	.attr("transform", "rotate(-90)")
	    	.style("text-anchor", "end")
	    	.text(this.labelY);
	/*Set title for graph */
	if(this.title!== null){
		this.svg.selectAll(".title").remove();
		this.svg.append("text")
			.attr("class", "title")
			.attr("transform", "translate(" + ((_this.border.right + _this.border.left)*0.5) + "," + (_this.border.top) + ")")
		    .style("text-anchor","middle")
		    .text(_this.title);
	}

	this.addLegend();
	if (this.newName!==null){
		this.chartName = this.newName; 
		this.chartName2 = this.newName2; 

	}
}

BarChart.prototype.addLegend  =  function(){
	var _this = this;
	
	
	var legendSize = (this.border.bottom - this.border.top)/8.0;
	//svgHandle.selectAll(".legend").remove();
	legend = this.svg.selectAll(".legend")
  		.data(this.legendNames);

  	
  	legendGrp = legend.enter().append("g")
  		.attr("class", "legend")
  		.attr("transform", function(d, i) { 
      		return "translate(" + (_this.border.right*0.85) + "," + (_this.border.top + i*legendSize) + ")"; 
    	});

	legendGrp.append("rect")
		.attr("x", 5)
	    .attr("width", legendSize)
	    .attr("height", legendSize)
	    .attr("y", legendSize)
	    //.style("stroke", "black")
	    .style("fill", function(d,i){
	    	return _this.color[i]; 
	    });

	legendGrp.append("text")
	    .attr("y", legendSize*2)
	    .attr("dy", "-.25em")
	    .style("text-anchor","end")
	    .text(function(d){return d;});

	this.svg.select("#legendLabel").remove();
	this.svg.append("text")
		.attr("id", "legendLabel")
		.attr("transform", "translate(" + (_this.border.right*0.85) + "," + (_this.border.top) + ")")
		.attr("x", 5+legendSize)
		.attr("y", legendSize-2)
	    .style("text-anchor","end")
	    .text(_this.legendLabel);

}

BarChart.prototype.removeLegend = function(){
	this.svg.select("#legendLabel").remove();
	this.svg.selectAll(".legend").remove();
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};