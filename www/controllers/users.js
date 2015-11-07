
//
tamreen.controller('UsersController', function($scope, $rootScope, $state, $ionicPopup, TamreenService){

	console.log('Users controller has been initialized.');

	// Parameters.
	$scope.parameters = {};
	$scope.parameters.regionCode = 'sa';

	//
	$scope.user = null;
	$scope.userAvatar = null;

	// TODO: This to be fixed.
	$rootScope.$on('users.update', function(){
		$scope.user = TamreenService.user;
	});

	//
	$scope.getRandomAvatar = function(){
		$scope.userAvatar = randomAvatar();
	}

	// firstHandShake.
	// Called when the user is entering the mobile and expecting a temporary code number.
	$scope.firstHandShake = function(){

		console.log('First hand shake has been called.');

		// Set the region code.
		TamreenService.regionCode = $scope.parameters.regionCode;

		// Validate the input of the user.
		if (TamreenService.helperMobileNumberValidable($scope.parameters.mobileNumber) == false){

			$ionicPopup.alert({
				title: 'خطأ',
				template: 'الرجاء التأكّد من إدخال رقم جوّال صحيح.',
				okText: 'حسنًا',
			});

			return;
		}

		// Set the device and e164 formatted mboile number.
		var e164formattedMobileNumber = TamreenService.helperMobileNumberE164Format($scope.parameters.mobileNumber);

		// Great!
		console.log('Getting the mobile number ' + e164formattedMobileNumber);
		console.log('Getting the device ' + TamreenService.deviceType);
		console.log('Getting the token ' + TamreenService.deviceToken);

		// Try to make a first handshake using the service.
		var promise = TamreenService.userFirstHankShake(e164formattedMobileNumber);

		// Check what the service promises.
		promise.then(function(){
			$state.go('users-secondhandshake');
		}, function(response){
			TamreenService.helperHandleErrors(response);
		});
	};

	// secondHandShake.
	// Called when the user is entering the temporary number that has been sent to.
	$scope.secondHandShake = function(){

		console.log('Second hand shake has been called.');

		// Validate if the code is correct.
		if (!validator.isNumeric($scope.parameters.code)){

			return $ionicPopup.alert({
				title: 'خطأ',
				template: 'الرجاء التأكّد من تعبئة الحقل بشكلٍ صحيح.',
				okText: 'حسنًا',
			});
		}

		// Try to make the second handshake using the service.
		var promise = TamreenService.userSecondHandShake($scope.parameters.code);

		// Check what the service promises.
		// TODO: Maybe if there is only one promise.
		promise.then(function(response){

			TamreenService.helperSaveUserInfo(response.data)

			.then(function(success){

				if (response.data.loginable == 0)
					return $state.go('players-firstupdate');

				// Otherwise.
				$state.go('home.trainings');

			}, function(error){

				return $ionicPopup.alert({
					title: 'خطأ',
					template: 'حدث خطأ أثناء محاولة حفظ معلومات الدخول، تأكّد من منح الصلاحيّات اللازمة للتطبيق.',
					okText: 'حسنًا',
				});
			});

		}, function(response){
			TamreenService.helperHandleErrors(response);
		});
	};

	// Confirm if the user wants to log out.
	// FIXME: Consider in the level of the API to remove the device token.
	$scope.logout = function(){

		//
		var confirmPopup = $ionicPopup.confirm({
			title: 'تسجيل الخروج',
			template: 'هل أنت متأكّد من أنّك تريد تسجيل الخروج؟',
			cancelText: 'لا',
			okText: 'نعم',
			okType: 'button-assertive',
		});

		confirmPopup.then(function(yes){

			if(yes){

				var promise = TamreenService.userLogout();

				// Check what the service promises.
				promise.then(function(){
					TamreenService.helperDestroyUserInfo();
				}, function(response){
					TamreenService.helperDestroyUserInfo();
				});

				//
				$state.go('users-firsthandshake');

				$ionicPopup.alert({
					title: 'تم',
					template: 'تمّ تسجيل الخروج بنجاح.',
					okText: 'حسنًا',
				});
			}
		});
	};

	//
	$scope.fetchUserDetails = function(){
		//
		return TamreenService.playerDetails($scope.user.playerId)

		//
		.then(function(response){
			TamreenService.user.fullname = response.data.fullname;
			$scope.user = TamreenService.user;
		}, function(response){
			TamreenService.helperHandleErrors(response);
		});
	};

	//
	$scope.profilePullToRefresh = function(){
		$scope.fetchUserDetails();
		$scope.$broadcast('scroll.refreshComplete');
	}

	//
	if ($state.current.name == 'home.profile'){
		console.log('$state.current.name is called.');
		$scope.user = TamreenService.user;
	}

});