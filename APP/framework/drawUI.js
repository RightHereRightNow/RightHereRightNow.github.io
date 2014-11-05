function drawUI() {

	console.log('Draw UI');


	// MENU
	
	var svgmenu = d3.select("#ui").append("svg:svg")
		.attr("id","menu")
		.attr("viewBox", "0 0 " + 1000 + " " + 1000)
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("width",1000).attr("height",1000)
		.append("svg:g")
		// .attr("transform","translate(" + 50 + "," + 50 + ")")


	/*
	svgmap.append("svg:svg")
		.attr("fill","yellow")
		*/

	svgmenu.append("rect")
		.attr("class","level1button")
		.attr("x",50).attr("y",50)
		.attr("width",900).attr("height",200)
		.on("click", function() { console.log('Clicked'); });

/*		.attr("x",10)
		.attr("y",20)
		.attr("width",100)
		.attr("height",200)
		*/










	// MAPCONTROL
/*	
	var svgmenu = d3.select("#ui").append("svg:svg")
		.attr("id","mapcontrol")
		.attr("viewBox", "0 0 " + 200 + " " + 1000)
		.attr("preserveAspectRatio", "xMinYMin meet")
		.attr("width",1000).attr("height",200)
		// .append("svg:g")

	svgmenu.append("rect")
		.attr("fill","#3db7e4")
		.attr("x",50).attr("y",50)
		.attr("width",400).attr("height",200)

	svgmenu.append("rect")
		.attr("fill","#3db7e4")
		.attr("x",550).attr("y",50)
		.attr("width",400).attr("height",200)
*/


}
