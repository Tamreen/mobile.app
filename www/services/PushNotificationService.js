
//
tamreen.factory('PushNotificationService', function($q, $injector, $ionicPlatform, $rootScope, $ionicLoading){

	console.log('PushNotificationService has been called.');

	//
	var service = {};

	//
	service.deviceToken = null;
	service.services = {};

	//
	service.initialize = function(services){

		//
		service.services = services;

		//
		var deferred = $q.defer();

		if (configs.environment == 'development'){
			service.fail(deferred);
		}else{

			// If the environment is not development.
			$ionicPlatform.ready(function(){

				var iosConfig = {
					"badge": true,
					"sound": true,
					"alert": true,
				};

				console.log('pushNotification', PushNotification);

				//
				var push = PushNotification.init({
					android: configs.android,
					ios: iosConfig,
    				windows: {},
				});	

				push.on('registration', function(data) {
					// data.registrationId
					service.deviceToken = data.registrationId;
					return deferred.resolve(service);
				});

				push.on('notification', function(data) {
					// data.message,
					// data.title,
					// data.count,
					// data.sound,
					// data.image,
					// data.additionalData
					// console.log('notification');
					service.helperToast(data.title);
				});

				push.on('error', function(e) {
					return service.fail(deferred);
				});

			});
		}

		//
		return deferred.promise;
	};

	//
	service.helperToast = function(content){

		$ionicPlatform.ready(function(){

			var androidPath = '';

			if (validator.equals(service.services.device.deviceType, 'android')){
				androidPath = '/android_asset/www/';
			}

			var media = new Media(androidPath + 'views/sounds/activity.mp3');

			$ionicLoading.show({template: content, duration: 2000});

			// Play the media.
			media.play();

		});
	};

	//
	service.fail = function(deferred){
		service.deviceToken = '1234-dance';
		return deferred.resolve(service);
	};

	//
	return service;
});