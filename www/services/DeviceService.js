
//
tamreen.factory('DeviceService', function($q, $injector){

	console.log('DeviceService has been called.');

	//
	var service = {};

	//
	service.platform = null;

	//
	service.initialize = function(){

		//
		var deferred = $q.defer();

		if (configs.environment == 'development'){
			service.platform = 'android';
			deferred.resolve(service);
		}

		// TODO: If the environment is not development.

		//
		return deferred.promise;
	};

	//
	return service;
});