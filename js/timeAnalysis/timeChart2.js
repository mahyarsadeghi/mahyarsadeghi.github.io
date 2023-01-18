
//
//             //Adding Tooltip
//             let tooltip = d3.select("#timeChart2")
//                 .append("div")
//                 .style("opacity", 0)
//                 .attr("class", "tooltip")
//                 .style("background-color", "white")
//                 .style("border", "solid")
//                 .style("border-width", "1px")
//                 .style("border-radius", "5px")
//                 .style("padding", "10px")
//             let mouseover = function (d) {
//                 tooltip
//                     .style("opacity", 1)
//             }
//             let mousemove = function (event, d) {
//                 tooltip
//                     .html("Year: " + d.Year + " Sales: " + d.value + " M$")
//                     .style("left", (event.pageX + 30) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
//                     .style("top", (event.pageY) + "px")
//             }
//             var mouseleave = function (d) {
//                 tooltip
//                     .transition()
//                     .duration(200)
//                     .style("opacity", 0)
//             }
//
//             




// set the dimensions and margins of the graph
let margin2 = { top: 10, right: 100, bottom: 30, left: 30 },
    width2 = 900 - margin2.left - margin2.right,
    height2 = 500 - margin2.top - margin2.bottom;

// append the svg object to the body of the page


//Read the data
d3.csv("../../data/top_5_genres_trend.csv").then(function (data) {
    // console.log(data);
    let svg2 = d3.select("#timeChart2")
        .append("svg")
        .attr("viewBox", '-100 0 1000 570')
        // .attr("width", width2 + margin2.left + margin2.right)
        // .attr("height", height2 + margin2.top + margin2.bottom)
        .attr('id', 'SVG_T_A_CH_2')
        .append("g")
        .attr("transform", `translate(${margin2.left},${margin2.top})`);

    let allGroup = ['Pop', 'Rock', 'R&b', 'Hip-hop', 'Country']

    // Reformat the data: we need an array of arrays of {x, y} tuples
    let dataReady = allGroup.map(function (grpName) { // .map allows to do something for each element of the list
        return {
            genre: grpName,

            values: data.map(function (d) {
                // console.log(d);
                //If the value of the genre is not zero, then return that

                return { Year: d.period_active, value: +d[grpName] };

            })
        };
    });
    console.log(dataReady)

    // A color scale: one color for each group
    let myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(['#2877b7', '#17823c', '#817ab8', '#fc8c62', '#00fa9a']);

    // Add X axis --> it is a date format
    let x = d3.scaleLinear()
        .domain([1935, 2023])
        .range([0, width2]);
    svg2.append("g")
        .attr("transform", `translate(0, ${height2})`)
        .transition().duration(1000)
        .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([0, 60])
        .range([height2, 0]);
    svg2.append("g")
    .transition().duration(1000)
        .call(d3.axisLeft(y));

    //     var bisect = d3.bisector(function(d) { return d.x; }).left;

    //     var focus = svg2
    //     .append('g')
    //     .append('circle')
    //       .style("fill", "none")
    //       .attr("stroke", "black")
    //       .attr('r', 8.5)
    //       .style("opacity", 0)

    //   // Create the text that travels along the curve of chart
    //   var focusText = svg2
    //     .append('g')
    //     .append('text')
    //       .style("opacity", 0)
    //       .attr("text-anchor", "left")
    //       .attr("alignment-baseline", "middle")

    //       svg2
    //       .append('rect')
    //       .style("fill", "none")
    //       .style("pointer-events", "all")
    //       .attr('width', width2)
    //       .attr('height', height2)
    //       .on('mouseover', mouseover)
    //       .on('mousemove', mousemove)
    //       .on('mouseout', mouseout);

    //       function mouseover() {
    //         focus.style("opacity", 1)
    //         focusText.style("opacity",1)
    //       }

    //       function mousemove(event, d) {
    //         // recover coordinate we need
    //         var x0 = x.invert(d3.pointer(this));
    //         var i = bisect(data, x0, 1);
    //         selectedData = data[i]
    //         focus
    //           .attr("cx", x(selectedData.period_active))
    //           .attr("cy", y(selectedData.Pop))
    //         focusText
    //           .html("Year:" + selectedData.period_active + "  -  " + "Nbr. Artists:" + selectedData.Pop)
    //           .attr("x", x(selectedData.period_active)+15)
    //           .attr("y", y(selectedData.Pop))
    //         }
    //       function mouseout() {
    //         focus.style("opacity", 0)
    //         focusText.style("opacity", 0)
    //       }

    //Adding Tooltip
    // let tooltip = d3.select("#timeChart2")
    //     .append("div")
    //     .style("opacity", 0)
    //     .attr("class", "tooltip")
    //     .style("background-color", "white")
    //     .style("border", "solid")
    //     .style("border-width", "1px")
    //     .style("border-radius", "5px")
    //     .style("padding", "10px")
    // let mouseover = function (d) {
    //     tooltip
    //         .style("opacity", 1)
    // }
    // let mousemove = function (event, d) {
    //     tooltip
    //         .html("Year: " + d.Year + " Count: " + d.value + " M$")
    //         .style("left", (event.pageX + 30) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
    //         .style("top", (event.pageY) + "px")
    // }
    // var mouseleave = function (d) {
    //     tooltip
    //         .transition()
    //         .duration(200)
    //         .style("opacity", 0)
    // }

    // Add the lines

    let line = d3.line()
        .x(d => x(+d.Year))
        .y(d => y(+d.value))
    svg2.selectAll("myLines")
        .data(dataReady)
        .join("path")
        .attr("class", function (d) {
            if (d.genre.includes('&')) {
                return d.genre.replace('&', '')
            } else {
                return d.genre
            }
        }
        )
        .attr("d", d => line(d.values))
        .attr("stroke", d => myColor(d.genre))
        .style("stroke-width", 4)
        .style("fill", "none")



    // Add the points
    // svg2
    //     // First we need to enter in a group
    //     .selectAll("myDots")
    //     .data(dataReady)
    //     .join('g')
    //     .style("fill", d => myColor(d.genre))
    //     .attr("class", d => d.genre)
    //     // Second we need to enter in the 'values' part of this group
    //     .selectAll("myPoints")
    //     .data(d => d.values)
    //     .join("circle")
    //     .attr("cx", d => x(d.Year))
    //     .attr("cy", d => y(d.value))
    //     .attr("r", 5)
    //     .attr("stroke", "white")
    //     .on("mouseover", mouseover)
    //     .on("mousemove", mousemove)
    //     .on("mouseleave", mouseleave)

    // Add a label at the end of each line

    svg2
        .selectAll("myLabels")
        .data(dataReady)
        .join('g')
        .append("text")
        .attr("class", d => d.genre)
        .datum(d => {
            return { genre: d.genre, value: d.values[d.values.length - 1] };
        }) // keep only the last value of each time series
        .attr("transform", d => `translate(${x(d.value.Year)},${y(d.value.value)})`) // Put the text at the position of the last point
        .attr("x", 12) // shift the text a bit more right
        .text(d => d.genre)
        .style("fill", d => myColor(d.genre))
        .style("font-size", 15)
    let modGenre = ''
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
            if (d.genre.includes('&')) {
                modGenre = d.genre.replace('&', '')
            } else {
                modGenre = d.genre
            }
            // is the element currently visible ?
            currentOpacity = d3.selectAll("." + modGenre).style("opacity")
            // Change the opacity: from 0 to 1 or from 1 to 0
            d3.selectAll("." + modGenre).transition().style("opacity", currentOpacity == 1 ? 0 : 1)

        })
    //adding x and y labels
    svg2.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width2)
        .attr("y", height2 + 40)
        .text("Years");

    svg2.append("text")
        .attr("text-anchor", "end")
        .attr("x", -40)
        .attr("y", height2 - 450)
        .text("Nbr. Artists");
})