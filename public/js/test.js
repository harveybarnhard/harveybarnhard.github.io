// https://stackoverflow.com/questions/16933711/how-to-load-csv-file-to-object-in-angualrjs
// https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
function CSVtoArray(text) {
    var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
    var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

    // Return NULL if input string is not well formed CSV string.
    if (!re_valid.test(text)) return null;

    var a = []; // Initialize array to receive values.
    text.replace(re_value, // "Walk" the string using replace with callback.
        function(m0, m1, m2, m3) {

            // Remove backslash from \' in single quoted values.
            if (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));

            // Remove backslash from \" in double quoted values.
            else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
            else if (m3 !== undefined) a.push(m3);
            return ''; // Return empty string.
        });

    // Handle special case of empty last value.
    if (/,\s*$/.test(text)) a.push('');
    return a;
};

app.factory('Items', ['$http', '$q', function($http, $q){
  var Url   =  "data.csv";
  var ItemsDefer = $q.defer()
  $http.get(Url).then(function(response){
     ItemsDefer.resolve(CSVtoArray(response.data));
  });
  return ItemsDefer.promise;
}]);

app.factory('Items2', ['$http', '$q', function($http, $q){
  var Url   =  "data.csv";
	var Items = $http.get(Url).then(function(response){
     return CSVtoArray(response.data);
  });
  return Items;
}]);

function Items3($http, $q){
	var Url   =  "data.csv";
	var Items = $http.get(Url).then(function(response){
     return CSVtoArray(response.data);
  });
  return Items;
};

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
    {"name": "K", "count": 180}
];
console.log($scope.barData);
	}).directive( 'dir1', [
  function () {
    return {
      restrict: 'E',
      scope: { data: '='},
      link: barchart
    };
		console.log($scope.barData);
		function barchart(scope, element) {
			console.log(scope.data);
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

			//Render graph based on 'data'
			scope.render = function(data) {
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
			};

			//Watch 'data' and run scope.render(newVal) whenever it changes
			//Use true for 'objectEquality' property so comparisons are done on equality and not reference
			scope.$watch('data', function(){
				scope.render(scope.data);
			}, true);
		}
	}
]);

// app.controller('enduranceCtrl', function($scope, $http) {
// 	// Items2.then(function(parsedCsvData){
// 	// 	var parsedCsvData = parsedCsvData.map(Number);
// 	// 	// console.log(parsedCsvData);
//   // 	$scope.myData = parsedCsvData;
// 	// });
// 	// $scope.myData = $http.get("data.csv").then(function(response){
// 	// 	console.log(response.data)
// 	// 	return CSVtoArray(response.data)
// 	// });
// 	// console.log($scope.myData);
// 	$scope.myData = [10,20,30,40,60,50,80,90];
// 	console.log($scope.myData);
// 	}).directive('dir4', [
// 		 function() {
// 			 return {
// 				 restrict: 'E',
// 				 replace: false,
// 				 scope: {data: '='},
// 				 link: barchart
// 			};
// 			console.log($scope.data);
// 		 function barchart(scope, element) {
// 			 var chart = d3.select(element[0]);
// 			 scope.render = function(data) {
// 				 console.log(data);
// 				 chart.append("div").attr("class", "chart")
// 					.selectAll('div')
// 					.data(scope.data).enter().append("div")
// 					.style("width", function(d) { return d + "%"; })
// 					.text(function(d) { return d + "%"; });
// 			 }
// 		 };
// 		 scope.$watch('data', function(){
// 			 scope.render(scope.data);
// 		 }, true)
//      //explicitly creating a directive definition variable
//      //this may look verbose but is good for clarification purposes
//      //in real life you'd want to simply return the object {...}
//      // var directiveDefinitionObject = {
//      //     //We restrict its use to an element
//      //     restrict: 'E',
//      //     //this is important, we don't want to overwrite our directive declaration
//      //     //in the HTML mark-up
//      //     replace: false,
//      //     //our data source would be an array passed thru chart-data attribute
//      //     scope: {data: '=chartData'},
//      //     link: barchart
// 		 //
// 			// 	 function (scope, element, attrs) {
//      //       //in D3, any selection[0] contains the group
//      //       //selection[0][0] is the DOM node
//      //       var chart = d3.select(element[0]);
//      //       //to our original directive markup bars-chart
//      //       //we add a div with out chart stling and bind each
//      //       //data entry to the chart
//             // chart.append("div").attr("class", "chart")
//             //  .selectAll('div')
//             //  .data(scope.data).enter().append("div")
//             //  .style("width", function(d) { return d + "%"; })
//             //  .text(function(d) { return d + "%"; });
//      //       //setting it's width based on the data value (d)
//      //       //and text all with a smooth transition
//      //     }
//      //  };
//       // return directiveDefinitionObject;
// 		}
//    ]);
