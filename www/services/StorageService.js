
//
tamreen.factory('StorageService', function($q, $injector){

	console.log('StorageService has been called.');

	// $ionicPlatform.ready(function(){
	// 	console.log('$ionicPlatform is ready.');
	// });

	// $injector.get('$ionicPlatform').ready(function(){
	// 	console.log('It was ready and I was called.');
	// });

	//
	var service = {};

	//
	// service.deviceToken = null;

	//
	service.initialize = function(services){

		//
		var deferred = $q.defer();

		console.log('initialize StorageService.');

		//
		deferred.resolve(service);

		//
		return deferred.promise;
	};

	// TODO: Check if the environmet is development or not.
	service.store = function(key, value){

		//
		var deferred = $q.defer();

		//deferred.resolve('Stored!');
		if (configs.environment == 'development'){
			localStorage.setItem(key, JSON.stringify(value));
			deferred.resolve(true);
		}

		//
		return deferred.promise;
	};

	// TODO: Check if the environmet is development or not.
	service.retrieve = function(key){
		
		//
		var deferred = $q.defer();

		if (configs.environment == 'development'){

			var objectString = localStorage.getItem(key);

			if (validator.isNull(objectString)){
				deferred.reject('Cannot find the variable.');
			}

			deferred.resolve(JSON.parse(objectString));
		}

		//
		return deferred.promise;

	};

	// TODO: Check if the environmet is development or not.
	service.destroy = function(key){

		//
		var deferred = $q.defer();

		//deferred.resolve('Stored!');
		if (configs.environment == 'development'){
			localStorage.removeItem(key);
			deferred.resolve(true);
		}

		//
		return deferred.promise;

	};

	//
	return service;

});