/**
* Name: Sanne Oud 
* Student number: 11014067
* Data processing
*
* This script makes a map with GNI and a scatterplot with HPI related data. They are
* interactively linked. Clicking a land in one of the images will colour the edge green in both.
*
* HPI data from: "http://happyplanetindex.org/"
* Gross national income per capita at purchasing power parity, (current USD)
* data is from: "https://data.worldbank.org/indicator/NY.GNP.PCAP.PP.CD"
*
* The countries dataset is from:
* https://raw.githubusercontent.com/jdamiani27/Data-Visualization-and-D3/master/lesson4/world_countries.json
**/

/**
* Make some global variables so the plot can be changed without reloading the data.
**/
var GNIdata, HPIdata;
var yName = "Wellbeing";
var xName = "HPI";

/**
* Load the wanted csv data files.
**/
function getData() {
	
	// load the datafiles and afterword check the data
	queue()
		.defer(d3.json, "world_countries.json")
		.defer(d3.csv, "incomeCSVfinal.csv")
		.defer(d3.csv, "HPIdatafinal.csv")
		.await(checkData);
}

/**
* Get the data in the wanted format.
**/
function checkData(error, countries, GNIdataCheck, HPIdataCheck){
	
	// throw an error if there
	if (error) throw error;
	
	// get the GNI data in the wanted format
	GNIdataCheck.forEach(function(d) {
		d.Income = +d.Income;
	});
	GNIdata = GNIdataCheck;
	
	// start making the GNI plot
	drawMap(countries, GNIdata, "mapSVG");
	
	// get the HPI data in the wanted format
	HPIdataCheck.forEach(function(d) {
		d.HPIRank = +d.HPIRank;
		d["Life expectancy"] = +d["Life expectancy"];
		d.Wellbeing = +d.Wellbeing;
		d.Inequality = +d.Inequality;
		d["Ecological footprint"] = +d["Ecological footprint"];
		d.HPI = +d.HPI;
	});
	HPIdata = HPIdataCheck;
	
	// start making th HPI plot
	drawPlot("plotSVG");
}

/**
* Draws a map coloured to the data.
**/
function drawMap(countries, GNIdata, svgName){
	
	// get the svg and write the title
	d3.select(".mapTitle").text("GNI(Gross national income) per capita at PPP (purchasing power parity) in USD");
	var mapSVG = d3.selectAll("." + svgName)
		.append('g')
		.attr('class', 'map');			

	// get the size and margins
	var margin = {top: 20, right: 300, bottom: 20, left: 0};
	var width = +d3.selectAll(".mapSVG").attr("width") - margin.left - margin.right;
	var height = +d3.selectAll(".mapSVG").attr("height") - margin.top - margin.bottom;
	
	// get the colour scale
	var colour = d3.scale.linear()
		.domain([0, d3.max(GNIdata, function (d) { 
			return Math.round(d.Income/10000)*10000; 
			})])
		.range(["#D5E2EF", "#08519C"]);
	
	// make the colours for the legenda
	var legendColours = { "$0": colour(0), "$20000": colour(20000), 
		"$40000": colour(40000), "$60000": colour(60000), 
		"$80000": colour(80000), "unknown": colour(undefined)
	};
	
	// make the map smaller and do not display antartica
	var path = d3.geo.path();
	var projection = d3.geo.mercator()
		.scale(80)
		.translate([(width / 2), 240]);
	var path = d3.geo.path().projection(projection);

	// make a list for the {country: GNI} and add the GNI to the countries
	var CountryGNI = {};
	GNIdata.forEach(function(d) { 
		CountryGNI[d.Country] = +d.Income; 
		});
		
	// add the countries
	mapSVG.append("g")
		.attr("class", "countries")
		.selectAll("path")
		.data(countries.features)
			.enter()
			.append("path")
				.attr("d", path)
				.attr("class", function(d) { return d.properties.name.replace(" ", "-"); })
				.style("fill", function(d) { return colour(CountryGNI[d.properties.name]); })
				.on("mouseover", function(d) {
					d3.select(this).style("opacity", "0.8");
				})
				.on("mouseout", function(d) {
					d3.select(this).style("opacity", "1");
				})
				.on("click", function(d) {
					countryClicked(d.properties.name.replace(" ", "-"), "circle");
				})
				.append("title")
					.text( function(d) { 
						return d.properties.name + ", GNI: " + CountryGNI[d.properties.name]; 
					});
		
	// get a legend
	getLegend(svgName, legendColours, width, height, margin);
}

/**
* Draws a scatterplot. 
**/
function drawPlot(svgName){

	// colour the buttons that are used
	buttonClassX = ".x" + xName.split(" ")[0]
	buttonClassY = ".y" + yName.split(" ")[0]
	d3.selectAll("button").style("background-color", "#e7e7e7")
	d3.select(buttonClassX).style("background-color", "#bbbbbb")
	d3.select(buttonClassY).style("background-color", "#bbbbbb")
	
	// remove the second svg if there and add it empty again
	d3.select("." + svgName + "2").remove();
	d3.select("." + svgName)
		.append("svg")
			.attr("class", svgName + 2);
			
	// write the title
	if (xName == "HPI") { 
		var xTitle = xName; 
	}
	else { 
		var xTitle = xName.toLowerCase(); 
	};
	if (yName == "HPI") { 
		var yTitle = yName; 
	}
	else { 
		var yTitle = yName.toLowerCase(); 
	};
	d3.select(".plotTitle").text("The " + yTitle + " against the " + xTitle + 
		" coloured by region");

	// get the size
	var margin = {top: 10, right: 300, bottom: 100, left: 60};
	var width = +d3.selectAll("." + svgName).attr("width") - margin.left - margin.right;
	var height = +d3.selectAll("." + svgName).attr("height") - margin.top - margin.bottom;
	
	// get the colours for the legend
	var regionColours = {"Americas": "#A53431", "Asia Pacific": "#D73030",
		"Europe": "#EA5B1C", "Middle East and North Africa": "#F39205", 
		"Post-communist": "#FEC911", "Sub Saharan Africa": "#FCEA11", 
		"Unknown": "#727272"};

	// get the scales for the x axis and y axis
	var x = d3.scale.linear()
		.range([0, width])
		.domain([0, d3.max(HPIdata, function(d) {
			if (d[xName] < 1) {
				return 1;
			}
			else {
				return (d[xName] + 10 - (d[xName] % 10));
			};
		})]);
	var y = d3.scale.linear()
		.range([height, 0])
		.domain([0, d3.max(HPIdata, function(d) { 
			if (d[yName] < 1) {
				return 1;
			}
			else {
				return (d[yName] + 10 - (d[yName] % 10));
			}; 
		})]);
	
	// get the axis
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");
	
	// get an svg for the plot
	var svg = d3.select("." + svgName + "2")
		.append("g")
			.attr("transform", 
				"translate(" + margin.left + "," + margin.top + ")");

	// draw the x axis
	svg.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
			.attr("class", "label")
			.attr("x", width / 2)
			.attr("y", margin.bottom / 2)
			.style("text-anchor", "middle")
			.text(function() {
				if (xName == "Life expectancy") {
					return "Life expectancy in years";
				}
				else if (xName == "Ecological footprint") {
					return "Ecological footprint in gha per person";
				}
				else if (xName == "HPI") {
					return "The happy planet index";
				}
				else if (xName == "Wellbeing") {
					return "Wellbeing on a scale from 0 to 10";
				}
				else if (xName == "Inequality") {
					return "Inequality of outcome in percentage";
				}
				else {
					return xName;
				};
			});
	
	// draw the y axis
	svg.append("g")
		.attr("class", "y-axis")
		.call(yAxis)
		.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("x", -(height / 2))
			.attr("y", -(margin.left / 1.5))
			.style("text-anchor", "middle")
			.text(function() {
				if (yName == "Life expectancy") {
					return "Life expectancy in years";
				}
				else if (yName == "Ecological footprint") {
					return "Ecological footprint in gha per person";
				}
				else if (yName == "HPI") {
					return "The happy planet index";
				}
				else if (yName == "Wellbeing") {
					return "Wellbeing on a scale from 0 to 10";
				}
				else if (yName == "Inequality") {
					return "Inequality of outcome in percentages";
				}
				else {
					return yName;
				};
			});

	// append a group for the datapoints
	var svgplot = svg.append("g").attr("class", "plot");
		
	// draw the datapoints
	svgplot.selectAll("circle")
		.data(HPIdata)
		.enter()
		.append("circle")
			.attr("class", function(d) { return d.Country.replace(" ", "-"); })
			.attr("r", 3)
			.attr("cx", function(d) { return x(d[xName]); })
			.attr("cy", function(d) { return y(d[yName]); })
			.style("fill", function(d) { 
				if (regionColours[d["Region"]]){ 
					return regionColours[d.Region];
					}
				else { 
					return regionColours["Unknown"];
					};
				})
			.on("mouseover", function() {
				d3.select(this).attr("fill-opacity", "0.6");
			})
			.on("mouseout", function() {
				d3.select(this).attr("fill-opacity", "1");
			})
			.on("click", function(d) {
				countryClicked(d.Country.replace(" ", "-")	, "path");
			})
			.append("title")
				.text( function(d) { 
					return d.Country + ", " + xTitle + " is " + d[xName] + " and " + yTitle + " is " + d[yName]; 
				});	
	
	// get a legend
	getLegend(svgName, regionColours, width, height, margin);
}

/**
* Draw the legends.
**/
function getLegend(svgName, infoColours, width, height, margin){
	
	// get the wanted svg
	var svg = d3.select("." + svgName);

	// get the coordinates for the legend and its content
	var legendX = width + margin.left + 10;
	var legendY = margin.top + 10;
	var legendWidth = margin.right - 50;
	var legendHeight = 	height - 20;
	var colourWidth = legendWidth/6;
	var legendBorder = 15;
	var infoWidth = legendWidth - colourWidth - (legendBorder * 3);
			
	// get all the different regions
	var infoList = Object.keys(infoColours);
	var infoHeight = ((legendHeight - (legendBorder * 3) )
		/ infoList.length) - 10;
	
	// create a y coordinate scale for the legend
	var legendYScale = d3.scale.linear()
		.range([legendY + (legendBorder * 3), 
			legendY + legendHeight - legendBorder])
		.domain([0, infoList.length]);
	
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
		.data(infoList)
		.enter()
		.append("rect")
			.attr("class", "colour rect")
			.attr("x", legendX + legendBorder)
			.attr("y", function(d,i) { return legendYScale(i); })
			.attr("width", colourWidth)
			.attr("height", infoHeight)
			.attr("stroke", "black")
			.attr("fill", function(d) { return infoColours[d]; })
			.attr("rx", 10)
			.attr("ry", 10);
		
	// draw the rectangles for the colour discription
	legend.selectAll(".text rect")
		.data(infoList)
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
		.data(infoList)
		.enter()
		.append("text")
			.attr("class", "legenda")
			.attr("x", legendX + colourWidth + (legendBorder * 2) + 10 )
			.attr("y", function(d,i) {
				return legendYScale(i) + infoHeight - 5; 
			})
			.attr("fill", "black")
			.attr("font-size", function() { 
				{ return Math.round(infoHeight/2); }
			})
			.text( function(d) { return d; });
}

/**
* Colour the data of a clicked country.
**/
function countryClicked(countryName, formOfObject) {
	
	// check the colour of the object and change it
	var colourOfObject = d3.selectAll("." + countryName).style("stroke");
	if ((colourOfObject) == "rgb(255, 255, 255)") {
		var selected = false;
	}
	else {
		var selected = true;
	};
	d3.selectAll("." + countryName)
		.style("stroke", function() {
				if (selected == false) {
					return "green";
				}
				else {
					return "white";
				};
		})
		.style("stroke-width", function() {
				if (selected == false) {
					return "2";
				}
				else {
					return "1";
				};
		});
}

/**
* Change the axis on the plot.
**/
function changeAxis(axisName, axisDataName){
	
	// change the Axis to the desired data
	if (axisName == 'x'){
		xName = axisDataName;
	}
	else if (axisName == 'y') {
		yName = axisDataName;
	};
	drawPlot("plotSVG");
}

/**
* Show/hide the storytelling.
**/
function showStory() {
	
	// show or hide the dropdown
	if (d3.select(".dropdownContent").style("display") == "none") {
		d3.select(".dropdownContent").style("display", "block");
	}
	else {
		d3.select(".dropdownContent").style("display", "none");
	}
}