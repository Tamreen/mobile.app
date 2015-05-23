
// Pages controller.
starter.controller('PagesController', function($scope, $state, $ionicPopup, TamreenService){

	console.log('Pages controller has been initialized.');

	$scope.appVersion = TamreenService.appVersion;

	$scope.parameters = {};

	// feedback
	// Called when the user is trying to give feedback.
	$scope.feedback = function(){

		if (validator.isNull($scope.parameters.content)){

			$ionicPopup.alert({
				title: 'خطأ',
				template: 'الرجاء تعبئة الحقول المطلوبة.',
				okText: 'حسنًا',
			});

			return;
		}

		// Try to give the feedback using the service.
		var promise = TamreenService.feedback($scope.parameters.content);

		// Check what the service promises.
		promise.then(function(user){

			$ionicPopup.alert({
				title: 'شكرًا',
				template: 'شكرًا لك على رأيك، نهتم به و نعمل على دراسته.',
				okText: 'حسنًا',
			});

			$state.go('pages-about');

		}, function(response){
			$ionicPopup.alert({
				title: 'خطأ',
				template: 'يبدو أنّ هناك خطأٌ ما عند تحديث المعلومات، حاول مرّة أخرى تكرّمًا.',
				okText: 'حسنًا',
			});
		});

	}

});