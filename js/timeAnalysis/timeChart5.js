
// set the dimensions and margins of the graph
const margin = { top: 50, right: 0, bottom: 30, left: 150 },
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//Read the data
d3.csv("../../data/top_5_genres_trend.csv").then(function (data) {

    // group the data: I want to draw one line per group
    let allGroup = ['Pop', 'Rock', 'R&b', 'Hip-hop', 'Country']

    // Reformat the data: we need an array of arrays of {x, y} tuples
    let dataReady = allGroup.map(function (grpName) { // .map allows to do something for each element of the list
        return {
            genre: grpName,

            values: data.map(function (d) {

                return { Year: d.period_active, value: +d[grpName] };

            })
        };
    });
    //   console.log(dataReady)
    // What is the list of groups?
    allKeys = new Set(dataReady.map(d => d.genre))

    // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
    const svg = d3.select("#timeChart5")
        .selectAll("uniqueChart")
        .data(dataReady)
        .enter()
        .append("svg")
        .attr("viewBox", '0 0 610 500')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left},${margin.top})`);

    // Add X axis --> it is a date format
    const x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.period_active; }))
        .range([0, width]);
    svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).ticks(5));

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width - 5)
        .attr("y", height + 30)
        .text("Years");

    //Add Y axis
    const y = d3.scaleLinear()
        .domain([0, 60])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y).ticks(5));

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", (width / 2) - 230)
        .attr("y", height - 450)
        .text("Nbr. Artists")
        .attr("transform", "rotate(-90)");

    let myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(['#2877b7', '#17823c', '#817ab8', '#fc8c62', '#00fa9a']);

    let line = d3.line()
        .x(d => x(+d.Year))
        .y(d => y(+d.value))
    // Draw the line
    svg
        .append("path")
        .attr("d", d =>
            line(d.values))
        .attr("fill", "none")
        .attr("stroke", d => myColor(d.genre))
        .attr("stroke-width", 3.9)


    // Add titles
    svg
        .append("text")
        .attr("text-anchor", "start")
        .attr("y", -5)
        .attr("x", 0)
        .text(d => d.genre)
        .attr("fill", d => myColor(d.genre))


})
