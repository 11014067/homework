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

	// formulas to calculate the alpha and the beta
	var alpha = (rangeMax - rangeMin) / (domainMax - domainMin)
	var beta = rangeMax - alpha * domainMax

	// returns the function for the linear transformation (y = a * x + b)
	return function(x){
		return alpha * x + beta;
		}
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
			drawGraph();
			}
		}
	requestData.open("GET", "http://127.0.0.1:8080/week2data.txt");
	requestData.send();
	}

/**
* Draw the Graph.
**/	
	
function drawGraph(){
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
	
	// make the canvas and domain ranges
	var canvasDayMin = 100;
	var canvasDayMax = 450;
	var canvasTempMin = 50;
	var canvasTempMax = 350;
	var domainDay = [0,365];
	var domainTemp = [300, -150];
	var rangeDay = [canvasDayMin, canvasDayMax];
	var rangeTemp = [canvasTempMin, canvasTempMax];
	
	// get the transform functions
	var abDay = createTransform(domainDay, rangeDay);
	var abTemp = createTransform(domainTemp, rangeTemp);

	// get a canvas
	var emptyCanvas = document.getElementById("canvas")
	var canvas = emptyCanvas.getContext("2d");
	
	// print the axis
	canvas.moveTo(canvasDayMin - 10, abTemp(250));
	canvas.lineTo(canvasDayMin - 10, canvasTempMax);
	canvas.moveTo(canvasDayMin, canvasTempMax);
	canvas.lineTo(canvasDayMax, canvasTempMax);
	canvas.stroke();
	
	// make the axis labels
	yAxis = ["-15", "-10", "-5", "0", "5", "10", "15", "20", "25"];
	xAxis = [["1997", 0], ["February", 31], ["March", 59], ["April", 91], 
		["May", 121], ["june", 152], ["july", 182], ["august", 213], ["september", 244], 
		["oktober", 274], ["november", 305], ["december", 335], ["1998", 365]];
	
	// make the Y axis.
	canvas.textAlign = "right";
	for (var i = 0; i < yAxis.length; i++){
		// make the Y axis label
		place = parseInt(yAxis[i]) * 10;
		canvas.fillText(yAxis[i], canvasDayMin - 20, abTemp(place) + 2);
		// make a line to that label
		canvas.moveTo(canvasDayMin - 10, abTemp(place));
		canvas.lineTo(canvasDayMin - 15, abTemp(place));
		canvas.stroke();
		}
	
	for (var i = 0; i < xAxis.length; i++){
		// make the x axis label and rotate on that point
		canvas.save();
		canvas.translate(abDay(xAxis[i][1]), canvasTempMax + 20);
		canvas.rotate(-Math.PI/4);
		canvas.fillText(xAxis[i][0], 0,0);
		canvas.restore()
		// make a line to that label
		canvas.moveTo(abDay(xAxis[i][1]), canvasTempMax);
		canvas.lineTo(abDay(xAxis[i][1]), canvasTempMax + 10);
		canvas.stroke();
		}
	
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
	
	// write titles
	canvas.textAlign = "center"
	// graph title
	canvas.font = "20px Calibri";
	canvas.fillText("Temperature at De Bilt (NL) in 1997", (canvasDayMax - canvasDayMin)/2 + canvasDayMin, canvasTempMin);
	// axis titles
	canvas.font = "15px Calibri";
	canvas.fillText("Date in Months", (canvasDayMax - canvasDayMin)/2 + canvasDayMin, canvasTempMax + 70);
	var Ytitle = "Temperature in Celcius";
	var placement = canvasTempMin + 30
	var steps = (canvasTempMax - canvasTempMin)/ Ytitle.length
	for (var i = 0; i < Ytitle.length; i++){
		canvas.fillText(Ytitle[i], (canvasDayMin - 50), placement)
		placement = placement + steps
		}
	
	// print a zero temperature line
	canvas.beginPath();
	canvas.moveTo(canvasDayMin - 10, abTemp(0));
	// make the line red
	canvas.strokeStyle = "red";
	canvas.lineTo(canvasDayMax, abTemp(0));
	canvas.stroke();
	
	}