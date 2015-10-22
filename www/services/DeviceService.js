
//
tamreen.factory('DeviceService', function($q, $injector){

	console.log('DeviceService has been called.');

	//
	var service = {};

	//
	service.deviceType = null;

	//
	service.initialize = function(){

		//
		var deferred = $q.defer();

		if (configs.environment == 'development'){
			service.deviceType = 'android';
			deferred.resolve(service);
		}

		// TODO: If the environment is not development.

		//
		return deferred.promise;
	};

	//
	return service;
});