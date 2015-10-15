
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
		return $http.get(configs.apiBaseurl + '/hellos')

		//
		.then(function(response){

			//
			service.appName = response.data.name;
			service.appVersion = response.data.version;

			//
			var configAppVersionInteger = Number(configs.version.replace(/\./g, ''));
			var appVersionInteger = Number(service.appVersion.replace(/\./g, ''));

			if (configAppVersionInteger < appVersionInteger){
				throw new Error('The version of the app need to be updated.');
			}

			return service;

		});

	}

	//
	return service;

});