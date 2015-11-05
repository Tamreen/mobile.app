
//
tamreen = angular.module('tamreen', ['ionic', 'ngCordova']);

// Run at the begining.
tamreen.run(function($ionicPlatform, TamreenService){
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

// From now filter.
tamreen.filter('round', [
    '$filter', function($filter){
        return function(input){
			return Math.round(input);
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
	.state('players-firstupdate', {
		url: '/players/firstupdate',
		templateUrl: 'views/players.firstupdate.html',
		controller: 'PlayersController',
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
	.state('pages-choosemap', {
		url: '/pages/choosemap',
		templateUrl: 'views/pages.choosemap.html',
		controller: 'PagesController',
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
				controller: 'UsersController',
			}
		}
	})

	//
	.state('pages-about', {
		url: '/pages/about',
		templateUrl: 'views/pages.about.html',
		controller: 'PagesController',
	});

	// Set the default route.
	//$urlRouterProvider.otherwise('/users/firsthandshake');
});

//
// function drawTrainingStatus(){
// 	var canvas = document.getElementById('trainingStatusCanvas');
// 	//var context = canvas.getContext('2d');
// 	console.log(canvas);
// }

// drawTrainingStatus();

// http://www.wickedlysmart.com/how-to-make-a-pie-chart-with-html5s-canvas/
function degreesToRadians(degrees){
	return (degrees * Math.PI)/180;
}

// TODO: This method need to be tested.
function drawTrainingPercentage(percentage){

	var canvas = trainingStatusCanvas;
	var context = canvas.getContext('2d');

	context.save();

	var centerX = Math.floor(canvas.width/2);
    var centerY = Math.floor(canvas.height/2);
    var radius = Math.floor(canvas.width/2);

    // Fill the background.
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#f1f1f1';
    context.fill();

	var startingAngle = degreesToRadians(0);
	var arcSize = degreesToRadians(360*(percentage/100));
	var endingAngle = startingAngle + arcSize;

	context.beginPath();
	context.moveTo(centerX, centerY);
	context.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
	context.closePath();

	context.fillStyle = '#d0bcf9';
	context.fill();

	context.restore();

	//
	return canvas.toDataURL();
}
