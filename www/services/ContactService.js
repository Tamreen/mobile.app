
//
tamreen.factory('ContactService', function($q, $injector){

	console.log('ContactService has been called.');

	//
	var service = {};

	//
	service.contact = null;

	//
	// TODO: The validation should be here.
	service.pick = function(){

		console.log('service.pick has been called.');

		//
		var deferred = $q.defer();

		if (configs.environment == 'development'){

			// Make a dummy contact.
			service.contact = {
				fullname: Math.floor(Math.random()*9000000) + 1000000,
				e164formattedMobileNumber: '+96655' + (Math.floor(Math.random()*9000000) + 1000000),
			}

			//
			deferred.resolve(service.contact);

			// }, function(error){
			// 	deferred.reject(error);
			// });
		}

		// TODO: If the environment is not development.

		//
		return deferred.promise;
	};

	//
	return service;
});