
const margin = {top: 10, right: 20, bottom: 30, left: 50},
width = 600 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#genreChart4")
.append("svg")
// .attr("width", width + margin.left + margin.right)
// .attr("height", height + margin.top + margin.bottom)
.attr("viewBox", '-200 0 1000 570')
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("../../data/top_artist_country.csv").then( function(data) {

// Add X axis
let x = d3.scaleBand()
.domain(data.map(d => d.Country))
.range([ 0, width ])
.padding(.2);
svg.append("g")
.attr("transform", `translate(0, ${height})`)
.call(d3.axisBottom(x))
.selectAll("text")
.attr("transform", "translate(-10,0)rotate(-45)")
.style("text-anchor", "end");

// Add Y axis
let y = d3.scaleLinear()
.domain([0, 600])
.range([ height, 0]);
svg.append("g")
.call(d3.axisLeft(y));

// Add a scale for bubble size
let z = d3.scaleLinear()
.domain([75, 550])
.range([ 4, 40]);

// Add a scale for bubble color
// const myColor = d3.scaleOrdinal()
// .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
// .range(d3.schemeSet2);

// -1- Create a tooltip div that is hidden by default:
let tooltip = d3.select("#genreChart4")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "10px")

// -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
const showTooltip = function(event, d) {

  let totalAmount = d['Sales ($)'];
  let artist = d.Artist;
  let country = d.Country;

  tooltip
    .html("<span style='color:grey'>Artist: </span>" + artist +
      "<br>" + "<span style='color:grey'>Sales ($): </span>" + totalAmount +
      "<br>" + "<span style='color:grey'>Country: </span>" + country)
    .style("opacity", 1);
//   d3.select(this).attr("fill", "#9B2335");
console.log(artist)
  d3.select(`#bubbles${artist}`.split(" ").join('').split('/').join("").split("'").join("")).attr('stroke' ,'#9B2335').attr('stroke-width', '3px')
//  d3.select(`circle`).attr('stroke' ,'black')


}
const moveTooltip = function(event, d) {
tooltip
.style('left', (event.pageX + 40) + 'px')
.style('top', (event.pageY + 5) + 'px')
}
const hideTooltip = function(event, d) {
tooltip
  .transition()
  .duration(200)
  .style("opacity", 0)
  d3.selectAll("circle").attr('stroke' ,'none')
}

// Add dots
svg.append('g')
.selectAll("dot")
.data(data)
.join("circle")
  .attr("id", d => "bubbles"+d.Artist.split(" ").join('').split('/').join("").split("'").join(""))
  .attr("class", d => "bubbles"+d.Artist)
  .attr("cx", d => x(d.Country))
  .attr("cy", d => y(d['Sales ($)']))
  .attr("r", d => z(d['Sales ($)']))
  .style("fill", '#17823c')
// -3- Trigger the functions
.on("mouseover", showTooltip )
.on("mousemove", moveTooltip )
.on("mouseleave", hideTooltip )

})
