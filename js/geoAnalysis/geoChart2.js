
// The svg
const svg2 = d3.select("#geoChart2"),
  width2 = +svg2.attr("width"),
  height2 = +svg2.attr("height");

// Map and projection
const path2 = d3.geoPath();
const projection2 = d3.geoMercator()
  .scale(70)
  .center([0, 20])
  .translate([width2 / 2, height2 / 2]);

  Legend(d3.scaleThreshold([0, 10000000, 20000000, 40000000, 6000000, 200000000, 1000000000, 3000000000, 8000000000], d3.schemeBlues[9]), "#geoLegend2")

// Data and color scale
const data2 = new Map();
const colorScale2 = d3.scaleThreshold()
  .domain([0, 10000000, 20000000, 40000000, 6000000, 200000000, 1000000000, 3000000000, 8000000000])
  .range(d3.schemeBlues[9]);

  let tooltip2 = d3.select("#geoChart2Div")
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
  d3.csv("../../data/TCUCountry.csv", function (d) {
    data2.set(d['Country'], +d.TCUForCountry)
  })]).then(function (loadData) {
    let topo = loadData[0]

    let mouseOver = function (event, d) {
      console.log(d)
      console.log( d.properties.name)
      
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

      tooltip2
        .transition()
        .duration(200)
        .style("opacity", 1)
      tooltip2
        .html("<span style='color:grey'>Country: </span>" + d.properties.name + "<br>" + "<span style='color:grey'>TCU (units): </span>" + d.total)
        .style("top", (event.pageY) + "px")
        .style("left", (event.pageX + 30) + "px")
    }
    let mouseMove = function (event, d) {
      tooltip2
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
      tooltip2
        .transition()
        .duration(200)
        .style("opacity", 0)
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
        console.log(d.properties.name, d.id)
        d.total = data2.get(d.properties.name) || 0;
        return colorScale2(d.total);
      })
      .style("stroke", "black")
      .attr("class", function (d) { return "Country" })
      .style("opacity", 1)
      .on("mouseover", mouseOver)
      .on("mouseleave", mouseLeave)
      .on("mousemove", mouseMove);

  })
