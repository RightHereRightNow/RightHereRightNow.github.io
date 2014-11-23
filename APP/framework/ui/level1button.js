var level1Button = function(parentUI,text,iconname,onClick,s,markers) {

	this.ui = parentUI;
	this.previousButton = null;
	this.childButtons = [];

	this.contextModeStr = s;
	this.textStr = text;
	this.iconStr = iconname;

	this.yStart = 0;
	this.yEnd = 0;

	this.g = null;
	this.active = false;

	this.clickCallback = onClick;
	this.markerArray = markers;

	this.colorActive = "#ccc";
	this.colorInactive = "#888";

}

level1Button.prototype.create = function(svg) {

	// First draw Children - will be in background
	for (c in this.childButtons) {
		this.childButtons[c].create(svg);
	}
	
	var thisButton = this;
	var color = this.colorInactive;

	this.g = svg.append("svg:g")
		.attr("fill",color)
		.attr("class","level1button")
		.attr("transform","translate(0," + this.yStart + ")")
		.on("click", function() { 
			thisButton.onClick();	
		});

	this.g.append("rect")
		.attr("x",this.ui.button1dx)
		.attr("y",this.ui.button1dy)
		.attr("width",this.ui.button1width)
		.attr("height",this.ui.button1height);

	this.g.append("svg:text")
		.attr("fill",this.ui.textColor)
		.attr("class","buttontext")
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

	this.update();

}

level1Button.prototype.onClick = function() {
	console.log("CLICKED:\t" + this.textStr);
	(this.active ? this.setInactive() : this.setActive());
	this.clickCallback();
	this.ui.update();
}

level1Button.prototype.setActive = function() {
	this.active = true;
	context.setLayer(this.contextModeStr,this.markerArray,true);
	this.yEnd = this.yStart + this.ui.button1height + this.childButtons.length*(this.ui.button2height+this.ui.button2dy);

	for (c in this.childButtons) {
		this.childButtons[c].yStart = this.ui.button1height + this.ui.button1dy + c*(this.ui.button2height + this.ui.button2dy);
	}

}

level1Button.prototype.setInactive = function() {
	this.active = false;
	context.setLayer(this.contextModeStr,this.markerArray,false);
	this.yEnd = this.yStart + this.ui.button1height;
}

level1Button.prototype.setPreviousButton = function(prevButton) {
	this.previousButton = prevButton;
	if(this.previousButton !== null) {
		this.yStart = this.previousButton.yEnd + this.ui.button1dy;
	} else {
		this.yStart = 0;
	}
	this.yEnd = this.yStart + this.ui.button1height;
}

level1Button.prototype.update = function() {

	if(this.previousButton === null) {
		this.yStart = 0;
	} else {
		this.yStart = this.previousButton.yEnd + this.ui.button1dy;
	};

	this.active = context.getMode(this.contextModeStr);
	if(!this.active) {
		this.yEnd = this.yStart + this.ui.button1height;
	}

	var thisButton = this;

	var color = (this.active ? this.colorActive : this.colorInactive);
	var opac = 1; // (this.active ? 1 : .4);
	
	// console.log("ySTART = " + this.yStart + "\tName = " + this.textStr);

	this.g.transition()
		.duration(this.ui.dt)
		.attr("transform","translate(0," + this.yStart + ")")
		.attr("fill", color)
		.attr("opacity", opac);

	for(c in this.childButtons) {
		this.childButtons[c].update();
	}
	
}

level1Button.prototype.addChildButton = function(text,iconname,onClick,s,markers,col) {
	var index = this.childButtons.length;
	var c = new level2Button(this,index,text,iconname,onClick,s,markers,col);
	this.childButtons.push(c);
	c.setPreviousButton(this.childButtons[this.childButtons.length-2]);
}
