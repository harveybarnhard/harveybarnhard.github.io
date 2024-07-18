---
title: "Longevity and VO<sub>2</sub>&nbsp; max"
permalink: /vo2max/
layout: single
author_profile: false
---

[Mandsager et al. (2018)](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2707428) quantify the strong relationship between VO<sub>2</sub> max (a measurement of endurance
fitness) and life expectancy. The relationship is so strong, in fact, that the hazard ratio
between low and elite levels of VO<sub>2</sub> max is greater than the hazard ratio
of end stage renal disease. In simple terms, a great VO<sub>2</sub> max is more associated
with living a longer life than having healthy kidneys.

This interactive figure uses Garmin's estimate of my VO<sub>2</sub> max and extremely
back-of-the-envelope calculations to estimate my life expectancy and how it changes with
my training.
See the [GitHub Repository](https://github.com/harveybarnhard/vo2max_longevity) for how I process data from Garmin to create this chart.

<style>
        .line {
            fill: none;
            stroke: steelblue;
            stroke-width: 2px;
        }
        .dot {
            fill: gray;
            stroke: none;
        }
        .tooltip {
            position: absolute;
            text-align: left;
            background-color: rgb(255, 255, 255, 0.95);
            border: 0px;
            pointer-events: none;
            text-align: left;
            font-size: 0.5em;
            border: 1px solid #ccc;
            padding: 3px;
            box-shadow: 0 0 5px rgba(0,0,0,0.3);
        }
</style>

<div id="chart"></div>
<script src="https://d3js.org/d3.v6.min.js"></script>
<script>
// Set the dimensions of the canvas / graph
var margin = { top: 40, right: 60, bottom: 30, left: 50 },
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
// Parse the date / time
var parseDate = d3.timeParse("%Y-%m-%d");

// Set the ranges
var x = d3.scaleTime().range([0, width]);
var y1 = d3.scaleLinear().range([height, 0]);
var y2 = d3.scaleLinear().range([height, 0]);

// Define the lines
var valueline1 = d3.line()
    .defined(function(d) { return !isNaN(d.le_est_m); }) // Handle missing values
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y1(d.le_est_m); });

var valueline2 = d3.line()
    .defined(function(d) { return !isNaN(d.vo2max_m); }) // Handle missing values
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y2(d.vo2max_m); });

// Adds the svg canvas
var svg = d3.select("#chart")
    .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("width", "100%")
        .attr("height", "100%")
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("https://raw.githubusercontent.com/harveybarnhard/vo2max_longevity/main/data/le_estimates.csv").then(function(data) {

    // Format the data
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.le_est_m = +d.le_est_m;
        d.vo2max_m = +d.vo2max_m;
    });

    // Calculate the y-axis domains
    var y1Min = d3.min(data, function(d) { return d.le_est_m; }) - 1;
    var y1Max = d3.max(data, function(d) { return d.le_est_m; }) + 1;
    var y2Min = d3.min(data, function(d) { return d.vo2max_m; }) - 1;
    var y2Max = d3.max(data, function(d) { return d.vo2max_m; }) + 1;

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y1.domain([y1Min, y1Max]); // Set the y1-axis range
    y2.domain([y2Min, y2Max]); // Set the y2-axis range

    // Add the valueline1 path
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline1)
        .style("fill", "none")
        .style("stroke", "steelblue")
        .style("stroke-width", 2); // Standard thickness line

    // Add the valueline2 path
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", valueline2)
        .style("fill", "none")
        .style("stroke", "red")
        .style("stroke-width", 2); // Standard thickness line

    // Add the X Axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the Y1 Axis
    svg.append("g")
        .attr("class", "axisBlue")
        .call(d3.axisLeft(y1));

    // Add the Y2 Axis
    svg.append("g")
        .attr("class", "axisRed")
        .attr("transform", "translate(" + width + " ,0)")
        .call(d3.axisRight(y2));

    // Add the Y1 Axis Label
    svg.append("text")
        .attr("x", width / 4)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Life Expectancy")
        .style("color", "steelblue");

    // Add the Y2 Axis Label
    svg.append("text")
        .attr("x", (3 * width) / 4)
        .attr("y", -10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Estimated VO2max");

    // Add colored squares next to axis labels
    svg.append("rect")
        .attr("x", width / 4 - 78)
        .attr("y", -23.5)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", "steelblue");

    svg.append("rect")
        .attr("x", (3 * width) / 4 -89.5)
        .attr("y", -23.5)
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", "red");

    // Add tooltip elements
    var focus = svg.append("g")
        .style("display", "none");

    focus.append("line")
        .attr("class", "tooltip-line")
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "black")
        .style("stroke-width", "1px")
        .style("stroke-dasharray", "3,3")
        .style("pointer-events", "none");

    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    // Create an overlay for capturing mouse movements
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function() { focus.style("display", null); })
        .on("mouseout", function() {
            focus.style("display", "none");
            tooltip.style("opacity", 0);
        })
        .on("mousemove", mousemove);

    var bisectDate = d3.bisector(function(d) { return d.date; }).left;

    function mousemove(event) {
        var x0 = x.invert(d3.pointer(event)[0]),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        focus.select(".tooltip-line")
            .attr("transform", "translate(" + x(d.date) + ",0)");

        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html("Date: " + d.date.toLocaleDateString() + "<br/>Life Expectancy: " + d.le_est_m.toFixed(2) + "<br/>Estimated VO2max: " + d.vo2max_m.toFixed(2));

        var tooltipWidth = parseInt(tooltip.style("width"));
        var tooltipHeight = parseInt(tooltip.style("height"));
        var mouseX = d3.pointer(event, svg.node())[0];
        var mouseY = d3.pointer(event, svg.node())[1];

        var tooltipX = mouseX + margin.left;
        var tooltipY = mouseY + margin.top;

        tooltip.style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px");
    }

}).catch(function(error) {
    console.log(error);
});

</script>

Here is the back-of-the-envelope math that is used to create this figure. First, I take my VO<sub>2</sub> max estimates
from Garmin in units of mL/(kg $\cdot$ min). Garmin estimates VO<sub>2</sub> max using wrist-based and cheststrap-based
heart rate measurements during exercise and recovery. Wrist-based heartrate measurements are not very reliable. Nevertheless,
<a href="https://assets.firstbeat.com/firstbeat/uploads/2017/06/white_paper_VO2max_30.6.2017.pdf">Garmin VO<sub>2</sub> estimates have been validated to accurately predict VO<sub>2</sub> estimates from gold-standard laboratory tests</a>. I then take a rolling average
of VO<sub>2</sub> estimates to smooth out any irregularities.

Each estimated value of VO<sub>2</sub> max corresponds to a mortality hazard ratio relative to the median individual.
For example, individuals with a high VO<sub>2</sub> max will have a low hazard ratio (relatively less likely to die) while
individuals with a low VO<sub>2</sub> max will have a high hazard ratio (relatively more likely to die). The
relationship between VO<sub>2</sub> and hazard ratios are taken from 
[Mandsager et al. (2018)](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2707428). The
most important figure from this paper is shown below.
I model the relationship between VO<sub>2</sub> and hazard ratios as a natural cubic spline so that each
estimate of VO<sub>2</sub> corresponds to an estimated hazard ratio.

<img src="/images/projects/vo2_figure.jpg" alt="Fig" />

The next step is to use the hazard ratios to modify survival curves in order to estimate life expectancy.
Mortality data by age and gender was taken from [CDC Wonder](https://wonder.cdc.gov/) from 2018-2021 in the United States (note that mortality was higher in 2020-2021 during the COVID-19 pandemic). These mortality data allow for the construction of survival curves from any age. Because
this chart is taken over many years, this survival curve will be different in 2018 when I was 22 years old vs in 2023 when
I was 27 years old. These baseline survival curves correspond to a hazard ratio equal to one for the average individual in the United
States. Using the proportional hazards assumption, these survival curves will be pushed inward (less survival) or outwards (more survival) depending on whether the hazard ratio is greater than one or less than one.


Period life expectancy is calculated by integrating the survival curve. Higher VO<sub>2</sub> max estimates correspond to a hazard ratio of
less than one, and therefore more area under the survival curve. Therefore, higher VO<sub>2</sub> max estimates correspond to greater life
expectancy estimates.