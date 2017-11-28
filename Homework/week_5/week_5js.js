
function getData(){
		
	var parseDate = d3.time.format("%d-%m-%y").parse;
	// get the json data via d3
	d3.json("week_5csvAllInOne.json", function(error, data) {
		if (error) throw error;
		data.forEach(function(d) {
			d.Bilt = +d.Bilt;
			d.Hoogeveen = +d.Hoogeveen;
			d.Vlissingen = +d.Vlissingen;
			d["\ufeffDate"] = parseDate(d["\ufeffDate"]);
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
	
	var x = d3.time.scale()
		.domain(d3.extent(data, function(d) { return d["\ufeffDate"]; }))
		.rangeRound([0, width]);
	
	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.Hoogeveen/10; })])
		.rangeRound([height, 0]);
		
	// Define the line
	var BiltLine = d3.svg.line()
		.x(function(d) { return x(d["\ufeffDate"]); })
		.y(function(d) { return y(d.Bilt/10); });
	
	
	var HoogeveenLine = d3.svg.line()
		.x(function(d) { return x(d["\ufeffDate"]); })
		.y(function(d) { return y(d.Hoogeveen/10); });
		
	var VlissingenLine = d3.svg.line()
		.x(function(d) { return x(d["\ufeffDate"]); })
		.y(function(d) { return y(d.Vlissingen/10); });
		
	g.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "green")
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
		.attr("d", BiltLine(data));
	
	g.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "blue")
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
		.attr("d", HoogeveenLine(data));
	
	g.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", "red")
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
		.attr("d", VlissingenLine(data));
	
	
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
			.attr("y", (margin.bottom / 4)*3 )
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
	
};