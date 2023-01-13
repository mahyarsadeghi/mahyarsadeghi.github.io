
// set the dimensions and margins of the graph
const margin2 = { top: 20, right: 30, bottom: 40, left: 90 },
  width2 = 600 - margin2.left - margin2.right,
  height2 = 500 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
const svg2 = d3.select("#genreChart1")
  .append("svg")
  // .attr("width", width2 + margin2.left + margin2.right)
  // .attr("height", height2 + margin2.top + margin2.bottom)
  .attr("viewBox", `-200 0 1000 500`)
  .append("g")
  .attr("transform", `translate(${margin2.left}, ${margin2.top})`);

let tooltip3 = d3.select("#genreChart1")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "10px")


// Three function that change the tooltip when user hover / move / leave a cell

// Parse the Data
d3.csv("../../data/top_15_genres.csv").then(function (data) {

  let mouseover = function (event, d) {
    let totalAmount = d.Count;
    let genre = d.Genre;

    tooltip3
      .html("<span style='color:grey'>Genre: </span>" + genre +
        "<br>" + "<span style='color:grey'>Nbr. of Artists: </span>" + totalAmount)
      .style("opacity", 1);
    d3.select(this).attr("fill", "#9B2335");
  }
  let mousemove = function (event, d) {
    tooltip3
      .style('left', (event.pageX + 40) + 'px')
      .style('top', (event.pageY + 5) + 'px')
  }
  let mouseleave = function (event, d) {
    tooltip3
      .style("opacity", 0);
    d3.select(this).attr("fill", '#6e5ba8');
  }

  // Add X axis
  let x = d3.scaleLinear()
    .domain([0, 60])
    .range([0, width2]);
  svg2.append("g")
    .attr("transform", `translate(0, ${height2})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y axis
  let y = d3.scaleBand()
    .range([0, height2])
    .domain(data.map(d => d.Genre))
    .padding(.2);
  svg2.append("g")
    .call(d3.axisLeft(y))

  //Bars
  svg2.selectAll("myRect")
    .data(data)
    .join("rect")
    .attr("x", x(0))
    .attr("y", d => y(d.Genre))
    .attr("width", d => x(0))
    .attr("height", y.bandwidth())
    .attr("fill", "#6e5ba8")
    .on('mouseover', mouseover)
    .on('mouseleave', mouseleave)
    .on('mousemove', mousemove)

  svg2.selectAll("rect")
    .transition()
    .duration(800)
    .attr("x", function (d) { return x(0); })
    .attr("width", function (d) { return width2 - (width2 - x(d.Count)) })
    .delay(function (d, i) { return (i * 100) })

})