
function getData(year){
		
	var parseDate = d3.time.format("%d-%m-%y").parse;
	jsonName = "week_5csv" + year + ".json"
	d3.select(".title").text("The temperature at De Bilt, Hoogeveen and Vlissingen in the year " + year + 
		" in degrees Celcius")
	// get the json data via d3
	d3.json(jsonName, function(error, data) {
		if (error) throw error;
		data.forEach(function(d) {
			d.Bilt = +d.Bilt;
			d.Hoogeveen = +d.Hoogeveen;
			d.Vlissingen = +d.Vlissingen;
			d.dateCopy = d["\ufeffDate"] = parseDate(d["\ufeffDate"]);
			});
		drawGraph(data);
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

//kleuren in disign keuze
//legenda
//headers en commends
//index
//nul lijn

function drawGraph(data){
	// remove the old graph if there
	d3.selectAll("g").remove();
	
	// create a g for the graph
	var svg = d3.selectAll("svg");
	var margin = {top: 10, right: 600, bottom: 50, left: 50};
	var width = +svg.attr("width") - margin.left - margin.right;
	var height = +svg.attr("height") - margin.top - margin.bottom;
	var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	// get the colours
	var colours = { Bilt: "#00009e", Hoogeveen: "#90009e", Vlissingen: "#F0009e"};
	
	// get the axis scales
	var x = d3.time.scale()
		.domain(d3.extent(data, function(d) { return d.dateCopy; }))
		.rangeRound([0, width]);
	var y = d3.scale.linear()
		.domain([d3.min(data, function(d) { return (Math.min(d.Bilt, d.Hoogeveen, d.Vlissingen) / 10) - 2; }),
			d3.max(data, function(d) { return (Math.max(d.Bilt, d.Hoogeveen, d.Vlissingen) / 10) + 2; })])
		.rangeRound([height, 0]);
	
	// define the line function for each city
	var BiltLine = d3.svg.line()
		.x(function(d) { return x(d.dateCopy); })
		.y(function(d) { return y(d.Bilt/10); });
	
	var HoogeveenLine = d3.svg.line()
		.x(function(d) { return x(d.dateCopy); })
		.y(function(d) { return y(d.Hoogeveen/10); });
		
	var VlissingenLine = d3.svg.line()
		.x(function(d) { return x(d.dateCopy); })
		.y(function(d) { return y(d.Vlissingen/10); });
	
	// draw a line for each city
	g.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", colours.Bilt)
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
		.attr("d", BiltLine(data));
	
	g.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", colours.Hoogeveen)
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
		.attr("d", HoogeveenLine(data));
	
	g.append("path")
		.datum(data)
		.attr("fill", "none")
		.attr("stroke", colours.Vlissingen)
		.attr("stroke-linejoin", "round")
		.attr("stroke-linecap", "round")
		.attr("stroke-width", 1.5)
		.attr("d", VlissingenLine(data));
	
	
	// get the axis functions
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
			.text("Date");
	
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
			.text("Temperature in Celcius");
	
	// get the crosshair line function
	var crosshairLine = d3.svg.line()
		.x(function(d) { return d.x; })
		.y(function(d) { return d.y; });
		
	// initiate the crosshairs
	var mouseX = 100;
	var mouseY = 400;
	var crosshairMouseX = [{x: mouseX, y: 0}, {x: mouseX, y: height}];
	var crosshairBilt = [{x: 0, y: mouseY}, {x: width, y: mouseY}];
	var crosshairHoogeveen = [{x: 0, y: mouseY + 5}, {x: width, y: mouseY + 5}];
	var crosshairVlissingen = [{x: 0, y: mouseY + 10}, {x: width, y: mouseY + 10}];

	
	// crosshairs
	var crosshairGX = g.append("path")
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("d", crosshairLine(crosshairMouseX));
	var crosshairGYBilt = g.append("path")
		.attr("fill", "none")
		.attr("stroke", colours.Bilt)
		.attr("d", crosshairLine(crosshairBilt));
	var crosshairGYHoogeveen = g.append("path")
		.attr("fill", "none")
		.attr("stroke", colours.Hoogeveen)
		.attr("d", crosshairLine(crosshairHoogeveen));
	var crosshairGYVlissingen = g.append("path")
		.attr("fill", "none")
		.attr("stroke", colours.Vlissingen)
		.attr("d", crosshairLine(crosshairVlissingen));
		
	// show crosshairs and information
	svg.on("mousemove", function() {
		d3.selectAll(".information").remove()
		d3.selectAll(".background").remove()
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
		var index = getDataIndex(data, dateX);
		
		// get the x and y per location
		var xDate = x(data[index].dateCopy);
		var yBilt = y(data[index].Bilt / 10);
		var yHoogeveen = y(data[index].Hoogeveen / 10);
		var yVlissingen = y(data[index].Vlissingen / 10);
		
		// coordinate the crosshairs
		crosshairMouseX = [{x: xDate, y: 0}, {x: xDate, y: height}];
		crosshairBilt = [{x: 0, y: yBilt}, {x: width, y: yBilt}];
		crosshairHoogeveen = [{x: 0, y: yHoogeveen}, {x: width, y: yHoogeveen}];
		crosshairVlissingen = [{x: 0, y: yVlissingen}, {x: width, y: yVlissingen}];
		
		// draw the crosshair
		crosshairGX.attr("d", crosshairLine(crosshairMouseX));
		crosshairGYBilt.attr("d", crosshairLine(crosshairBilt));
		crosshairGYHoogeveen.attr("d", crosshairLine(crosshairHoogeveen));
		crosshairGYVlissingen.attr("d", crosshairLine(crosshairVlissingen));
		
		// position the information
		if (mouseX < (width / 5)){
			placeX = mouseX + 10
			placeY = margin.top + 30
			}
		else if (mouseX > (width - (width / 5))){
			placeX = mouseX - 165
			placeY = margin.top + 30
			}
		else {
			placeX = mouseX + 10
			placeY = height - 70
			}
		
		// add the information
		g.append("rect")
			.attr("class", "background")
			.attr("x", placeX - 5)
			.attr("y", placeY - 15)
			.attr("width", 160)
			.attr("height", 70)
			.attr("fill", "white")
			.attr("stroke", "black");
		g.append("text")
			.attr("class", "information")
			.attr("x", placeX)
			.attr("y", placeY)
			.text("Temperature on " + data[index].dateCopy.getDate() + "-" + (data[index].dateCopy.getMonth() + 1));
		g.append("text")
			.attr("class", "information")
			.attr("x", placeX + 5)
			.attr("y", placeY + 20)
			.text("Bilt : " + data[index].Bilt / 10);
		g.append("text")
			.attr("class", "information")
			.attr("x", placeX + 5)
			.attr("y", placeY + 35)
			.text("Hoogeveen : " + data[index].Hoogeveen / 10);
		g.append("text")
			.attr("class", "information")
			.attr("x", placeX + 5)
			.attr("y", placeY + 50)
			.text("Vlissingen : " + data[index].Vlissingen / 10);
		});
		
}

function getDataIndex(data, date){
	var results = [Math.abs(data[0].dateCopy.getTime() - date.getTime()), 0] 
	for (var i = 0; i < data.length; i++){
		if (Math.abs(data[i].dateCopy.getTime() - date.getTime()) < results[0]){
			results = [Math.abs(data[i].dateCopy.getTime() - date.getTime()), i]
			}
		}
	return results[1];
}