/***
* Name: Sanne Oud 
* Student number: 11014067
* Data processing
*
* This script makes a graph of the temperature in 1997 at De Bilt (NL)
***/

/** 
* Create a transform function, it gives back a function to 
* convert for the data into a coordinate on the range.
**/
function createTransform(domain, range){
	// get the min and max
	var domainMin = domain[0]
	var domainMax = domain[1]
	var rangeMin = range[0]
	var rangeMax = range[1]

	// calculate alpha and beta
	var alpha = (rangeMax - rangeMin) / (domainMax - domainMin)
	var beta = rangeMax - alpha * domainMax

	// returns the function for the linear transformation (y = a * x + b)
	return function(x){
		return alpha * x + beta;
		}
	}
	
/**
* Get the minimum and maximum of a column in a list.
**/
function minMax(list, j){
	// make a min and max
	var minInt;
	var maxInt;
	if (j >= 0 && j < 10){
		// get a starting value
		minInt = list[0][j];
		maxInt = list[0][j];
		for (var i = 1; i < list.length; i++){
			// if the value is the new max or min, save that
			if (list[i][j] < minInt){
				minInt = list[i][j];
			}
			else if (list[i][j] > maxInt){
				maxInt = list[i][j];
			}
		}
	}
	else{
		// if the given index is not numerical and between 0 and 9, return NaN
		return NaN
	}
	// return the minimum and maximum in a list
	return [minInt, maxInt]
}

 /**
 * Get the data from the server.
 **/
function getData(){
	// get the data via a http request
	var requestData = new XMLHttpRequest()
	requestData.onreadystatechange = function() {
		// when done save the data and call the drawGraph function
		if (this.readyState == 4 && this.status == 200) {
			document.getElementById("rawData").value = requestData.responseText;
			drawData();
			}
		}
	requestData.open("GET", "week2data.txt");
	requestData.send();
	}

/**
* Draw the Graph.
**/	
function drawData(){
	var data = []
	
	// get the data split on the lines
	var rawData = document.getElementById("rawData").value;
	var splitData = rawData.split("\n");
	
	// split the data into columns and get the relative date
	for (var i = 1; i < splitData.length - 1; i ++) {
		// column split the data
		var columnData = splitData[i].split(",");
		
		// get the date relative to the first
		temp = "" + parseInt(columnData[0]);
		// calculate the day by converting it to miliseconds from 1970-01-01
		temp = new Date(temp.substring(0,4) + "-" + temp.substring(4,6) + "-" + temp.substring(6,8))
		// calculate back to days
		milisecDay = 1000 * 60 * 60 * 24
		temp /= milisecDay
		// save the first day
		if (i == 1){
			firstDate = temp;
			}
		// get the amount of days from the first day
		columnData[0] = temp- firstDate;
		
		// save the data
		data[i-1] = [columnData[0], parseInt(columnData[1])];
		}
	
	// get a canvas
	var emptyCanvas = document.getElementById("canvas")
	var canvas = emptyCanvas.getContext("2d");

	// make the graph ranges
	var boundery = 100
	var canvasDayMin = boundery;
	var canvasDayMax = emptyCanvas.width - boundery;
	var canvasTempMin = boundery;
	var canvasTempMax = emptyCanvas.height - boundery;
	
	// make the domains
	var domainDay = minMax(data, 0);
	var domainTemporary = minMax(data, 1);
	
	// turn the temperature domain around
	var domainTemp = [];
	domainTemp[0] = domainTemporary[1];
	domainTemp[1] = domainTemporary[0];
	
	// make the axis ranges
	var rangeDay = [canvasDayMin, canvasDayMax];
	var rangeTemp = [canvasTempMin, canvasTempMax];
		
	// get the transform functions
	var abDay = createTransform(domainDay, rangeDay);
	var abTemp = createTransform(domainTemp, rangeTemp);
	
	// make the axis labels
	yAxis = ["-15", "-10", "-5", "0", "5", "10", "15", "20", "25"];
	xAxis = [["1997", 0], ["February", 31], ["March", 59], ["April", 91], 
		["May", 121], ["june", 152], ["july", 182], ["august", 213], ["september", 244], 
		["oktober", 274], ["november", 305], ["december", 335], ["1998", 365]];
		
	// print the axis
	canvas.moveTo(canvasDayMin - 10, abTemp(parseInt(yAxis[0]) * 10));
	canvas.lineTo(canvasDayMin - 10, abTemp(parseInt(yAxis[yAxis.length - 1]) * 10));
	canvas.moveTo(canvasDayMin, canvasTempMax + 10);
	canvas.lineTo(canvasDayMax, canvasTempMax + 10);
	canvas.stroke();
	
	// right align text
	canvas.textAlign = "right";
	
	// make the x axis
	for (var i = 0; i < xAxis.length; i++){
		// make the x axis label and rotate on that point
		canvas.save();
		canvas.translate(abDay(xAxis[i][1]), canvasTempMax + 30);
		canvas.rotate(-Math.PI/4);
		canvas.fillText(xAxis[i][0], 0,0);
		canvas.restore()
		// make a line to that label
		canvas.moveTo(abDay(xAxis[i][1]), canvasTempMax + 10);
		canvas.lineTo(abDay(xAxis[i][1]), canvasTempMax + 20);
		canvas.stroke();
		}
	
	// make the y axis.
	for (var i = 0; i < yAxis.length; i++){
		// make the y axis label
		place = parseInt(yAxis[i]) * 10;
		canvas.fillText(yAxis[i], canvasDayMin - 20, abTemp(place) + 2);
		// make a line to that label
		canvas.moveTo(canvasDayMin - 10, abTemp(place));
		canvas.lineTo(canvasDayMin - 15, abTemp(place));
		canvas.stroke();
		}
		
	// write titles in the centre
	canvas.textAlign = "center"
	// graph title
	canvas.font = "20px Calibri";
	canvas.fillText("Temperature at De Bilt (NL) in 1997", (canvasDayMax - canvasDayMin)/2 + canvasDayMin, boundery / 2);
	// axis titles
	canvas.font = "15px Calibri";
	canvas.fillText("Date in Months", (canvasDayMax - canvasDayMin)/2 + canvasDayMin, canvasTempMax + boundery - 20);
	var Ytitle = "Temperature in Celcius";
	var placement = canvasTempMin + 10
	var steps = (canvasTempMax - canvasTempMin)/ (Ytitle.length - 1)
	for (var i = 0; i < Ytitle.length; i++){
		canvas.fillText(Ytitle[i], (boundery / 2), placement)
		placement = placement + steps
		}
	
	// print a zero temperature line
	canvas.beginPath();
	canvas.moveTo(canvasDayMin - 10, abTemp(0));
	// make the line red
	canvas.strokeStyle = "red";
	canvas.lineTo(canvasDayMax, abTemp(0));
	canvas.stroke();
	canvas.strokeStyle = "black"
	
	// print the graph
	count = 0;
	canvas.beginPath();
	for (var i = 0; i < data.length; i++) {
		// move to the first spot
		if (count == 0) {
			// calculate the starting spot
			start = abTemp(data[i][1]);
			// draw a invisible line
			canvas.moveTo(canvasDayMin, start);
			// go on with the rest of the graph
			count = 1;
			}
		// print a line to the next spots
		else {
			// calculate the spot on the canvas
			tempPlace = abTemp(data[i][1]);
			dayPlace = abDay(data[i][0]);
			// draw a invisible line
			canvas.lineTo(dayPlace, tempPlace);
			}
		}
	// draw the actual line
	canvas.stroke();
	
	}
