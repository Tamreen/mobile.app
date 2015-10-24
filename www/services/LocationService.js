
//
tamreen.factory('LocationService', function($q, $injector){

	console.log('LocationService has been called.');

	//
	var service = {};

	//
	service.coordinates = {x: 0, y: 0};

	//
	service.getCurrent = function(){

		console.log('service.getCurrent has been called.');

		//
		var deferred = $q.defer();

		if (configs.environment == 'development'){

			// This should be a promise.
			navigator.geolocation.getCurrentPosition(function(position){

				service.coordinates.x = position.coords.longitude;
				service.coordinates.y = position.coords.latitude;

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