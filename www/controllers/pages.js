
tamreen.controller('PagesController', function($scope, $rootScope, LocationService){

	//
	$scope.parameters = {coordinates: {x: 0, y: 0}};

	// TODO: It does not seem to save the new coordinates in parameters.
	$scope.getUserCurrentLocation = function(){

		//
		return LocationService.getCurrent()

		//
		.then(function(coordinates){
			$scope.parameters.coordinates = coordinates;
			$rootScope.$broadcast('pages.maps.choose', coordinates);
		}, function(error){
			// TODO: Make this error prettier.
			alert('Error occur');
		});
	};

	// TODO: The choosemap page should accept coordinates.

});