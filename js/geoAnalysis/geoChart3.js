
// The svg
const svg3 = d3.select("#geoChart3"),
  width3 = +svg3.attr("width"),
  height3 = +svg3.attr("height");

// Map and projection
const path3 = d3.geoPath();
const projection3 = d3.geoMercator()
  .scale(120)
  .center([0, 20])
  .translate([width3 / 2, height3 / 2]);

// Data and color scale
const data3 = new Map();
const colorScale3 = d3.scaleThreshold()
  .domain([0, 1, 2, 3, 5, 10, 20, 80])
  .range(d3.schemePurples[9]);

Legend(d3.scaleThreshold([0, 1, 2, 3, 5, 10, 20, 80], d3.schemePurples[9]), "#geoLegend3")

let tooltip3 = d3.select("#geoChart3Div")
  .append("div")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("font-size", "16px")

// Load external data and boot
Promise.all([
  d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"),
  d3.csv("../../data/ArtistPerCountry.csv", function (d) {
    data3.set(d['Country'], +d.ArtistForCountry)
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

      tooltip3
        .transition()
        .duration(200)
        .style("opacity", 1)
      tooltip3
        .html("<span style='color:grey'>Country: </span>" + d.properties.name + "<br>" + "<span style='color:grey'>Nbr. of Artist: </span>" + d.total)
        .style("top", (event.pageY) + "px")
        .style("left", (event.pageX + 30) + "px")
    }
    let mouseMove = function (event, d) {
      tooltip3
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
      tooltip3
        .transition()
        .duration(200)
        .style("opacity", 0)
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
        d.total = data3.get(d.properties.name) || 0;
        return colorScale3(d.total);
      })
      .style("stroke", "black")
      .attr("class", function (d) { return "Country" })
      .style("opacity", 1)
      .on("mouseover", mouseOver)
      .on('mousemove', mouseMove)
      .on("mouseleave", mouseLeave)

  })
