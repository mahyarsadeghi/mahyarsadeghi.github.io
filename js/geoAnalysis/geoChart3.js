
// The svg
const svg3 = d3.select("#geoChart3"),
  width3 = +svg3.attr("width"),
  height3 = +svg3.attr("height");

// Map and projection
const path3 = d3.geoPath();
const projection3 = d3.geoMercator()
  .scale(70)
  .center([0,20])
  .translate([width3 / 2, height3 / 2]);

// Data and color scale
const data3 = new Map();
const colorScale3 = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

// Load external data and boot
Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv", function(d) {
    data3.set(d.code, +d.pop)
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
  svg3.append("g")
    .selectAll("path")
    .data(topo.features)
    .enter()
    .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection3)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data3.get(d.id) || 0;
        return colorScale3(d.total);
      })
      .style("stroke", "transparent")
      .attr("class", function(d){ return "Country" } )
      .style("opacity", .8)
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )

})
