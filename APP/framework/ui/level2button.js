var level2Button = function(parentButton,text,ystart,yend,iconname,onClick,s,markers) {

	this.parentButton = parentButton;
	this.previousButton = null;
	this.childButtons = [];

	parentButton.addChildButton(this);

	this.contextSwitchStr = s;
	this.textStr = text;
	this.iconStr = iconname;

	// Dynamic Menu Parameters
	/*const*/ this.yStartInitial = this.parentButton.yStart + ystart;
	this.yStart = this.yStartInitial;
	/*const*/ this.yEndInitial = this.parentButton.yStart + yend;
	this.yEnd = this.yEndInitial;
	
	this.ui = this.parentButton.ui;

	this.g;
	this.active = context.getMode(this.contextSwitchStr);

	this.clickCallback = onClick;

	this.colorActive = "#ccc";
	this.colorInactive = "#888";

	this.markerArray = markers;

}

level2Button.prototype.create = function(svg) {
	console.log("drawing button");

	var thisButton = this;

	var color = (this.active ? this.colorActive : this.colorInactive);	

	this.g = svg.append("svg:g")
		.attr("fill",color)
		.attr("class","level2button")
		.attr("transform","translate(0," + this.yStart + ")")
		.on("click", function() { 
			thisButton.onClick();	
		});

	this.g.append("rect")
		.attr("x",this.ui.button2dx).attr("y",this.ui.button2dy)
		.attr("width",this.ui.button2width).attr("height",this.ui.button2height);

	this.g.append("svg:text")
		.attr("fill",this.ui.textColor)
		// .attr("class","buttontext")
		.attr("transform","translate(" + (this.ui.button2dx+this.ui.textpadding) + "," + (this.ui.font2size+this.ui.button2dy+(this.ui.button2height-this.ui.font2size)/2) + ")")
		.text(this.textStr)
		.attr("text-anchor","bottom")
		.attr("font-size", this.ui.font2size)
		.attr("font-variant", "small-caps")
		.attr("font-family", "Roboto")
		.attr("cursor","default");

	this.g.append("svg:image")
		.attr("xlink:href", "img/" + this.iconStr + ".svg")
		.attr("x",this.ui.button2dx+.1*this.ui.button2height)
		.attr("y",this.ui.button2dy+.1*this.ui.button2height)
		.attr("width", .8*this.ui.button2height)
		.attr("height", .8*this.ui.button2height)

}

level2Button.prototype.onClick = function() {
	console.log("CLICKED:\t" + this.textStr);
	this.active = !this.active;

	context.setLayer(this.contextSwitchStr,this.markerArray,this.active);

	if(this.active) {
		this.yEnd = this.yStart + this.ui.button2height + this.childButtons.length;
	} else {
		this.yEnd = this.yStart + this.ui.button2height;
	}
	
	// this.clickCallback();
	
	this.ui.update();

}

level2Button.prototype.setPreviousButton = function(prevButton) {
	this.previousButton = prevButton;
}

level2Button.prototype.addChildButton = function(childButton) {
	this.childButtons.push(childButton);
}

level2Button.prototype.update = function() {

	if(this.previousButton === null) {
		this.yStart = 0;
	} else {
		this.yStart = this.previousButton.yEndInitial + this.ui.button1dy + this.ui.button1height + this.ui.button2dy;
	};

	var thisButton = this;

	var color = (this.active ? this.colorActive : this.colorInactive);
	var opac = 1; // (this.active ? 1 : .4);

	console.log("PREVBUTTON = " + this.previousButton.textStr);
	console.log("YSTART = " + this.yStart);

	var thisButton = this;


	// TODO: there is a problem with this.g
	this.g.transition()
		.duration(this.ui.dt)
		.attr("transform","translate(0," + this.yStart + ")")
		.attr("fill", "blue")
		.attr("opacity", opac);
/*
	this.g.transition()
		.duration(this.ui.dt)
		.attr("transform","translate(0," + this.yStart + ")")
		.attr("fill", "blue")
		.attr("opacity", opac)
		.each("end",function(){
			// d3.select(this).attr("fill","green");
			console.log("Transition Complete");
		});
		// .attr("display","none");
*/	
}
