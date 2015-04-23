
// Users controller.
starter.controller('UsersController', function($scope, $state, $ionicPopup, TamreenService){

	console.log('Users controller has been initialized.');

	// Parameters.
	$scope.parameters = {};
	$scope.parameters.regionCode = 'sa';

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
				okText: 'حسناً',
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
			console.log(JSON.stringify(response));
			$ionicPopup.alert({
				title: 'خطأ',
				template: 'يبدو أنّ هناك خطأٌ ما عند إرسال الرمز المؤقت، حاول مرّة أخرى تكرّماً.',
				okText: 'حسناً',
			});
		});
	};

	// secondHandShake.
	// Called when the user is entering the temporary number that has been sent to.
	$scope.secondHandShake = function(){

		console.log('Second hand shake has been called.');

		// Validate if the code is correct.
		if (!validator.isNumeric($scope.parameters.code)){

			$ionicPopup.alert({
				title: 'خطأ',
				template: 'الرجاء التأكّد من تعبئة الحقل بشكلٍ صحيح.',
				okText: 'حسناً',
			});

			return;
		}

		// Try to make the second handshake using the service.
		var promise = TamreenService.userSecondHandShake($scope.parameters.code);

		// Check what the service promises.
		promise.then(function(response){

			TamreenService.helperUserRememberInfo(response.data);
			
			if (response.data.loginable == false)
				return $state.go('players-update');

			// Otherwise.
			$state.go('groups-list');

		}, function(response){
			$ionicPopup.alert({
				title: 'خطأ',
				template: 'الرجاء التأكّد من إدخال الرمز المؤقت  بشكلٍ صحيح.',
				okText: 'حسناً',
			});
		});
	};
});