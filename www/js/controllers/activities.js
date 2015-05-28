
// Activities controller.
starter.controller('ActivitiesController', function($scope, $rootScope, $state, $stateParams, $ionicActionSheet, $ionicPopup, $ionicScrollDelegate, TamreenService){

	console.log('Activities controller has been initialized.');

	// Parameters.
	$scope.parameters = {};

	// Training.
	$scope.training = null;

	// Activities.
	$scope.activities = [];

	// Arabic actions.
	$scope.actionWillcome = 'سأحضر بإذن الله';
	$scope.actionApologize = 'أعتذر عن الحضور';
	$scope.actionBringProfessional = 'جلب لاعب محترف';
	$scope.actionDetails = 'تفاصيل التمرين';
	$scope.actionCancel = 'إلغاء التمرين'; 

	$scope.activitiesBack = function(groupId){
		$state.go('trainings-list', {'groupId': groupId});
	}

	$scope.list = function(trainingId){

		console.log('List activities has been called.');

		// Try to list the groups using the service.
		var promise = TamreenService.activityList(trainingId);

		// Check what the service promises.
		promise.then(function(response){
			$scope.activities = response.data;
			$ionicScrollDelegate.scrollBottom(true);
		}, function(response){
			TamreenService.helperHandleErrors(response);
		});
	}

	$scope.fetchUpdates = function(trainingId){

		// This function could act like list() function.
		console.log('Fetching updates has been called.');

		// Call another method that make all that.
		$scope.list(trainingId);

		// Okay, every this is done.
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.more = function(){

		// console.log('Activities more has been called.');

		// var buttonLabels = [{text: 'سأحضر بإذن الله'}, {text: 'أعتذر عن الحضور'}];

		// // Check if the user is admin of the training.
		// if ($scope.training.adminable)
		// {
		// 	buttonLabels.push({text: 'إلغاء التمرين'});
		// }

		//
		var buttonLabels = [];

		//
		if ($scope.training.playerDecision == 'notyet'){
			buttonLabels.push({text: $scope.actionWillcome});
			buttonLabels.push({text: $scope.actionApologize});
		}

		//
		if ($scope.training.playerDecision == 'willcome' || $scope.training.playerDecision == 'register-as-subset'){
			buttonLabels.push({text: $scope.actionApologize});
		}

		//
		if ($scope.training.playerDecision == 'apologize'){
			buttonLabels.push({text: $scope.actionWillcome});
		}

		//
		if ($scope.training.professionalable){
			buttonLabels.push({text: $scope.actionBringProfessional});
		}

		//
		buttonLabels.push({text: $scope.actionDetails});

		//
		if ($scope.training.adminable){
			buttonLabels.push({text: $scope.actionCancel});
		}

		var hideSheet = $ionicActionSheet.show({

	     	buttons: buttonLabels,
	     	titleText: 'فيمَ تفكّر؟',
	     	cancelText: 'إلغاء',
	     	destructiveText: null,

	     	cancel: function(){
	          // add cancel code.
	        },

	     	buttonClicked: function(index){

				//
				var selectedLabel = buttonLabels[index].text;

				// #/trainings/{{training.id}}

				//
				if (selectedLabel == $scope.actionWillcome){
					$scope.willCome($scope.training.id);
				}

				//
				if (selectedLabel == $scope.actionApologize){
					$scope.apologize($scope.training.id);
				}

				//
				if (selectedLabel == $scope.actionBringProfessional){
					alert('actionBringProfessional');
				}

				//
				if (selectedLabel == $scope.actionDetails){
					$state.go('trainings-details', {trainingId: $scope.training.id});
				}

				//
				if (selectedLabel == $scope.actionCancel){
					$scope.cancel($scope.training.id);
				}

		       	// Not sure why.
	       		return true;
	     	}
   		});
	}

	$scope.willCome = function(trainingId){

		console.log('Decision will come has been called.');

		// Try to list the groups using the service.
		var promise = TamreenService.trainingWillCome(trainingId);

		// Check what the service promises.
		promise.then(function(response){

			// Do refresh the activities.
			$scope.list(trainingId);
			$scope.updateTraining(trainingId);

		}, function(response){
			TamreenService.helperHandleErrors(response);
		});
	}

	// Confirm this action.
	$scope.apologize = function(trainingId){
		
		console.log('Decision apologize has been called.');

		// Check if the user is sure about deleting.
		var confirmPopup = $ionicPopup.confirm({
			title: 'الاعتذار عن الحضور',
			template: 'هل أنت متأكّد من أنّك تريد الاعتذار عن الحضور؟',
			cancelText: 'لا',
			okText: 'نعم',
			okType: 'button-assertive',
		});

		confirmPopup.then(function(yes){

			if(yes){

				// Try to list the groups using the service.
				var promise = TamreenService.trainingApologize(trainingId);

				// Check what the service promises.
				promise.then(function(response){

					// Do refresh the activities.
					$scope.list(trainingId);
					$scope.updateTraining(trainingId);

				}, function(response){
					TamreenService.helperHandleErrors(response);
				});
			}
		});
	}

	//
	$scope.cancel = function(trainingId){

		console.log('Cancel the training has been called.');

		// Check if the user is sure about deleting.
		var confirmPopup = $ionicPopup.confirm({
			title: 'إلغاء التمرين',
			template: 'هل أنت متأكّد من أنّك تريد إلغاء التمرين؟',
			cancelText: 'لا',
			okText: 'نعم',
			okType: 'button-assertive',
		});

		confirmPopup.then(function(yes){

			if(yes){

				// Try to list the groups using the service.
				var promise = TamreenService.trainingCancel(trainingId);

				// Check what the service promises.
				promise.then(function(response){

					$state.go('trainings-list', {'groupId': $scope.training.groupId});

					$ionicPopup.alert({
						title: 'تم',
						template: 'تمّ إلغاء التمرين.',
						okText: 'حسنًا',
					});

				}, function(response){
					TamreenService.helperHandleErrors(response);
				});

			}else{
				console.log('Training has not been canceled.');
			}
		});
	}

	//
	$scope.updateTraining = function(trainingId){

		var promise = TamreenService.trainingDetails($stateParams.trainingId);

		promise.then(function(response){

			// Save the current training.
			$scope.training = response.data;

		}, function(response){
			console.log('There is an error when getting a training details.');
		});
	}

	// Define a training if any.
	if ($stateParams.trainingId){

		// Try to get the training using the service.
		var promise = TamreenService.trainingDetails($stateParams.trainingId);

		// Check what the service promises.
		promise.then(function(response){

			// Save the current training.
			$scope.training = response.data;

			// Load data or do not.
			if ($state.current.name == 'activities-list'){

				$scope.list($stateParams.trainingId);

				// When receive a notification, update the current activity.
				// $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification){

				// 	switch(notification.event){
				// 		case 'message':
				// 			$scope.fetchUpdates($stateParams.trainingId);
				// 		break;
				// 	}
				// });
			}

		}, function(response){
			console.log('There is an error when getting a training details.');
		});
	}

});