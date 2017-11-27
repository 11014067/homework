function getData(){
	// get the json data via d3
	d3.json("week_5csv.json", function(error, data) {
		if (error) throw error;
		data.forEach(function(d) {
			d.TG = +d.TG
			});
		drawGraph(data);
	});
}

function drawGraph(data){
	console.log(data);
	
	var svg = d3.select("svg"),
		margin = {top: 50, right: 50, bottom: 50, left: 50},
		width = +svg.attr("width") - margin.left - margin.right,
		height = +svg.attr("height") - margin.top - margin.bottom,
		g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var parseTime = d3.time.format("%Y%m%d");
	
	var x = d3.time.scale()
		.domain(d3.extent(data, function(d) { return d.DATE; }))
		.rangeRound([0, width]);
	
	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.TG/10; })])
		.rangeRound([height, 0]);
	
	
	var line = d3.svg.line()
		.x(function(d) { return x(d.DATE); })
		.y(function(d) { return y(d.TG/10); });
	
	g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);
	
	// get the axis
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left");
	
	// draw the x axis
	g.append("g")
		.attr("class", "x-axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
			.attr("class", "label")
			.attr("x", width / 2)
			.attr("y", margin.bottom / 2)
			.style("text-anchor", "middle")
			.text("X AXIS");
	
	// draw the y axis
	g.append("g")
		.attr("class", "y-axis")
		.call(yAxis)
		.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("x", -(height / 2))
			.attr("y", -(margin.left / 2))
			.style("text-anchor", "middle")
			.text("Y AXIS");
	
	//g.append("g")
	//	.attr("transform", "translate(0," + height + ")")
	//	.call(d3.axisBottom(x))
	//	.select(".domain")
	//	.remove();
	//
	//g.append("g")
	//	.call(d3.axisLeft(y))
	//	.append("text")
	//	.attr("fill", "#000")
	//	.attr("transform", "rotate(-90)")
	//	.attr("y", 6)
	//	.attr("dy", "0.71em")
	//	.attr("text-anchor", "end")
	//	.text("Price ($)");
	//
	//g.append("path")
	//	.datum(data)
	//	.attr("fill", "none")
	//	.attr("stroke", "steelblue")
	//	.attr("stroke-linejoin", "round")
	//	.attr("stroke-linecap", "round")
	//	.attr("stroke-width", 1.5)
	//	.attr("d", line);
};