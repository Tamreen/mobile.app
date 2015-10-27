
//
tamreen.factory('TamreenService', function($q, $ionicModal, $ionicPopup, $ionicPlatform, $state, $http, InternetService, AppInfoService, DeviceService, PushNotificationService, StorageService){

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
	service.e164formattedMobileNumber = null;

	//
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
			//$state.go('users-firsthandshake');

			service.helperLoadUserInfo()

			//
			.then(function(user){

				//user.logginable = 1;
				service.user = user;

				// Set the region code.
				service.regionCode = service.helperMobileRegionCode(user.e164formattedMobileNumber);

				// Go afterward to groups.
				$state.go('home.trainings');
				
			//
			}, function(error){
				$state.go('users-firsthandshake');
			});

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

	// TODO: Most of methods to be here.

	//
	service.helperDestroyUserInfo = function(){
		service.user = null;
		$cordovaFile.removeFile(cordova.file.dataDirectory, service.userTokenFilePath);
	}

	//
	service.helperMobileNumberValidable = function(mobileNumber){
		try{
			return phoneUtils.isValidNumberForRegion(mobileNumber, service.regionCode);
		}catch (e){
			return false;
		}
    };

    //
    service.helperMobileRegionCode = function(mobileNumber){
		try{
			return phoneUtils.getRegionCodeForNumber(mobileNumber).toLowerCase();
		}catch (e){
			return null;
		}
    };

    // Return the mobile number in e164 format.
    service.helperMobileNumberE164Format = function(mobileNumber){
		try{
			return phoneUtils.formatE164(mobileNumber, service.regionCode);
		}catch (e){
			return '';
		}
    };

	// A helper method to return the user token as an HTTP header.
	// Private.
	service.helperUserTokenHeader = function(){

		var headers = {
			'X-User-Device-Type': service.device.deviceType,
			'X-User-Device-Token': service.pushNotification.deviceToken,
		};

		if (!validator.isNull(service.user)){
			headers['X-User-Token'] = service.user.token;
		}

		return headers;
	};

	//
	service.helperSaveUserInfo = function(object){

		//
		service.user = object;

		//
		var deferred = $q.defer();

		//
		service.storage.store(configs['userKey'], object)

		//
		.then(function(success){
			return deferred.resolve(success);
		}, function(error){
			return deferred.reject(error);
		});

		//
		return deferred.promise;
	};

	//
	service.helperLoadUserInfo = function(){

		var deferred = $q.defer();

		//
		service.storage.retrieve(configs['userKey'])

		//
		.then(function(user){
			return deferred.resolve(user);
		}, function(error){
			return deferred.reject(error);
		});

		//
		return deferred.promise;
	};

	//
	service.helperHandleErrors = function(response){

		var errorMessage = null;

		if (!validator.isNull(response) && !validator.isNull(response.data) && !validator.isNull(response.data.message)){
			errorMessage = response.data.message;
		}else{
			errorMessage = 'يبدو أنّ هناك خطأ ما، حاول مرّة أخرى لاحقًا.';
		}

		//
		$ionicPopup.alert({
			title: 'خطأ',
			template: errorMessage,
			okText: 'حسنًا',
		});
	};

	// Handshake the user for the first time.
	// PUT /users/firsthandshake
	service.userFirstHankShake = function(e164formattedMobileNumber){

		// Save the mobile in a variable to be used always.
		service.e164formattedMobileNumber = e164formattedMobileNumber;

		var callableUrl = configs.apiBaseurl + '/users/firsthandshake';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		// This way is more readable.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
			data: {
				'e164formattedMobileNumber': e164formattedMobileNumber,
			}
		});
	};

	// Handshake the user for the second time and log him/er in.
	// PUT /users/secondhandshake
	service.userSecondHandShake = function(code){

		var callableUrl = configs.apiBaseurl + '/users/secondhandshake';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			data: {
				'e164formattedMobileNumber': service.e164formattedMobileNumber,
				'code': code,
			}
		});
	};

	// List all trainings that the user is invited to.
	// (Auth) GET /trainings/specified
	service.trainingListSpecified = function(){

		var callableUrl = configs.apiBaseurl + '/trainings/specified';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});
	};

	// TODO: I used PUT and I do not want to use it.
	// List all trainings that the user is around.
	// (Auth) GET /trainings/around
	service.trainingListAround = function(coordinates){

		var callableUrl = configs.apiBaseurl + '/trainings/around';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		console.log(coordinates);

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			data: {'coordinates': coordinates},
			headers: service.helperUserTokenHeader(),
		});
	};

	// TODO: The training details method.

	// List all groups that the current player (logged in user) is in.
	// (Auth) GET /groups
	service.groupList = function(){

		var callableUrl = configs.apiBaseurl + '/groups';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});
	};

	// Get the group details.
	// (Auth) GET /groups/:id
	service.groupDetails = function(id){

		var callableUrl = configs.apiBaseurl + '/groups/' + id;

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});

	};

	return service;
});