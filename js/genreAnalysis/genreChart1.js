
// set the dimensions and margins of the graph
const margin2 = {top: 20, right: 30, bottom: 40, left: 90},
    width2 = 460 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
const svg2 = d3.select("#genreChart1")
  .append("svg")
    // .attr("width", width2 + margin2.left + margin2.right)
    // .attr("height", height2 + margin2.top + margin2.bottom)
    .attr("viewBox", `0 0 1000 500`)
  .append("g")
    .attr("transform", `translate(${margin2.left}, ${margin2.top})`);

// Parse the Data
d3.csv("../../data/top_15_genres.csv").then( function(data) {

  // Add X axis
  const x = d3.scaleLinear()
    .domain([0, 60])
    .range([ 0, width2]);
    svg2.append("g")
    .attr("transform", `translate(0, ${height2})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  const y = d3.scaleBand()
    .range([ 0, height2 ])
    .domain(data.map(d => d.Genre))
    .padding(.2);
    svg2.append("g")
    .call(d3.axisLeft(y))

  //Bars
  svg2.selectAll("myRect")
    .data(data)
    .join("rect")
    .attr("x", x(0) )
    .attr("y", d => y(d.Genre))
    .attr("width", d => x(d.Count))
    .attr("height", y.bandwidth())
    .attr("fill", "#69b3a2")

})