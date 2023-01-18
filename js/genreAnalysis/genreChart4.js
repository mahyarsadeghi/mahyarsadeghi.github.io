
const margin = { top: 10, right: 20, bottom: 30, left: 50 },
  width = 600 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#genreChart4")
  .append("svg")
  .attr("viewBox", '-200 0 1000 570')
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

let tooltip4 = d3.select("#genreChart4")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "10px")

let x4 = d3.scaleBand()
  .range([0, width])
  .padding(.2);
let xAxis4 = svg.append("g")
  .attr("transform", `translate(0, ${height})`);

let y4 = d3.scaleLinear()
  .range([height, 0]);
let yAxis4 = svg.append("g")
  // .attr("transform", `translate(0, ${height})`)
  .attr("class", "myYaxis")

let z = d3.scaleLinear()
  .range([4, 40]);

function update_initial_chart4() {

  d3.csv("../../data/top_artist_country.csv").then(function (data) {

    // Add a scale for bubble size

    const showTooltip = function (event, d) {

      let totalAmount = d['Sales ($)'];
      let artist = d.Artist;
      let country = d.Country;
      let tcu = d['TCU (unit)']

      tooltip4
        .html("<span style='color:grey'>Artist: </span>" + artist +
          "<br>" + "<span style='color:grey'>Sales ($): </span>" + totalAmount + ' million' +
          "<br>" + "<span style='color:grey'>TCU (unit): </span>" + tcu + ' units' +
          "<br>" + "<span style='color:grey'>Country: </span>" + country)
        .style("opacity", 1);
      //   d3.select(this).attr("fill", "#9B2335");
      console.log(artist)
      d3.select(`#bubbles${artist}`.split(" ").join('').split('/').join("").split("'").join("")).attr('stroke', '#9B2335').attr('stroke-width', '3px')
      //  d3.select(`circle`).attr('stroke' ,'black')


    }
    const moveTooltip = function (event, d) {
      tooltip4
        .style('left', (event.pageX + 40) + 'px')
        .style('top', (event.pageY + 5) + 'px')
       
    }
    const hideTooltip = function (event, d) {
      tooltip4
        .transition()
        .duration(200)
        .style("opacity", 0)
        let artist = d.Artist;
        d3.select(`#bubbles${artist}`.split(" ").join('').split('/').join("").split("'").join("")).attr('stroke', 'black').attr('stroke-width', '1px')
    }

    x4.domain(data.map(d => d.Country))
    xAxis4.transition().duration(1000).call(d3.axisBottom(x4))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
      svg.append("text")
			.attr('class', "text-axis-chart4")
			.attr("text-anchor", "end")
			.attr("x", width)
			.attr("y", height + 50)
			.text("Countries");


    y4.domain([0, 600]);
    yAxis4.transition().duration(1000).call(d3.axisLeft(y4))
      .selectAll("text")
      .attr("transform", "translate(-20,0)")
      .style("text-anchor", "end");
      svg.append("text")
			.attr('class', "text-axis-chart4")
			.attr("text-anchor", "end")
			.attr("x", -55)
			.attr("y", height - 420)
			.text("Sales ($)");

    z.domain([28900000, 335300000])

    // Add dots
    let u = svg
      .selectAll("circle")
      .data(data)
    u
      .join("circle")
      .attr("id", d => "bubbles" + d.Artist.split(" ").join('').split('/').join("").split("'").join(""))
      .attr("class", d => "bubbles" + d.Artist)
      .attr("cx", d => x4(d.Country))
      .attr("cy", d => y4(d['Sales ($)']))
      .attr("r", d => z(d['TCU (unit)']))
      .style("fill", '#2877b7')
      .attr('stroke', 'black')
      // -3- Trigger the functions
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)


    var valuesToShow = [28900000, 182100000, 335300000 ]
    var moveX = 200
    var moveY = 300
    var xCircle = 390 + moveX
    var xLabel = 440 + moveX
    svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("circle")
      .attr("cx", xCircle)
      .attr("cy", function (d) { return height - moveY - z(d) })
      .attr("r", function (d) { return z(d) })
      .style("fill", "none")
      .attr("stroke", "black")

      svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("line")
      .attr('x1', function (d) { return xCircle + z(d) })
      .attr('x2', xLabel)
      .attr('y1', function (d) { return height - moveY - z(d) })
      .attr('y2', function (d) { return height - moveY - z(d) })
      .attr('stroke', 'black')
      .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svg
      .selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
      .attr('x', xLabel)
      .attr('y', function (d) { return height - moveY - z(d) })
      .text(function (d) { return d })
      .style("font-size", 10)
      .attr('class', 'legend-text')
      .attr('alignment-baseline', 'middle')

    // Legend title
    svg.append("text")
      .attr('x', xCircle)
      .attr("y", height - moveY + 30)
      .text("TCU (unit)")
      .attr('class', 'legend-text')
      .attr("text-anchor", "middle")

  })

}

function update1_chart4() {

  d3.csv("../../data/top_artist_country.csv").then(function (data) {
    d3.selectAll('.text-axis-chart4').remove()
    d3.selectAll('.legend-text').remove()

    // Add a scale for bubble size
    const showTooltip = function (event, d) {

      let totalAmount = d['Sales ($)'];
      let artist = d.Artist;
      let country = d.Country;
      let tcu = d['TCU (unit)']

      tooltip4
        .html("<span style='color:grey'>Artist: </span>" + artist +
          "<br>" + "<span style='color:grey'>Sales ($): </span>" + totalAmount + ' million' +
          "<br>" + "<span style='color:grey'>TCU (unit): </span>" + tcu + ' units' +
          "<br>" + "<span style='color:grey'>Country: </span>" + country)
        .style("opacity", 1);
      //   d3.select(this).attr("fill", "#9B2335");
      console.log(artist)
      d3.select(`#bubbles${artist}`.split(" ").join('').split('/').join("").split("'").join("")).attr('stroke', '#9B2335').attr('stroke-width', '3px')
      //  d3.select(`circle`).attr('stroke' ,'black')


    }
    const moveTooltip = function (event, d) {
      tooltip4
        .style('left', (event.pageX + 40) + 'px')
        .style('top', (event.pageY + 5) + 'px')
    }
    const hideTooltip = function (event, d) {
      tooltip4
        .transition()
        .duration(200)
        .style("opacity", 0)
        let artist = d.Artist;
        d3.select(`#bubbles${artist}`.split(" ").join('').split('/').join("").split("'").join("")).attr('stroke', 'black').attr('stroke-width', '1px')
    }

    x4.domain(data.map(d => d.Country))
    xAxis4.transition().duration(1000).call(d3.axisBottom(x4))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
      svg.append("text")
			.attr('class', "text-axis-chart4")
			.attr("text-anchor", "end")
			.attr("x", width)
			.attr("y", height + 50)
			.text("Countries");

    y4.domain([0, 600]);
    yAxis4.transition().duration(1000).call(d3.axisLeft(y4))
      .selectAll("text")
      .attr("transform", "translate(-25,0)rotate(-45)")
      .style("text-anchor", "end");
      svg.append("text")
			.attr('class', "text-axis-chart4")
			.attr("text-anchor", "end")
			.attr("x", -55)
			.attr("y", height1 - 490)
			.text("Sales ($)");

    z.domain([28900000, 335300000])

    // Add dots
    let u = svg
      .selectAll("circle")
      .data(data)
    u
      .join("circle")
      .transition()
      .duration(1000)
      .attr("id", d => "bubbles" + d.Artist.split(" ").join('').split('/').join("").split("'").join(""))
      .attr("class", d => "bubbles" + d.Artist)
      .attr("cx", d => x4(d.Country))
      .attr("cy", d => y4(d['Sales ($)']))
      .attr("r", d => z(d['TCU (unit)']))
      .style("fill", '#2877b7')
      .attr('stroke', 'black')
      // -3- Trigger the functions
      u
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)

      var valuesToShow = [28900000, 182100000, 335300000 ]
      var moveX = 200
      var moveY = 300
      var xCircle = 390 + moveX
      var xLabel = 440 + moveX
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function (d) { return height - moveY - z(d) })
        .attr("r", function (d) { return z(d) })
        .style("fill", "none")
        .attr("stroke", "black")
  
        svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
        .attr('x1', function (d) { return xCircle + z(d) })
        .attr('x2', xLabel)
        .attr('y1', function (d) { return height - moveY - z(d) })
        .attr('y2', function (d) { return height - moveY - z(d) })
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))
  
      // Add legend: labels
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr('x', xLabel)
        .attr('y', function (d) { return height - moveY - z(d) })
        .text(function (d) { return d })
        .style("font-size", 10)
        .attr('class', 'legend-text')
        .attr('alignment-baseline', 'middle')
  
      // Legend title
      svg.append("text")
        .attr('x', xCircle)
        .attr("y", height - moveY + 30)
        .text("TCU (unit)")
        .attr('class', 'legend-text')
        .attr("text-anchor", "middle")

  })

};

function update2_chart4() {

  d3.csv("../../data/top_artist_countryTCU.csv").then(function (data) {
    d3.selectAll('.text-axis-chart4').remove()
    d3.selectAll('.legend-text').remove()

    // Add a scale for bubble siz
    const showTooltip = function (event, d) {

      let totalAmount = d['TCU (unit)'];
      let artist = d.Artist;
      let sales = d['Sales ($)']
      let country = d.Country;

      tooltip4
        .html("<span style='color:grey'>Artist: </span>" + artist +
          "<br>" + "<span style='color:grey'>TCU (unit): </span>" + totalAmount + ' units' +
          "<br>" + "<span style='color:grey'>Sales ($): </span>" + sales + ' million' +
          "<br>" + "<span style='color:grey'>Country: </span>" + country)
        .style("opacity", 1);
      //   d3.select(this).attr("fill", "#9B2335");
      console.log(artist)
      d3.select(`#bubbles${artist}`.split(" ").join('').split('/').join("").split("'").join("")).attr('stroke', '#9B2335').attr('stroke-width', '3px')
    


    }
    const moveTooltip = function (event, d) {
      tooltip4
        .style('left', (event.pageX + 40) + 'px')
        .style('top', (event.pageY + 5) + 'px')
    }
    const hideTooltip = function (event, d) {
      tooltip4
        .transition()
        .duration(200)
        .style("opacity", 0)
      let artist = d.Artist;
      d3.select(`#bubbles${artist}`.split(" ").join('').split('/').join("").split("'").join("")).attr('stroke', 'black').attr('stroke-width', '1px')
    }

    x4.domain(data.map(d => d.Country))
    xAxis4.transition().duration(1000).call(d3.axisBottom(x4))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
      svg.append("text")
			.attr('class', "text-axis-chart4")
			.attr("text-anchor", "end")
			.attr("x", width)
			.attr("y", height + 50)
			.text("Countries");

    y4.domain([0, 450000000]);
    yAxis4.transition().duration(1000).call(d3.axisLeft(y4))
      .selectAll("text")
      .attr("transform", "translate(-20,0)rotate(-45)")
      .style("text-anchor", "end");
      svg.append("text")
			.attr('class', "text-axis-chart4")
			.attr("text-anchor", "end")
			.attr("x", -55)
			.attr("y", height1 - 490)
			.text("TCU (unit)");

    z.domain([75, 550])

    // Add dots
    let u = svg
      .selectAll("circle")
      .data(data)
    u
      .join("circle")
      .transition()
      .duration(1000)
      .attr("id", d => "bubbles" + d.Artist.split(" ").join('').split('/').join("").split("'").join(""))
      .attr("class", d => "bubbles" + d.Artist)
      .attr("cx", d => x4(d.Country))
      .attr("cy", d => y4(d['TCU (unit)']))
      .attr("r", d => z(d['Sales ($)']))
      .style("fill", '#17823c')
      .attr('stroke', 'black')
    // -3- Trigger the functions
    u
      .on("mouseover", showTooltip)
      .on("mousemove", moveTooltip)
      .on("mouseleave", hideTooltip)

      var valuesToShow = [75, 312.5 , 550 ]
      var moveX = 200
      var moveY = 300
      var xCircle = 390 + moveX
      var xLabel = 440 + moveX
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function (d) { return height - moveY - z(d) })
        .attr("r", function (d) { return z(d) })
        .style("fill", "none")
        .attr("stroke", "black")
  
        svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("line")
        .attr('x1', function (d) { return xCircle + z(d) })
        .attr('x2', xLabel)
        .attr('y1', function (d) { return height - moveY - z(d) })
        .attr('y2', function (d) { return height - moveY - z(d) })
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))
  
      // Add legend: labels
      svg
        .selectAll("legend")
        .data(valuesToShow)
        .enter()
        .append("text")
        .attr('x', xLabel)
        .attr('y', function (d) { return height - moveY - z(d) })
        .text(function (d) { return d })
        .style("font-size", 10)
        .attr('class', 'legend-text')
        .attr('alignment-baseline', 'middle')
  
      // Legend title
      svg.append("text")
        .attr('x', xCircle)
        .attr("y", height - moveY + 30)
        .text("Sales ($)")
        .attr('class', 'legend-text')
        .attr("text-anchor", "middle")

  })
};

update_initial_chart4();
//Read the data

