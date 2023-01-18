let margin3 = {top: 10, right: 100, bottom: 30, left: 100}, 
width3 = 800 - margin3.left - margin3.right,
    height3 = 500 - margin3.top - margin3.bottom;
var svg3 = d3.select("#timeChart3")
    .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("viewBox", `-150 0 1000 570`)
    .append("g")
    .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

// Parse the Data
d3.csv("../../data/TA_CH_3.csv").then(function (data) {
    // d3.csv("../../data/prova.csv").then(function (data2) {

    //     console.log(data2) 

    // })
    // console.log(data);
    // List of subgroups = header of the csv files = soil condition here
    // var subgroups = data.columns.slice(1)
    let subgroups = ['Pop', 'Rock', 'R&b', 'Hip-hop', 'country'];
    let top_countries = ["United States", "Canada", "United Kingdom", "Barbados", "Trinidad and Tobago"]
    data = data.map(function (d) {
        return {
            'Country': d.Country,
            'Pop': d.pop,
            'Rock': d.rock,
            'country': d.country,
            'Hip-hop': d['hip-hop'],
            'R&b': d['r&b']
        }
    });
    data = data.filter(function (row) {
        if (top_countries.includes(row.Country)) {
            return row;
        }
    })
    console.log(data)
    // List of groups = species here = value of the first column called group -> I show them on the X axis
    var groups = d3.map(data, function (d) {
        return (d.Country)
    });
    // console.log('ggggggggg', groups)
    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 14000])
        .range([0, width3])

    svg3.append("g")
        .attr("transform", "translate(0," + height3 + ")")
        .transition().duration(1000)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleBand()
        .domain(groups)
        .range([0, height3])
        .padding([0.2]);
    svg3.append("g")
    .transition().duration(1000)
        .call(d3.axisLeft(y));
    // color palette = one color per subgroup
    let color_list = ['#2877b7', '#17823c', '#817ab8', '#fc8c62', '#00fa9a' ]
    var color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(color_list)


    //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
        .keys(subgroups)(data)


    // ----------------
    // Create a tooltip
    // ----------------
    let tooltip3 = d3.select("#timeChart2")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
    let mouseover3 = function (d) {
        tooltip3
            .style("opacity", 1)
            d3.select(this).attr("fill", "#9B2335");
    }
    let mousemove3 = function (event, d) {
        var subgroupName = d3.select(this.parentNode).datum().key;
        var subgroupValue = d.data[subgroupName].toString().split(".")[0];
        if (subgroupValue > 999) {
            subgroupValue = `${d.data[subgroupName]} billion`
        } else {
            subgroupValue = `${d.data[subgroupName]} million`
        }
        d3.csv("../../data/prova.csv").then(function (data2) {

            console.log(data2) 
    
        })
        tooltip3
        .html("<span style='color:grey'>Genre: </span>" + subgroupName  + "<br>" + "<span style='color:grey'>Sales ($): </span>" +subgroupValue  )
            .style("left", (event.pageX + 30) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
            .style("top", (event.pageY) + "px")
    }
    // var mouseleave3 = function (d) {
    //     tooltip3
    //         .transition()
    //         .duration(200)
    //         .style("opacity", 0)
    //         d3.select(this).attr('fill', d => color)
    // }


    // Show the bars
    svg3.append("g")
        .selectAll("g")
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .enter().append("g")
        .attr("fill", function (d) {

            return color(d.key);
        })
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("x", function (d) {
            // return x(d.data.Neighborhood);
            return x(d[0])
        })
        .attr("y", function (d) {
            // console.log(d.data.Country);
            return y(d.data.Country);
        })
        .attr("height", y.bandwidth())
        .attr("width", function (d) {
            return x(d[1]) - x(d[0])
        })
        .on("mouseover", mouseover3)
        .on("mousemove", mousemove3)
        .on("mouseleave", function () {
            tooltip3
                .style("opacity", 0);
            d3.select(this).attr("fill", function (d) {
                return color;
            })
        })

    var legend3 = d3.select("#task_3_legend")
        .append("svg")
        // .attr("viewBox", `0 0 50 50`)
        .attr('width', 300)
        .attr('height', 200)
        .append('g')
        .attr("transform", `translate(50,0)`)
        .selectAll("div")
        .data(subgroups)
        .enter()
        .append("g")
        .attr('transform', function (d, i) {
            return "translate(0," + i * 30 + ")";
        });

    legend3.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function (d, i) {
            console.log(color[d])
            return color(d)
        });

    legend3.append("text")
        .attr("x", 25)
        .attr("y", 15)
        .text(function (d, i) {
            return d
        });
    svg3.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width3 + 50)
        .attr("y", height3 + 50)
        .text("Sales ($)");
        svg3.append("text")
        .attr("text-anchor", "end")
        .attr("x", -40)
        .attr("y", height2 - 450)
        .text("Country");

});
