
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
		console.log('internet');
		service.internet = internet;
		return AppInfoService.initialize({internet: internet});
	})

	//
	.then(function(appInfo){
		console.log('appInfo');
		service.appInfo = appInfo;
		return DeviceService.initialize({appInfo: appInfo});
	})

	//
	.then(function(device){
		console.log('device');
		service.device = device;
		return PushNotificationService.initialize({device: device});
	})

	//
	.then(function(pushNotification){
		console.log('pushNotification');
		service.pushNotification = pushNotification;
		return StorageService.initialize({pushNotification: pushNotification});
	})

	//
	.then(function(storage){

		console.log('Reached this line meaning peace.');

		service.storage = storage;

		//
		$ionicPlatform.ready(function(){

			console.log('$ionicPlatform is ready.');

			service.helperLoadUserInfo()

			//
			.then(function(user){

				user.logginable = 1;
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

	// The app cannot run without these services.
	.catch(function(error){

		console.log(error);

		$ionicModal.fromTemplateUrl('views/pages.modal.html').then(function(modal){
			modal.scope.message = error;
			// modal.scope.details = '1.0.0';
			modal.show();
		});
	});

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
	service.helperDestroyUserInfo = function(){

		// $cordovaFile.removeFile(cordova.file.dataDirectory, service.userTokenFilePath);

		//
		service.user = null;

		//
		var deferred = $q.defer();

		//
		service.storage.destroy(configs['userKey'])

		//
		.then(function(user){
			return deferred.resolve(user);
		}, function(error){
			return deferred.reject(error);
		});

		//
		return deferred.promise;
	}

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

	// Update the parameters of a player.
	// (Auth) PUT /players
	service.playerUpdate = function(parameters){

		var callableUrl = configs.apiBaseurl + '/players';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
			data: parameters,
		});
	};

	// Get a player information.
	// (Auth) GET /players/:id
	service.playerDetails = function(id){

		var callableUrl = configs.apiBaseurl + '/players/' + id;

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});
	};

	// Log the user out of the app.
	// (Auth) PUT /users/logout
	service.userLogout = function(){

		var callableUrl = configs.apiBaseurl + '/users/logout';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
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

	// FIXME: I used PUT and I do not want to use it.
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

	// Add a training.
	// (Auth) POST /trainings
	service.trainingAdd = function(parameters){

		var callableUrl = configs.apiBaseurl + '/trainings';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'POST',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
			data: parameters,
		});
	};

	// Update a training.
	// (Auth) PUT /trainings/:id
	service.trainingUpdate = function(id, parameters){

		var callableUrl = configs.apiBaseurl + '/trainings/' + id;

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
			data: parameters,
		});
	};

	// Get the training details.
	// (Auth) GET /trainings/:id
	service.trainingDetails = function(id){

		var callableUrl = configs.apiBaseurl + '/trainings/' + id;

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});
	};

	// Lets the player come to the training.
	// (Auth) PUT /trainings/:id/willcome
	service.trainingWillCome = function(id){

		var callableUrl = configs.apiBaseurl + '/trainings/' + id + '/willcome';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});
	};

	// Lets the player apologize from coming to the training.
	// (Auth) PUT /trainings/:id/apologize
	service.trainingApologize = function(id){

		var callableUrl = configs.apiBaseurl + '/trainings/' + id + '/apologize';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});
	};

	// Decide for a player to come to a training by the training admin.
	// (Auth) PUT /trainings/:id/players/:playerId/willcome
	service.trainingAdminPlayerWillCome = function(id, playerId){

		var callableUrl = configs.apiBaseurl + '/trainings/' + id + '/players/' + playerId + '/willcome';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});
	};

	// Decide for a player to apologize for attending a training by the training admin
	// (Auth) PUT /trainings/:id/players/:playerId/apologize
	service.trainingAdminPlayerApologize = function(id, playerId){

		var callableUrl = configs.apiBaseurl + '/trainings/' + id + '/players/' + playerId + '/apologize';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});
	};

	// Lets the player bring a professional player.
	// (Auth) PUT /trainings/:id/bringprofessional
	service.trainingBringProfessional = function(id, e164formattedMobileNumber, fullname){

		var callableUrl = configs.apiBaseurl + '/trainings/' + id +'/bringprofessional';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
			data: {
				e164formattedMobileNumber: e164formattedMobileNumber,
				fullname: fullname,
			}
		});
	};

	// Lets the admin poke the training players.
	// (Auth) PUT /trainings/:id/poke
	service.trainingPoke = function(id){

		var callableUrl = configs.apiBaseurl + '/trainings/' + id + '/poke';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});
	};

	// Lets the admin professionalize the training.
	// (Auth) PUT /trainings/:id/professionalize
	service.trainingProfessionalize = function(id){

		var callableUrl = configs.apiBaseurl + '/trainings/' + id + '/professionalize';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});
	};

	// Lets the admin publicize the training.
	// (Auth) PUT /trainings/:id/publicize
	service.trainingPublicize = function(id){

		var callableUrl = configs.apiBaseurl + '/trainings/' + id + '/publicize';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});
	};

	// Lets the admin cancel the training.
	// (Auth) PUT /trainings/:id/cancel
	service.trainingCancel = function(id){

		var callableUrl = configs.apiBaseurl + '/trainings/' + id + '/cancel';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});
	};

	// Lets the admin complete the training.
	// (Auth) PUT /trainings/:id/complete
	service.trainingComplete = function(id){

		var callableUrl = configs.apiBaseurl + '/trainings/' + id + '/complete';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});
	};

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

	// Add a new group and be the admin of it.
	// (Auth) POST /groups/add
	service.groupAdd = function(name){

		var callableUrl = configs.apiBaseurl + '/groups';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'POST',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
			data: {'name': name}
		});
	};

	// Update a group.
	// (Auth) PUT /groups/:id
	service.groupUpdate = function(id, parameters){

		var callableUrl = configs.apiBaseurl + '/groups/' + id;

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
			data: parameters,
		});

	};

	// Leave a group, must be in that group and not admin.
	// (Auth) PUT /groups/:id/leave
	service.groupLeave = function(id){

		var callableUrl = configs.apiBaseurl + '/groups/' + id + '/leave';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});

	};

	// Delete a group, must be an admin.
	// (Auth) DELETE /groups/:id
	service.groupDelete = function(id){

		var callableUrl = configs.apiBaseurl + '/groups/' + id;

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'DELETE',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});

	};

	// Add a new player to a certain group, must be an admin for the group.
	// (Auth) POST /groups/:id/players
	service.groupPlayerAdd = function(id, e164formattedMobileNumber, fullname){

		var callableUrl = configs.apiBaseurl + '/groups/' + id +'/players';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'POST',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
			data: {
				e164formattedMobileNumber: e164formattedMobileNumber,
				fullname: fullname,
			}
		});
	};

	// Delete a player from a certain group.
	// (Auth) DELETE /groups/:id/players/:playerId
	service.groupPlayerDelete = function(id, playerId){

		var callableUrl = configs.apiBaseurl + '/groups/' + id + '/players/' + playerId;

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'DELETE',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});
	};

	// Make a player an admin for a certain group.
	// (Auth) PUT /groups/:id/players/:playerId/adminize
	service.groupPlayerAdminize = function(id, playerId){

		var callableUrl = configs.apiBaseurl + '/groups/' + id + '/players/' + playerId + '/adminize';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'PUT',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});

	};

	return service;
});