
//
tamreen.factory('LocationService', function($q, $injector, $ionicPlatform){

	console.log('LocationService has been called.');

	//
	var service = {};

	//
	service.coordinates = {y: 0, x: 0};

	//
	service.getCurrent = function(){

		console.log('service.getCurrent has been called.');

		//
		var deferred = $q.defer();

		$cordovaGeolocation = $injector.get('$cordovaGeolocation');

		$ionicPlatform.ready(function(){

			console.log('$ionicPlatform in $cordovaGeolocation');

			var posOptions = {
	            enableHighAccuracy: true,
	            timeout: 10000,
	        };

	        //
        	//$cordovaGeolocation.getCurrentPosition(posOptions)

        	//
        	$cordovaGeolocation.getCurrentPosition(posOptions)

        	.then(function(position){

				service.coordinates.y = position.coords.latitude;
				service.coordinates.x = position.coords.longitude;

				console.log('coordinates');

				deferred.resolve(service.coordinates);

			}, function(error){
				deferred.reject('ثمّة خطأ عند محاولة الحصول على موقعك الجغرافيّ الحاليّ.');
			});

		});

		// // This should be a promise.
		// navigator.geolocation.getCurrentPosition(function(position){

		// 	service.coordinates.y = position.coords.latitude;
		// 	service.coordinates.x = position.coords.longitude;

		// 	console.log('coordinates');

		// 	deferred.resolve(service.coordinates);

		// }, function(error){
		// 	deferred.reject('ثمّة خطأ عند محاولة الحصول على موقعك الجغرافيّ الحاليّ.');
		// }, { enableHighAccuracy: true });

		//
		return deferred.promise;
	};

	//
	return service;
});