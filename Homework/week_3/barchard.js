/***
* Name: Sanne Oud 
* Student number: 11014067
* Data processing
*
* This script makes a graph of the letter frequency in the Dutch language.
* Data is from: https://onzetaal.nl/taaladvies/letterfrequentie-in-het-nederlands
***/

/**
* Get the data for the chart via d3 in json format.
**/
function getData(){
	// get the json data via d3
	d3.json("NL.json", function(data) {
		svgChard(data);
	});
}

/**
* Draw the barchart for the Dutch letter frequency
**/
function svgChard(JSONdata){
	// set all the marges
	var width = 1000;
	var height = 350;
	var upperSpace = 100;
	var leftSpace = 100;
	
	// set the barwidth
	var barWidth = ((width - 50)/JSONdata.length)-5;
   
	// set linear scales for the axis to draw the data later on
	var x = d3.scale.linear()
			.domain([0, d3.max(JSONdata,function(NL) { return (parseInt(NL.index));})])
			.range([0, width]);
	var y = d3.scale.linear()
			.domain([-1, d3.max(JSONdata, function(NL) { return parseFloat(NL.percentage); })])
			.rangeRound([height, 0]);
	// also set a ordinal x scale for the x-axis label 
	var xOrdinal = d3.scale.ordinal()
			.domain(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j","k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"])
			.rangeBands([0, width]);
	
	// get the DOM element for the chart
	var bars = d3.select(".chard");
	
	// draw the x axis
	var xAxis = d3.svg.axis().scale(xOrdinal).orient("bottom");
	bars.append("g")
		.attr("class", "x_axis")
		.attr("transform", "translate(" + leftSpace + "," + (height+upperSpace) + ")")
		.call(xAxis);
	
	// draw the y axis
	var yAxis = d3.svg.axis().scale(y).orient("left");
	bars.append("g")
		.attr("font-size", "15px")
		.attr("class", "y_axis")
		.attr("transform", "translate(" + leftSpace + "," + upperSpace + ")")
		.call(yAxis);
	    
	// draw the graph titles
	// draw the title
	bars.append("text")
		.attr("x", width / 2)
		.attr("y", upperSpace / 2)
		.attr("text-anchor", "middle")
		.style("font-size", "25px")
		.text("The letter frequency in the Dutch language");
	// draw the x axis title
	bars.append("text")
		.attr("x", width / 2)
		.attr("y", height + upperSpace + 40)
		.attr("text-anchor", "middle")
		.style("font-size", "15px")
		.text("The letters in alphabetical order");
	// draw the y axis title and rotate it
	bars.append("text")
		.attr("x", ((height / 2) + upperSpace)*-1)
		.attr("y", leftSpace / 2)
		.attr("transform", "rotate(-90)")
		.attr("text-anchor", "middle")
		.style("font-size", "15px")
		.text("letter frequency in percentage (%)");
	
	// draw a bar for each data point
	bars.selectAll("data")
		.data(JSONdata)
		.enter()
		.append("rect")
			// draw a dark blue rect
			.attr("x", function(NL, index) { return x(index) + leftSpace; })
			.attr("y", function(NL) { return y(NL.percentage) + upperSpace; })
			.attr("height", function(NL) { return height - y(NL.percentage); })
			.attr("width", barWidth)
			.attr("fill", "#0F0F8A")
			// if you go over the rect, make it red and show the data
			.on("mouseover", function() {
				d3.select(this).attr("fill", "#8A0F0F");
				var place = d3.select(this).attr("x");
				place = "text[x='" + place + "']";
				bars.selectAll(place).attr("visibility", "visible");
				})
			// if you go off of the rect change everything back to normal
			.on("mouseout", function() {
				d3.select(this).attr("fill", "#0F0F8A");
				var place = d3.select(this).attr("x");
				place = "text[x='" + place + "']";
				bars.selectAll(place).attr("visibility", "hidden");
				});
				
	// set a invisible text div with the data for each data point
	bars.selectAll("data")
		.data(JSONdata)
		.enter()
		.append("text")
		.attr("x", function(NL, index) { return x(index) + leftSpace; })
		.attr("y", function(NL) { return y(NL.percentage) + upperSpace; })
		.attr("dx", barWidth/2)
		.attr("dy", "20")
		.style("font-size", "12px")
		.attr("text-anchor", "middle")
		.attr("fill", "white")
		.attr("visibility", "hidden")
		.text(function(NL) { return NL.percentage;});	
}
