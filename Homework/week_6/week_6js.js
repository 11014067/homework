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
function checkData(error, countries, GNIdata, HPIdata){
	// throw an error if there
	if (error) throw error;
	
	// get the GNI data in the wanted format
	GNIdata.forEach(function(d) {
		d.Income = +d.Income;
	});
	
	// start making the GNI plot
	drawMap(countries, GNIdata);
	
	// get the HPI data in the wanted format
	HPIdata.forEach(function(d) {
		d.HPIRank = +d.HPIRank;
		d["Life expectancy"] = +d["Life expectancy"];
		d.Wellbeing = +d.Wellbeing;
		d.Inequality = +d.Inequality;
		d["Ecological footprint"] = +d["Ecological footprint"];
		d.HPI = +d.HPI;
	});
	
	// start making th HPI plot
	drawPlot(HPIdata, "Wellbeing", "Ecological footprint");
	
	d3.select(".title").text("The GNI and HPI(Happy Planet Index) in 2016")
}

/**
* Draws a map coloured to the data.
**/
function drawMap(countries, GNIdata){
	d3.select(".mapTitle").text("GNI(Gross national income) per capita at PPP (purchasing power parity) in USD");
	
	minimumGNI = d3.min(GNIdata, function (d) { return d.Income; });
	maximumGNI = d3.max(GNIdata, function (d) { return d.Income; });
	
	var format = d3.format(",");
	
	// get the svg and add g for the map
	mapSVG = d3.selectAll(".mapSVG")
		.append('g')
		.attr('class', 'map');			

	// get the margins
	var margin = {top: 0, right: 200, bottom: 0, left: 0},
		width = +d3.selectAll(".mapSVG").attr("width") - margin.left - margin.right,
		height = +d3.selectAll(".mapSVG").attr("height") - margin.top - margin.bottom;
	
	// colour scale
	var colour = d3.scale.linear()
		.domain([minimumGNI, maximumGNI])
		.range(["rgb(198,219,239)", "rgb(8,81,156)"]);
	
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
				.style("stroke", "white")
				.style("stroke-width", 1.5)
				.style("opacity",0.8)
				.style("stroke","white")
				.style("stroke-width", 0.3)
				.on("mouseover", function(d) {
					d3.select(this)
						.style("opacity", 1)
						.style("stroke-width",3);
				})
				.on("mouseout", function(d) {
					d3.select(this)
						.style("opacity", 0.8)
						.style("stroke-width",0.3)
						.style("stroke", "white");
				})
				.on("click", function(d) {
					countryClicked(d.properties.name, "circle")
					console.log(d3.select(this))
				})
				.append("title")
					.text( function(d) { return d.properties.name; });
	
	// add the names 
	mapSVG.append("path")
		.datum(topojson.mesh(countries.features, function(a, b) { return a.id !== b.id; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
		.attr("class", "names")
		.attr("d", path);
}

/**
* Draws a scatterplot. 
**/
function drawPlot(HPIdata, yName, xName){
	
	// write the title
	var yTitle = yName.toLowerCase();
	var xTitle = xName.toLowerCase();
	d3.select(".plotTitle").text("The " + yTitle + " against the " + xTitle + 
		" coloured by region");
	
	// get the name of the wanted data on the x and y axis
	var yAxisData = yName;
	var xAxisData = xName;

	// get all the coordinates for the canvas and the graph
	var margin = {top: 10, right: 300, bottom: 100, left: 60};
	var chartWidth = +d3.selectAll(".plotSVG").attr("width");
	var chartHeight = +d3.selectAll(".plotSVG").attr("height");
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
		.domain([0, d3.max(HPIdata, function(d) {
			return (d[xAxisData] + 10 - (d[xAxisData] % 10));
			})]);
	var y = d3.scale.linear()
		.range([graphHeight, 0])
		.domain([0, d3.max(HPIdata, function(d) { 
			return (d[yAxisData] + 10 - (d[yAxisData] % 10)); 
			})]);
	var sizeScale = d3.scale.linear()
		.range([2, 10])
		.domain([d3.min(HPIdata, function(d) { return d["HPI"];}),
			d3.max(HPIdata, function(d) { return d["HPI"]; })]);
	
	// get the axis
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");
	
	// start an svg for the plot
	var svg = d3.select(".plotSVG")
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
		.data(HPIdata)
		.enter()
		.append("circle")
			.attr("class", function(d) { return d.Country; })
			.attr("r", 3)
			.attr("cx", function(d) { return x(d[xAxisData]); })
			.attr("cy", function(d) { return y(d[yAxisData]); })
			.attr("stroke", "white")
			.attr("stroke-width", "1")
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
					.style("stroke-width", ".3")
			})
			.on("mouseout", function() {
				d3.select(this)
					.attr("fill-opacity", "1")
					.style("stroke-width", "1")
					.style("stroke", "white")
			})
			.on("click", function(d) {
				countryClicked(d.Country, "path")
			})
			.append("title")
				.text( function(d) { return d.Country; });		
	
	// get the coordinates for the legend and its content
	var legendX = graphWidth + 15;
	var legendY = 0;
	var legendWidth = margin.right - 50;
	var legendHeight = 	graphHeight;
	var colourWidth = legendWidth/6;
	var legendBorder = 15;
	var infoWidth = legendWidth - colourWidth - (legendBorder * 3);
			
	// get all the different regions
	var regionList = Object.keys(regionColours);
	var infoHeight = ((legendHeight - (legendBorder * 2) )
		/ regionList.length) - 10;
	
	// create a y coordinate scale for the legend
	var legendYScale = d3.scale.linear()
		.range([legendY + (legendBorder * 2), 
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
		.attr("y", legendY + (legendBorder * 1.5))
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
				return legendYScale(i) + infoHeight - 5; 
				})
			.attr("fill", "black")
			.attr("font-size", "11px")
			.text( function(d) { return d; });
}

function countryClicked(countryName, formOfObject) {
	console.log(countryName)
	d3.selectAll("." + countryName)
		.style("stroke-width", "2")
		.style("stroke", "green")
}