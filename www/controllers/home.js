
tamreen.controller('HomeController', function($scope, $rootScope){

	//
	// TODO: Update the default value of the badges.
	$scope.badges = {
		trainings: 4,
		groups: 0,
		profile: 0,
	};

	// TODO: Call a method for updating the badges.
	$rootScope.$on('badges.update', function(){
		$scope.badges.trainings = 0;
	});

});