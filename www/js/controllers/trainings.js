
// Trainings controller.
starter.controller('TrainingsController', function($scope, $state, $stateParams, $ionicActionSheet, $ionicPopup, TamreenService){

	console.log('Trainings controller has been initialized.');

	// Parameters.
	$scope.parameters = {};

	// Trainings.
	$scope.trainings = [];

	// Chosen group and/or trainig.
	$scope.group = null;
	$scope.training = null;

	$scope.trainingsBack = function(groupId){
		$state.go('groups-list');
	}

	$scope.list = function(groupId){

		console.log('List trainings has been called.');

		// Try to list the trainings of a certain group using the service.
		var promise = TamreenService.trainingList(groupId);

		// Check what the service promises.
		promise.then(function(response){
			$scope.trainings = response.data;
		}, function(response){
			$ionicPopup.alert({
				title: 'خطأ',
				template: 'يبدو أنّ هناك خطأٌ ما عند جلب التمارين، حاول مرّة أخرى تكرّماً.',
				okText: 'حسناً',
			});
		});
	}
	
	$scope.fetchUpdates = function(groupId){

		// This function could act like list() function.
		console.log('Fetching updates has been made.');

		// Call another method that make all that.
		$scope.list(groupId);

		// Okay, every this is done.
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.add = function(groupId){

		console.log('Adding a training has been called.');

		// Validate the user inputs.
		if (validator.isNull($scope.parameters.stadium) || !validator.isDate($scope.parameters.startedAt) || !validator.isNumeric($scope.parameters.playersCount) || $scope.parameters.playersCount <= 0 || !validator.isNumeric($scope.parameters.subsetPlayersCount)){

				$ionicPopup.alert({
					title: 'خطأ',
					template: 'الرجاء التأكّد من تعبئة الحقول بشكلٍ صحيح.',
					okText: 'حسناً',
				});

				return;
		}

		// Set the datetime to be formatted correctly.
		var isoStartDateTime = validator.toDate($scope.parameters.startedAt).toISOString();

		// Try to add a training to a certain group using the service.
		var promise = TamreenService.trainingAdd(groupId, $scope.parameters.stadium, isoStartDateTime, $scope.parameters.playersCount, $scope.parameters.subsetPlayersCount);

		// Check what the service promises.
		promise.then(function(response){

			// Save the training information.
			$scope.training = response.data;

			// Redirect to the added training activities.
			$state.go('activities-list', {'trainingId': $scope.training.id});

		}, function(response){
			$ionicPopup.alert({
				title: 'خطأ',
				template: 'يبدو أنّ هناك خطأٌ ما عند إضافة تمرين، حاول مرّة أخرى تكرّماً.',
				okText: 'حسناً',
			});
		});
	}

	$scope.detail = function(trainingId){

		console.log('Detailing has been called.');

		// Try to get a training details using the service.
		var promise = TamreenService.trainingDetails(trainingId);

		// Check what the service promises.
		promise.then(function(response){
			// Save the training information.
			$scope.training = response.data;
		}, function(response){
			$ionicPopup.alert({
				title: 'خطأ',
				template: 'يبدو أنّ هناك خطأٌ ما عند جلب تفاصيل التمرين، حاول مرّة أخرى تكرّماً.',
				okText: 'حسناً',
			});
		});
	}

	$scope.more = function(){

		console.log('Training more has been called.');

		var buttonLabels = [{text: 'إضافة تمرين جديد'}, {text: 'استعراض اللاعبين'}];

		// Check if the user is admin of the group.
		if ($scope.group.adminable)
		{
			buttonLabels.push({text: 'حذف المجموعة'});
		}
		else
		{
			buttonLabels.push({text: 'مغادرة المجموعة'});
		}

		var hideSheet = $ionicActionSheet.show({

	     	buttons: buttonLabels,
	     	titleText: 'ما رأيك بتمرينٍ جديد؟',
	     	cancelText: 'إلغاء',
	     	destructiveText: null,

	     	cancel: function() {
	          // Add cancel code here.
	        },

	     	buttonClicked: function(index){

		    	if (index == 0){
		       		console.log('Add a new training has been chosen.');
		       		$state.go('trainings-add', {'groupId': $scope.group.id});
		       }
		       else if (index == 1){
		       		console.log('Manage group players has been chosen.');
		       		$state.go('groups-players-list', {'groupId': $scope.group.id});
		       }
		       else if (index == 2)
		       {
		       		if ($scope.group.adminable)
		       		{
		       			// Call the method of deleting the group.
		       			$scope.deleteGroup($scope.group.id);
		       		}
		       		else
		       		{
		       			// Call the method of leaving the group.
		       			$scope.leaveGroup($scope.group.id);
		       		}
		       	}

		       	// Not sure why this returns.
	       		return true;
	     	}
   		});
	}

	$scope.leaveGroup = function(groupId){

		console.log('Leave a group has been called.');

		// Check if the user is sure about deleting.
		var confirmPopup = $ionicPopup.confirm({
			title: 'مغادرة المجموعة',
			template: 'هل أنت متأكّد من أنّك تريد مغادرة المجموعة؟',
			cancelText: 'لا',
			okText: 'نعم',
			okType: 'button-assertive',
		});

		confirmPopup.then(function(yes){

			if(yes){

				// Try to list the groups using the service.
				var promise = TamreenService.groupLeave(groupId);

				// Check what the service promises.
				promise.then(function(response){

					$ionicPopup.alert({
						title: 'تم',
						template: 'لقد غادرتَ المجموعة، في حفظ الله.',
						okText: 'حسناً',
					});

					// Redirect the user to the groups.
					$state.go('groups-list');

				}, function(response){
					$ionicPopup.alert({
						title: 'خطأ',
						template: 'يبدو أنّ هناك خطأٌ ما عند مغادرة المجموعة، حاول مرّة أخرى تكرّماً.',
						okText: 'حسناً',
					});
				});

			}else{
				console.log('Cancel leaving the group.');
			}
		});
	}

	// Admin function.
	// Delete a group.
	$scope.deleteGroup = function(groupId){

		console.log('Delete a group has been called.');

		// Check if the user is sure about deleting.
		var confirmPopup = $ionicPopup.confirm({
			title: 'حذف المجموعة',
			template: 'هل أنت متأكّد من أنّك تريد حذف المجموعة؟',
			cancelText: 'لا',
			okText: 'نعم',
			okType: 'button-assertive',
		});

		confirmPopup.then(function(yes){

			if(yes){

				// Try to list the groups using the service.
				var promise = TamreenService.groupDelete(groupId);

				// Check what the service promises.
				promise.then(function(response){

					$ionicPopup.alert({
						title: 'تم',
						template: 'لقد حذفتَ المجموعة.',
						okText: 'حسناً',
					});

					// Redirect the user to the groups.
					$state.go('groups-list');

				}, function(response){
					$ionicPopup.alert({
						title: 'خطأ',
						template: 'يبدو أنّ هناك خطأٌ ما عند حذف التمرين، حاول مرّة أخرى تكرّماً.',
						okText: 'حسناً',
					});
				});

			}else{
				console.log('Cancel deleting the group.');
			}
		});
	}

	// Define a group if any.
	if ($stateParams.groupId){

		console.log('Define a group.');

		// Try to get the group using the service.
		var promise = TamreenService.groupDetails($stateParams.groupId);

		// Check what the service promises.
		promise.then(function(response){

			// Save the current group.
			$scope.group = response.data;

			if ($state.current.name == 'trainings-list'){
				$scope.list($scope.group.id);
			}
			
		});
	}

	// Define a training if any.
	if ($stateParams.trainingId){
		$scope.training = {id: $stateParams.trainingId};
	}

	// Having already the information that needed.
	if ($state.current.name == 'trainings-details'){
		$scope.detail($scope.training.id);
	}

});