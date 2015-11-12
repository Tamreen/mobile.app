
//
tamreen.factory('PushNotificationService', function($q, $injector, $ionicPlatform, $rootScope, $ionicLoading, $timeout){

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

			service.deviceToken = '12321312321';
			deferred.resolve(service);

		}else{

			// If the environment is not development.
			$ionicPlatform.ready(function(){

				$cordovaPush = $injector.get('$cordovaPush');

				// Listen to whenever a notification received.
				$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification){

					console.log('hello');

					switch(notification.event){

						case 'registered':

							// Make sure the type of the notification is registered.
							service.deviceToken = notification.regid;
							return deferred.resolve(service);

						break;

						case 'message':
							service.helperToast(notification.payload.title);
							console.log('message has been received.');
						break;

						// There has to be an error received also.
						default:
							return deferred.reject('لا يُمكن الوصول إلى الإشعارات في الوقت الحاليّ.');
						break;
					}

					if (notification.alert){
						service.helperToast(notification.alert);
						console.log('alert has been received.');
					}
				});

				// Register the push notification service.
				if (validator.equals(services.device.deviceType, 'android')){

					// Set the device token.
					// Android is very important.
					$cordovaPush.register(configs.android).then(function(result){
					    console.log('Device is to be registered.');
					}, function(error){
					    return deferred.reject(error);
					});

				}else if (validator.equals(services.device.deviceType, 'ios')){

					var iosConfig = {
						"badge": true,
						"sound": true,
						"alert": true,
					};

					$cordovaPush.register(iosConfig).then(function(result){

						service.deviceToken = result;
						return deferred.resolve(service);

					}, function(error){

						// FIXME: Escape when the simulator is used for both ios and android.
						if (error == ' - REMOTE_NOTIFICATION_SIMULATOR_NOT_SUPPORTED_NSERROR_DESCRIPTION'){
							service.deviceToken = '12321312321';
							return deferred.resolve(service);
						}

						return deferred.reject('لا يُمكن الوصول إلى الإشعارات في الوقت الحاليّ.');
					});
				}

			});
		}

		// TODO: Test these lines.
		// $timeout(function(){
		// 	deferred.reject('Cannot use the push notifications service.');
		// }, 5000);

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
	return service;
});