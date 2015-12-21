
//
tamreen.factory('AppInfoService', function($q, $http, $timeout){

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
				return deferred.reject('الرجاء تحديث التطبيق إلى آخر نسخة متوفّرة.');
			}

			return deferred.resolve(service);

		}, function(response){
			return deferred.reject('الوصول إلى واجهة برمجة تطبيق تمرين (API) غير مُمكنة.');
		});

		// 
		$timeout(function(){
			return deferred.reject('الوصول إلى واجهة برمجة تطبيق تمرين (API) غير مُمكنة.');
		}, 10000);

		return deferred.promise;

	};

	//
	return service;

});