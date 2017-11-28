
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
			
	var crosshairLine = d3.svg.line()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; });
		
	//var crosshairG = g.append('g').style('display', 'none');
    //            
    //crosshairG.append('line')
    //    .attr('id', 'crosshairX');
    //crosshairG.append('line')
    //    .attr('id', 'crosshairY');
    //crosshairG.append('circle')
    //    .attr('id', 'focusCircle')
    //    .attr('r', 5);
	//
	//var mouse = d3.mouse(this);
	//var closeSelector = d3.bisector(function(d) { return d[0]; }).left;
    ////var mouseDate = xScale.invert(mouse[0]);
    //var i = closeSelector(data, mouse[0]); // returns the index to the current data item
    //
    //var d0 = data[i - 1]
    //var d1 = data[i];
    //// work out which date value is closest to the mouse
    //var d = mouseDate - d0[0] > d1[0] - mouseDate ? d1 : d0;
    //
    //var xCoor = x(d[0]);
    //var yCoor = y(d[1]);
    //
    //focus.select('#focusCircle')
    //    .attr('cx', xCoor)
    //    .attr('cy', yCoor);
    //focus.select('#focusLineX')
    //    .attr('x1', xCoor).attr('y1', yScale(yDomain[0]))
    //    .attr('x2', xCoor).attr('y2', yScale(yDomain[1]));
    //focus.select('#focusLineY')
    //    .attr('x1', xScale(xDomain[0])).attr('y1', y)
    //    .attr('x2', xScale(xDomain[1])).attr('y2', y);
	
	var crosshairMiddle = [{x: width / 2, y: 0}, {x: width / 2, y: height}]	
	var crosshairData2 = [{x: 0, y: height / 2}, {x: width, y: height / 2}]
	
	// crosshairs ---Should be mousemove over whole thing
	g.append("path")
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("d", crosshairLine(crosshairMiddle))
		.on("mousemove", function() {
			d3.select(this).attr("d", crosshairLine(crosshairData2));
		})
		.on('mouseout', function() { focus.style('display', 'none'); })
};