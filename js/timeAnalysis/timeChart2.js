
// set the dimensions and margins of the graph
let margin2 = { top: 10, right: 100, bottom: 30, left: 30 },
    width2 = 900 - margin2.left - margin2.right,
    height2 = 500 - margin2.top - margin2.bottom;

// append the svg object to the body of the page


//Read the data
d3.csv("../../data/top_5_genres_trend.csv").then(function (data) {
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
        .attr("opacity", '0.6')
        .style("fill", "none")



    // Add a label at the end of each line

    svg2
        .selectAll("myLabels")
        .data(dataReady)
        .join('g')
        .append("text")
        .attr("class", function (d) {
            if (d.genre.includes('&')) {
                return d.genre.replace('&', '')
            } else {
                return d.genre
            }
        }
        )
        .datum(d => {
            return { genre: d.genre, value: d.values[d.values.length - 1] };
        }) // keep only the last value of each time series
        .attr("transform", d => `translate(${x(d.value.Year)},${y(d.value.value)})`) // Put the text at the position of the last point
        .attr("x", 12) // shift the text a bit more right
        .text(d => d.genre)
        .style("fill", d => myColor(d.genre))
        .attr('opacity', '0.8')
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
        .attr('opacity', '0.8')
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
            d3.selectAll("." + modGenre).transition().style("opacity", currentOpacity == 0.6 ? 0 : 0.6)

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