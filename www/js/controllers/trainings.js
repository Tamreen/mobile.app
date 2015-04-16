
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

	// Set the locale of moment.
	moment.locale('ar-sa');

	// Set the default value of started at.
	// $scope.parameters.startedAtDate = moment();
	// $scope.parameters.startedAtTime = todayFirstHour;

	// Hold dates and hours.
	$scope.dates = [];

	// Set the dates.
	for (i=0; i<7; i++){
		var day = moment().add(i, 'days');
		$scope.dates.push({id: day.format(), value: day.format('dddd, DD MMMM YYYY')});
	}

	// Set the hours.
	$scope.hours = [
		{id: '00:00', value: '12:00 ص'},
		{id: '00:30', value: '12:30 ص'},
		{id: '01:00', value: '1:00 ص'},
		{id: '01:30', value: '1:30 ص'},
		{id: '02:00', value: '2:00 ص'},
		{id: '02:30', value: '2:30 ص'},
		{id: '03:00', value: '3:00 ص'},
		{id: '03:30', value: '3:30 ص'},
		{id: '04:00', value: '4:00 ص'},
		{id: '04:30', value: '4:30 ص'},
		{id: '05:00', value: '5:00 ص'},
		{id: '05:30', value: '5:30 ص'},
		{id: '06:00', value: '6:00 ص'},
		{id: '06:30', value: '6:30 ص'},
		{id: '07:00', value: '7:00 ص'},
		{id: '07:30', value: '7:30 ص'},
		{id: '08:00', value: '8:00 ص'},
		{id: '08:30', value: '8:30 ص'},
		{id: '09:00', value: '9:00 ص'},
		{id: '09:30', value: '9:30 ص'},
		{id: '10:00', value: '10:00 ص'},
		{id: '10:30', value: '10:30 ص'},
		{id: '11:00', value: '11:00 ص'},
		{id: '11:30', value: '11:30 ص'},
		{id: '12:00', value: '12:00 م'},
		{id: '12:30', value: '12:30 م'},
		{id: '13:00', value: '1:00 م'},
		{id: '13:30', value: '1:30 م'},
		{id: '14:00', value: '2:00 م'},
		{id: '14:30', value: '2:30 م'},
		{id: '15:00', value: '3:00 م'},
		{id: '15:30', value: '3:30 م'},
		{id: '16:00', value: '4:00 م'},
		{id: '16:30', value: '4:30 م'},
		{id: '17:00', value: '5:00 م'},
		{id: '17:30', value: '5:30 م'},
		{id: '18:00', value: '6:00 م'},
		{id: '18:30', value: '6:30 م'},
		{id: '19:00', value: '7:00 م'},
		{id: '19:30', value: '7:30 م'},
		{id: '20:00', value: '8:00 م'},
		{id: '20:30', value: '8:30 م'},
		{id: '21:00', value: '9:00 م'},
		{id: '21:30', value: '9:30 م'},
		{id: '22:00', value: '10:00 م'},
		{id: '22:30', value: '10:30 م'},
		{id: '23:00', value: '11:00 م'},
		{id: '23:30', value: '11:30 م'},
	];

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
		if (validator.isNull($scope.parameters.stadium) || validator.isNull($scope.parameters.startedAtDate) || validator.isNull($scope.parameters.startedAtTime) || !validator.isNumeric($scope.parameters.playersCount) || $scope.parameters.playersCount <= 0 || !validator.isNumeric($scope.parameters.subsetPlayersCount)){

				$ionicPopup.alert({
					title: 'خطأ',
					template: 'الرجاء التأكّد من تعبئة الحقول بشكلٍ صحيح.',
					okText: 'حسناً',
				});

				return;
		}

		// Get the started at datetime.
		var startedAt = moment($scope.parameters.startedAtDate, 'YYYY-MM-DDTHH:mm:ssZ');
		
		// Get the hours and minutes.
		var hoursMinutes = $scope.parameters.startedAtTime.split(':');

		// Update them.
		startedAt.hours(hoursMinutes[0]).minutes(hoursMinutes[1]).seconds(0);

		// Set the datetime to be formatted correctly.
		var isoStartDateTime = startedAt.toISOString(); //validator.toDate($scope.parameters.startedAt).toISOString();

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