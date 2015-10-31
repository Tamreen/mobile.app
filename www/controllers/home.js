
var homeEventsDefined = false;

tamreen.controller('HomeController', function($scope){

	//
	// TODO: Update the default value of the badges.
	$scope.badges = {
		trainings: 4,
		groups: 0,
		profile: 0,
	};

	// // TODO: Call a method for updating the badges from the API.
	// $rootScope.$on('badges.update', function(){
	// 	$scope.badges.trainings = 0;
	// });

	//
	if (homeEventsDefined == false){

		ionic.EventController.on('badges.update', function(){
			$scope.badges.trainings = 0;
		});

		homeEventsDefined = true;
	}

});