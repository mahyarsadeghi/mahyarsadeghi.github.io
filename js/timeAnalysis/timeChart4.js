
// set the dimensions and margins of the graph
let marginT4 = { top: 10, right: 30, bottom: 30, left: 40 },
    widthT4 = 460 - marginT4.left - marginT4.right,
    heightT4 = 400 - marginT4.top - marginT4.bottom;

// append the svg object to the body of the page
let svgT4 = d3.select("#timeChart4")
    .append("svg")
    .attr('id', 'svg_timeChart4')
    .attr("width", widthT4 + marginT4.left + marginT4.right)
    .attr("height", heightT4 + marginT4.top + marginT4.bottom)
    .append("g")
    .attr("transform",
        `translate(${marginT4.left},${marginT4.top})`);

// get the data
d3.csv("../../data/PopRock_years.csv").then(function (data) {

    // X axis: scale and draw:
    let x = d3.scaleLinear()
        .domain([1935, 2023])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, widthT4]);
    svgT4.append("g")
        .attr("transform", `translate(0, ${heightT4})`)
        .call(d3.axisBottom(x));

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
        .call(d3.axisLeft(y));

    // append the bars for series 1
    svgT4.selectAll("rect")
        .data(bins1)
        .join("rect")
        .attr("x", 1)
        .attr("transform", function (d) { return `translate(${x(d.x0)} , ${y(d.length)})` })
        .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
        .attr("height", function (d) { return heightT4 - y(d.length); })
        .style("fill", "#69b3a2")
        .style("opacity", 0.6)

    // append the bars for series 2
    svgT4.selectAll("rect2")
        .data(bins2)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function (d) { return `translate(${x(d.x0)}, ${y(d.length)})` })
        .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
        .attr("height", function (d) { return heightT4 - y(d.length); })
        .style("fill", "#404080")
        .style("opacity", 0.6)

    // Handmade legend
    svgT4.append("circle").attr("cx", 300).attr("cy", 30).attr("r", 6).style("fill", "#69b3a2")
    svgT4.append("circle").attr("cx", 300).attr("cy", 60).attr("r", 6).style("fill", "#404080")
    svgT4.append("text").attr("x", 320).attr("y", 30).text("Pop").style("font-size", "15px").attr("alignment-baseline", "middle")
    svgT4.append("text").attr("x", 320).attr("y", 60).text("Rock").style("font-size", "15px").attr("alignment-baseline", "middle")

});



d3.select('#selectGenres').on("change", function () {
    let genre1 = this.value.split(" VS ")[0]
    let genre2 = this.value.split(" VS ")[1]
    console.log(genre1, genre2)
    d3.select('#svg_timeChart4').remove();

    let marginT4 = { top: 10, right: 30, bottom: 30, left: 40 },
        widthT4 = 460 - marginT4.left - marginT4.right,
        heightT4 = 400 - marginT4.top - marginT4.bottom;

    let svgT4 = d3.select("#timeChart4_2")
        .append("svg")
        .attr('id', 'svg_timeChart4')
        .attr("width", widthT4 + marginT4.left + marginT4.right)
        .attr("height", heightT4 + marginT4.top + marginT4.bottom)
        .append("g")
        .attr("transform",
            `translate(${marginT4.left},${marginT4.top})`);

    d3.csv(`../../data/${genre1+genre2}_years.csv`).then(function (data) {

        // X axis: scale and draw:
        let x = d3.scaleLinear()
            .domain([1935, 2023])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
            .range([0, widthT4]);
            svgT4.append("g")
            .attr("transform", `translate(0, ${heightT4})`)
            .call(d3.axisBottom(x));

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
            .call(d3.axisLeft(y));

        // append the bars for series 1
        svgT4.selectAll("rect")
            .data(bins1)
            .join("rect")
            .attr("x", 1)
            .attr("transform", function (d) { return `translate(${x(d.x0)} , ${y(d.length)})` })
            .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
            .attr("height", function (d) { return heightT4 - y(d.length); })
            .style("fill", "#69b3a2")
            .style("opacity", 0.6)

        // append the bars for series 2
        svgT4.selectAll("rect2")
            .data(bins2)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", function (d) { return `translate(${x(d.x0)}, ${y(d.length)})` })
            .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1; })
            .attr("height", function (d) { return heightT4 - y(d.length); })
            .style("fill", "#404080")
            .style("opacity", 0.6)

        // Handmade legend
        svgT4.append("circle").attr("cx", 300).attr("cy", 30).attr("r", 6).style("fill", "#69b3a2")
        svgT4.append("circle").attr("cx", 300).attr("cy", 60).attr("r", 6).style("fill", "#404080")
        svgT4.append("text").attr("x", 320).attr("y", 30).text(genre1).style("font-size", "15px").attr("alignment-baseline", "middle")
        svgT4.append("text").attr("x", 320).attr("y", 60).text(genre2).style("font-size", "15px").attr("alignment-baseline", "middle")

    });

})


// append the svg object to the body of the page


// get the data
