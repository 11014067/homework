
function getData(){
		
	var parseDate = d3.time.format("%d-%m-%y").parse;
	// get the json data via d3
	d3.json("week_5csvAllInOne.json", function(error, data) {
		if (error) throw error;
		data.forEach(function(d) {
			d.Bilt = +d.Bilt;
			d.Hoogeveen = +d.Hoogeveen;
			d.Vlissingen = +d.Vlissingen;
			d.randomDate = d["\ufeffDate"] = parseDate(d["\ufeffDate"]);
			});
		drawGraph(data);
	});
}

//kleuren in disign keuze

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
		.domain([d3.min(data, function(d) { return Math.min(d.Bilt, d.Hoogeveen, d.Vlissingen) / 10; }),
			d3.max(data, function(d) { return Math.max(d.Bilt, d.Hoogeveen, d.Vlissingen) / 10; })])
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
		
	
	var mouseX = 100;
	var mouseX2 = 300;
	var mouseY = 100;
	var crosshairMouseX = [{x: mouseX, y: 0}, {x: mouseX, y: height}];
	var crosshairMouseY = [{x: 0, y: mouseY}, {x: width, y: mouseY}];

	
	// crosshairs ---Should be mousemove over whole thing
	crosshairGX = g.append("path")
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("d", crosshairLine(crosshairMouseX));
	crosshairGY = g.append("path")
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("d", crosshairLine(crosshairMouseY));
		
	var bisectDate = d3.bisector(function(d) { console.log("hoi"); return d["/ufeffDate"]; }).right;
	console.log(bisectDate);
	
	svg.on("mousemove", function() {
		d3.selectAll(".information").remove()
		var coordinates = d3.mouse(this);
		
		// change the coordinates to match the mouse in the graph
		mouseX = coordinates[0] - margin.left;
		mouseY = coordinates[1] - margin.top;
		
		// if the mouse is out of bounds, stop at the bound
		if (mouseX < 0) { mouseX = 0 }
		else if (mouseX > width) { mouseX = width };
		if (mouseY < 0) { mouseY = 0 }
		else if (mouseY > height) { mouseY = height };
		
		// get the date at the mousepoint
		var dateX = x.invert(mouseX);
		index = getDataIndex(data, dateX);
		
		// get the x and y per location
		xDate = 
		
		// draw the crosshairs
		crosshairMouseMove = [[{x: mouseX, y: 0}, {x: mouseX, y: height}],[{x: 0, y: mouseY}, {x: width, y: mouseY}]];
		crosshairGX.attr("d", crosshairLine(crosshairMouseMove[0]));
		crosshairGY.attr("d", crosshairLine(crosshairMouseMove[1]));
		
		// add text to the margin
		g.append("text")
			.attr("class", "information")
			.attr("x", coordinates[0])
			.attr("y", coordinates[1])
			.text("hey");

		});
		
}

function getDataIndex(data, date){
	var results = [Math.abs(data[0]["randomDate"].getTime() - date.getTime()), 0] 
	for (var i = 0; i < data.length; i++){
		if (Math.abs(data[i]["randomDate"].getTime() - date.getTime()) < results[0]){
			results = [Math.abs(data[i]["randomDate"].getTime() - date.getTime()), i]
			}
		}
	return results[1];
}
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