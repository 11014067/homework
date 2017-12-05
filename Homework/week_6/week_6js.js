/**
* Name: Sanne Oud 
* Student number: 11014067
* Data processing
*
* Gross national income per capita at purchasing power parity, (current USD)
* Data is from: "https://data.worldbank.org/indicator/NY.GNP.PCAP.PP.CD"
*
* https://raw.githubusercontent.com/jdamiani27/Data-Visualization-and-D3/master/lesson4/world_countries.json
**/

/**
* Load the wanted csv data files.
**/
function getData() {
	// load the datafiles and afterword check the data
	queue()
		.defer(d3.csv, "incomeCSVfinal.csv")
		.defer(d3.csv, "HPIdatafinal.csv")
		.await(checkData);
}

/**
* Get the data in the wanted format.
**/
function checkData(error, GNIdata, HPIdata){
	// throw an error if there
	if (error) throw error;
	
	// get the GNI data in the wanted format
	GNIdata.forEach(function(d) {
		d.Income = +d.Income;
	});
	
	// start making the GNI plot
	drawMap(GNIdata);
	
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
	drawPlot(HPIdata);
}

/**
* Draws a map coloured to the data.
**/
function drawMap(GNIdata){
	var format = d3.format(",");

// Set tooltips
var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
              return "<strong>Country: </strong><span class='details'>" + d.properties.name + "<br></span>" + "<strong>Population: </strong><span class='details'>" + format(d.population) +"</span>";
            })

var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

var color = d3.scale.threshold()
    .domain([10000,100000,500000,1000000,5000000,10000000,50000000,100000000,500000000,1500000000])
    .range(["rgb(247,251,255)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(66,146,198)","rgb(33,113,181)","rgb(8,81,156)","rgb(8,48,107)","rgb(3,19,43)"]);

var path = d3.geo.path();

var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append('g')
            .attr('class', 'map');

var projection = d3.geo.mercator()
                   .scale(130)
                  .translate( [width / 2, height / 1.5]);

var path = d3.geo.path().projection(projection);

svg.call(tip);

queue()
    .defer(d3.json, "world_countries.json")
    .defer(d3.tsv, "world_population.tsv")
    .await(ready);

function ready(error, data, population) {
  var populationById = {};

  population.forEach(function(d) { populationById[d.id] = +d.population; });
  data.features.forEach(function(d) { d.population = populationById[d.id] });

  svg.append("g")
      .attr("class", "countries")
    .selectAll("path")
      .data(data.features)
    .enter().append("path")
      .attr("d", path)
      .style("fill", function(d) { return color(populationById[d.id]); })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style("opacity",0.8)
      // tooltips
        .style("stroke","white")
        .style('stroke-width', 0.3)
        .on('mouseover',function(d){
          tip.show(d);

          d3.select(this)
            .style("opacity", 1)
            .style("stroke","white")
            .style("stroke-width",3);
        })
        .on('mouseout', function(d){
          tip.hide(d);

          d3.select(this)
            .style("opacity", 0.8)
            .style("stroke","white")
            .style("stroke-width",0.3);
        });

  svg.append("path")
      .datum(topojson.mesh(data.features, function(a, b) { return a.id !== b.id; }))
       // .datum(topojson.mesh(data.features, function(a, b) { return a !== b; }))
      .attr("class", "names")
      .attr("d", path);
}
}

/**
* Draws a scatterplot. 
**/
function drawPlot(HPIdata){
	
}