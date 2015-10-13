
//
tamreen.factory('PushNotificationService', function($q, $injector){

	console.log('PushNotificationService has been called.');

	//
	var service = {};

	//
	service.token = null;

	//
	service.initialize = function(device){

		//
		var deferred = $q.defer();

		// if (configs.environment == 'development'){
		// 	service.platform = 'android';
		// 	deferred.resolve(service);
		// }

		// TODO: If the environment is not development.

		deferred.resolve(service);

		//
		return deferred.promise;
	};

	//
	return service;
});