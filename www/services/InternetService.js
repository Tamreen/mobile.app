
//
tamreen.factory('InternetService', function($q){

	//
	var service = {};

	//
	service.initialize = function(services){

		//
		var deferred = $q.defer();

		// TODO: Check if the internet connection is valid.
		deferred.resolve('InternetService');

		//
		return deferred.promise;
	}

	//
	return service;

});