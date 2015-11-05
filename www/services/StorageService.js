
//
tamreen.factory('StorageService', function($q, $injector, $ionicPlatform){

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
		if (configs.environment == 'development'){
			deferred.resolve(service);
		}else{

			$ionicPlatform.ready(function(){

				$cordovaFile = $injector.get('$cordovaFile');
				
				//
				$cordovaFile.getFreeDiskSpace()

				//
				.then(function(success){
					return deferred.resolve(service);
				}, function(error){
					return deferred.reject('Cannot save or read files.');
				});

			});

		}

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
		}else{

			$ionicPlatform.ready(function(){

				$cordovaFile = $injector.get('$cordovaFile');

				$cordovaFile.writeFile(cordova.file.dataDirectory, key, JSON.stringify(value), true)

				.then(function(success){
					return deferred.resolve(true);
				}, function(error){
					return deferred.reject(error);
				});

			});

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

		}else{

			$ionicPlatform.ready(function(){

				$cordovaFile = $injector.get('$cordovaFile');

				// Check if the file exists.
				$cordovaFile.checkFile(cordova.file.dataDirectory, key)

				.then(function(success){

					return $cordovaFile.readAsText(cordova.file.dataDirectory, key)

					.then(function(contents){
						var jsonContents = JSON.parse(contents);
						return deferred.resolve(jsonContents);
					}, function(error){
						return deferred.reject(error);
					});

				}, function(error){
					return deferred.reject(error);
				});

			});

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
		}else{

			$ionicPlatform.ready(function(){
				$cordovaFile = $injector.get('$cordovaFile');
				$cordovaFile.removeFile(cordova.file.dataDirectory, key);
				deferred.resolve(true);
			});

		}

		//
		return deferred.promise;

	};

	//
	return service;

});