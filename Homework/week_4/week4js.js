
function loadData(yName, xName){
	d3.select("svg").remove();
	d3.select(".title").text("The '" + yName + "' against the '" + xName + "'")
	d3.csv("Week4.csv", function(error, data){ 
		if (error) throw error;
			data.forEach(function(d) {
				d.HPIRank = +d.HPIRank;
				d.LifeExpectancy = +d.LifeExpectancy;
				d.Wellbeing = +d.Wellbeing;
				d.Inequality = +d.Inequality;
				d.Footprint = +d.Footprint;
				d.HPI = +d.HPI;
				});
			drawChart(data, yName, xName);
		}
	);
}

/**
* https://www.w3schools.com/howto/howto_js_dropdown.asp
**/
function showOptions() {
    document.getElementById("myDropdown").style.display='block';
}
function hideOptions() {
	document.getElementById("myDropdown").style.display='none';
}

function drawChart(data, yName, xName){
	
	var yAxisData = yName;
	var xAxisData = xName;
	
	var margin = {top: 10, right: 50, bottom: 100, left: 70};
	var chartWidth = 800;
	var chartHeight = 500;
	var graphWidth = chartWidth - margin.left - margin.right;
	var graphHeight = chartHeight - margin.top - margin.bottom;
	
	var x = d3.scale.linear()
		.range([0, graphWidth])
		.domain([0, d3.max(data, function(d) { return (d[xAxisData] + 10 - (d[xAxisData] % 10)) })]);
	var y = d3.scale.linear()
		.range([graphHeight, 0])
		.domain([0, d3.max(data, function(d) { return (d[yAxisData] + 10 - (d[yAxisData] % 10)) })]);
	
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");
	
	var svg = d3.select("body")
		.append("svg")
		.attr("width", chartWidth)
		.attr("height", chartHeight)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + graphHeight + ")")
		.call(xAxis)
		.append("text")
			.attr("class", "label")
			.attr("x", graphWidth / 2)
			.attr("y", margin.bottom / 2)
			.style("text-anchor", "middle")
			.text(xAxisData)
	
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("x", -(graphHeight / 2))
			.attr("y", -(margin.left / 2))
			.style("text-anchor", "middle")
			.text(yAxisData)
	
	svg.selectAll(".dot")
		.data(data)
		.enter()
		.append("circle")
			.attr("class", "dot")
			.attr("r", 3.5)
			.attr("cx", function(d) { return x(d[xAxisData]);})
			.attr("cy", function(d) { return y(d[yAxisData]);})
	
	
}


//
//var color = d3.scale.category10();
//
//svg.selectAll(".dot").style("fill", function(d) { return color(d.species); });
//
//  var legend = svg.selectAll(".legend")
//      .data(color.domain())
//    .enter().append("g")
//      .attr("class", "legend")
//      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
//
//  legend.append("rect")
//      .attr("x", chartWidth - 18)
//      .attr("chartWidth", 18)
//      .attr("height", 18)
//      .style("fill", color);
//
//  legend.append("text")
//      .attr("x", chartWidth - 24)
//      .attr("y", 9)
//      .attr("dy", ".35em")
//      .style("text-anchor", "end")
//      .text(function(d) { return d; });
//
//});