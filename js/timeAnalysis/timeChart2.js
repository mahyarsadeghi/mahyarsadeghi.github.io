

// set the dimensions and margins of the graph
let margin2 = {top: 10, right: 100, bottom: 30, left: 30},
    width2 = 460 - margin2.left - margin2.right,
    height2 = 400 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
let svg2 = d3.select("#timeChart2")
  .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
    .attr("transform",`translate(${margin2.left},${margin2.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_connectedscatter.csv").then(function(data) {

    // List of groups (here I have one group per column)
    let allGroup = ["valueA", "valueB", "valueC"]

    // Reformat the data: we need an array of arrays of {x, y} tuples
    let dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: data.map(function(d) {
          return {time: d.time, value: +d[grpName]};
        })
      };
    });
    // I strongly advise to have a look to dataReady with
    // console.log(dataReady)

    // A color scale: one color for each group
    let myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    let x = d3.scaleLinear()
      .domain([0,10])
      .range([ 0, width2 ]);
    svg2.append("g")
      .attr("transform", `translate(0, ${height2})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear()
      .domain( [0,20])
      .range([ height2, 0 ]);
    svg2.append("g")
      .call(d3.axisLeft(y));

    // Add the lines
    let line = d3.line()
      .x(d => x(+d.time))
      .y(d => y(+d.value))
    svg2.selectAll("myLines")
      .data(dataReady)
      .join("path")
        .attr("class", d => d.name)
        .attr("d", d => line(d.values))
        .attr("stroke", d => myColor(d.name))
        .style("stroke-width", 4)
        .style("fill", "none")

    // Add the points
    svg2
      // First we need to enter in a group
      .selectAll("myDots")
      .data(dataReady)
      .join('g')
        .style("fill", d => myColor(d.name))
        .attr("class", d => d.name)
      // Second we need to enter in the 'values' part of this group
      .selectAll("myPoints")
      .data(d => d.values)
      .join("circle")
        .attr("cx", d => x(d.time))
        .attr("cy", d => y(d.value))
        .attr("r", 5)
        .attr("stroke", "white")

    // Add a label at the end of each line
    svg2
      .selectAll("myLabels")
      .data(dataReady)
      .join('g')
        .append("text")
          .attr("class", d => d.name)
          .datum(d => { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
          .attr("transform", d => `translate(${x(d.value.time)},${y(d.value.value)})`) // Put the text at the position of the last point
          .attr("x", 12) // shift the text a bit more right
          .text(d => d.name)
          .style("fill", d => myColor(d.name))
          .style("font-size", 15)

    // Add a legend (interactive)
    svg2
      .selectAll("myLegend")
      .data(dataReady)
      .join('g')
        .append("text")
          .attr('x', (d,i) => 30 + i*60)
          .attr('y', 30)
          .text(d => d.name)
          .style("fill", d => myColor(d.name))
          .style("font-size", 15)
        .on("click", function(event,d){
          // is the element currently visible ?
          currentOpacity = d3.selectAll("." + d.name).style("opacity")
          // Change the opacity: from 0 to 1 or from 1 to 0
          d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)

        })
})
