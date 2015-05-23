
// Tamreen service.
starter.factory('TamreenService', function($http, $rootScope, $state, $ionicPlatform, $cordovaDevice, $cordovaPush, $cordovaAppVersion, $ionicLoading, $ionicPopup){

	console.log('Tamreen service has been initialized.');

	// The service to be returned.
	var service = {};

	// App version.
	service.appVersion = '0.0.0';

	// The user must login to use the app.
	service.user = null;

	// The URL of the API.
	service.baseUrl = '/api/v1'; // local.
	// service.baseUrl = 'https://tamreen-app.com:4000/api/v1';

	service.localStorage = null;
	service.userTokenKey = 'users-token';
  
	// Device.
	service.deviceType = null;
	service.deviceToken = null;

	// Mobile information.
	service.regionCode = null;
	service.e164formattedMobileNumber = null;

	// A helper method to return the user token as an HTTP header.
	// Private.
	service.helperUserTokenHeader = function(){

		var headers = {
			'X-User-Device-Type': service.deviceType,
			'X-User-Device-Token': service.deviceToken,
		};

		if (!validator.isNull(service.user)){
			headers['X-User-Token'] = service.user.token;
		}

		return headers;
	}

	// Remember the user information.
	// Private.
	service.helperUserRememberInfo = function(user){
		
		service.user = user;

		// Save the user data into a file.
		// $cordovaFile.writeFile(cordova.file.dataDirectory, service.userTokenFilePath, service.user).then(function(result){
		// 	console.log('User token file has been created.');
		// }, function(error){
		// 	console.log('User token file has not been created.');
		// 	console.log(JSON.stringify(error));
		// });

		service.localStorage.setItem(service.userTokenKey, JSON.stringify(service.user));

		return true;
	}

	// Forget the user information.
	// Private.
	service.helperUserForgetInfo = function(){

		service.user = null;

		// $cordovaFile.removeFile(cordova.file.dataDirectory, service.userTokenFilePath).then(function(result){
		// 	//
		// }, function(error){
		// 	//
		// });

		service.localStorage.removeItem(service.userTokenKey);

		return true;
	}

	service.helperMobileNumberValidable = function(mobileNumber){
		try{
			return phoneUtils.isValidNumberForRegion(mobileNumber, service.regionCode);
		}catch (e){
			return false;
		}
    };

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

    // Register to push notification service.
    service.helperPushNotificationRegister = function(){

    	if (validator.equals(service.deviceType, 'android')){

	         // Set the device token.
	         $cordovaPush.register(configs['android']).then(function(result){
	             console.log('Device has been registered.');
	         }, function(error){
	             console.log(error);
	         });
	     }

	     else if (validator.equals(service.deviceType, 'ios')){

	     	var iosConfig = {
				"badge": true,
				"sound": true,
				"alert": true,
			};
			
			$cordovaPush.register(iosConfig).then(function(result){
				service.deviceToken = result;
			}, function(error){
	             console.log(error);
	        });
	     }
    }

	// Handshake the user for the first time.
	// POST /users/firsthandshake
	service.userFirstHankShake = function(e164formattedMobileNumber){

		// Save the mobile in a variable to be used always.
		service.e164formattedMobileNumber = e164formattedMobileNumber;

		var callableUrl = service.baseUrl + '/users/firsthandshake';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		// This way is more readable.
		return $http({
			method: 'POST',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
			data: {
				'e164formattedMobileNumber': e164formattedMobileNumber,
			}
		});
	};

	// Handshake the user for the second time and log him/er in.
	// POST /users/secondhandshake
	service.userSecondHandShake = function(code){

		var callableUrl = service.baseUrl + '/users/secondhandshake';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'POST',
			url: callableUrl,
			data: {
				'e164formattedMobileNumber': service.e164formattedMobileNumber,
				'code': code,
			}
		});
	};

	// Log the user out of the app.
	// (Auth) GET /users/logout
	service.userLogout = function(){

		var callableUrl = service.baseUrl + '/users/logout';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});
	};

	// Update the fullname of a player.
	// (Auth) POST /users/update
	service.playerUpdate = function(fullname){

		var callableUrl = service.baseUrl + '/users/update';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'POST',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
			data: {
				fullname: fullname,
			}
		});
	};

	// List all groups that the current player (logged in user) is in.
	// (Auth) GET /groups
	service.groupList = function(){

		var callableUrl = service.baseUrl + '/groups';

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

		var callableUrl = service.baseUrl + '/groups/' + id;

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});

	};

	// It is propably the same with service.groupList.
	// (Auth) GET /groups/latest
	service.groupFetchUpdates = function(){
		return service.groupList();
	};

	// Add a new group and be the admin of it.
	// (Auth) POST /groups/add
	service.groupAdd = function(name){

		var callableUrl = service.baseUrl + '/groups/add';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'POST',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
			data: {
				name: name,
			}
		});

	};

	// Leave a group, must be in that group and not admin.
	// (Auth) GET /groups/:id/leave
	service.groupLeave = function(id){

		var callableUrl = service.baseUrl + '/groups/' + id + '/leave';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});

	};

	// Delete a group, must be an admin.
	// (Auth) GET /groups/:id/delete 
	service.groupDelete = function(id){

		var callableUrl = service.baseUrl + '/groups/' + id + '/delete';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});

	};

	// List all players in a certain group, must be a member of that group.
	// (Auth) GET /groups/:groupId/players
	service.groupPlayerList = function(groupId){

		var callableUrl = service.baseUrl + '/groups/' + groupId + '/players';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});

	};

	// It is propably the same with service.groupPlayerList.
	// (Auth) GET /groups/:groupId/players/latest
	service.groupPlayerFetchUpdates = function(groupId){
		return service.groupPlayerList(groupId);
	};

	// Add a new player to a certain group, must be an admin for the group.
	// (Auth) POST /groups/:groupId/players/add
	service.groupPlayerAdd = function(groupId, e164formattedMobileNumber, fullname){

		var callableUrl = service.baseUrl + '/groups/' + groupId +'/players/add';

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
	// (Auth) GET /groups/:groupId/players/:id/delete
	service.groupPlayerDelete = function(id, groupId){

		var callableUrl = service.baseUrl + '/groups/' + groupId + '/players/' + id + '/delete';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});

	};

	// Make a player an admin for a certain group.
	// (Auth) GET /groups/:groupId/players/:id/adminize
	service.groupPlayerAdminimize = function(id, groupId){

		var callableUrl = service.baseUrl + '/groups/' + groupId + '/players/' + id + '/adminize';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});

	};

	// List all trainings associated with a certain group.
	// (Auth) GET /groups/:groupId/trainings
	service.trainingList = function(groupId){

		var callableUrl = service.baseUrl + '/groups/' + groupId + '/trainings';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});

	};

	// It is propably the same with service.trainingList.
	// (Auth) GET /groups/:groupId/trainings/latest
	service.trainingFetchUpdates = function(groupId){
		return service.trainingList(groupId);
	};

	// Add a training to a certain group, must be an admin for the group.
	// (Auth) POST /groups/:groupId/trainings/add
	service.trainingAdd = function(groupId, stadium, startedAt, playersCount, subsetPlayersCount){

		var callableUrl = service.baseUrl + '/groups/' + groupId + '/trainings/add';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'POST',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
			data: {
				stadium: stadium,
				startedAt: startedAt,
				playersCount: playersCount,
				subsetPlayersCount: subsetPlayersCount,
			}
		});

	};

	// Get the training details.
	// (Auth) GET /trainings/:id
	service.trainingDetails = function(id){

		var callableUrl = service.baseUrl + '/trainings/' + id;

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
	// (Auth) GET /trainings/:id/willcome
	service.trainingWillCome = function(id){

		var callableUrl = service.baseUrl + '/trainings/' + id + '/willcome';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});

	};

	// Lets the player apologize from coming to the training.
	// (Auth) GET /trainings/:id/apologize
	service.trainingApologize = function(id){

		var callableUrl = service.baseUrl + '/trainings/' + id + '/apologize';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});

	};

	// Let the admin cancel the training.
	// (Auth) GET /trainings/:id/cancel
	service.trainingCancel = function(id){

		var callableUrl = service.baseUrl + '/trainings/' + id + '/cancel';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});

	};

	// List the activities for a certain training.
	// GET /trainings/:trainingId/activities
	service.activityList = function(trainingId){

		var callableUrl = service.baseUrl + '/trainings/' + trainingId + '/activities';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'GET',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
		});

	};

	// It is propably the same with service.activityList.
	// GET /trainings/:trainingId/activities/latest
	service.activityFetchUpdates = function(trainingId){
		return service.activityList(trainingId);
	};

	// Give a feedback.
	// POST /feedbacks/add
	service.feedback = function(content){

		var callableUrl = service.baseUrl + '/feedbacks/add';

		// Do tell about calling the URL.
		console.log('Calling ' + callableUrl + '...');

		// Done.
		return $http({
			method: 'POST',
			url: callableUrl,
			headers: service.helperUserTokenHeader(),
			data: {
				content: content,
			}
		});
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

	$ionicPlatform.ready(function(){

		// Listen to whenever a notification received.
		$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification){

			switch(notification.event){

				case 'registered':

					// Make sure the type of the notification is registered.
					service.deviceToken = notification.regid;
				break;
			}
		});

		console.log('localStorage');

		// Check if the localStorage is available and could be used.
		try{

			var localStorageable = 'localStorage' in window && window['localStorage'] !== null;

			if (localStorageable == false){
				$ionicPopup.alert({
					title: 'خطأ',
					template: 'لن يعمل التطبيق يشكلٍ صحيح في ظلّ عدم تفعيل التخزين المحلّي.',
					okText: 'حسنًا',
				});
				return;
			}

			// Set the local storage.
			service.localStorage = window.localStorage;

		}catch (e){

			$ionicPopup.alert({
				title: 'خطأ',
				template: 'لن يعمل التطبيق يشكلٍ صحيح في ظلّ عدم تفعيل التخزين المحلّي.',
				okText: 'حسنًا',
			});
			return;
		}

		$cordovaAppVersion.getAppVersion().then(function(version){
			service.appVersion = version;
		});

		console.log('TamreenService is ready.');


		// Set the device information.
		service.deviceType = $cordovaDevice.getPlatform();

		if (validator.isNull(service.deviceType)){
			$ionicPopup.alert({
				title: 'خطأ',
				template: 'لن يعمل التطبيق يشكلٍ صحيح في ظلّ عدم وجود منصّة تشغيل (Platform).',
				okText: 'حسنًا',
			});
			return;
		}

		service.deviceType = service.deviceType.toLowerCase();
		console.log('service.deviceType = ' + service.deviceType);

		// Call the device.
		service.helperPushNotificationRegister();

		// TODO:
		// service.localStorage.removeItem(service.userTokenKey);

		// Try to get the user information.
		var saved = service.localStorage.getItem(service.userTokenKey);

		if (saved == null)
		{
			console.log('Cannot find the user information.');
			$state.go('users-firsthandshake');

		}else{

			// Get the user information as JSON.
			var user = JSON.parse(saved);

			// Make the user logged in.
			user.logginable = 1;
			service.user = user;

			// Set the region code.
			service.regionCode = service.helperMobileRegionCode(user.e164formattedMobileNumber);

			console.log(JSON.stringify(service.user));

			// Go afterward to groups.
			$state.go('groups-list');
		}

	});

	return service;
});
