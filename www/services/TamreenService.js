
//
tamreen.factory('TamreenService', function($q, $ionicModal, $ionicPlatform, $state, InternetService, AppInfoService, DeviceService, PushNotificationService, StorageService){

	console.log('TamreenService has been called.');

	//
	var service = {};

	//
	service.internet = null;
	service.appInfo = null;
	service.device = null;
	service.pushNotification = null;
	service.storage = null;

	//
	service.regionCode = null;
	service.user = null;

	//
	InternetService.initialize()

	//
	.then(function(internet){
		service.internet = internet;
		return AppInfoService.initialize(internet);
	})

	//
	.then(function(appInfo){
		service.appInfo = appInfo;
		return DeviceService.initialize(appInfo);
	})

	//
	.then(function(device){
		service.device = device;
		return PushNotificationService.initialize(device);
	})

	//
	.then(function(pushNotification){
		service.pushNotification = pushNotification;
		return StorageService.initialize(pushNotification);
	})

	//
	.then(function(storage){

		service.storage = storage;

		$ionicPlatform.ready(function(){

			console.log('$ionicPlatform is ready.');

			// TODO: Check if the user is logged in or redirect to firsthandshake.
			$state.go('users-firsthandshake');

		});
	})

	// TODO: The media and the contacts and so.

	// The app cannot run without these services.
	.catch(function(error){
		$ionicModal.fromTemplateUrl('views/pages.modal.html').then(function(modal){
			modal.scope.message = error;
			// modal.scope.details = '1.0.0';
			modal.show();
		});
	});

	return service;
});