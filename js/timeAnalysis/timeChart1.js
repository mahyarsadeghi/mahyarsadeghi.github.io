
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
let marginT1 = { top: 10, right: 20, bottom: 30, left: 50 },
    widthT1 = 800 - marginT1.left - marginT1.right,
    heightT1 = 500 - marginT1.top - marginT1.bottom;

// append the svg object to the body of the page
let svgT1 = d3.select("#timeChart1")
    .append("svg")
    .attr("viewBox", '-100 0 1000 570')
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        `translate(${marginT1.left},${marginT1.top})`);

        let tooltip = d3.select("#timeChart1")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "10px")
      
// get the data
d3.csv("../../data/allYears.csv").then(function (data) {

    // X axis: scale and draw:
    let x = d3.scaleLinear()
        .domain([1935, 2023])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, widthT1]);
        svgT1.append("g")
        .attr("transform", `translate(0, ${heightT1})`)
        .call(d3.axisBottom(x));

    let y = d3.scaleLinear()
        .range([heightT1, 0]);
    let yAxis = svgT1.append("g");

    function update_initial(nBin) {

        let showTooltip = function (event, d) {
            tooltip
              .html("<span style='color:grey'>Range: </span>" + d.x0 + " - " + d.x1)
              .style("opacity", 1);
            //   d3.select(this).attr("fill", "#9B2335");
          }
          let moveTooltip = function (event, d) {
            tooltip
              .style('left', (event.x + 70) + 'px')
              .style('top', (event.y - 70) + 'px')
          }
          let hideTooltip = function (event, d) {
            tooltip
              .style("opacity", 0)

          }

        // set the parameters for the histogram
        let histogram = d3.histogram()
            .value(function (d) { return d.period_active; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(nBin)); // then the numbers of bins

        // And apply this function to data to get the bins
        let bins = histogram(data);
  
        y.domain([0, d3.max(bins, function (d) { return d.length; })]);

        yAxis
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y))

        svgT1.append("text")
            .attr("text-anchor", "end")
            .attr("x", widthT1)
            .attr("y", heightT1 + 50)
            .text("Years");

        // append the bar rectangles to the svg element
        let u = svgT1.selectAll("rect")
            .data(bins)
            u
            .enter()
            .append("rect")
            .merge(u)
                .attr("x", 1)
                .attr("transform", function (d) { return `translate(${x(d.x0)} , ${y(d.length)})` })
                .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1 })
                .attr("height", function (d) { return heightT1 - y(d.length); })
                .style("fill", "#69b3a2")
                .on("mouseover", showTooltip)
                .on("mousemove", moveTooltip)
                .on("mouseleave", hideTooltip)
                .exit()
                .remove()

     
                
    }

    function update(nBin) {

        let showTooltip = function (event, d) {
             tooltip
             .style("opacity", 1)
              .html("<span style='color:grey'>Range: </span>" + d.x0 + " - " + d.x1)
              .style("opacity", 1)
              .style('left', (event.x)/2 + 'px')
              .style('top', (event.y )/2 + 'px')
            //   d3.select(this).attr("fill", "#9B2335");
          }
          let moveTooltip = function (event, d) {
            tooltip
              .style('left', (event.x + 70)+ 'px')
              .style('top', (event.y - 70) + 'px')

          }
          let hideTooltip = function (event, d) {
            tooltip
              .style("opacity", 0)

          }

        // set the parameters for the histogram
        let histogram = d3.histogram()
            .value(function (d) { return d.period_active; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(nBin)); // then the numbers of bins

        // And apply this function to data to get the bins
        let bins = histogram(data);
  
        y.domain([0, d3.max(bins, function (d) { return d.length; })]);

        yAxis
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y))

        svgT1.append("text")
            .attr("text-anchor", "end")
            .attr("x", widthT1)
            .attr("y", heightT1 + 50)
            .text("Years");

        // append the bar rectangles to the svg element
        let u = svgT1.selectAll("rect")
            .data(bins)
            u
            .enter()
            .append("rect")
            .merge(u)
            .transition()
            .duration(1000)
                .attr("x", 1)
                .attr("transform", function (d) { return `translate(${x(d.x0)} , ${y(d.length)})` })
                .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1 })
                .attr("height", function (d) { return heightT1 - y(d.length); })
                .style("fill", "#69b3a2")


            u
                .exit()
                .remove()

            
             u
                .on("mouseover", showTooltip)
                .on("mousemove", moveTooltip)
                .on("mouseleave", hideTooltip)
    }


    // Initialize with 20 bins
    update_initial(20)


    // Listen to the button -> update if user change it
    d3.select("#nBin").on("input", function () {
        update(+this.value);
    });

});