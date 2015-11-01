
tamreen.controller('PagesController', function($scope, $rootScope, $ionicHistory, LocationService){

	//
	$scope.parameters = {
		coordinates: {y: 0, x: 0}
	};

	//
	$scope.goBack = function(){
		console.log($scope.parameters.coordinates);
		$rootScope.$emit('pages.maps.choose', $scope.parameters.coordinates);
		$ionicHistory.goBack();
	}

	// TODO: It does not seem to save the new coordinates in parameters.
	$scope.getUserCurrentLocation = function(){

		//
		return LocationService.getCurrent()

		//
		.then(function(coordinates){
			$scope.parameters.coordinates = coordinates;
		}, function(error){
			// TODO: Make this error prettier.
			alert('Error occur');
		});
	};

	// TODO: The choosemap page should accept coordinates.

});