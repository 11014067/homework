/***
* Name: Sanne Oud 
* Student number: 11014067
* Data processing
*
* This script makes a scatterplot of different factors involved in the 
* "Happy Planet Index".
* Data is from: "http://happyplanetindex.org/"
***/

/**
* Load the data.
**/
function loadData(yName, xName){
	// remove the svg if already there
	d3.select("svg").remove();

	// get the data and if posible get the integer
	d3.csv("HPIdata.csv", function(error, data){ 
		if (error) throw error;
		data.forEach(function(d) {
			d.HPIRank = +d.HPIRank;
			d["Life expectancy"] = +d["Life expectancy"];
			d.Wellbeing = +d.Wellbeing;
			d.Inequality = +d.Inequality;
			d["Ecological footprint"] = +d["Ecological footprint"];
			d.HPI = +d.HPI;
			});
			
		// draw the plot
		drawChart(data, yName, xName);
		});
}

/**
* If this function is called, drop down the dropdown menu.
**/
function showOptions() {
    document.getElementById("dropdown").style.display='block';
}

/**
* If this function is called, hide the dropdown menu.
**/
function hideOptions() {
	document.getElementById("dropdown").style.display='none';
}

/**
* Draw a scatterplot.
**/
function drawChart(data, yName, xName){
	// write the title
	var yTitle = yName.toLowerCase();
	var xTitle = xName.toLowerCase();
	d3.select(".title").text("The " + yTitle + " against the " + xTitle + 
		" coloured by region");
	
	// get the name of the wanted data on the x and y axis
	var yAxisData = yName;
	var xAxisData = xName;

	// get all the coordinates for the canvas and the graph
	var margin = {top: 10, right: 350, bottom: 100, left: 70};
	var chartWidth = 1100;
	var chartHeight = 500;
	var graphWidth = chartWidth - margin.left - margin.right;
	var graphHeight = chartHeight - margin.top - margin.bottom;
	
	// get a colour for each region and one for unknown
	var regionColours = {"Americas": "#A53431", "Asia Pacific": "#D73030",
		"Europe": "#EA5B1C", "Middle East and North Africa": "#F39205", 
		"Post-communist": "#FEC911", "Sub Saharan Africa": "#FCEA11", 
		"Unknown": "#727272"};

	// get the scales for the x axis, y axis and datapoint size
	var x = d3.scale.linear()
		.range([0, graphWidth])
		.domain([0, d3.max(data, function(d) {
			return (d[xAxisData] + 10 - (d[xAxisData] % 10));
			})]);
	var y = d3.scale.linear()
		.range([graphHeight, 0])
		.domain([0, d3.max(data, function(d) { 
			return (d[yAxisData] + 10 - (d[yAxisData] % 10)); 
			})]);
	var sizeScale = d3.scale.linear()
		.range([2, 10])
		.domain([d3.min(data, function(d) { return d["HPI"];}),
			d3.max(data, function(d) { return d["HPI"]; })]);
	
	// get the axis
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");
	
	// start an svg for the plot
	var svg = d3.select(".plot")
		.append("svg")
		.attr("width", chartWidth)
		.attr("height", chartHeight)
		.append("g")
			.attr("transform", 
				"translate(" + margin.left + "," + margin.top + ")");

	// draw the x axis
	svg.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + graphHeight + ")")
		.call(xAxis)
		.append("text")
			.attr("class", "label")
			.attr("x", graphWidth / 2)
			.attr("y", margin.bottom / 2)
			.style("text-anchor", "middle")
			.text(function() {
				if (xAxisData == "Life expectancy") {
					return "Life expectancy in years";
					}
				else if (xAxisData == "Ecological footprint") {
					return "Ecological footprint in gha per person";
					}
				else {
					return "Error";
					};
				});
	
	// draw the y axis
	svg.append("g")
		.attr("class", "y-axis")
		.call(yAxis)
		.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("x", -(graphHeight / 2))
			.attr("y", -(margin.left / 2))
			.style("text-anchor", "middle")
			.text(function() {
				if (yAxisData == "Ecological footprint") {
					return "Ecological footprint in gha per person";
					}
				else if(yAxisData == "Wellbeing") {
					return "Wellbeing on a scale from 0 to 10";
					}
				else {
					return "Error";
					};
				});

	// append a group for the datapoints
	var svgplot = svg.append("g").attr("class", "plot");
		
	// draw the datapoints
	svgplot.selectAll(".datapoint")
		.data(data)
		.enter()
		.append("circle")
			.attr("class", "datapoint")
			.attr("r", function(d) { return sizeScale(d["HPI"]); })
			.attr("cx", function(d) { return x(d[xAxisData]); })
			.attr("cy", function(d) { return y(d[yAxisData]); })
			.attr("stroke", "white")
			.attr("stroke-width", "1")
			.style("fill", function(d) { 
				if (regionColours[d["Region"]]){ 
					return regionColours[d["Region"]];
					}
				else { 
					return regionColours["Unknown"];
					};
				})
			.on("mouseover", function(){
				d3.select(this).attr("fill-opacity", "0.6")
				})
			.on("mouseout", function(){
				d3.select(this).attr("fill-opacity", "1")
				})
			.append("title")
				.text( function(d) { return d["Country"]; });		
	
	// get the coordinates for the legend and its content
	var legendX = chartWidth - margin.right;
	var legendY = margin.top;
	var legendWidth = margin.right - 100;
	var legendHeight = 	graphHeight;
	var colourWidth = legendWidth/6;
	var legendBorder = 20;
	var infoWidth = legendWidth - colourWidth - (legendBorder * 3);
			
	// get all the different regions
	var regionList = Object.keys(regionColours);
	var infoHeight = ((legendHeight - 50 - (legendBorder * 2) )
		/ regionList.length) - 10;
	
	// create a y coordinate scale for the legend
	var legendYScale = d3.scale.linear()
		.range([legendY + 50 + legendBorder, 
			legendY + legendHeight - legendBorder])
		.domain([0, regionList.length]);
	
	// draw the legend box
	var legend = svg.append("g").attr("class", "legend");
	legend.append("rect")
		.attr("x", legendX)
		.attr("y", legendY)
		.attr("width", legendWidth)
		.attr("height", legendHeight)
		.attr("stroke", "black")
		.attr("fill", "white")
		.attr("rx", 10)
		.attr("ry", 10);
	
	// draw the coloured rectangles
	legend.selectAll(".colour rect")
		.data(regionList)
		.enter()
		.append("rect")
			.attr("class", "colour rect")
			.attr("x", legendX + legendBorder)
			.attr("y", function(d,i) { return legendYScale(i); })
			.attr("width", colourWidth)
			.attr("height", infoHeight)
			.attr("stroke", "black")
			.attr("fill", function(d) { return regionColours[d]; })
			.attr("rx", 10)
			.attr("ry", 10);
		
	// draw the rectangles for the colour discription
	legend.selectAll(".text rect")
		.data(regionList)
		.enter()
		.append("rect")
			.attr("class", "text rect")
			.attr("x", legendX + colourWidth + (legendBorder * 2))
			.attr("y", function(d,i) { return legendYScale(i); })
			.attr("width", infoWidth)
			.attr("height", infoHeight)
			.attr("stroke", "black")
			.attr("fill", "white")
			.attr("rx", 10)
			.attr("ry", 10);
	
	// write the legend title
	legend.append("text")
		.attr("class", "title")
		.attr("x", legendX + (legendWidth / 2))
		.attr("y", legendY + (legendBorder * 2))
		.attr("fill", "black")
		.attr("font-size", "25px")
		.attr("text-anchor", "middle")
		.text("Legend");
		
	// write the colour discription
	legend.selectAll(".legenda")
		.data(regionList)
		.enter()
		.append("text")
			.attr("class", "legenda")
			.attr("x", legendX + colourWidth + (legendBorder * 2) + 10 )
			.attr("y", function(d,i) {
				return legendYScale(i) + infoHeight - 10; 
				})
			.attr("fill", "black")
			.attr("font-size", "11px")
			.text( function(d) { return d; });
}