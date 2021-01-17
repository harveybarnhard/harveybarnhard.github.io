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
  .when('/blog/no-analyzing-residuals',{
    templateUrl: 'posts/no-analyzing-residuals.html',
    controller: 'mathRender'
  })
  .when('/blog/calculating-diagonal-of-hat-matrix',{
    templateUrl: 'posts/calculating-diagonal-of-hat-matrix.html',
    controller: 'mathRender'
  })
  .when('/blog/delta-method',{
    templateUrl: 'posts/delta-method.html',
    controller: 'mathRender'
  })
  .when('/projects',{
    templateUrl: 'projects.html',
  })
  .when('/about',{
    templateUrl: 'about.html',
  })
  .when('/you-are-lost',{
    templateUrl: 'you-are-lost.html'
  })
  .otherwise({ redirectTo:'/you-are-lost'});
})
