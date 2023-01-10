
// The svg
const svg = d3.select("#geoChart1"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Map and projection
const path = d3.geoPath();
const projection = d3.geoMercator()
  .scale(70)
  .center([0, 20])
  .translate([width / 2, height / 2]);

// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
  .domain([0, 100, 200, 300, 500, 700, 1000, 5000, 10000])
  .range(d3.schemeBlues[9]);

let tooltip = d3.select("#geoChart1Div")
  .append("div")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "10px")
  // .style("min-width", "2px")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("font-size", "16px")

// Load external data and boot
Promise.all([
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
  d3.csv("../../data/SalesCountry.csv", function (d) {
    data.set(d['Country'], +d.SalesForCountry)
  })]).then(function (loadData) {
    let topo = loadData[0]

    let mouseOver = function (event, d) {
      console.log(d)
      console.log(d.properties.name)

      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", .5)
        .style('stroke', 'transparent')
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "red")

      tooltip
        .transition()
        .duration(200)
        .style("opacity", 1)
      tooltip
        .html("<span style='color:grey'>Country: </span>" + d.properties.name + "<br>" + "<span style='color:grey'>Sales: </span>" + `${d.total} million`)
        .style("top", (event.pageY) + "px")
        .style("left", (event.pageX + 30) + "px")
    }
    let mouseMove = function (event, d) {
      tooltip
        .style("left", (event.pageX + 30) + "px")
        .style("top", (event.pageY) + "px")
    }
    let mouseLeave = function (event, d) {
      d3.selectAll(".Country")
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", 'black')
      d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "black")
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    }

    // Draw the map
    svg.append("g")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
      // draw each country
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.properties.name) || 0;
        return colorScale(d.total);
      })
      .style("stroke", "black")
      .attr("class", function (d) { return "Country" })
      .style("opacity", 1)
      .on("mouseover", mouseOver)
      .on('mousemove', mouseMove)
      .on("mouseleave", mouseLeave)

  })
