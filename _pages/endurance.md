---
title: "Training Volume"
permalink: /volume/
layout: single
author_profile: false
---

This interactive figure shows my weekly training volume in hours across running, cycling,
and other activities (e.g. hiking, canoeing).
See the [GitHub Repository](https://github.com/harveybarnhard/endur) for how I pull and process data from Strava to create this chart.

<div id="active_time"></div>
 <!-- Load d3.js -->
 <script src="https://d3js.org/d3.v5.js"></script>
 <script>
 	d3.csv("https://raw.githubusercontent.com/harveybarnhard/endur/main/data/strava_activities_sub.csv")
 	  .then(function(data) {
 					var parseDate = d3.timeParse("%m-%d-%Y");
 					// Format the data
 					data.forEach(function(d) {
 						// turn the date string into a date object
 						var value = { monday: parseDate(d.monday) };
 						d.Ran = d.Run_moving_time;
 						d.Cycled = d.Ride_moving_time;
 						d.Other = d.Other_moving_time;
 						// adding calculated data to each count in preparation for stacking
 						var y0 = 0; // keeps track of where the "previous" value "ended"
 						value.counts = ["Ran", "Cycled", "Other"].map(function(name) {
 								return { name: name,
 												 y0: y0,
 												 // add this count on to the previous "end" to create a range,
 												//  and update the "previous end" for the next iteration
 												 y1: y0 += +d[name]
 											 };
 						});
 						// quick way to get the total from the previous calculations
 						value.total = value.counts[value.counts.length - 1].y1;
 						d.value = value
 					});
 								// ---------------------------------- //
 								// Variable creation while data loads //
 								// ---------------------------------- //
 								var margin = {top: 60, right: 50, bottom: 50, left: 50},
 										width = 1200 - margin.left - margin.right,
 										height = 500 - margin.top - margin.bottom;
 								    marginOverview = { top: 480, right: margin.right, bottom: 20,  left: margin.left },
 								    heightOverview = 600 - marginOverview.top - marginOverview.bottom;
 								// some colours to use for the bars
 								var colour = d3.scaleOrdinal()
 								               .range(d3.schemeTableau10);
 								// mathematical scales for the x and y axes
 								var x = d3.scaleTime()
 								                .range([0, width]);
 								var y = d3.scaleLinear()
 								                .range([height, 0]);
 								var xOverview = d3.scaleTime()
 								                .range([0, width]);
 								var yOverview = d3.scaleLinear()
 								                .range([heightOverview, 0]);
 								// rendering for the x and y axes
 								var xAxis = d3.axisBottom()
 								                .scale(x).ticks(5)
 								var yAxis = d3.axisLeft()
 								                .scale(y)
 								var xAxisOverview = d3.axisBottom()
 								                .scale(xOverview).ticks(5)
 								// something for us to render the chart into
 								var svg = d3.select("#active_time")
 								                .append("svg") // the overall space
 								                    .attr("viewBox", "0 0 1200 600")
 								var main = svg.append("g")
 								                .attr("class", "main")
 								                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 								var overview = svg.append("g")
 								                    .attr("class", "overview")
 								                    .attr("transform", "translate(" + marginOverview.left + "," + marginOverview.top + ")");
 								// brush tool to let us zoom and pan using the overview chart
 								function brushed() {
 										// update the main chart's x axis data range
 										x.domain(d3.event.selection === null ? xOverview.domain() : d3.event.selection.map(xOverview.invert))
 									// 604800000 is the number of milliseconds in a week
 									// redraw the bars on the main chart
 										main.selectAll(".bar.stack")
 														.attr("transform", function(d) { return "translate(" + x(d.value.monday) + ",0)"; })
 										main.selectAll(".bar")
 														.attr("width", x.range()[1]/((x.domain()[1] - x.domain()[0])/604800000) - 0.2)
 										// redraw the x axis of the main chart
 										main.select(".x.axis").call(xAxis);
 								}
 								var brush = d3.brushX()
 								                    //.x(xOverview)
 								                    .extent([[0, -6], [width, heightOverview]])
 								                    .on("start brush end", brushed)
 								const defaultSelection = [900, x.range()[1]];
 								// Info box
 								var heightInfobox = 43
 								var infobox = svg.append("text")
 										.attr("id", "infobox")
 										.attr("x", 40)
 										.attr("y", heightInfobox)
 										.attr("width", 1)
 										.style("opacity", 0)
 								// Vertical line for clarity
 								var vertical = svg.append("rect")
 										.style("fill", "var(--text-color)")
 										.style("z-index", "19")
 										.style("opacity", 0)
 										.attr("pointer-events", "none")
 										.style("fill", "white")
 								var horizontal = svg.append("rect")
 										.style("width", width)
 										.style("height", 2)
 										.style("x", margin.left)
 										.style("fill", "var(--text-color)")
 										.style("z-index", "19")
 										.style("opacity", 0)
 										.attr("pointer-events", "none")
 								// How to format date and hour strings?
 								var formatDate = d3.timeFormat("%B %d, %Y")
 								var formatHour = d3.format(".1f")
 					d3
 					  .select(".target")  // select the elements that have the class 'target'
 					  .style("stroke-width", 8) // change their style: stroke width is not equal to 8 pixels
 									// data ranges for the x and y axes
 									x.domain(d3.extent(data, function(d) { return d.value.monday; }));
 									y.domain([0, 55]);
 									xOverview.domain(x.domain());
 									yOverview.domain(y.domain());
 									// https://observablehq.com/@didoesdigital/22-june-2020-d3-bar-chart-brush-work-in-progress?collection=@didoesdigital/journal-getting-started-with-data-viz-collection
 									// data range for the bar colours
 									// (essentially maps attribute names to colour values)
 									colour.domain(data[0].value.counts);
 									// draw the axes now that they are fully set up
 									main.append("g")
 											.attr("class", "x axis")
 											.attr("transform", "translate(0," + height + ")")
 											.call(xAxis);
 									main.append("g")
 											.attr("class", "y axis")
 											.call(yAxis);
 									overview.append("g")
 											.attr("class", "x axis")
 											.attr("transform", "translate(0," + heightOverview + ")")
 											.call(xAxisOverview);
 									var toolTip = function(d) {
 											// Fill out infobox
 											infobox.text("Week of " + formatDate(d.value.monday))
 											infobox.style("opacity", 1)
 											vertical.style("x", x(d.value.monday) + 50)
 															.style("y", y(d.value.total) + margin.top)
 															.style("height", height - y(d.value.total))
 															.style("opacity", 0.4)
 															.style("width", x.range()[1]/((x.domain()[1] - x.domain()[0])/604800000) - 0.2)
 											horizontal.style("y", y(d.value.total) + margin.top)
 																.style("opacity", 0.6)
 										}
 									var noHighlight = function(d){
 										vertical.style("opacity", 0)
 										horizontal.style("opacity", 0)
 										infobox.style("opacity", 0)
 									}
 									// draw the bars
 									main.append("defs").append("clipPath")
 									.attr("id", "clip")
 										.append("rect")
 									.attr("width", width)
 									.attr("height", height);
 									main.append("g")
 													.attr("clip-path", "url(#clip)")
 													.attr("class", "bars")
 											// a group for each stack of bars, positioned with the left side on the date
 											.selectAll(".bar.stack")
 											.data(data)
 											.enter().append("g")
 													.attr("class", "bar stack")
 													.attr("transform", function(d) { return "translate(" + x(d.value.monday) + ",0)"; })
 													.on("mousemove", toolTip)
 													.on("mouseleave", noHighlight)
 											// a bar for each value in the stack, positioned in the correct y positions
 											.selectAll("rect")
 											.data(function(d) { return d.value.counts; })
 											.enter().append("rect")
 													.attr("class", "bar")
 													.attr("width", x.range()[1]/((x.domain()[1] - x.domain()[0])/604800000) - 0.2)
 													.attr("y", function(d) { return y(d.y1); })
 													.attr("height", function(d) { return y(d.y0) - y(d.y1); })
 													.style("fill", function(d) { return colour(d.name); });
 									overview.append("g")
 															.attr("class", "bars")
 											.selectAll(".bar")
 											.data(data)
 											.enter().append("rect")
 													.attr("class", "bar")
 													.attr("x", function(d) { return xOverview(d.value.monday) - 3; })
 													.attr("width", 3.5)
 													.attr("y", function(d) { return yOverview(d.value.total); })
 													.attr("height", function(d) { return heightOverview - yOverview(d.value.total); })
 													.attr("fill", "var(--accent-bg-color)");
 									// add the brush target area on the overview chart
 									overview.append("g")
 											.attr("class", "x brush")
 											.call(brush)
 											.call(brush.move, defaultSelection)
 											.selectAll("rect")
 													.attr("y", -6)
 													.attr("height", heightOverview + 7);  // +7 is magic number for styling
 									var size = 20
 									// Add the legend
 									svg.selectAll("myrect")
 											.data(["Ran", "Cycled", "Other"])
 											.enter()
 											.append("rect")
 												.attr("x", function(d,i){ return 420 + i*size*8})
 												.attr("y", 27)
 												.attr("width", size)
 												.attr("height", size)
 												.style("fill", function(d){ return colour(d)})
 									svg.selectAll("mylabels")
 											.data(["Ran", "Cycled", "Other"])
 											.enter()
 											.append("text")
 												.attr("y", 38.8)
 												.attr("x", function(d,i){ return 445 + i*size*8 })
 												.style("fill", function(d){ return colour(d)})
 												.text(function(d){ return d})
 												.attr("text-anchor", "left")
 												.style("alignment-baseline", "middle")
 		})
 </script>