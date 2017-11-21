/***
* Name: Sanne Oud 
* Student number: 11014067
* Data processing
*
* This script continues on the test.svg script to finish it into a 
* legenda with six coloured blocks and white blocks for text behind them.
***/

/***
* Get the test svg and put it in the html.
***/
function svgLoad(){
	// put test.sgv in the body of the html
	d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;    
    document.body.appendChild(xml.documentElement);    
	// start to make the legenda
	svgLegenda();
	});	
}

/***
* Finish the test svg to be six blocks long with 
* coloured blocks and white rectangles for text.
***/
function svgLegenda(){
	// get the colours and positions
	colours = ["#ccece6","#99d8c9","#66c2a4","#41ae76","#238b45","#005824"]
	var yPosition = [13.5, 56.9, 96.8, 138.7, 178.6, 220.5]
	var xPosition = [13, 46.5]
	var widthRect = [21, 119.1]
	var heightRect = 29
	
	// make a template for the class
	textColours = "kleur"
	textText = "tekst"
	
	// make a data array for the missing blocks
	var dataArray = []

	// calculate the amount of given rects put new data in so it completes the selection
	var arrayOfRectC = d3.selectAll("rect[class=st1]");
	for (var i = arrayOfRectC[0].length; i < colours.length; i++ ){
		rectName = textColours + (i + 1);
		dataArray.push([rectName, xPosition[0], yPosition[i], widthRect[0], heightRect]);
		}
	
	// append the new rect's
	for (var i = 0; i < dataArray.length; i++){
		d3.select("svg")
		.append("rect")
			.attr("id", function() { return dataArray[i][0]; })
			.attr("x", function() { return dataArray[i][1]; })
			.attr("y", function() { return dataArray[i][2]; })
			.attr("class", "st1")
			.attr("width", function() { return dataArray[i][3]; })
			.attr("height", function() { return dataArray[i][4]; })
		}
	
	// colour all the colour rects
	d3.selectAll("rect[class=st1]").style("fill", function(d,i) { return colours[i]; })
	
	// calculate the amount of given rects put new data in so it completes the selection
	arrayOfRect = d3.selectAll("rect[class=st2]");
	var dataArray = []
	for (var i = arrayOfRect[0].length; i < colours.length; i++ ){
		rectName = textText + (i + 1);
		dataArray.push([rectName, xPosition[1], yPosition[i], widthRect[1], heightRect]);
		}
	
	// append the new rect's
	for (var i = 0; i < dataArray.length; i++){
		d3.select("svg")
		.append("rect")
			.attr("id", function() { return dataArray[i][0]; })
			.attr("x", function() { return dataArray[i][1]; })
			.attr("y", function() { return dataArray[i][2]; })
			.attr("class", "st2")
			.attr("width", function() { return dataArray[i][3]; })
			.attr("height", function() { return dataArray[i][4]; })
		}
}