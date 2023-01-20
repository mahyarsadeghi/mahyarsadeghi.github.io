
// set the dimensions and margins of the graph
let marginT5 = {top: 10, right: 30, bottom: 30, left: 60},
    widthT5 = 800 - marginT5.left - marginT5.right,
    heightT5 = 500 - marginT5.top - marginT5.bottom;
    // append the svg object to the body of the page
    let svgT5 = d3.select("#timeChart5")
      .append("svg")
      .attr("viewBox", `-100 0 1000 570`)
        // .attr("width", widthT5 + marginT5.left + marginT5.right)
        // .attr("height", heightT5 + marginT5.top + marginT5.bottom)
      .append("g")
        .attr("transform", `translate(${marginT5.left}, ${marginT5.top})`)

        let tooltip5 = d3.select("#timeChart5")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "10px")
//Read the data
d3.csv("../../data/artist_FirstYear.csv").then( function(data) {


    const showTooltip = function (event, d) {

        let artist = d.Artist;
        let startYear = d.Year;

  
        tooltip5
          .html("<span style='color:grey'>Artist: </span>" + artist +
            "<br>" + "<span style='color:grey'>Starting Year: </span>" + startYear )
          .style("opacity", 1);
        //   d3.select(this).attr("fill", "#9B2335");
        console.log(artist)
        d3.select(`#bubbles${artist}`.split(" ").join('').split('/').join("").split("'").join("").split(".").join("")).attr('stroke', '#9B2335').attr('stroke-width', '3px')
        //  d3.select(`circle`).attr('stroke' ,'black')
  
  
      }
      const moveTooltip = function (event, d) {
        tooltip5
          .style('left', (event.pageX + 40) + 'px')
          .style('top', (event.pageY + 5) + 'px')
         
      }
      const hideTooltip = function (event, d) {
        tooltip5
          .transition()
          .duration(200)
          .style("opacity", 0)
          let artist = d.Artist;
          d3.select(`#bubbles${artist}`.split(" ").join('').split('/').join("").split("'").join("").split(".").join("")).attr('stroke', 'white').attr('stroke-width', '1px')
      }
  // Add X axis
  let x = d3.scaleLinear()
    .domain([0, 0])
    .range([ 0, widthT5 ]);
    svgT5.append("g")
    .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
    .attr("transform", `translate(0, ${heightT5})`)
    .call(d3.axisBottom(x))
    .attr("opacity", "0")
console.log(data)
  // Add Y axis
  let y = d3.scaleBand()
    .domain(data.map(d => d.Artist))
    .range([ heightT5, 0]);
    svgT5.append("g")
    .call(d3.axisLeft(y))
    .transition()
    .duration(1000)
    .selectAll('text')
    .attr('font-size', '5pt')
    .attr("transform", "translate(-10,0)rotate(-45)")
    .attr('opacity', '0')


  // Add dots
  svgT5.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.Year); } )
      .attr("cy", function (d) { return y(d.Artist); } )
      .attr("r", 5)
      .style("fill", "#63449d")
      .attr("id", d => "bubbles" + d.Artist.split(" ").join('').split('/').join("").split("'").join("").split(".").join(""))
      .attr("class", d => "bubbles" + d.Artist)
      .attr('stroke', 'white')
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)

  // new X axis
  x.domain([1935, 2023])
  svgT5.select(".myXaxis")
    .transition()
    .duration(2000)
    .attr("opacity", "1")
    .call(d3.axisBottom(x));

    svgT5.selectAll("circle")
    .transition()
    .delay(function(d,i){return(i*3)})
    .duration(2000)
    .attr("cx", function (d) { return x(d.Year); } )
    .attr("cy", function (d) { return y(d.Artist); } )
})
