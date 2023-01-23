
// set the dimensions and margins of the graph
const margin1 = { top: 20, right: 30, bottom: 70, left: 60 },
	width1 = 600 - margin1.left - margin1.right,
	height1 = 600 - margin1.top - margin1.bottom;


// append the svg object to the body of the page
const svg1 = d3.select("#genreChart2")
	.append("svg")
	// .attr("width", width3 + margin3.left + margin3.right)
	// .attr("height", height3 + margin3.top + margin3.bottom)
	.attr("viewBox", `-200 20 1000 600`)
	.append("g")
	.attr("transform", `translate(${margin1.left},${margin1.top})`);


let tooltip1 = d3.select("#genreChart2")
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
	.range([0, width1])
let xAxis = svg1.append("g")
	.attr("transform", `translate(0,${height1})`)


// Initialize the Y axis
let y = d3.scaleBand()
	.range([0, height1])
	.padding(.2);
let yAxis = svg1.append("g")
	.attr("class", "myYaxis")

function update_initial_chart2() {
	d3.csv("../../data/top_15_genres_sales.csv").then(function (data) {

		let scolor = d3.scaleSequential()
			.domain([0, 8388])
			.interpolator(d3.interpolateGreens);

		let mouseover = function (event, d) {
			let genre = d.Genre;
			let totalAmount = d.SalesForGenre.toString().split(".")[0]
			if (totalAmount > 999) {
				totalAmount = `${d.SalesForGenre} billion`
			} else {
				totalAmount = `${d.SalesForGenre} million`
			}
			tooltip1
				.html("<span style='color:grey'>Genre: </span>" + genre +
					"<br>" + "<span style='color:grey'>Sales ($): </span>" + totalAmount)
				.style("opacity", 1);
			d3.select(this).attr("fill", "#9B2335");
		}
		let mousemove = function (event, d) {
			tooltip1
				.style('left', (event.pageX + 40) + 'px')
				.style('top', (event.pageY + 5) + 'px')
		}
		let mouseleave = function (event, d) {
			tooltip1
				.style("opacity", 0);
			d3.select(this).attr('fill', d => scolor(d.SalesForGenre))
			d3.select('#OtherSales').attr('fill', "#868e96");
		}

		x.domain([0, 9000])



		xAxis.transition().duration(1000).call(d3.axisBottom(x))
			.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");

		svg1.append("text")
			.attr('class', "text-axis-chart2")
			.attr("text-anchor", "end")
			.attr("x", width1)
			.attr("y", height1 + 50)
			.text("Sales ($)");



		// Update the Y axis
		y.domain(data.map(d => d.Genre));
		yAxis.transition().duration(1000).call(d3.axisLeft(y))
			.selectAll("text")
			.style("text-anchor", "end");

		svg1.append("text")
			.attr('class', "text-axis-chart2")
			.attr("text-anchor", "end")
			.attr("x", -55)
			.attr("y", height1 - 490)
			.text("Genres");
		// Create the u variable
		var u = svg1.selectAll("rect")
			.data(data)


		u
			.join("rect")
			.attr("y", d => y(d.Genre))
			.attr("x", x(0))
			.attr("width", d => x(d.SalesForGenre))
			.attr("height", y.bandwidth())
			.attr('id', d => d.Genre + 'Sales')
			.attr('fill', d => scolor(d.SalesForGenre))
			.on('mouseover', mouseover)
			.on('mouseleave', mouseleave)
			.on('mousemove', mousemove)


		d3.select('#OtherSales').attr('fill', "#868e96");
	});
	// Update the X axis
}

// A function that create / update the plot for a given variable:
function update1_chart2() {
	d3.csv("../../data/top_15_genres_sales.csv").then(function (data) {

		let scolor = d3.scaleSequential()
			.domain([0, 8388])
			.interpolator(d3.interpolateGreens);

		d3.selectAll('.text-axis-chart2').remove()
		let mouseover = function (event, d) {
			let genre = d.Genre;
			let totalAmount = d.SalesForGenre.toString().split(".")[0]
			if (totalAmount > 999) {
				totalAmount = `${d.SalesForGenre} billion`
			} else {
				totalAmount = `${d.SalesForGenre} million`
			}
			tooltip1
				.html("<span style='color:grey'>Genre: </span>" + genre +
					"<br>" + "<span style='color:grey'>Sales ($): </span>" + totalAmount)
				.style("opacity", 1);
			d3.select(this).attr("fill", "#9B2335");
		}
		let mousemove = function (event, d) {
			tooltip1
				.style('left', (event.pageX + 40) + 'px')
				.style('top', (event.pageY + 5) + 'px')
		}
		let mouseleave = function (event, d) {
			tooltip1
				.style("opacity", 0);
			d3.select(this).attr('fill', d => scolor(d.SalesForGenre))
			d3.select('#OtherSales').attr('fill', "#868e96");
		}

		x.domain([0, 9000])
		xAxis.transition().duration(1000).call(d3.axisBottom(x))
			.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");
		svg1.append("text")
			.attr('class', "text-axis-chart2")
			.attr("text-anchor", "end")
			.attr("x", width1)
			.attr("y", height1 + 50)
			.text("Sales ($)");


		// Update the Y axis
		y.domain(data.map(d => d.Genre));
		yAxis.transition().duration(1000).call(d3.axisLeft(y))
			.selectAll("text")
			.style("text-anchor", "end");
		svg1.append("text")
			.attr('class', "text-axis-chart2")
			.attr("text-anchor", "end")
			.attr("x", -55)
			.attr("y", height1 - 490)
			.text("Genres");

		// Create the u variable
		var u = svg1.selectAll("rect")
			.data(data)


		u
			.join("rect")
			.transition()
			.duration(1000)
			.attr("y", d => y(d.Genre))
			.attr("x", x(0))
			.attr("width", d => x(d.SalesForGenre))
			.attr("height", y.bandwidth())
		u
			.attr('id', d => d.Genre + 'Sales')
			.attr('fill', d => scolor(d.SalesForGenre))
		d3.select('#OtherSales').attr('fill', "#868e96");
		u
			.on('mouseover', mouseover)
			.on('mouseleave', mouseleave)
			.on('mousemove', mousemove)



	});
	// Update the X axis

}

function update2_chart2() {
	d3.csv("../../data/top_15_genres_TCU.csv").then(function (data) {


		let scolor = d3.scaleSequential()
			.domain([0, 7460460000])
			.interpolator(d3.interpolateBlues);


		d3.selectAll('.text-axis-chart2').remove()
		let mouseoverUpdate = function (event, d) {
			let totalAmount = d.TCUForGenre;
			let genre = d.Genre;

			tooltip1
				.html("<span style='color:grey'>Genre: </span>" + genre +
					"<br>" + "<span style='color:grey'>TCU (unit): </span>" + totalAmount + " units")
				.style("opacity", 1);
			d3.select(this).attr("fill", "#9B2335");
		}
		let mousemoveUpdate = function (event, d) {
			tooltip1
				.style('left', (event.pageX + 40) + 'px')
				.style('top', (event.pageY + 5) + 'px')
		}
		let mouseleaveUpdate = function (event, d) {
			tooltip1
				.style("opacity", 0);
			d3.select(this).attr('fill', d => scolor(d.TCUForGenre))
			d3.select('#OtherTCU').attr('fill', "#868e96");
		}

		x.domain([0, 8000000000])
		xAxis.transition().duration(1000).call(d3.axisBottom(x))
			.selectAll("text")
			.attr("transform", "translate(-10,0)rotate(-45)")
			.style("text-anchor", "end");
		svg1.append("text")
			.attr('class', "text-axis-chart2")
			.attr("text-anchor", "end")
			.attr("x", width1 + 50)
			.attr("y", height1 + 65)
			.text("TCU (Unit)");

		// Update the Y axis
		y.domain(data.map(d => d.Genre));
		yAxis.transition().duration(1000).call(d3.axisLeft(y))
			.selectAll("text")
			.style("text-anchor", "end");
		svg1.append("text")
			.attr('class', "text-axis-chart2")
			.attr("text-anchor", "end")
			.attr("x", -55)
			.attr("y", height1 - 490)
			.text("Genres");

		// Create the u variable
		var u = svg1.selectAll("rect")
			.data(data)

		u
			.join("rect")
			.transition()
			.duration(1000)
			.attr("y", d => y(d.Genre))
			.attr("x", x(0))
			.attr("width", d => x(d.TCUForGenre))
			.attr("height", y.bandwidth())
		u
			.attr('id', d => d.Genre + 'TCU')
			.attr('fill', d => scolor(d.TCUForGenre))

		u
			.on('mouseover', mouseoverUpdate)
			.on('mouseleave', mouseleaveUpdate)
			.on('mousemove', mousemoveUpdate)

		d3.select('#OtherTCU').attr('fill', "#868e96");

	});


}

// Initialize the plot with the first dataset
update_initial_chart2();