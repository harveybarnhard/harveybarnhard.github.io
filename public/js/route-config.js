var app = angular.module('sampleApp',['ngRoute']);

app.config(function ($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl:'home.html',
    controller: 'homeCtrl'
  })
  .when('/endurance',{
    templateUrl:'endurance.html',
    controller: 'controller1'
  })
  .when('/blog',{
    templateUrl:'blog.html',
    controller: 'blogCtrl'
  })
  .when('/projects',{
    templateUrl:'projects.html',
    controller: 'projectsCtrl'
  })
  .when('/about',{
    templateUrl:'about.html',
    controller: 'aboutCtrl'
  })
  .otherwise({ redirectTo:'/'});
})


app.controller('controller1', function($scope,$http) {
		// create a message to display in our view
		$scope.message = 'Bar Chart';
		$scope.barData = [
    {"name": "A", "count": 300},
    {"name": "B", "count": 150},
    {"name": "C", "count": 400},
    {"name": "D", "count": 300},
    {"name": "E", "count": 100},
    {"name": "F", "count": 200},
    {"name": "G", "count": 420},
    {"name": "H", "count": 320},
    {"name": "I", "count": 250},
    {"name": "J", "count": 210},
    {"name": "K", "count": 180}
];
	}).directive( 'dir1', [
  function () {
    return {
      restrict: 'E',
      scope: {
        data: '='
      },

      link: barchart
    };

    function barchart(scope, element) {
      		 	var margin = {top: 20, right: 20, bottom: 30, left: 45},
				width = 480 - margin.left - margin.right,
				height = 360 - margin.top - margin.bottom;
				var svg = d3.select(element[0])
				.append("svg")
				.attr('width', width + margin.left + margin.right)
				.attr('height', height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
				var y = d3.scale.linear().range([height, 0]);

				var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom");

				var yAxis = d3.svg.axis()
				.scale(y)
				.orient("left")
				.ticks(10);

				//Render graph based on 'data'
				scope.render = function(data) {
				//Set our scale's domains
				x.domain(data.map(function(d) { return d.name; }));
				y.domain([0, d3.max(data, function(d) { return d.count; })]);
				//Redraw the axes
				svg.selectAll('g.axis').remove();
				//X axis
				svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);
				//Y axis
				svg.append("g")
				.attr("class", "y axis")
				.call(yAxis)
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("Count");
				var bars = svg.selectAll(".bar").data(data);
				bars.enter()
				.append("rect")
				.attr("class", "bar")
				.attr("x", function(d) { return x(d.name); })
				.attr("width", x.rangeBand());

				//Animate bars
				bars
				.transition()
				.duration(1000)
				.attr('height', function(d) { return height - y(d.count); })
				.attr("y", function(d) { return y(d.count); })
				};

				//Watch 'data' and run scope.render(newVal) whenever it changes
				//Use true for 'objectEquality' property so comparisons are done on equality and not reference
				scope.$watch('data', function(){
				scope.render(scope.data);
				}, true);
      }
  }
]);
