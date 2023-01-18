
// set the dimensions and margins of the graph
let marginT4 = { top: 10, right: 30, bottom: 30, left: 40 },
    widthT4 = 600 - marginT4.left - marginT4.right,
    heightT4 = 500 - marginT4.top - marginT4.bottom;

// append the svg object to the body of the page
let svgT4 = d3.select("#timeChart4")
    .append("svg")
    .attr('id', 'svg_timeChart4')
    .attr("viewBox", '-200 0 1000 570')
    // .attr("width", widthT4 + marginT4.left + marginT4.right)
    // .attr("height", heightT4 + marginT4.top + marginT4.bottom)
    .append("g")
    .attr("transform",
        `translate(${marginT4.left},${marginT4.top})`);

// get the data
d3.csv("../../data/PopRock_years.csv").then(function (data) {

    let allGroup = ['Pop', 'Rock']

    // Reformat the data: we need an array of arrays of {x, y} tuples
    let dataReady = allGroup.map(function (grpName) { // .map allows to do something for each element of the list
        return {
            genre: grpName,
        };
    });
    // X axis: scale and draw:
    let x = d3.scaleLinear()
        .domain([1935, 2023])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, widthT4]);
    svgT4.append("g")
        .attr("transform", `translate(0, ${heightT4})`)
        .transition().duration(1000)
        .call(d3.axisBottom(x));
    svgT4.append("text")
        .attr("text-anchor", "end")
        .attr("x", widthT4)
        .attr("y", heightT4 + 50)
        .text("Years");
    svgT4.append("text")
        .attr("text-anchor", "end")
        .attr("x", -40)
        .attr("y", height2 - 450)
        .text("Nbr. Artists");

    // set the parameters for the histogram
    let histogram = d3.histogram()
        .value(function (d) { return +d.period_active; })   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
        .thresholds(x.ticks(40)); // then the numbers of bins

    // And apply twice this function to data to get the bins.
    let bins1 = histogram(data.filter(function (d) { return d.Genre === "Pop" }));
    let bins2 = histogram(data.filter(function (d) { return d.Genre === "Rock" }));

    // Y axis: scale and draw:
    let y = d3.scaleLinear()
        .range([heightT4, 0]);
    y.domain([0, d3.max(bins1, function (d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    svgT4.append("g")
    .transition().duration(1000)
        .call(d3.axisLeft(y));

    // append the bars for series 1
    svgT4.selectAll("rect")
        .data(bins1)
        .join("rect")
        .attr("x", 1)
        .attr('class', 'Pop')
        .attr("transform", function (d) { return `translate(${x(d.x0)} , ${y(d.length)})` })
        .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
        .attr("height", function (d) { return heightT4 - y(d.length); })
        .style("fill", "#2877b7")
        .style("opacity", 0.6)

    // append the bars for series 2
    svgT4.selectAll("rect2")
        .data(bins2)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr('class', 'Rock')
        .attr("transform", function (d) { return `translate(${x(d.x0)}, ${y(d.length)})` })
        .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
        .attr("height", function (d) { return heightT4 - y(d.length); })
        .style("fill", "#17823c")
        .style("opacity", 0.6)

    let myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(['#2877b7', '#17823c']);
    svgT4
        .selectAll("myLegend")
        .data(dataReady)
        .join('g')
        .append("text")
        .attr('x', (d, i) => 30 + i * 60)
        .attr('y', 30)
        .text(d => d.genre)
        .style("fill", d => myColor(d.genre))
        .style("font-size", '11pt')
        .on("click", function (event, d) {
            // is the element currently visible ?
            currentOpacity = d3.selectAll("." + d.genre).style("opacity")
            // Change the opacity: from 0 to 1 or from 1 to 0
            d3.selectAll("." + d.genre).transition().style("opacity", currentOpacity == 0.6 ? 0 : 0.6)

        })



});



d3.select('#selectGenres').on("change", function () {
    let genre1 = this.value.split(" VS ")[0]
    let genre2 = this.value.split(" VS ")[1]
    console.log(genre1, genre2)
    d3.select('#svg_timeChart4').remove();

    let genre1V2 = genre1.replace(" ", "")
    let genre2V2 = genre2.replace(" ", "")
    if (genre1V2.includes('&') || genre2V2.includes("&")) {
        genre1V2 = genre1V2.replace('&', '')
        genre2V2 = genre2V2.replace('&', '')
    }
    let allGroup = [genre1V2, genre2V2]

    // Reformat the data: we need an array of arrays of {x, y} tuples
    let dataReady = allGroup.map(function (grpName) { // .map allows to do something for each element of the list
        return {
            genre: grpName,
        };
    });

    let marginT4 = { top: 10, right: 30, bottom: 30, left: 40 },
        widthT4 = 600 - marginT4.left - marginT4.right,
        heightT4 = 500 - marginT4.top - marginT4.bottom;

    let svgT4 = d3.select("#timeChart4_2")
        .append("svg")
        .attr('id', 'svg_timeChart4')
        .attr("viewBox", '-200 0 1000 570')
        .append("g")
        .attr("transform",
            `translate(${marginT4.left},${marginT4.top})`);

    d3.csv(`../../data/${genre1 + genre2}_years.csv`).then(function (data) {

        // X axis: scale and draw:
        let x = d3.scaleLinear()
            .domain([1935, 2023])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
            .range([0, widthT4]);
        svgT4.append("g")
            .attr("transform", `translate(0, ${heightT4})`)
            .transition().duration(1000)
            .call(d3.axisBottom(x));
        svgT4.append("text")
            .attr("text-anchor", "end")
            .attr("x", widthT4)
            .attr("y", heightT4 + 50)
            .text("Years");
        svgT4.append("text")
            .attr("text-anchor", "end")
            .attr("x", -40)
            .attr("y", height2 - 450)
            .text("Nbr. Artists");
        // set the parameters for the histogram
        let histogram = d3.histogram()
            .value(function (d) { return +d.period_active; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(40)); // then the numbers of bins

        // And apply twice this function to data to get the bins.
        let bins1 = histogram(data.filter(function (d) { return d.Genre === genre1 }));
        let bins2 = histogram(data.filter(function (d) { return d.Genre === genre2 }));

        // Y axis: scale and draw:
        let y = d3.scaleLinear()
            .range([heightT4, 0]);
        y.domain([0, d3.max(bins1, function (d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
        svgT4.append("g")
        .transition().duration(1000)
            .call(d3.axisLeft(y));

        // append the bars for series 1
        svgT4.selectAll("rect")
            .data(bins1)
            .join("rect")
            .attr("x", 1)
            .attr('class', genre1V2)
            .attr("transform", function (d) { return `translate(${x(d.x0)} , ${y(d.length)})` })
            .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
            .attr("height", function (d) { return heightT4 - y(d.length); })
            .style("fill", "#2877b7")
            .style("opacity", 0.6)

        // append the bars for series 2
        svgT4.selectAll("rect2")
            .data(bins2)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr('class', genre2V2)
            .attr("transform", function (d) { return `translate(${x(d.x0)}, ${y(d.length)})` })
            .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
            .attr("height", function (d) { return heightT4 - y(d.length); })
            .style("fill", "#17823c")
            .style("opacity", 0.6)

        let myColor = d3.scaleOrdinal()
            .domain(allGroup)
            .range(['#2877b7', '#17823c']);
        svgT4
            .selectAll("myLegend")
            .data(dataReady)
            .join('g')
            .append("text")
            .attr('class', 'legend-text-histogram')
            .attr('x', (d, i) => 30 + i * 60)
            .attr('y', 30)
            .text(d => d.genre)
            .style("fill", d => myColor(d.genre))
            .style("font-size", 11)
            .on("click", function (event, d) {
                // is the element currently visible ?
                currentOpacity = d3.selectAll("." + d.genre).style("opacity")
                // Change the opacity: from 0 to 1 or from 1 to 0
                d3.selectAll("." + d.genre).transition().style("opacity", currentOpacity == 0.6 ? 0 : 0.6)

            })

    });

})


// append the svg object to the body of the page


// get the data
