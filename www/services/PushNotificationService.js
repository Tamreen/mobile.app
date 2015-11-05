
//
tamreen.factory('PushNotificationService', function($q, $injector, $ionicPlatform, $rootScope){

	console.log('PushNotificationService has been called.');

	//
	var service = {};

	//
	service.deviceToken = null;

	//
	service.initialize = function(services){

		//
		var deferred = $q.defer();

		if (configs.environment == 'development'){

			service.deviceToken = '12321312321';
			deferred.resolve(service);

		}else{

			// TODO: If the environment is not development.
			$ionicPlatform.ready(function(){

				$cordovaPush = $injector.get('$cordovaPush');

				// TODO: Listen to whenever a notification received.
				$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification){

					switch(notification.event){

						case 'registered':

							// Make sure the type of the notification is registered.
							service.deviceToken = notification.regid;
							return deferred.resolve(service);

						break;

						case 'message':
							// TODO: service.helperToast(notification.payload.title);
							console.log('message has been received.');
						break;

						// TODO: There has to be an error received also.
						default:
							return deferred.reject('An unknown GCM event has occurred');
						break;
					}

					if (notification.alert){
						// TODO: service.helperToast(notification.alert);
						console.log('alert has been received.');
					}
				});

				// TODO: Register the push notification service.
				if (validator.equals(services.device.deviceType, 'android')){

					// Set the device token.
					// TODO: Android is very important.
					$cordovaPush.register(configs.android.senderID).then(function(result){
					    console.log('Device is to be registered.');
					}, function(error){
						// TODO: This error to be readable.
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

						// TODO: Escape when the simulator is used for both ios and android.
						if (error == ' - REMOTE_NOTIFICATION_SIMULATOR_NOT_SUPPORTED_NSERROR_DESCRIPTION'){
							service.deviceToken = '12321312321';
							return deferred.resolve(service);
						}

						return deferred.reject('Cannot use the push notification for now.');
					});
				}

			});
		}

		//
		return deferred.promise;
	};

	//
	return service;
});