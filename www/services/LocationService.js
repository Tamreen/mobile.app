
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

		if (configs.environment == 'development'){

			// This should be a promise.
			navigator.geolocation.getCurrentPosition(function(position){

				service.coordinates.y = position.coords.latitude;
				service.coordinates.x = position.coords.longitude;

				deferred.resolve(service.coordinates);

			}, function(error){
				deferred.reject(error);
			});
			
			//deferred.resolve(service);
		}

		// TODO: If the environment is not development.

		//
		return deferred.promise;
	};

	//
	return service;
});