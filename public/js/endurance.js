app.controller('enduranceCtrl', function($rootScope,$scope,$http) {
	window.scrollTo(0, 0)
	d3.csv("https://raw.githubusercontent.com/harveybarnhard/endur/main/data/strava_activities_sub.csv", parse, function(data){
		$rootScope.$broadcast("Data_Ready", data)
	})
	// by habit, cleaning/parsing the data and return a new object to ensure/clarify data object structure
	var parseDate = d3.timeParse("%m-%d-%Y");
	function parse(d) {
		console.log(d)
		// turn the date string into a date object
		var value = { monday: parseDate(d.monday) };
		d.Run = d.Run_moving_time;
		d.Ride = d.Ride_moving_time;
		d.Zwift = d.VirtualRide_moving_time;
		d.Other = d.Other_moving_time;
		console.log(value)
		// adding calculated data to each count in preparation for stacking
		var y0 = 0; // keeps track of where the "previous" value "ended"
		value.counts = ["Run", "Ride", "Zwift", "Other"].map(function(name) {
				return { name: name,
								 y0: y0,
								 // add this count on to the previous "end" to create a range,
								//  and update the "previous end" for the next iteration
								 y1: y0 += +d[name]
							 };
		});
		// quick way to get the total from the previous calculations
		value.total = value.counts[value.counts.length - 1].y1;
		return value;
	}
}).directive( 'dir1', [
  function () {
    return {
      restrict: 'E',
      link: activeHours
    };
		function activeHours(scope, element) {
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
			                .scale(x)
			var yAxis = d3.axisLeft()
			                .scale(y)
			var xAxisOverview = d3.axisBottom()
			                .scale(xOverview)

			// something for us to render the chart into
			var svg = d3.select(element[0])
			                .append("svg") // the overall space
			                    .attr("viewBox", "0 0 1200 600")
			var main = svg.append("g")
			                .attr("class", "main")
			                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			var overview = svg.append("g")
			                    .attr("class", "overview")
			                    .attr("transform", "translate(" + marginOverview.left + "," + marginOverview.top + ")");

			// brush tool to let us zoom and pan using the overview chart
			var brush = d3.brushX()
			                    //.x(xOverview)
			                    .extent([[0, 0], [width, heightOverview]])
			                    .on("brush", brushed);
			scope.$on("Data_Ready", function(events, data){
				console.log(data)
				// data ranges for the x and y axes
				x.domain(d3.extent(data, function(d) { return d.monday; }));
				y.domain([0, 22]);
				xOverview.domain(x.domain());
				yOverview.domain(y.domain());
				// https://observablehq.com/@didoesdigital/22-june-2020-d3-bar-chart-brush-work-in-progress?collection=@didoesdigital/journal-getting-started-with-data-viz-collection
				// data range for the bar colours
				// (essentially maps attribute names to colour values)
				colour.domain(data[0].counts);

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
								.attr("transform", function(d) { return "translate(" + x(d.monday) + ",0)"; })
						// a bar for each value in the stack, positioned in the correct y positions
						.selectAll("rect")
						.data(function(d) { return d.counts; })
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
								.attr("x", function(d) { return xOverview(d.monday) - 3; })
								.attr("width", 10)
								.attr("y", function(d) { return yOverview(d.total); })
								.attr("height", function(d) { return heightOverview - yOverview(d.total); });

				// add the brush target area on the overview chart
				overview.append("g")
						.attr("class", "x brush")
						.call(brush)
						.selectAll("rect")
								// -6 is magic number to offset positions for styling/interaction to feel right
								.attr("y", -6)
								// need to manually set the height because the brush has
								// no y scale, i.e. we should see the extent being marked
								// over the full height of the overview chart
								.attr("height", heightOverview + 7);  // +7 is magic number for styling
				var size = 20
				svg.selectAll("myrect")
						.data(["Run", "Ride", "Zwift", "Other"])
						.enter()
						.append("rect")
							.attr("x", function(d,i){ return 440 + i*size*5})
							.attr("y", 27)
							.attr("width", size)
							.attr("height", size)
							.style("fill", function(d){ return colour(d)})
				svg.selectAll("mylabels")
						.data(["Run", "Ride", "Zwift", "Other"])
						.enter()
						.append("text")
							.attr("y", 38.8)
							.attr("x", function(d,i){ return 465 + i*size*5 })
							.style("fill", function(d){ return colour(d)})
							.text(function(d){ return d})
							.attr("text-anchor", "left")
							.style("alignment-baseline", "middle")

			})

			// zooming/panning behaviour for overview chart
			function brushed() {
					// update the main chart's x axis data range
					x.domain(d3.event.selection === null ? xOverview.domain() : d3.event.selection.map(xOverview.invert))
				// 604800000 is the number of milliseconds in a week
				// redraw the bars on the main chart
					main.selectAll(".bar.stack")
									.attr("transform", function(d) { return "translate(" + x(d.monday) + ",0)"; })
					main.selectAll(".bar")
									.attr("width", x.range()[1]/((x.domain()[1] - x.domain()[0])/604800000) - 0.2)
					// redraw the x axis of the main chart
					main.select(".x.axis").call(xAxis);
			}
		}
	}
]);
