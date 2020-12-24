// Code goes here

(function () {

    var app = angular.module('sampleApp',['ngRoute']);

    app.config(function ($routeProvider){
        $routeProvider
            .when('/',{
                templateUrl:'test.html'
            })
            .when('/test2',{
                templateUrl:'test2.html'
            })
            .otherwise({ redirectTo:'/'});
    });
})();
