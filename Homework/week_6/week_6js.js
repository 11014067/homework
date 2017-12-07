/**
* Name: Sanne Oud 
* Student number: 11014067
* Data processing
*
* Gross national income per capita at purchasing power parity, (current USD)
* Data is from: "https://data.worldbank.org/indicator/NY.GNP.PCAP.PP.CD"
*
*
* https://raw.githubusercontent.com/jdamiani27/Data-Visualization-and-D3/master/lesson4/world_countries.json
**/

/**
* Make some global variables so the plot can be changed without reloading the data.
**/
var GNIdata, HPIdata
var yName = "Wellbeing"
var xName = "HPI"

/**
* Change the axis on the plot.
**/
function changeAxis(axisName, axisDataName){
	if (axisName == 'x'){
		xName = axisDataName;
	}
	else if (axisName == 'y') {
		yName = axisDataName;
	};
	drawPlot("plotSVG");
}

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
	
	d3.select(".title").text("The GNI and HPI in 2016")
}

/**
* Draws a map coloured to the data.
**/
function drawMap(countries, GNIdata, svgName){
	d3.select(".mapTitle").text("GNI(Gross national income) per capita at PPP (purchasing power parity) in USD");
	
	maximumGNI = d3.max(GNIdata, function (d) { 
		return Math.round(d.Income/10000)*10000; 
	});
	
	var format = d3.format(",");
	
	// get the svg and add g for the map
	mapSVG = d3.selectAll("." + svgName)
		.append('g')
		.attr('class', 'map');			

	// get the margins
	var margin = {top: 20, right: 300, bottom: 20, left: 0},
		width = +d3.selectAll(".mapSVG").attr("width") - margin.left - margin.right,
		height = +d3.selectAll(".mapSVG").attr("height") - margin.top - margin.bottom;
	
	// colour scale
	var colour = d3.scale.linear()
		.domain([0, maximumGNI])
		.range(["#C6DBEF", "#08519C"]);
	
	// unhardcode the legend colours
	
	// colours for the legenda
	var legendColours = { "0 GNI": colour(0), "20000 GNI": colour(20000), 
		"40000 GNI": colour(40000), "60000 GNI": colour(60000), 
		"80000 GNI": colour(80000), "unknown": colour(undefined)
	};
	
	// start a path
	var path = d3.geo.path();
	
	// strat the projection and add the path to it
	var projection = d3.geo.mercator()
		.scale(80)
		.translate([(width / 2), 240]);
	var path = d3.geo.path().projection(projection);

	// putting the data in a list
	var populationById = {};
	GNIdata.forEach(function(d) { populationById[d.Country] = +d.Income; });
	countries.features.forEach(function(d) { d.Income = populationById[d.properties.name] });
	
	// add the countries to the g
	mapSVG.append("g")
		.attr("class", "countries")
		.selectAll("path")
		.data(countries.features)
			.enter()
			.append("path")
				.attr("d", path)
				.attr("class", function(d) { return d.properties.name; })
				.style("fill", function(d) { return colour(populationById[d.properties.name]); })
				.on("mouseover", function(d) {
					d3.select(this)
						.style("opacity", 0.8)
						.style("stroke-width",3);
				})
				.on("mouseout", function(d) {
					d3.select(this)
						.style("opacity", 1)
						.style("stroke-width",0.3)
						.style("stroke", "white");
				})
				.on("click", function(d) {
					countryClicked(d.properties.name, "circle");
				})
				.append("title")
					.text( function(d) { return d.properties.name + ", GNI : " + populationById[d.properties.name]; });
	
	// add the names 
	mapSVG.append("path")
		.datum(topojson.mesh(countries.features, function(a, b) { return a.id !== b.id; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
		.attr("class", "names")
		.attr("d", path);
		
	getLegend(svgName, legendColours, width, height, margin);
}

/**
* Draws a scatterplot. 
**/
function drawPlot(svgName){
	d3.select("." + svgName + "2").remove();
	
	d3.select("." + svgName)
		.append("svg")
			.attr("class", svgName + 2);
			
	// write the title
	if (xName == "HPI"){
		var xTitle = xName;
	}
	else{
		var xTitle = xName.toLowerCase();
	};
	if (yName == "HPI"){
		var yTitle = yName;
	}
	else{
		var yTitle = yName.toLowerCase();
	};
	d3.select(".plotTitle").text("The " + yTitle + " against the " + xTitle + 
		" coloured by region");
	
	// get the name of the wanted data on the x and y axis
	var yAxisData = yName;
	var xAxisData = xName;

	// get all the coordinates for the canvas and the graph
	var margin = {top: 10, right: 300, bottom: 100, left: 60};
	var svgWidth = +d3.selectAll("." + svgName).attr("width");
	var svgHeight = +d3.selectAll("." + svgName).attr("height");
	var width = svgWidth - margin.left - margin.right;
	var height = svgHeight - margin.top - margin.bottom;
	
	// get a colour for each region and one for unknown
	var regionColours = {"Americas": "#A53431", "Asia Pacific": "#D73030",
		"Europe": "#EA5B1C", "Middle East and North Africa": "#F39205", 
		"Post-communist": "#FEC911", "Sub Saharan Africa": "#FCEA11", 
		"Unknown": "#727272"};

	// get the scales for the x axis, y axis and datapoint size
	var x = d3.scale.linear()
		.range([0, width])
		.domain([0, d3.max(HPIdata, function(d) {
			return (d[xAxisData] + 10 - (d[xAxisData] % 10));
		})]);
	var y = d3.scale.linear()
		.range([height, 0])
		.domain([0, d3.max(HPIdata, function(d) { 
			return (d[yAxisData] + 10 - (d[yAxisData] % 10)); 
		})]);
	
	// get the axis
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");
	
	// start an svg for the plot
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
				if (xAxisData == "Life expectancy") {
					return "Life expectancy in years";
				}
				else if (xAxisData == "Ecological footprint") {
					return "Ecological footprint in gha per person";
				}
				else if (xAxisData == "HPI") {
					return "The happy planet index";
				}
				else if(xAxisData == "Wellbeing") {
					return "Wellbeing on a scale from 0 to 10";
				}
				else {
					return xAxisData;
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
			.attr("y", -(margin.left / 2))
			.style("text-anchor", "middle")
			.text(function() {
				if (yAxisData == "Life expectancy") {
					return "Life expectancy in years";
				}
				else if (yAxisData == "Ecological footprint") {
					return "Ecological footprint in gha per person";
				}
				else if (yAxisData == "HPI") {
					return "The happy planet index";
				}
				else if(yAxisData == "Wellbeing") {
					return "Wellbeing on a scale from 0 to 10";
				}
				else {
					return yAxisData;
				};
			});

	// append a group for the datapoints
	var svgplot = svg.append("g").attr("class", "plot");
		
	// draw the datapoints
	svgplot.selectAll("circle")
		.data(HPIdata)
		.enter()
		.append("circle")
			.attr("class", function(d) { return d.Country; })
			.attr("r", 3)
			.attr("cx", function(d) { return x(d[xAxisData]); })
			.attr("cy", function(d) { return y(d[yAxisData]); })
			.style("fill", function(d) { 
				if (regionColours[d["Region"]]){ 
					return regionColours[d.Region];
					}
				else { 
					return regionColours["Unknown"];
					};
				})
			.on("mouseover", function() {
				d3.select(this)
					.attr("fill-opacity", "0.6")
					.style("stroke-width", ".3");
			})
			.on("mouseout", function() {
				d3.select(this)
					.attr("fill-opacity", "1")
					.style("stroke-width", "1")
					.style("stroke", "white");
			})
			.on("click", function(d) {
				countryClicked(d.Country, "path");
			})
			.append("title")
				.text( function(d) { return d.Country; });	
		
	getLegend(svgName, regionColours, width, height, margin);
}


function getLegend(svgName, infoColours, width, height, margin){	
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

function countryClicked(countryName, formOfObject) {
	d3.selectAll("." + countryName)
		.style("stroke-width", "2")
		.style("stroke", "green");
}