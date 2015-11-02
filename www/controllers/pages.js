
tamreen.controller('PagesController', function($scope, $rootScope, $ionicPopup, $ionicHistory, LocationService){

	//
	$scope.parameters = {
		coordinates: null,
	};

	$scope.version = configs.version;

	//
	$scope.goBack = function(){
		console.log($scope.parameters.coordinates);
		$rootScope.$emit('pages.maps.choose', $scope.parameters.coordinates);
		$ionicHistory.goBack();
	}

	//
	$scope.getUserCurrentLocation = function(){

		//
		return LocationService.getCurrent()

		//
		.then(function(coordinates){
			$scope.parameters.coordinates = coordinates;
		}, function(error){
			$ionicPopup.alert({
				title: 'خطأ',
				template: 'الرجاء تمكين التطبيق من استخدام الموقع الجغرافيّ.',
				okText: 'حسنًا',
			});
		});
	};

	// TODO: The choosemap page should accept coordinates.

});