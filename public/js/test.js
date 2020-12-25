app.controller('enduranceCtrl', function($rootScope,$scope,$http) {
d3.csv("data.csv", function(data){
	$rootScope.barData = data;
	console.log($scope.barData)
	$rootScope.$broadcast("Data_Ready", data)
})
	}).directive( 'dir1', [
  function () {
    return {
      restrict: 'E',
      link: barchart
    };
		function barchart(scope, element) {
			scope.$on("Data_Ready", function(events, data){
				console.log(data);
				var margin = {top: 20, right: 20, bottom: 30, left: 45},
				width = 480 - margin.left - margin.right,
				height = 360 - margin.top - margin.bottom;

				var svg = d3.select(element[0])
				.append("svg")
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)

				var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
				var y = d3.scale.linear().range([height, 0]);

				var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

				var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.ticks(10);
				console.log(data)
				//Set our scale's domains
				x.domain(data.map(function(d) { return d.name; }));
				y.domain([0, d3.max(data, function(d) { return d.count; })]);
				var bars = svg.selectAll(".bar").data(data);
				bars.enter()
				.append("rect")
				.attr("class", "bar")
				.attr("x", function(d) { return x(d.name); })
				.attr("width", x.rangeBand());

				//Animate bars
				bars
				.attr('height', function(d) { return height - y(d.count); })
				.attr("y", function(d) { return y(d.count); })

				//Render graph based on 'data'
				// scope.render = function(data) {
				// 	console.log(data)
				// 	//Set our scale's domains
				// 	x.domain(data.map(function(d) { return d.name; }));
				// 	y.domain([0, d3.max(data, function(d) { return d.count; })]);
				// 	var bars = svg.selectAll(".bar").data(data);
				// 	bars.enter()
				// 	.append("rect")
				// 	.attr("class", "bar")
				// 	.attr("x", function(d) { return x(d.name); })
				// 	.attr("width", x.rangeBand());
				//
				// 	//Animate bars
				// 	bars
				// 	.attr('height', function(d) { return height - y(d.count); })
				// 	.attr("y", function(d) { return y(d.count); })
				// };

				//Watch 'data' and run scope.render(newVal) whenever it changes
				//Use true for 'objectEquality' property so comparisons are done on equality and not reference
				// scope.$watch('data', function(){
				// 	console.log(scope.data)
				// 	scope.render(scope.data);
				// }, true);
			})
		}
	}
]);
