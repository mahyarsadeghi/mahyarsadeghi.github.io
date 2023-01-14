function Legend(color, id, {
    title,
    tickSize = 6,
    width = 600, 
    height = 44 + tickSize,
    marginTop = 18,
    marginRight = 20,
    marginBottom = 16 + tickSize,
    marginLeft = 20,
    ticks = width / 64,
    tickFormat,
    tickValues
  } = {}) {
  
  function ramp(color, n = 256) {
    const canvas = document.createElement("canvas");
    canvas.width = n;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    for (let i = 0; i < n; ++i) {
      context.fillStyle = color(i / (n - 1));
      context.fillRect(i, 0, 1, 1);
    }
    return canvas;
  }
  
  const svgLeg = d3.select(id)
              .append("svg")
              .attr("viewBox", '0 0 ' + (width + marginLeft + marginRight) +
                  ' ' + (height + marginTop + marginBottom))
              .append("g")
              .attr("transform", `translate(${marginLeft}, ${marginTop})`);
  
  //const prova = d3.select("graph5").append(svgLeg)
  
  let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
  let x;
  
  // Continuous
  if (color.interpolate) {
    const n = Math.min(color.domain().length, color.range().length);
  
    x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));
  
    svgLeg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
  }
  
  // Sequential
  else if (color.interpolator) {
    x = Object.assign(color.copy()
        .interpolator(d3.interpolateRound(marginLeft, width - marginRight)),
        {range() { return [marginLeft, width - marginRight]; }});
  
    svgLeg.append("image")
        .attr("x", marginLeft)
        .attr("y", marginTop)
        .attr("width", width - marginLeft - marginRight)
        .attr("height", height - marginTop - marginBottom)
        .attr("preserveAspectRatio", "none")
        .attr("xlink:href", ramp(color.interpolator()).toDataURL());
  
    // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
    if (!x.ticks) {
      if (tickValues === undefined) {
        const n = Math.round(ticks + 1);
        tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
      }
      if (typeof tickFormat !== "function") {
        tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
      }
    }
  }
  
  // Threshold
  else if (color.invertExtent) {
    const thresholds
        = color.thresholds ? color.thresholds() // scaleQuantize
        : color.quantiles ? color.quantiles() // scaleQuantile
        : color.domain(); // scaleThreshold
  
    const thresholdFormat
        = tickFormat === undefined ? d => d
        : typeof tickFormat === "string" ? d3.format(tickFormat)
        : tickFormat;
  
    x = d3.scaleLinear()
        .domain([-1, color.range().length - 1])
        .rangeRound([marginLeft, width - marginRight]);
  
    svgLeg.append("g")
      .selectAll("rect")
      .data(color.range())
      .join("rect")
        .attr("x", (d, i) => x(i - 1))
        .attr("y", marginTop)
        .attr("width", (d, i) => x(i) - x(i - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", d => d);
  
    tickValues = d3.range(thresholds.length);
    tickFormat = i => thresholdFormat(thresholds[i], i);
  }
  
  // Ordinal
  else {
    x = d3.scaleBand()
        .domain(color.domain())
        .rangeRound([marginLeft, width - marginRight]);
  
    svgLeg.append("g")
      .selectAll("rect")
      .data(color.domain())
      .join("rect")
        .attr("x", x)
        .attr("y", marginTop)
        .attr("width", Math.max(0, x.bandwidth() - 1))
        .attr("height", height - marginTop - marginBottom)
        .attr("fill", color);
  
    tickAdjust = () => {};
  }
  
  svgLeg.append("g")
  .attr("transform", `translate(0,${height - marginBottom})`)
  .call(d3.axisBottom(x)
    .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
    .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
    .tickSize(tickSize)
    .tickValues(tickValues))
  .call(tickAdjust)
  .call(g => g.select(".domain").remove())
  .call(g => g.append("text")
    .attr("x", marginLeft)
    .attr("y", marginTop + marginBottom - height - 6)
    .attr("fill", "currentColor")
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .attr("class", "title")
    .text(title));
  
    return svgLeg.node();
  
  }


  // d3.csv("../../data/top_artist_country.csv").then( function(data) {

  //   // Add X axis
  //   let x = d3.scaleBand()
  //   .domain(data.map(d => d.Country))
  //   .range([ 0, width ])
  //   .padding(.2);
  //   svg.append("g")
  //   .attr("transform", `translate(0, ${height})`)
  //   .call(d3.axisBottom(x))
  //   .selectAll("text")
  //   .attr("transform", "translate(-10,0)rotate(-45)")
  //   .style("text-anchor", "end");
    
  //   // Add Y axis
  //   let y = d3.scaleLinear()
  //   .domain([0, 600])
  //   .range([ height, 0]);
  //   svg.append("g")
  //   .call(d3.axisLeft(y));
    
  //   // Add a scale for bubble size
  //   let z = d3.scaleLinear()
  //   .domain([75, 550])
  //   .range([ 4, 40]);
    
  //   // Add a scale for bubble color
  //   // const myColor = d3.scaleOrdinal()
  //   // .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
  //   // .range(d3.schemeSet2);
    
  //   // -1- Create a tooltip div that is hidden by default:
    
    
  //   // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
  //   const showTooltip = function(event, d) {
    
  //     let totalAmount = d['Sales ($)'];
  //     let artist = d.Artist;
  //     let country = d.Country;
    
  //     tooltip
  //       .html("<span style='color:grey'>Artist: </span>" + artist +
  //         "<br>" + "<span style='color:grey'>Sales ($): </span>" + totalAmount + ' million' +
  //         "<br>" + "<span style='color:grey'>Country: </span>" + country)
  //       .style("opacity", 1);
  //   //   d3.select(this).attr("fill", "#9B2335");
  //   console.log(artist)
  //     d3.select(`#bubbles${artist}`.split(" ").join('').split('/').join("").split("'").join("")).attr('stroke' ,'#9B2335').attr('stroke-width', '3px')
  //   //  d3.select(`circle`).attr('stroke' ,'black')
    
    
  //   }
  //   const moveTooltip = function(event, d) {
  //   tooltip
  //   .style('left', (event.pageX + 40) + 'px')
  //   .style('top', (event.pageY + 5) + 'px')
  //   }
  //   const hideTooltip = function(event, d) {
  //   tooltip
  //     .transition()
  //     .duration(200)
  //     .style("opacity", 0)
  //     d3.selectAll("circle").attr('stroke' ,'none')
  //   }
    
  //   // Add dots
  //   svg.append('g')
  //   .selectAll("dot")
  //   .data(data)
  //   .join("circle")
  //     .attr("id", d => "bubbles"+d.Artist.split(" ").join('').split('/').join("").split("'").join(""))
  //     .attr("class", d => "bubbles"+d.Artist)
  //     .attr("cx", d => x(d.Country))
  //     .attr("cy", d => y(d['Sales ($)']))
  //     .attr("r", d => z(d['Sales ($)']))
  //     .style("fill", '#17823c')
  //   // -3- Trigger the functions
  //   .on("mouseover", showTooltip )
  //   .on("mousemove", moveTooltip )
  //   .on("mouseleave", hideTooltip )
    
  //   })