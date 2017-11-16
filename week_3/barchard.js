/****
*
*
****/

function getData(){
	d3.json("NL.json", function(data) {
		svgChard(data);
	});
}

function svgChard(JSONdata){
	console.log(JSONdata)
	var width = 1000;
	var height = 350;
	var upperSpace = 100
	var leftSpace = 50
	var barWidth = ((width - 50)/JSONdata.length)-5;
   
	var x = d3.scale.linear()
			.domain([0, d3.max(JSONdata,function(NL) { return (parseInt(NL.index));})])
			.range([0, width]);
	var xOrdinal = d3.scale.ordinal()
			.domain(["a", "b", "c", "d", "e", "f", "g", "h", "i", "j","k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"])
			.rangeBands([0, width]);
	var y = d3.scale.linear()
			.domain([0, d3.max(JSONdata, function(NL) { return parseFloat(NL.percentage); })])
			.rangeRound([height, 0]);
	
	var bars = d3.select(".chard");
	
	xAxis = d3.svg.axis().scale(xOrdinal).orient("bottom");
	bars.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + leftSpace + "," + (height+upperSpace) + ")")
		.call(xAxis);
	yAxis = d3.svg.axis().scale(y).orient("left");
	bars.append("g")
		.attr("class", "y axis")
		.attr("x", "50")
		.call(yAxis);
	    
	bars.append("text")
		.attr("x", width/2)
		.attr("y", upperSpace/2)
		.attr("text-anchor", "middle")
		.style("font-size", "20px")
		.text("The letter frequency in the Dutch language.")
		
	bars.selectAll("data")
		.data(JSONdata)
		.enter()
		.append("rect")
			.attr("x", function(NL, index) { return x(index) + leftSpace; })
			.attr("y", function(NL) { return y(NL.percentage) + upperSpace; })
			.attr("height", function(NL) { return height - y(NL.percentage); })
			.attr("width", barWidth)
			.attr("fill", "#0F0F8A")
			.on("mouseover", function() {
				d3.select(this).attr("fill", "#8A0F0F");
				var place = d3.select(this).attr("x");
				place = "text[x='" + place + "']";
				bars.selectAll(place).attr("visibility", "visible");
				})
			.on("mouseout", function() {
				d3.select(this).attr("fill", "#0F0F8A");
				var place = d3.select(this).attr("x");
				place = "text[x='" + place + "']";
				bars.selectAll(place).attr("visibility", "hidden");
				})
	bars.selectAll("data")
		.data(JSONdata)
		.enter()
		.append("text")
		.attr("x", function(NL, index) { return x(index) + leftSpace; })
		.attr("y", function(NL) { return y(NL.percentage) + upperSpace; })
		.attr("dx", barWidth/2)
		.attr("dy", "20")
		.style("font-size", "12px")
		.attr("text-anchor", "middle")
		.attr("fill", "white")
		.attr("visibility", "hidden")
		.text(function(NL) { return NL.percentage;})		

}


///np