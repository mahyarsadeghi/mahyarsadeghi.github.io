
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
let x3 = d3.scaleLinear()
	.range([0, width3])
//   .padding(0.2);
let xAxis3 = svg3.append("g")
	.attr("transform", `translate(0,${height3})`)


// Initialize the Y axis
let y3 = d3.scaleBand()
	.range([0, height3])
	.padding(.2);
let yAxis3 = svg3.append("g")
	.attr("class", "myYaxis")

function update_initial_chart3() {
	d3.csv("../../data/top_20_artists_sales.csv").then(function (data) {

		let scolor = d3.scaleSequential()
			.domain([0, 550])
			.interpolator(d3.interpolateGreens);



		let mouseover = function (event, d) {
			let artist = d.Artist;
			let totalAmount = d['Sales ($)'].toString().split(".")[0]
			if (totalAmount > 999) {
				totalAmount = `${d['Sales ($)']} billion`
			} else {
				totalAmount = `${d['Sales ($)']} million`
			}

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

		x3.domain([0, 600])
		xAxis3.transition().duration(1000).call(d3.axisBottom(x3))
			.selectAll("text")
			// .attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

			svg3.append("text")
			.attr('class', "text-axis-chart3")
			.attr("text-anchor", "end")
			.attr("x", width3)
			.attr("y", height3 + 50)
			.text("Sales ($)");

		// Update the Y axis
		y3.domain(data.map(d => d.Artist));
		yAxis3.transition().duration(1000).call(d3.axisLeft(y3))
			.selectAll("text")
			// .attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");
			svg3.append("text")
		.attr('class', "text-axis-chart3")
		.attr("text-anchor", "end")
		.attr("x", -55)
		.attr("y", height3 - 550)
		.text("Artists");

		// Create the u variable
		var u = svg3.selectAll("rect")
			.data(data)


		u
			.join("rect")
			// .transition()
			// .duration(1000) // Add a new rect for each new elements
			.attr("y", d => y3(d.Artist))
			.attr("x", x3(0))
			.attr("width", d => x3(d['Sales ($)']))
			.attr("height", y3.bandwidth())
			.attr("fill", d => scolor(d['Sales ($)']))
			.on('mouseover', mouseover)
			.on('mouseleave', mouseleave)
			.on('mousemove', mousemove)


	});
	// Update the X axis
}
// A function that create / update the plot for a given variable:
function update1() {
	d3.csv("../../data/top_20_artists_sales.csv").then(function (data) {

		let scolor = d3.scaleSequential()
			.domain([0, 550])
			.interpolator(d3.interpolateGreens);


		d3.selectAll('.text-axis-chart3').remove()
		let mouseover = function (event, d) {
			let artist = d.Artist;
			let totalAmount = d['Sales ($)'].toString().split(".")[0]
			if (totalAmount > 999) {
				totalAmount = `${d['Sales ($)']} billion`
			} else {
				totalAmount = `${d['Sales ($)']} million`
			}

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

		x3.domain([0, 600])
		xAxis3.transition().duration(1000).call(d3.axisBottom(x3))
			.selectAll("text")
			// .attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

			svg3.append("text")
			.attr('class', "text-axis-chart3")
			.attr("text-anchor", "end")
			.attr("x", width3)
			.attr("y", height3 + 50)
			.text("Sales ($)");

		// Update the Y axis
		y3.domain(data.map(d => d.Artist));
		yAxis3.transition().duration(1000).call(d3.axisLeft(y3))
			.selectAll("text")
			// .attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");
			svg3.append("text")
			.attr('class', "text-axis-chart3")
			.attr("text-anchor", "end")
			.attr("x", -55)
			.attr("y", height3 - 550)
			.text("Artists");
	

		// Create the u variable
		var u = svg3.selectAll("rect")
			.data(data)


		u
			.join("rect")
			.transition()
			.duration(1000) // Add a new rect for each new elements
			.attr("y", d => y3(d.Artist))
			.attr("x", x3(0))
			.attr("width", d => x3(d['Sales ($)']))
			.attr("height", y3.bandwidth())
			.attr("fill", d => scolor(d['Sales ($)']))
			u
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

			d3.selectAll('.text-axis-chart3').remove()
		let mouseoverUpdate = function (event, d) {
			let totalAmount = d['TCU (unit)'];
			let artist = d.Artist;

			tooltip
				.html("<span style='color:grey'>Artist: </span>" + artist +
					"<br>" + "<span style='color:grey'>TCU (unit): </span>" + totalAmount + ' units')
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

		x3.domain([0, 450000000])
		xAxis3.transition().duration(1000).call(d3.axisBottom(x3))
			.selectAll("text")
			// .attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");
			svg3.append("text")
			// .transition().duration(1000)
			.attr('class', "text-axis-chart3")
			.attr("text-anchor", "end")
			.attr("x", width3 + 55)
			.attr("y", height3 + 50)
			.text("TCU (unit)");

		// Update the Y axis
		y3.domain(data.map(d => d.Artist));
		yAxis3.transition().duration(1000).call(d3.axisLeft(y3))
			.selectAll("text")
			// .attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");
			svg3.append("text")
			// .transition().duration(1000)
			.attr('class', "text-axis-chart3")
			.attr("text-anchor", "end")
			.attr("x", -55)
			.attr("y", height3 - 550)
			.text("Artists");
	

		// Create the u variable
		var u = svg3.selectAll("rect")
			.data(data)

		u
			.join("rect")
			.transition()
			.duration(1000) // Add a new rect for each new elements
			.attr("y", d => y3(d.Artist))
			.attr("x", x3(0))
			.attr("width", d => x3(d['TCU (unit)']))
			.attr("height", y3.bandwidth())
			.attr("fill", d => scolor2(d['TCU (unit)']));

		u
			.on('mouseover', mouseoverUpdate)
			.on('mouseleave', mouseleaveUpdate)
			.on('mousemove', mousemoveUpdate)
	});
	// Update the X axis

}

// Initialize the plot with the first dataset
update_initial_chart3();