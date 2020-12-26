app.controller('enduranceCtrl', function($rootScope,$scope,$http) {
	d3.csv("https://raw.githubusercontent.com/harveybarnhard/endur/main/data/strava_activities_sub.csv", function(data){
		$rootScope.$broadcast("Data_Ready", data)
	})
}).directive( 'dir1', [
  function () {
    return {
      restrict: 'E',
      link: activeHours
    };
		function activeHours(scope, element) {
			// -----------------------------------------------------------//
			// Create the canvas for the plot (no need to wait for data)  //
			// -----------------------------------------------------------//
			var margin = {top: 60, right: 230, bottom: 50, left: 50},
					width = 1200 - margin.left - margin.right,
					height = 400 - margin.top - margin.bottom;
			// parse the date / time
			var parseTime = d3.timeParse("%m-%d-%Y");
			// append the svg object to the body of the page
			var svg = d3.select(element[0])
				.append("svg")
					.attr("viewBox", "0 0 1000 400")
				.append("g")
					.attr("transform",
								"translate(" + margin.left + "," + margin.top + ")");
		  // ------------------------------------------------------------------ //
			// After data has finished loading, prepare data for plotting         //
			// ------------------------------------------------------------------ //
			scope.$on("Data_Ready", function(events, data){
				// Take a subset of columns and rename the columns for better visibility
				var select1 = "Run_moving_time",
						select2 = "Ride_moving_time",
						select3 = "VirtualRide_moving_time",
						select4 = "Other_moving_time";
				var title1 = "Run",
						title2 = "Cycle",
						title3 = "Zwift",
						title4 = "Other"
				headerBar = ["monday"];
				headerBar.push(title1, title2, title3, title4);
				var data = data.map(function(d){
						return {
							monday:d.monday,
							[title1]: d[select1],
							[title2]: d[select2],
							[title3]: d[select3],
							[title4]: d[select4]
						}
				});
				data["columns"] = headerBar;
			  // format the date data
			  data.forEach(function(d) {
			      d.monday = parseTime(d.monday);
			  });
				// List of groups = header of the csv files
				var keys = data.columns.slice(1)
				// color palette
				var color = d3.scaleOrdinal()
					.domain(keys)
					.range(d3.schemeTableau10);
				//stack the data
				var stackedData = d3.stack()
					.keys(keys)
					(data)

				// -----//
				// Axis //
				// ---- //
				// Add X axis
				var x = d3.scaleTime()
					.domain(d3.extent(data, function(d) { return d.monday; }))
					.range([ 0, width ]);
				var xAxis = svg.append("g")
					.attr("transform", "translate(0," + height + ")")
					.call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b-%Y")))
				// Add Y axis
				var y = d3.scaleLinear()
					.domain([0, 24])
					.range([ height, 0 ]);
				svg.append("g")
					.call(d3.axisLeft(y).ticks(6))
				// -------- //
				// Brushing //
				// -------- //
				// Add a clipPath, outside of which no shapes are drawn
			  var clip = svg.append("defs").append("svg:clipPath")
			      .attr("id", "clip")
			      .append("svg:rect")
			      .attr("width", width )
			      .attr("height", height )
			      .attr("x", 0)
			      .attr("y", 0);
			  // Add brushing, initializing by showing the entire plot
			  var brush = d3.brushX()
			      .extent( [ [0,0], [width,height] ] )
			      .on("end", updateChart)
				// ----- //
				// Chart //
				// ----- //
				// Create the area chart
				var areaChart = svg.append('g')
					.attr("clip-path", "url(#clip)")
				// Area generator
				var area = d3.area()
					.x(function(d) { return x(d.data.monday); })
					.y0(function(d) { return y(d[0]); })
					.y1(function(d) { return y(d[1]); })
					.curve(d3.curveMonotoneX) // Smooth it out a little

				// --------------- //
				// HIGHLIGHT GROUP //
				// --------------- //
				// What to do when one group is hovered in legend
				var highlight = function(d){
					console.log(d)
					// reduce opacity of all groups
					d3.selectAll(".myArea").style("opacity", .4)
					// except the one that is hovered
					d3.select("."+d)
						.style("opacity", 1)
					}

				// And when it is not hovered anymore in legend
				var noHighlight = function(d){
					d3.selectAll(".myArea")
						.style("opacity", 1)
					vertical.style("opacity", 0)
				}
				var vertical = svg.selectAll("tooltip")
					.data(keys)
					.enter()
					.append("rect")
						.attr("x", 100)
						.attr("y", 0)
						.attr("width", 0.5)
						.attr("height", 290)
						.style("fill", "var(--text-color)")
						.style("z-index", "19")
						.style("opacity", 0)
				// What to do when one group is hovered in chart
				var areaHighlight = function(d) {
					d3.selectAll(".myArea").style("opacity", .4)
					d3.select(this).style("opacity", 1)
					vertical.style("opacity", 1)
				}

				var toolTip = function(d) {
					mousex = d3.mouse(this);
         	mousex = mousex[0];
					console.log(mousex)
					vertical.style("x", (mousex - 2) + "px" )
				}
				// Create chart. Note that brushing is applied BEFORE the actual creation of
				// the chart and ".attr("pointer-events", "all")" is used so that the
				// highlighting even still occurs even after brush is applied
				areaChart
					.append("g")
					.attr("class", "brush")
					.call(brush)
					.selectAll("mylayers")
					.data(stackedData)
					.enter()
					.append("path")
						.attr("stroke", "var(--text-color)")
						.attr("stroke-width", .2)
						.attr("class", function(d) { return "myArea " + d.key })
						.style("fill", function(d) { return color(d.key); })
						.attr("d", area)
						.attr("pointer-events", "all")
						.on("mouseover", areaHighlight)
						.on("mousemove", toolTip)
						.on("mouseleave", noHighlight)
				// ------------ //
				// Update Chart //
				// ------------ //
				var idleTimeout
				function idled() { idleTimeout = null; }
				// A function that updates the chart for given boundaries
				function updateChart() {
					extent = d3.event.selection
					// If no selection, back to initial coordinate. Otherwise, update X axis domain
					if(!extent){
						if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
						x.domain(d3.extent(data, function(d) { return d.monday; }))
					}else{
						x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
						areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
					}

					// Update axis and area position
					xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
					areaChart
						.selectAll("path")
						.transition().duration(1000)
						.attr("d", area)
				}
				// ------ //
		    // LEGEND //
		    // ------ //
		    // Add one square in the legend for each name.
		    var size = 100
				svg.selectAll("myrect")
					.data(keys)
					.enter()
					.append("rect")
						.attr("x", function(d,i){ return 320 + i*size})
						.attr("y", -35)
						.attr("width", 20)
						.attr("height", 20)
						.style("fill", function(d){ return color(d)})
						.on("mouseover", highlight)
						.on("mouseleave", noHighlight)
		    svg.selectAll("mylabels")
		      .data(keys)
		      .enter()
		      .append("text")
		        .attr("y", -23)
		        .attr("x", function(d,i){ return 345 + i*size })
		        .style("fill", function(d){ return color(d)})
		        .text(function(d){ return d})
		        .attr("text-anchor", "left")
		        .style("alignment-baseline", "middle")
						.style("font-weight", "bold")
				svg.append("text")
		      .attr("text-anchor", "end")
		      .attr("x", 140)
		      .attr("y", -19.4 )
		      .text("Hours per week I")
		      .attr("text-anchor", "start")
					.style("font-weight", "bold")
					.style("fill", "var(--text-color)")
			})
		}
	}
]);
