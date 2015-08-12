
//
tamreen = angular.module('tamreen', ['ionic']);

// Run at the begining.
tamreen.run(function($ionicPlatform){

	// TODO: Whenever ionic platform is ready.

});

// Filters.

// Configs and routes.
tamreen.config(function($stateProvider, $urlRouterProvider){

	//
	$stateProvider

	//
	.state('users-firsthandshake', {
		url: '/users/firsthandshake',
		templateUrl: 'views/users.firsthandshake.html',
	});

	// Set the default route.
	$urlRouterProvider.otherwise('/users/firsthandshake');

});