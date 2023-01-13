


// // set the dimensions and margins of the graph
// const margin1 = {top: 100, right: 0, bottom: 0, left: 0},
//     width1 = 460 - margin1.left - margin1.right,
//     height1 = 460 - margin1.top - margin1.bottom,
//     innerRadius = 90,
//     outerRadius = Math.min(width1, height1) / 2;   // the outerRadius goes from the middle of the SVG area to the border

// // append the svg object
// const svg1 = d3.select("#genreChart2")
//   .append("svg")
//     .attr("width", width1 + margin1.left + margin1.right)
//     .attr("height", height1 + margin1.top + margin1.bottom)
//   .append("g")
//     .attr("transform", `translate(${width1/2+margin1.left}, ${height1/2+margin1.top})`);

// d3.csv("../../data/top_15_genres_sales.csv").then( function(data) {

//   // Scales
//   const x = d3.scaleBand()
//       .range([0, 2 * Math.PI])    // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
//       .align(0)                  // This does nothing
//       .domain(data.map(d => d.Genre)); // The domain of the X axis is the list of states.
//   const y = d3.scaleRadial()
//       .range([innerRadius, outerRadius])   // Domain will be define later.
//       .domain([0, 9000]); // Domain of Y is from 0 to the max seen in the data

//   // Add the bars
//   svg1.append("g")
//     .selectAll("path")
//     .data(data)
//     .join("path")
//       .attr("fill", "#69b3a2")
//       .attr("d", d3.arc()     // imagine your doing a part of a donut plot
//           .innerRadius(innerRadius)
//           .outerRadius(d => y(d['SalesForGenre']))
//           .startAngle(d => x(d.Genre))
//           .endAngle(d => x(d.Genre) + x.bandwidth())
//           .padAngle(0.01)
//           .padRadius(innerRadius))

//   // Add the labels
//   svg1.append("g")
//       .selectAll("g")
//       .data(data)
//       .join("g")
//         .attr("text-anchor", function(d) { return (x(d.Genre) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
//         .attr("transform", function(d) { return "rotate(" + ((x(d.Genre) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")"+"translate(" + (y(d['SalesForGenre'])+10) + ",0)"; })
//       .append("text")
//         .text(function(d){return(d.Genre)})
//         .attr("transform", function(d) { return (x(d.Genre) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
//         .style("font-size", "11px")
//         .attr("alignment-baseline", "middle")

// });


// set the dimensions and margins of the graph
const margin1 = {top: 20, right: 30, bottom: 40, left: 90},
    width1 = 600 - margin1.left - margin1.right,
    height1 = 500 - margin1.top - margin1.bottom;

// append the svg object to the body of the page
const svg1 = d3.select("#genreChart2")
  .append("svg")
    .attr("viewBox", `-200 0 1000 500`)
    //  .attr("width", width2 + margin2.left + margin2.right)
    // .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform", `translate(${margin1.left}, ${margin1.top})`);

// Parse the Data
d3.csv("../../data/top_15_genres_sales.csv").then( function(data) {

  // Add X axis
  let x = d3.scaleLinear()
    .domain([0, 9000])
    .range([ 0, width1]);
    svg1.append("g")
    .attr("transform", `translate(0, ${height1})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  let y = d3.scaleBand()
    .range([ 0, height1 ])
    .domain(data.map(d => d.Genre))
    .padding(.2);
    svg1.append("g")
    .transition().duration(1000)
    .call(d3.axisLeft(y))


  //Bars
  svg1.selectAll("myRect")
    .data(data)
    .join("rect")
    .attr("x", x(0) )
    .attr("y", d => y(d.Genre))
    .attr("width", d => x(d.SalesForGenre))
    .attr("height", y.bandwidth())
    .attr("fill", "#17823c")

})