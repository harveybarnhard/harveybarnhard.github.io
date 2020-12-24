(function () {

    var app = angular.module('sampleApp',['ngRoute']);

    app.config(function ($routeProvider){
        $routeProvider
            .when('/',{
                templateUrl:'home.html',
            })
            .when('/endurance',{
                templateUrl:'endurance.html',
            })
            .otherwise({ redirectTo:'/'});
    })
})();
