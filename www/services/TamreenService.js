
//
tamreen.factory('TamreenService', function($q, $ionicModal, InternetService, AppInfoService, DeviceService, PushNotificationService, StorageService){

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
	})

	// TODO: The media and the contacts and so.

	//
	.catch(function(error){
		//alert(error);
		$ionicModal.fromTemplateUrl('views/pages.tos.html').then(function(modal){
			// modal.scope.version = minClientVersion;
			modal.show();
		});
	});

	//
	service.hello = function(){

	};

	return service;
});