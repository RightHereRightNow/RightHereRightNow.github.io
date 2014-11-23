var level2Button = function(parentButton,i,text,iconname,onClick,s,markers,col) {

	this.parentButton = parentButton;
	this.ui = this.parentButton.ui;
	this.previousButton = null;
	this.childButtons = [];

	this.contextSwitchStr = s;
	this.textStr = text;
	this.iconStr = iconname;

	this.yStart = this.parentButton.yStart;
	this.yEnd = this.yStart + this.ui.button2height;

	this.g = null;
	this.active = false;

	this.clickCallback = onClick;

	this.colorActive = col; 
	// '#'+Math.floor(Math.random()*16777215).toString(16);
	this.colorInactive = "#aaa";

	this.markerArray = markers;

	this.index = i;

}

level2Button.prototype.create = function(svg) {

	var thisButton = this;
	var color = this.colorInactive;	

	this.g = svg.append("svg:g")
		.attr("fill",color)
		// .attr("class","level2button")
		.attr("transform","translate(0," + this.yStart + ")")
		.on("click", function() { 
			thisButton.onClick();	
		});

	this.g.append("rect")
		.attr("x",this.ui.button2dx)
		.attr("y",this.ui.button2dy)
		.attr("width",this.ui.button2width)
		.attr("height",this.ui.button2height);

	this.g.append("svg:text")
		.attr("fill",this.ui.textColor)
		.attr("class","buttontext")
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

	this.update();

}

level2Button.prototype.onClick = function() {
	console.log("CLICKED:\t" + this.textStr);
	(this.active ? this.setInactive() : this.setActive());
	this.clickCallback();
	this.ui.update();
}

level2Button.prototype.setActive = function() {
	this.active = true;
	context.setLayer(this.contextSwitchStr,this.markerArray,true);
	this.yEnd = this.yStart + this.ui.button2height;
}

level2Button.prototype.setInactive = function() {
	this.active = false;
	context.setLayer(this.contextSwitchStr,this.markerArray,false);
	this.yEnd = this.yStart + this.ui.button2height;
}

level2Button.prototype.setPreviousButton = function(prevButton) {
	this.previousButton = prevButton;
}

level2Button.prototype.update = function() {

	// TODO: add reference to parent button
	if(!this.parentButton.active) {
		// console.log(this.textStr + "Parent Button Inactive");
		this.yStart = this.parentButton.yStart;
	} else {
		// console.log("B\tLevel1Button" + this.textStr);
		this.yStart = this.parentButton.yStart + this.ui.button1dy + this.ui.button1height + this.index*(this.ui.button2height + this.ui.button2dy);
	};

	this.active = context.getMode(this.contextSwitchStr);
	
	var thisButton = this;

	var color = (this.active ? this.colorActive : this.colorInactive);
	var opac = (this.parentButton.active ? 1 : 0);

	var thisButton = this;

	this.g.transition()
		.duration(this.ui.dt)
		.attr("transform","translate(0," + this.yStart + ")")
		.attr("fill", color)
		.attr("opacity", opac);

}
