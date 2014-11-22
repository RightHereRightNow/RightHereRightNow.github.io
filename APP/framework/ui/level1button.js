var level1Button = function(parentUI,text,ystart,yend,iconname,onClick,s,markers) {

	this.ui = parentUI;

	this.contextSwitchStr = s;
	this.textStr = text;
	this.iconStr = iconname;

	// Dynamic Menu Parameters
	/*const*/ this.yStartInitial = ystart;
	this.yStart = ystart;
	/*const*/ this.yEndInitial = yend;
	this.yEnd = yend;

	this.parentButton = 0;
	this.previousButton = null;
	this.childButtons = [];

	this.g;
	this.active = context.getMode(this.contextSwitchStr);

	this.clickCallback = onClick;

	this.colorActive = "#ccc";
	this.colorInactive = "#888";

	this.markerArray = markers;

}

level1Button.prototype.create = function(svg) {
	console.log("drawing button");

	var thisButton = this;

	var color = (this.active ? this.colorActive : this.colorInactive);	

	this.g = svg.append("svg:g")
		.attr("fill",color)
		.attr("class","level1button")
		.attr("transform","translate(0," + this.yStart + ")")
		.on("click", function() { 
			thisButton.onClick();	
		});

	this.g.append("rect")
		.attr("x",this.ui.button1dx).attr("y",this.ui.button1dy)
		.attr("width",this.ui.button1width).attr("height",this.ui.button1height);

	this.g.append("svg:text")
		.attr("fill",this.ui.textColor)
		// .attr("class","buttontext")
		.attr("transform","translate(" + (this.ui.button1dx+this.ui.textpadding) + "," + (this.ui.font1size+this.ui.button1dy+(this.ui.button1height-this.ui.font1size)/2) + ")")
		.text(this.textStr)
		.attr("text-anchor","bottom")
		.attr("font-size", this.ui.font1size)
		.attr("font-variant", "small-caps")
		.attr("font-family", "Roboto")
		.attr("cursor","default");

	this.g.append("svg:image")
		.attr("xlink:href", "img/" + this.iconStr + ".svg")
		.attr("x",this.ui.button1dx+.1*this.ui.button1height)
		.attr("y",this.ui.button1dy+.1*this.ui.button1height)
		.attr("width", .8*this.ui.button1height)
		.attr("height", .8*this.ui.button1height)

}

level1Button.prototype.onClick = function() {
	console.log("CLICKED:\t" + this.textStr);
	(this.active ? this.setInactive() : this.setActive());
	// this.clickCallback();
	this.ui.update();
}

level1Button.prototype.setActive = function() {
	this.active = true;
	context.setLayer(this.contextSwitchStr,this.markerArray,this.active);
	this.yEnd = this.yStart + this.ui.button1height + this.childButtons.length*(this.ui.button2height+this.ui.button2dy);
	var prev = this;
	for (c in this.childButtons) {
		this.childButtons[c].previousButton = prev;
		prev = this.childButtons[c];
	}
	for (b in this.ui.buttonOneList) {
		var button = this.ui.buttonOneList[b];
		if(button != this) {
			this.ui.buttonOneList[b].setInactive();
		}
	}
}

level1Button.prototype.setInactive = function() {
	this.active = false;
	context.setLayer(this.contextSwitchStr,this.markerArray,this.active);
	this.yEnd = this.yStart + this.ui.button1height;
	for (c in this.childButtons) {
		this.childButtons[c].previousButton = this.previousButton;
	}
}

level1Button.prototype.setPreviousButton = function(prevButton) {
	this.previousButton = prevButton;
}

level1Button.prototype.addChildButton = function(childButton) {
	this.childButtons.push(childButton);
}

level1Button.prototype.update = function() {

	if(this.previousButton === null) {
		this.yStart = 0;
	} else {
		this.yStart = this.previousButton.yEnd + this.ui.button1dy;
	};

	var thisButton = this;

	var color = (this.active ? this.colorActive : this.colorInactive);
	var opac = 1; // (this.active ? 1 : .4);
	
	this.g.transition()
		.duration(this.ui.dt)
		.attr("transform","translate(0," + this.yStart + ")")
		.attr("fill", color)
		.attr("opacity", opac);
	
}
