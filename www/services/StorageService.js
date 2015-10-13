
//
tamreen.factory('StorageService', function($q, $injector){

	console.log('StorageService has been called.');

	// $ionicPlatform.ready(function(){
	// 	console.log('$ionicPlatform is ready.');
	// });

	// $injector.get('$ionicPlatform').ready(function(){
	// 	console.log('It was ready and I was called.');
	// });

	return {

		initialize: function(){

			//
			var deferred = $q.defer();

			console.log('initialize StorageService.');

			//
			deferred.reject('Hello');

			//
			return deferred.promise;
		},

	};
});