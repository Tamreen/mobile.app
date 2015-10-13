
//
tamreen.factory('TamreenService', function($q, DeviceService, PushNotificationService){

	console.log('TamreenService has been called.');

	//
	var service = {};

	//
	service.device = null;
	service.pushNotification = null;
	service.storage = null;

	// TODO: The internet is very important.
	// TODO: The device is very important.
	// TODO: The push notification is very important.
	// TODO: The storage is very important.

	//
	DeviceService.initialize()

	//
	.then(function(device){
		service.device = device;
		return PushNotificationService.initialize(device);
	})

	//
	.then(function(pushNotification){
		service.pushNotification = pushNotification;
		return console.log(pushNotification);
	})

	//
	.catch(function(error){
		console.error(error);
	});

	return service;
});