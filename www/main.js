
//
tamreen = angular.module('tamreen', ['ionic']);

// Run at the begining.
tamreen.run(function($ionicPlatform, TamreenService){

	// TODO: Whenever ionic platform is ready.

});

// Filters.
tamreen.filter('arDate', [
	'$filter', function($filter){
		return function(input){
			moment.locale('ar-sa');
			return moment(input).format('DD MMMM YYYY، hh:mm a');
		};
	}
]);

// From now filter.
tamreen.filter('fromNow', [
    '$filter', function($filter){
        return function(input){
			moment.locale('ar-sa');
			return moment(input).fromNow();
        };
    }
]);

// Configs and routes.
tamreen.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){

	//
	$ionicConfigProvider.tabs.position('bottom');

	//
	$stateProvider

	//
	.state('users-firsthandshake', {
		url: '/users/firsthandshake',
		templateUrl: 'views/users.firsthandshake.html',
		controller: 'UsersController',
	})

	//
	.state('pages-tos', {
		url: '/pages/tos',
		templateUrl: 'views/pages.tos.html',
	})

	//
	.state('users-secondhandshake', {
		url: '/users/secondhandshake',
		templateUrl: 'views/users.secondhandshake.html',
		controller: 'UsersController',
	})

	//
	.state('players-update', {
		url: '/players/update',
		templateUrl: 'views/players.update.html',
		controller: 'PlayersController',
	})

	//
	.state('pages-walkthrough', {
		url: '/pages/walkthrough',
		templateUrl: 'views/pages.walkthrough.html',
	})

	//
	.state('home', {
		url: '/home',
		abstract: true,
		templateUrl: 'views/home.html',
		controller: 'HomeController',
	})

	//
	.state('home.trainings', {
		url: '/trainings',
		views: {
			'home-trainings': {
				templateUrl: 'views/home.trainings.html',
				controller: 'TrainingsController',
			}
		},
	})

	//
	.state('trainings-add', {
		url: '/trainings/add',
		templateUrl: 'views/trainings.add.html',
		controller: 'TrainingsController',
	})

	//
	.state('trainings-details', {
		url: '/trainings/:id/details',
		templateUrl: 'views/trainings.details.html',
		controller: 'TrainingsController',
	})

	//
	.state('home.groups', {
		url: '/groups',
		views: {
			'home-groups': {
				templateUrl: 'views/home.groups.html',
				controller: 'GroupsController',
			}
		}
	})

	//
	.state('groups-add', {
		url: '/groups/add',
		templateUrl: 'views/groups.add.html',
		controller: 'GroupsController',
	})

	//
	.state('groups-details', {
		url: '/groups/:id/details',
		templateUrl: 'views/groups.details.html',
		controller: 'GroupsController',
	})

	//
	.state('groups-update', {
		url: '/groups/:id/update',
		templateUrl: 'views/groups.update.html',
		controller: 'GroupsController',
	})

	//
	.state('home.profile', {
		url: '/profile',
		views: {
			'home-profile': {
				templateUrl: 'views/home.profile.html',
			}
		}
	})

	//
	.state('pages-about', {
		url: '/pages/about',
		templateUrl: 'views/pages.about.html',
	});

	// Set the default route.
	//$urlRouterProvider.otherwise('/users/firsthandshake');

});