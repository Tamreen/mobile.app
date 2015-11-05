
//
tamreen.factory('InternetService', function($q, $injector, $ionicPlatform){

	//
	var service = {};

	//
	service.initialize = function(services){

		//
		var deferred = $q.defer();

		//
		if (configs.environment == 'development'){
			deferred.resolve(service);
		}else{
			$ionicPlatform.ready(function(){

				$cordovaNetwork = $injector.get('$cordovaNetwork');
				var isOnline = $cordovaNetwork.isOnline();

				// Check if the device is online.
				if (isOnline == true){
					deferred.resolve(service);
				}else{
					deferred.reject('Cannot connect to the internet.');
				}
			});
		}

		//
		return deferred.promise;
	};

	//
	return service;

});