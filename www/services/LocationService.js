
//
tamreen.factory('LocationService', function($q, $injector){

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

		// This should be a promise.
		navigator.geolocation.getCurrentPosition(function(position){

			service.coordinates.y = position.coords.latitude;
			service.coordinates.x = position.coords.longitude;

			deferred.resolve(service.coordinates);

		}, function(error){
			console.log(error);
			deferred.reject(error);
		});

		//
		return deferred.promise;
	};

	//
	return service;
});