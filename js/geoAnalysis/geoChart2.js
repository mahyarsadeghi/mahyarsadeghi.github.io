
// The svg
const svg2 = d3.select("#geoChart2"),
  width2 = +svg2.attr("width"),
  height2 = +svg2.attr("height");

// Map and projection
const path2 = d3.geoPath();
const projection2 = d3.geoMercator()
  .scale(70)
  .center([0,20])
  .translate([width2 / 2, height2 / 2]);

// Data and color scale
const data2 = new Map();
const colorScale2 = d3.scaleThreshold()
  .domain([100000000, 250000000, 500000000, 1000000000, 3000000000, 8000000000])
  .range(d3.schemeBlues[7]);

// Load external data and boot
Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
d3.csv("../../data/TCUCountry.csv", function(d) {
    data2.set(d['Country Code'], +d.TCUForCountry)
})]).then(function(loadData){
    let topo = loadData[0]

    let mouseOver = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .5)
    d3.select(this)
      .transition()
      .duration(200)
      .style("opacity", 1)
      .style("stroke", "black")
  }

  let mouseLeave = function(d) {
    d3.selectAll(".Country")
      .transition()
      .duration(200)
      .style("opacity", .8)
    d3.select(this)
      .transition()
      .duration(200)
      .style("stroke", "transparent")
  }

  // Draw the map
  svg2.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection2)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data2.get(d.id) || 0;
        return colorScale2(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )

})
