
// // set the dimensions and margins of the graph
// let margin = {top: 30, right: 30, bottom: 30, left: 50},
//     width = 460 - margin.left - margin.right,
//     height = 400 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// let svg = d3.select("#timeChart1")
//   .append("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform", `translate(${margin.left},${margin.top})`);

// // get the data
// d3.csv("../../data/allYears.csv").then( function(data) {

//   // add the x Axis
//   let x = d3.scaleLinear()
//             .domain([1935, 2023])
//             .range([0, width]);
//   svg.append("g")
//       .attr("transform", `translate(0, ${height})`)
//       .call(d3.axisBottom(x));

//   // add the y Axis
//   let y = d3.scaleLinear()
//             .range([height, 0])
//             .domain([0, 0.03]);
//   svg.append("g")
//       .call(d3.axisLeft(y));

//   // Compute kernel density estimation
//   const kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(40))
//   let density =  kde( data.map(function(d){  return d.period_active; }) )

//   // Plot the area
//   svg.append("path")
//       .attr("class", "mypath")
//       .datum(density)
//       .attr("fill", "#69b3a2")
//       .attr("opacity", ".8")
//       .attr("stroke", "#000")
//       .attr("stroke-width", 1)
//       .attr("stroke-linejoin", "round")
//       .attr("d",  d3.line()
//         .curve(d3.curveBasis)
//           .x(function(d) { return x(d[0]); })
//           .y(function(d) { return y(d[1]); })
//       );

// });


// // Function to compute density
// function kernelDensityEstimator(kernel, X) {
//   return function(V) {
//     return X.map(function(x) {
//       return [x, d3.mean(V, function(v) { return kernel(x - v); })];
//     });
//   };
// }
// function kernelEpanechnikov(k) {
//   return function(v) {
//     return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
//   };
// }


// set the dimensions and margins of the graph
let margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#timeChart1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          `translate(${margin.left},${margin.top})`);

// get the data
d3.csv("../../data/allYears.csv").then( function(data) {

  // X axis: scale and draw:
  let x = d3.scaleLinear()
      .domain([1935, 2023])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
      .range([0, width]);
  svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

  // set the parameters for the histogram
  let histogram = d3.histogram()
      .value(function(d) { return d.period_active; })   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(70)); // then the numbers of bins

  // And apply this function to data to get the bins
  let bins = histogram(data);

  // Y axis: scale and draw:
  let y = d3.scaleLinear()
      .range([height, 0]);
      y.domain([0, d3.max(bins, function(d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
  svg.append("g")
      .call(d3.axisLeft(y));

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
      .data(bins)
      .join("rect")
        .attr("x", 1)
    .attr("transform", function(d) { return `translate(${x(d.x0)} , ${y(d.length)})`})
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1})
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "#69b3a2")

});