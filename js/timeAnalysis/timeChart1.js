
// set the dimensions and margins of the graph
let marginT1 = { top: 10, right: 20, bottom: 30, left: 50 },
    widthT1 = 600 - marginT1.left - marginT1.right,
    heightT1 = 500 - marginT1.top - marginT1.bottom;

// append the svg object to the body of the page

let svgT1 = d3.select("#timeChart1")
    .append("svg")
    .attr('id', 'svg_timeChart1')
    .attr("viewBox", '-200 0 1000 570')
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        `translate(${marginT1.left},${marginT1.top})`);


// get the data
d3.csv("../../data/allYears.csv").then(function (data) {



    let scolor = d3.scaleSequential()
        .domain([0, 500])
        .interpolator(d3.interpolatePurples);

    // X axis: scale and draw:
    let x = d3.scaleLinear()
        .domain([1935, 2023])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
        .range([0, widthT1]);
    svgT1.append("g")
        .attr("transform", `translate(0, ${heightT1})`)
        .transition().duration(1000)
        .call(d3.axisBottom(x));

    let y = d3.scaleLinear()
        .range([heightT1, 0]);
    let yAxis = svgT1.append("g");

    let tooltip = d3.select("#timeChart1")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .attr('id', "tooltipHistogram")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "10px")

    function update_initial(nBin) {

        let showTooltip = function (event, d) {
            tooltip
                .html("<span style='color:grey'>Range: </span>" + d.x0 + " - " + d.x1)
                .style("opacity", 1);
            d3.select(this).attr("fill", "#9B2335");
        }
        let moveTooltip = function (event, d) {
            tooltip
                .style('left', (event.x + 70) + 'px')
                .style('top', (event.y - 70) + 'px')
        }
        let hideTooltip = function (event, d) {
            tooltip
                .style("opacity", 0)
            d3.select(this).attr('fill', d => scolor(d.length))

        }

        // set the parameters for the histogram
        let histogram = d3.histogram()
            .value(function (d) { return d.period_active; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(nBin)); // then the numbers of bins

        // And apply this function to data to get the bins
        let bins = histogram(data);

        y.domain([0, d3.max(bins, function (d) { return d.length; })]);

        yAxis
            .transition()
            .duration(1000)
            .call(d3.axisLeft(y))

        svgT1.append("text")
            .attr("text-anchor", "end")
            .attr("x", widthT1)
            .attr("y", heightT1 + 50)
            .text("Years");
        svgT1.append("text")
            .attr("text-anchor", "end")
            .attr("x", -40)
            .attr("y", height2 - 450)
            .text("Nbr. Artists");

        // append the bar rectangles to the svg element
        let u = svgT1.selectAll("rect")
            .data(bins)
        u
            .enter()
            .append("rect")
            .merge(u)
            .attr("x", 1)
            .attr("transform", function (d) { return `translate(${x(d.x0)} , ${y(d.length)})` })
            .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1 })
            .attr("height", function (d) { return heightT1 - y(d.length) })
            // .style("fill", "#817ab8")
            .attr('fill', d => scolor(d.length))
            .attr('stroke', 'black').attr('stroke-width', '.2')
            .on("mouseover", showTooltip)
            .on("mousemove", moveTooltip)
            .on("mouseleave", hideTooltip)
            .exit()
            .remove()

    }

    function update(nBin) {
        let tooltip2 = d3.select("#timeChart1")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .attr('id', "tooltipHistogram")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "10px")


        let scolor = d3.scaleSequential()
            .domain([0, 500])
            .interpolator(d3.interpolatePurples);

        let showTooltip2 = function (event, d) {
            tooltip2
                .style("opacity", 1)
                .html("<span style='color:grey'>Range: </span>" + d.x0 + " - " + d.x1)
                .style("opacity", 1)
                .style('left', (event.x) / 2 + 'px')
                .style('top', (event.y) / 2 + 'px')
            d3.select(this).attr("fill", "#9B2335")
                .attr('stroke', 'black').attr('stroke-width', '.2');
        }
        let moveTooltip2 = function (event, d) {
            tooltip2
                .style('left', (event.x + 70) + 'px')
                .style('top', (event.y - 70) + 'px')

        }
        let hideTooltip2 = function (event, d) {
            tooltip2
                .style("opacity", 0)
            d3.select(this).attr('fill', d => scolor(d.length))

        }

        // set the parameters for the histogram
        let histogram = d3.histogram()
            .value(function (d) { return d.period_active; })   // I need to give the vector of value
            .domain(x.domain())  // then the domain of the graphic
            .thresholds(x.ticks(nBin)); // then the numbers of bins

        // And apply this function to data to get the bins
        let bins = histogram(data);

        y.domain([0, d3.max(bins, function (d) { return d.length; })]);

        yAxis
            .transition()
            .duration(1000)
            .call(d3.axisLeft(y))

        svgT1.append("text")
            .attr("text-anchor", "end")
            .attr("x", widthT1)
            .attr("y", heightT1 + 50)
            .text("Years");

        svgT1.append("text")
            .attr("text-anchor", "end")
            .attr("x", -40)
            .attr("y", height2 - 450)
            .text("Nbr. Artists");

        // append the bar rectangles to the svg element
        let u = svgT1.selectAll("rect")
            .data(bins)
        u
            .enter()
            .append("rect")
            .merge(u)
            .transition()
            .duration(1000)
            .attr("x", 1)
            .attr("transform", function (d) { return `translate(${x(d.x0)} , ${y(d.length)})` })
            .attr("width", function (d) { return x(d.x1) - x(d.x0) - 1 })
            .attr("height", function (d) { return heightT1 - y(d.length); })
            .attr('fill', d => scolor(d.length))
            .attr('stroke', 'black').attr('stroke-width', '.2')

        u
            .exit()
            .remove()
            .on("mouseover", showTooltip2)
            .on("mousemove", moveTooltip2)
            .on("mouseleave", hideTooltip2)

    }


    // Initialize with 20 bins
    update_initial(40)


    // Listen to the button -> update if user change it
    d3.select("#nBin").on("input", function () {
        update(+this.value);
    });

});