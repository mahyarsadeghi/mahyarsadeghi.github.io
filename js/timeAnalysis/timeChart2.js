// set the dimensions and margins of the graph
let margin2 = {top: 10, right: 100, bottom: 30, left: 30},
    width2 = 800 - margin2.left - margin2.right,
    height2 = 500 - margin2.top - margin2.bottom;

// append the svg object to the body of the page
let svg2 = d3.select("#timeChart2")
    .append("svg")
    .attr("width", width2 + margin2.left + margin2.right)
    .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

//Read the data
d3.csv("../../data/TA_CH_2.csv").then(function (data) {

    // List of groups (here I have one group per column)
    // let allGroup = ['adult contemporary', 'alternative',
    //     'alternative rock', 'art rock', 'blues', 'blues rock', 'celtic',
    //     'country', 'country pop', 'dance', 'dance pop', 'dance-pop', 'disco',
    //     'easy listening', 'edm', 'electronic', 'electronica', 'electropop',
    //     'folk', 'folk pop', 'folk rock', 'funk', 'funk rock', 'glam metal',
    //     'glam rock', 'gospel', 'grunge', 'hard rock', 'heavy metal',
    //     'hip house', 'hip-hop', 'j-pop', 'jazz', 'latin', 'latin pop',
    //     'neo soul', 'new-age', 'nu metal', 'pop', 'pop punk', 'pop rock',
    //     'progressive rock', 'psychedelic rock', 'punk rock', 'r&b', 'rap rock',
    //     'reggae', 'rock', 'rock and roll', 'smooth jazz', 'soft rock', 'soul',
    //     'surf rock', 'swing', 'teen pop', 'thrash metal']
    let allGroup = ['pop', 'rock','country']

    let selected_country = "United States";
    data = data.filter(function (row) {
        return row['Country'] == selected_country;
    });
    // Reformat the data: we need an array of arrays of {x, y} tuples
    let dataReady = allGroup.map(function (grpName) { // .map allows to do something for each element of the list
        return {
            genre: grpName,
            country: selected_country,
            values: data.map(function (d) {
                // console.log(d);
                //If the value of the genre is not zero, then return that

                return {Year: d.Year, value: +d[grpName]};

            })
        };
    });
    // console.log(dataReady)
    // I strongly advise to have a look to dataReady with
    // console.log(dataReady)

    // A color scale: one color for each group
    let myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    let x = d3.scaleLinear()
        .domain([1935, 2023])
        .range([0, width2]);
    svg2.append("g")
        .attr("transform", `translate(0, ${height2})`)
        .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([0, 700])
        .range([height2, 0]);
    svg2.append("g")
        .call(d3.axisLeft(y));

    //Adding Tooltip
    let tooltip = d3.select("#timeChart2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
    let mouseover = function (d) {
        tooltip
            .style("opacity", 1)
    }
    let mousemove = function (event, d) {
        tooltip
            .html("Year: " + d.Year + " Sales: " + d.value + " M$")
            .style("left", (event.pageX + 30) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (event.pageY) + "px")
    }
    var mouseleave = function (d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }

    // Add the lines
    let line = d3.line()
        .x(d => x(+d.Year))
        .y(d => y(+d.value))
    svg2.selectAll("myLines")
        .data(dataReady)
        .join("path")
        .attr("class", d => d.genre)
        .attr("d", d => line(d.values))
        .attr("stroke", d => myColor(d.genre))
        .style("stroke-width", 4)
        .style("fill", "none")


    // Add the points
    svg2
        // First we need to enter in a group
        .selectAll("myDots")
        .data(dataReady)
        .join('g')
        .style("fill", d => myColor(d.genre))
        .attr("class", d => d.genre)
        // Second we need to enter in the 'values' part of this group
        .selectAll("myPoints")
        .data(d => d.values)
        .join("circle")
        .attr("cx", d => x(d.Year))
        .attr("cy", d => y(d.value))
        .attr("r", 5)
        .attr("stroke", "white")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)

    // Add a label at the end of each line
    // svg2
    //     .selectAll("myLabels")
    //     .data(dataReady)
    //     .join('g')
    //     .append("text")
    //     .attr("class", d => d.genre)
    //     .datum(d => {
    //         return {genre: d.genre, value: d.values[d.values.length - 1]};
    //     }) // keep only the last value of each time series
    //     .attr("transform", d => `translate(${x(d.value.Year)},${y(d.value.value)})`) // Put the text at the position of the last point
    //     .attr("x", 12) // shift the text a bit more right
    //     .text(d => d.genre)
    //     .style("fill", d => myColor(d.genre))
    //     .style("font-size", 15)

    // Add a legend (interactive)
    svg2
        .selectAll("myLegend")
        .data(dataReady)
        .join('g')
        .append("text")
        .attr('x', (d, i) => 30 + i * 60)
        .attr('y', 30)
        .text(d => d.genre)
        .style("fill", d => myColor(d.genre))
        .style("font-size", 15)
        .on("click", function (event, d) {
            // is the element currently visible ?
            currentOpacity = d3.selectAll("." + d.genre).style("opacity")
            // Change the opacity: from 0 to 1 or from 1 to 0
            d3.selectAll("." + d.genre).transition().style("opacity", currentOpacity == 1 ? 0 : 1)

        })
    //adding x and y labels
    svg2.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width2)
        .attr("y", height2 + 30)
        .text("Year");
    svg2.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("Sales (M $)");


})
