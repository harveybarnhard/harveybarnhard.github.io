

app.controller('enduranceCtrl', function($scope,$http) {
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
    {"name": "L", "count": 180}
];
$scope.myData = [10,20,30,40,60,50,80,90];
	}).directive('dir4', function ($parse) {
     //explicitly creating a directive definition variable
     //this may look verbose but is good for clarification purposes
     //in real life you'd want to simply return the object {...}
     var directiveDefinitionObject = {
         //We restrict its use to an element
         restrict: 'E',
         //this is important, we don't want to overwrite our directive declaration
         //in the HTML mark-up
         replace: false,
         //our data source would be an array passed thru chart-data attribute
         scope: {data: '=chartData'},
         link: function (scope, element, attrs) {
           //in D3, any selection[0] contains the group
           //selection[0][0] is the DOM node
           var chart = d3.select(element[0]);
           //to our original directive markup bars-chart
           //we add a div with out chart stling and bind each
           //data entry to the chart
            chart.append("div").attr("class", "chart")
             .selectAll('div')
             .data(scope.data).enter().append("div")
             .transition()
             .style("width", function(d) { return d + "%"; })
             .text(function(d) { return d + "%"; });
           //setting it's width based on the data value (d)
           //and text all with a smooth transition
         }
      };
      return directiveDefinitionObject;
   });
