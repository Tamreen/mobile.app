
// Players controller.
starter.controller('PlayersController', function($scope, $state, $ionicPopup, TamreenService){

	console.log('Players controller has been initialized.');

	// Parameters.
	$scope.parameters = {};

	// update
	// Called when the user is updating the information.
	$scope.update = function(){

		// Validate the input of the user.
		if (validator.isNull($scope.parameters.fullname) || validator.isNull($scope.parameters.fullname.trim())){

			$ionicPopup.alert({
				title: 'خطأ',
				template: 'الرجاء التأكّد من إدخال الاسم الكامل.',
				okText: 'حسناً',
			});

			return;
		}

		// Try to update the player using the service.
		var promise = TamreenService.playerUpdate($scope.parameters.fullname);

		// Check what the service promises.
		promise.then(function(user){
			$state.go('groups-list');
		}, function(response){
			$ionicPopup.alert({
				title: 'خطأ',
				template: 'يبدو أنّ هناك خطأٌ ما عند تحديث المعلومات، حاول مرّة أخرى تكرّماً.',
				okText: 'حسناً',
			});
		});
	};

});