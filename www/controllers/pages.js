
tamreen.controller('PagesController', function($scope, $rootScope, $state, $ionicPopup, $ionicHistory, TamreenService, LocationService){

	//
	$scope.parameters = {
		coordinates: null,
	};

	$scope.version = configs.version;

	//
	$scope.goBack = function(){
		//console.log(JSON.stringify($scope.parameters.coordinates));
		$rootScope.$emit('pages.maps.choose', $scope.parameters.coordinates);
		$ionicHistory.goBack();
	}

	//
	$scope.initializeMap = function(){

		var x = 0;
		var y = 0;

		if (!validator.isNull($scope.parameters.coordinates)){
			x = $scope.parameters.coordinates.x;
			y = $scope.parameters.coordinates.y;
		}

		var mapOptions = {
			center: new google.maps.LatLng(y, x),
			zoom: 16,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		var map = new google.maps.Map(document.getElementById('map'), mapOptions);
		
		//
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(y, x),
			map: map,
			draggable: true,
			title: 'Hello World!',
		});

		//
		google.maps.event.addListener(marker, "dragend", function(event){

			console.log('dragend called!');

			$scope.parameters.coordinates.x = event.latLng.lng();
			$scope.parameters.coordinates.y = event.latLng.lat(); 
        });
	};

	//
	$scope.getUserCurrentLocation = function(){

		//
		return LocationService.getCurrent()

		//
		.then(function(coordinates){
			$scope.parameters.coordinates = coordinates;
			$scope.initializeMap();
		}, function(error){
			$ionicPopup.alert({
				title: 'خطأ',
				template: 'الرجاء تمكين التطبيق من استخدام الموقع الجغرافيّ.',
				okText: 'حسنًا',
			});
		});
	};

	//
	$scope.skipWalkthrough = function(){

		TamreenService.storage.store(configs['walkthroughKey'], true)

		.then(function(success){
			return $state.go('home.trainings');
		}, function(error){
			console.log(error);
		});
	}

	// TODO: The choosemap page should accept coordinates.
	//$scope.getUserCurrentLocation();
	switch ($state.current.name){
		case 'pages-choosemap':
			console.log('called this one.');
			$scope.getUserCurrentLocation();
		break;
	}
});