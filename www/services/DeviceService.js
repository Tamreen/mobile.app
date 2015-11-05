
//
tamreen.factory('DeviceService', function($q, $injector, $ionicPlatform){

	console.log('DeviceService has been called.');

	//
	var service = {};

	//
	service.deviceType = null;

	//
	service.initialize = function(services){

		//
		var deferred = $q.defer();

		if (configs.environment == 'development'){
			
			service.deviceType = 'android';
			deferred.resolve(service);

		}else{

			// If the environment is not development.
			$ionicPlatform.ready(function(){

				$cordovaDevice = $injector.get('$cordovaDevice');
				service.deviceType = $cordovaDevice.getPlatform();

				if (validator.isNull(service.deviceType)){
					return deferred.reject('Cannot find the device.');
				}

				service.deviceType = service.deviceType.toLowerCase();
				return deferred.resolve(service);
			});
		}

		//
		return deferred.promise;
	};

	//
	return service;
});