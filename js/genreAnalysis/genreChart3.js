// var margin = {top: 100, right: 100, bottom: 100, left: 100},
// 				width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right,
// 				height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20);

// 			////////////////////////////////////////////////////////////// 
// 			////////////////////////// Data ////////////////////////////// 
// 			////////////////////////////////////////////////////////////// 

// 			var data = [
// 					  [//iPhone
// 						{axis:"Battery Life",value:0.22},
// 						{axis:"Brand",value:0.28},
// 						{axis:"Contract Cost",value:0.29},
// 						{axis:"Design And Quality",value:0.17},
// 						{axis:"Have Internet Connectivity",value:0.22},
// 						{axis:"Large Screen",value:0.02},
// 						{axis:"Price Of Device",value:0.21},
// 						{axis:"To Be A Smartphone",value:0.50}			
// 					  ],[//Samsung
// 						{axis:"Battery Life",value:0.27},
// 						{axis:"Brand",value:0.16},
// 						{axis:"Contract Cost",value:0.35},
// 						{axis:"Design And Quality",value:0.13},
// 						{axis:"Have Internet Connectivity",value:0.20},
// 						{axis:"Large Screen",value:0.13},
// 						{axis:"Price Of Device",value:0.35},
// 						{axis:"To Be A Smartphone",value:0.38}
// 					  ],[//Nokia Smartphone
// 						{axis:"Battery Life",value:0.26},
// 						{axis:"Brand",value:0.10},
// 						{axis:"Contract Cost",value:0.30},
// 						{axis:"Design And Quality",value:0.14},
// 						{axis:"Have Internet Connectivity",value:0.22},
// 						{axis:"Large Screen",value:0.04},
// 						{axis:"Price Of Device",value:0.41},
// 						{axis:"To Be A Smartphone",value:0.30}
// 					  ]
// 					];
// 			////////////////////////////////////////////////////////////// 
// 			//////////////////// Draw the Chart ////////////////////////// 
// 			////////////////////////////////////////////////////////////// 

// 			var color = d3.scaleOrdinal()
// 				.range(["#EDC951","#CC333F","#00A0B0"]);

// 			var radarChartOptions = {
// 			  w: width,
// 			  h: height,
// 			  margin: margin,
// 			  maxValue: 0.5,
// 			  levels: 5,
// 			  roundStrokes: true,
// 			  color: color
// 			};
// 			//Call function to draw the Radar chart
// 			RadarChart(".radarChart", data, radarChartOptions);









// function RadarChart(id, data, options) {
// 	var cfg = {
// 	 w: 600,				//Width of the circle
// 	 h: 600,				//Height of the circle
// 	 margin: {top: 20, right: 20, bottom: 20, left: 20}, //The margins of the SVG
// 	 levels: 3,				//How many levels or inner circles should there be drawn
// 	 maxValue: 0, 			//What is the value that the biggest circle will represent
// 	 labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
// 	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
// 	 opacityArea: 0.35, 	//The opacity of the area of the blob
// 	 dotRadius: 4, 			//The size of the colored circles of each blog
// 	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
// 	 strokeWidth: 2, 		//The width of the stroke around each blob
// 	 roundStrokes: false,	//If true the area and stroke will follow a round path (cardinal-closed)
// 	 color: d3.scaleOrdinal()	//Color function
// 	};

// 	//Put all of the options into a variable called cfg
// 	if('undefined' !== typeof options){
// 	  for(var i in options){
// 		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
// 	  }//for i
// 	}//if

// 	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
// 	var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));

// 	var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
// 		total = allAxis.length,					//The number of different axes
// 		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
// 		Format = d3.format('%'),			 	//Percentage formatting
// 		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

// 	//Scale for the radius
// 	var rScale = d3.scaleLinear()
// 		.range([0, radius])
// 		.domain([0, maxValue]);

// 	/////////////////////////////////////////////////////////
// 	//////////// Create the container SVG and g /////////////
// 	/////////////////////////////////////////////////////////

// 	//Remove whatever chart with the same id/class was present before
// 	d3.select(id).select("svg").remove();

// 	//Initiate the radar chart SVG
// 	var svg = d3.select(id).append("svg")
// 			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
// 			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
// 			.attr("class", "radar"+id);
// 	//Append a g element		
// 	var g = svg.append("g")
// 			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

// 	/////////////////////////////////////////////////////////
// 	////////// Glow filter for some extra pizzazz ///////////
// 	/////////////////////////////////////////////////////////

// 	//Filter for the outside glow
// 	var filter = g.append('defs').append('filter').attr('id','glow'),
// 		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
// 		feMerge = filter.append('feMerge'),
// 		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
// 		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

// 	/////////////////////////////////////////////////////////
// 	/////////////// Draw the Circular grid //////////////////
// 	/////////////////////////////////////////////////////////

// 	//Wrapper for the grid & axes
// 	var axisGrid = g.append("g").attr("class", "axisWrapper");

// 	//Draw the background circles
// 	axisGrid.selectAll(".levels")
// 	   .data(d3.range(1,(cfg.levels+1)).reverse())
// 	   .enter()
// 		.append("circle")
// 		.attr("class", "gridCircle")
// 		.attr("r", function(d, i){return radius/cfg.levels*d;})
// 		.style("fill", "#CDCDCD")
// 		.style("stroke", "#CDCDCD")
// 		.style("fill-opacity", cfg.opacityCircles)
// 		.style("filter" , "url(#glow)");

// 	//Text indicating at what % each level is
// 	axisGrid.selectAll(".axisLabel")
// 	   .data(d3.range(1,(cfg.levels+1)).reverse())
// 	   .enter().append("text")
// 	   .attr("class", "axisLabel")
// 	   .attr("x", 4)
// 	   .attr("y", function(d){return -d*radius/cfg.levels;})
// 	   .attr("dy", "0.4em")
// 	   .style("font-size", "10px")
// 	   .attr("fill", "#737373")
// 	   .text(function(d,i) { return Format(maxValue * d/cfg.levels); });

// 	/////////////////////////////////////////////////////////
// 	//////////////////// Draw the axes //////////////////////
// 	/////////////////////////////////////////////////////////

// 	//Create the straight lines radiating outward from the center
// 	var axis = axisGrid.selectAll(".axis")
// 		.data(allAxis)
// 		.enter()
// 		.append("g")
// 		.attr("class", "axis");
// 	//Append the lines
// 	axis.append("line")
// 		.attr("x1", 0)
// 		.attr("y1", 0)
// 		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
// 		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
// 		.attr("class", "line")
// 		.style("stroke", "white")
// 		.style("stroke-width", "2px");

// 	//Append the labels at each axis
// 	axis.append("text")
// 		.attr("class", "legend")
// 		.style("font-size", "11px")
// 		.attr("text-anchor", "middle")
// 		.attr("dy", "0.35em")
// 		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
// 		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
// 		.text(function(d){return d})
// 		.call(wrap, cfg.wrapWidth);

// 	/////////////////////////////////////////////////////////
// 	///////////// Draw the radar chart blobs ////////////////
// 	/////////////////////////////////////////////////////////

// 	//The radial line function
// 	var radarLine = d3.lineRadial()
// 		// .interpolate("linear-closed")

// 		.radius(function(d) { return rScale(d.value); })
// 		.angle(function(d,i) {	return i*angleSlice; })
//         .curve(d3.curveLinear);

// 	if(cfg.roundStrokes) {
// 		// radarLine.interpolate("cardinal-closed");
//         radarLine.curve(d3.curveCardinal)
// 	}

// 	//Create a wrapper for the blobs	
// 	var blobWrapper = g.selectAll(".radarWrapper")
// 		.data(data)
// 		.enter().append("g")
// 		.attr("class", "radarWrapper");

// 	//Append the backgrounds	
// 	blobWrapper
// 		.append("path")
// 		.attr("class", "radarArea")
// 		.attr("d", function(d,i) { return radarLine(d); })
// 		.style("fill", function(d,i) { return cfg.color(i); })
// 		.style("fill-opacity", cfg.opacityArea)
// 		.on('mouseover', function (d,i){
// 			//Dim all blobs
// 			d3.selectAll(".radarArea")
// 				.transition().duration(200)
// 				.style("fill-opacity", 0.1); 
// 			//Bring back the hovered over blob
// 			d3.select(this)
// 				.transition().duration(200)
// 				.style("fill-opacity", 0.7);	
// 		})
// 		.on('mouseout', function(){
// 			//Bring back all blobs
// 			d3.selectAll(".radarArea")
// 				.transition().duration(200)
// 				.style("fill-opacity", cfg.opacityArea);
// 		});

// 	//Create the outlines	
// 	blobWrapper.append("path")
// 		.attr("class", "radarStroke")
// 		.attr("d", function(d,i) { return radarLine(d); })
// 		.style("stroke-width", cfg.strokeWidth + "px")
// 		.style("stroke", function(d,i) { return cfg.color(i); })
// 		.style("fill", "none")
// 		.style("filter" , "url(#glow)");		

// 	//Append the circles
// 	blobWrapper.selectAll(".radarCircle")
// 		.data(function(d,i) { return d; })
// 		.enter().append("circle")
// 		.attr("class", "radarCircle")
// 		.attr("r", cfg.dotRadius)
// 		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
// 		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
// 		.style("fill", function(d,i,j) { return cfg.color(j); })
// 		.style("fill-opacity", 0.8);

// 	/////////////////////////////////////////////////////////
// 	//////// Append invisible circles for tooltip ///////////
// 	/////////////////////////////////////////////////////////

// 	//Wrapper for the invisible circles on top
// 	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
// 		.data(data)
// 		.enter().append("g")
// 		.attr("class", "radarCircleWrapper");

// 	//Append a set of invisible circles on top for the mouseover pop-up
// 	blobCircleWrapper.selectAll(".radarInvisibleCircle")
// 		.data(function(d,i) { return d; })
// 		.enter().append("circle")
// 		.attr("class", "radarInvisibleCircle")
// 		.attr("r", cfg.dotRadius*1.5)
// 		.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
// 		.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
// 		.style("fill", "none")
// 		.style("pointer-events", "all")
// 		.on("mouseover", function(d,i) {
// 			newX =  parseFloat(d3.select(this).attr('cx')) - 10;
// 			newY =  parseFloat(d3.select(this).attr('cy')) - 10;

// 			tooltip
// 				.attr('x', newX)
// 				.attr('y', newY)
// 				.text(Format(d.value))
// 				.transition().duration(200)
// 				.style('opacity', 1);
// 		})
// 		.on("mouseout", function(){
// 			tooltip.transition().duration(200)
// 				.style("opacity", 0);
// 		});

// 	//Set up the small tooltip for when you hover over a circle
// 	var tooltip = g.append("text")
// 		.attr("class", "tooltip")
// 		.style("opacity", 0);

// 	/////////////////////////////////////////////////////////
// 	/////////////////// Helper Function /////////////////////
// 	/////////////////////////////////////////////////////////

// 	//Taken from http://bl.ocks.org/mbostock/7555321
// 	//Wraps SVG text	
// 	function wrap(text, width) {
// 	  text.each(function() {
// 		var text = d3.select(this),
// 			words = text.text().split(/\s+/).reverse(),
// 			word,
// 			line = [],
// 			lineNumber = 0,
// 			lineHeight = 1.4, // ems
// 			y = text.attr("y"),
// 			x = text.attr("x"),
// 			dy = parseFloat(text.attr("dy")),
// 			tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

// 		while (word = words.pop()) {
// 		  line.push(word);
// 		  tspan.text(line.join(" "));
// 		  if (tspan.node().getComputedTextLength() > width) {
// 			line.pop();
// 			tspan.text(line.join(" "));
// 			line = [word];
// 			tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
// 		  }
// 		}
// 	  });
// 	}//wrap	

// }//RadarChart


// create 2 data_set


// set the dimensions and margins of the graph
const margin3 = { top: 30, right: 30, bottom: 70, left: 60 },
	width3 = 700 - margin3.left - margin3.right,
	height3 = 650 - margin3.top - margin3.bottom;


// append the svg object to the body of the page
const svg3 = d3.select("#genreChart3")
	.append("svg")
	// .attr("width", width3 + margin3.left + margin3.right)
	// .attr("height", height3 + margin3.top + margin3.bottom)
	.attr("viewBox", `-180 0 1000 650`)
	.append("g")
	.attr("transform", `translate(${margin3.left},${margin3.top})`);


	let tooltip = d3.select("#genreChart3")
	.append("div")
	.style("opacity", 0)
	.attr("class", "tooltip")
	.style("background-color", "white")
	.style("border", "solid")
	.style("border-width", "2px")
	.style("border-radius", "5px")
	.style("padding", "10px")

// Initialize the X axis
let x = d3.scaleLinear()
	.range([0, width3])
//   .padding(0.2);
let xAxis = svg3.append("g")
	.attr("transform", `translate(0,${height3})`)


// Initialize the Y axis
let y = d3.scaleBand()
	.range([0, height3])
	.padding(.2);
let yAxis = svg3.append("g")
	.attr("class", "myYaxis")


// A function that create / update the plot for a given variable:
function update1() {
	d3.csv("../../data/top_20_artists_sales.csv").then(function (data) {

		let scolor = d3.scaleSequential()
			.domain([0, 550])
			.interpolator(d3.interpolateGreens);



		let mouseover = function (event, d) {
			let totalAmount = d['Sales ($)'];
			let artist = d.Artist;

			tooltip
				.html("<span style='color:grey'>Artist: </span>" + artist +
					"<br>" + "<span style='color:grey'>Sales ($): </span>" + totalAmount)
				.style("opacity", 1);
			d3.select(this).attr("fill", "#9B2335");
		}
		let mousemove = function (event, d) {
			tooltip
				.style('left', (event.pageX + 40) + 'px')
				.style('top', (event.pageY + 5) + 'px')
		}
		let mouseleave = function (event, d) {
			tooltip
				.style("opacity", 0);
			d3.select(this).attr("fill", d => scolor(d['Sales ($)']));
		}

		x.domain([0, 600])
		xAxis.call(d3.axisBottom(x))
			.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

		// Update the Y axis
		y.domain(data.map(d => d.Artist));
		yAxis.transition().duration(1000).call(d3.axisLeft(y))
			.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

		// Create the u variable
		var u = svg3.selectAll("rect")
			.data(data)


		u
			.join("rect") // Add a new rect for each new elements
			.attr("y", d => y(d.Artist))
			.attr("x", x(0))
			.attr("width", d => x(d['Sales ($)']))
			.attr("height", y.bandwidth())
			.attr("fill", d => scolor(d['Sales ($)']))
			.on('mouseover', mouseover)
			.on('mouseleave', mouseleave)
			.on('mousemove', mousemove)
			

	});
	// Update the X axis

}

function update2() {
	d3.csv("../../data/top_20_artists_TCU.csv").then(function (data) {
		let scolor2 = d3.scaleSequential()
			.domain([0, 450000000])
			.interpolator(d3.interpolateBlues);

			let mouseoverUpdate = function (event, d) {
				let totalAmount = d['TCU (unit)'];
				let artist = d.Artist;
	
				tooltip
					.html("<span style='color:grey'>Artist: </span>" + artist +
						"<br>" + "<span style='color:grey'>TCU (unit): </span>" + totalAmount)
					.style("opacity", 1);
				d3.select(this).attr("fill", "#9B2335");
			}
			let mousemoveUpdate = function (event, d) {
				tooltip
					.style('left', (event.pageX + 40) + 'px')
					.style('top', (event.pageY + 5) + 'px')
			}
			let mouseleaveUpdate = function (event, d) {
				tooltip
					.style("opacity", 0);
				d3.select(this).attr("fill", d => scolor2(d['TCU (unit)']));
			}

		x.domain([0, 450000000])
		xAxis.call(d3.axisBottom(x))
			.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

		// Update the Y axis
		y.domain(data.map(d => d.Artist));
		yAxis.transition().duration(1000).call(d3.axisLeft(y))
			.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

		// Create the u variable
		var u = svg3.selectAll("rect")
			.data(data)

		u
			.join("rect") // Add a new rect for each new elements
			.attr("y", d => y(d.Artist))
			.attr("x", x(0))
			.attr("width", d => x(d['TCU (unit)']))
			.attr("height", y.bandwidth())
			.attr("fill", d => scolor2(d['TCU (unit)']))
			.on('mouseover', mouseoverUpdate)
			.on('mouseleave', mouseleaveUpdate)
			.on('mousemove', mousemoveUpdate)
	});
	// Update the X axis

}

// Initialize the plot with the first dataset
update1()