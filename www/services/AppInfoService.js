
//
tamreen.factory('AppInfoService', function($q, $http){

	//
	var service = {};

	//
	service.appName = null;
	service.appVersion = null;

	//
	service.initialize = function(services){

		//
		var deferred = $q.defer();

		//
		$http.get(configs.apiBaseurl + '/hellos')

		//
		.then(function(response){

			//
			service.appName = response.data.name;
			service.appVersion = response.data.version;

			//
			var configAppVersionInteger = Number(configs.version.replace(/\./g, ''));
			var appVersionInteger = Number(service.appVersion.replace(/\./g, ''));

			if (configAppVersionInteger < appVersionInteger){
				return deferred.reject('The version of the app need to be updated.');
			}

			return deferred.resolve(service);

		}, function(response){
			return deferred.reject('Cannot connect to Tamreen API.');
		});

		return deferred.promise;

	};

	//
	return service;

});