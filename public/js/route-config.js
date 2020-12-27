var app = angular.module('sampleApp',['ngRoute']);

app.config(function ($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl: 'home.html',
  })
  .when('/endurance',{
    templateUrl: 'endurance.html',
    controller: 'enduranceCtrl'
  })
  .when('/blog',{
    templateUrl: 'blog.html',
  })
  .when('/blog/evaluating-prediction-error',{
    templateUrl: 'posts/evaluating-prediction-error.html',
  })
  .when('/projects',{
    templateUrl: 'projects.html',
  })
  .when('/about',{
    templateUrl: 'about.html',
  })
  .otherwise({ redirectTo:'/'});
})
