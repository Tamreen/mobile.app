
tamreen.controller('HomeController', function($scope){

	//
	$scope.badges = {
		trainings: 4,
		groups: 0,
		profile: 0,
	};

	// TODO: Call a method for updating the badges.
	ionic.EventController.on('badges.update', function(event){
		//$scope.badges = event;
		$scope.badges.trainings = 0;

	});

});