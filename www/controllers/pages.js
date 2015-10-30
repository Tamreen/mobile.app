
tamreen.controller('PagesController', function($scope, $rootScope, $ionicHistory, LocationService){

	//
	$scope.parameters = {
		coordinates: {x: 0, y: 0}
	};

	//
	$scope.goBack = function(){
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