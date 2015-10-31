
// var trainingEventsDefined = false;

//
tamreen.controller('TrainingsController', function($scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicActionSheet, $ionicHistory, TamreenService, LocationService, ContactService){

	console.log('TrainingsController has been initialized.');

	//
	$scope.specifiedTrainings = [];
	$scope.aroundTrainings = [];

	//
	$scope.training = null;

	//
	$scope.parameters = {};

	//
	$scope.parameters.coordinates = null;

	//
	$scope.groups = [];

	//
	$scope.morePoke = 'إرسال “يالله شباب”';
	$scope.moreProfessionalize = 'فتح الباب لجلب محترفين';
	$scope.morePublicize = 'فتح الباب للعموم';
	$scope.moreComplete = 'الاكتفاء بالعدد الحاليّ';
	$scope.moreCancel = 'إلغاء التمرين';
	$scope.morePlayerWillCome = 'سيحضر بإذن الله';
	$scope.morePlayerApologize = 'يعتذر عن الحضور';

	//
	// TODO: This one has to be fixed, it is being called too many times.
	// if (trainingEventsDefined == false){

		$rootScope.$on('pages.maps.choose', function(event, coordinates){

			console.log('pages.maps.choose called');

			var previousState = $ionicHistory.backView().stateName;

			if (previousState == 'trainings-add'){
				return $scope.parameters.coordinates = coordinates;
			}

			if (previousState == 'trainings-details'){
				//return $scope.parameters.coordinates = coordinates;
				alert('The coordinates should be set and the training should be publicized.');
			}
		});

	// 	trainingEventsDefined = true;
	// }

	// Set the locale of moment.
	moment.locale('ar-sa');

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

	//
	$scope.fetchUserGroups = function(){

		//
		return TamreenService.groupList()

		//
		.then(function(response){

			$scope.groups = [];

			response.data.forEach(function(group){
				if (group.adminable == 1){
					$scope.groups.push(group);
				}
			});

		}, function(response){
			TamreenService.helperHandleErrors(response);
		});
	}

	//
	$scope.addTraining = function(){

		console.log('Adding a training has been called.');

		$scope.parameters.groups = [];

		//
		for (i=0; i<$scope.groups.length; i++){
			if ($scope.groups[i].checked == true){
				$scope.parameters.groups.push($scope.groups[i].id);
			}
		}

		if (validator.isNull($scope.parameters.publicized)){
			$scope.parameters.publicized = false;
		}

		console.log($scope.parameters);

		// Validate the user inputs.
		if (validator.isNull($scope.parameters.stadium) || validator.isNull($scope.parameters.startedAtDate) || validator.isNull($scope.parameters.startedAtTime) || !validator.isNumeric($scope.parameters.playersCount) || $scope.parameters.playersCount <= 0 || ($scope.parameters.publicized == false && $scope.parameters.groups.length == 0)){

			return $ionicPopup.alert({
				title: 'خطأ',
				template: 'الرجاء التأكّد من تعبئة الحقول بشكلٍ صحيح.',
				okText: 'حسنًا',
			});
		}

		//
		if ($scope.parameters.publicized == 1 && (validator.isNull($scope.parameters.coordinates) || validator.isNull($scope.parameters.coordinates.x) || validator.isNull($scope.parameters.coordinates.y))){

			return $ionicPopup.alert({
				title: 'خطأ',
				template: 'الرجاء تحديد موقع الملعب الجغرافي ما دامت الدعوة عامّةً.',
				okText: 'حسنًا',
			});
		}

		// Get the started at datetime.
		var startedAt = moment($scope.parameters.startedAtDate, 'YYYY-MM-DDTHH:mm:ssZ');
		
		// Get the hours and minutes.
		var hoursMinutes = $scope.parameters.startedAtTime.split(':');

		// Update them.
		startedAt.hours(hoursMinutes[0]).minutes(hoursMinutes[1]).seconds(0);

		// Set the datetime to be formatted correctly.
		var isoStartDateTime = startedAt.toISOString(); //validator.toDate($scope.parameters.startedAt).toISOString();

		// Try to add a training using the service.
		var promise = TamreenService.trainingAdd({stadium: $scope.parameters.stadium, startedAt: isoStartDateTime, playersCount: $scope.parameters.playersCount, publicized: +$scope.parameters.publicized, coordinates: $scope.parameters.coordinates, groups: $scope.parameters.groups,});

		// Check what the service promises.
		promise.then(function(response){

			// Save the training information.
			$scope.training = response.data;

			// Redirect to the added training.
			// TODO: $scope.specifiedPullToRefresh();
			$state.go('trainings-details', {'id': $scope.training.id});

		}, function(response){
			TamreenService.helperHandleErrors(response);
		});
	};

	// TODO: What if an error occur.
	// TODO: Order the trainings by the one with the latest updates.
	$scope.fetchSpecifiedTrainings = function(){

		return TamreenService.trainingListSpecified()

		//
		.then(function(response){
			$scope.specifiedTrainings = response.data;
			$scope.updateBadgesEventTrigger();
		});

		// TODO: What if there is something went wrong.
	};

	//
	$scope.fetchAroundTrainings = function(){

		return LocationService.getCurrent()

		//
		.then(function(coordinates){
			console.log(coordinates);
			return TamreenService.trainingListAround(coordinates);
		})

		//
		.then(function(response){
			$scope.aroundTrainings = response.data;
			$scope.updateBadgesEventTrigger();

		// TODO: Handle all errors including permission errors.
		}, function(response){
			TamreenService.helperHandleErrors(response);
		});
	};

	//
	$scope.specifiedPullToRefresh = function(){

		// Truncate the trainings list.
		$scope.specifiedTrainings = [];

		//
		$scope.fetchSpecifiedTrainings();
		//
		$scope.$broadcast('scroll.refreshComplete');
	};

	// TODO:
	$scope.updateBadgesEventTrigger = function(){
		ionic.EventController.trigger('badges.update');
	};

	//
	// TODO: Handle the errors if any.
	$scope.fetchTrainingDetails = function(id){

		//
		return TamreenService.trainingDetails(id)

		//
		.then(function(response){

			$scope.training = response.data;

			//
			$scope.training.canDecide = true;
			$scope.training.summary = null;

			// Work on variable called 'canDecide'.
			if ($scope.training.status == 'canceled' || $scope.training.status == 'started' || $scope.training.status == 'completed'){
				$scope.training.canDecide = false;
			}

			var summaries = [];

			// Check if the training is allowing to bring professionals and is publicized.
			if ($scope.training.professionalized == 1){
				summaries.push('جلب المُحترفين');
			}

			//
			if ($scope.training.publicized == 1){
				summaries.push('مُشاركة العموم');
			}

			//
			if (summaries.length > 0){
				$scope.training.summary = summaries.join(' وَ ');
			}

		}, function(response){
			TamreenService.helperHandleErrors(response);
		});
	};

	//
	$scope.pullToRefreshTraining = function(id){

		// Fetch the training.
		$scope.fetchTrainingDetails(id);

		//
		$scope.$broadcast('scroll.refreshComplete');
	};

	//
	$scope.trainingMore = function(){

		// If the user cannot decide for this training.
		if ($scope.training.canDecide == false || $scope.training.adminable == 0){
			return;
		}

		//
		var buttonLabels = [];

		//
		if ($scope.training.status != 'gathering-completed'){
			buttonLabels.push({text: $scope.morePoke});
		}

		//
		if ($scope.training.professionalized == 0){
			buttonLabels.push({text: $scope.moreProfessionalize});
		}

		//
		if ($scope.training.publicized == 0){
			buttonLabels.push({text: $scope.morePublicize});
		}

		//
		if ($scope.training.status != 'gathering-completed' && $scope.training.willcomePlayersCount > 0){
			buttonLabels.push({text: $scope.moreComplete});
		}

		//
		buttonLabels.push({text: $scope.moreCancel});

		//
		$ionicActionSheet.show({

			buttons: buttonLabels,
			titleText: 'فيمَ تفكّر؟',
			cancelText: 'إلغاء',
			destructiveText: null,

			cancel: function(){

			},

			buttonClicked: function(index){

				//
				var selectedLabel = buttonLabels[index].text;

				//
				if (selectedLabel == $scope.morePoke){
					$scope.poke($scope.training.id);
				}

				//
				if (selectedLabel == $scope.moreProfessionalize){
					$scope.professionalize($scope.training.id);
				}

				//
				if (selectedLabel == $scope.morePublicize){
					$scope.publicize($scope.training.id);
				}

				//
				if (selectedLabel == $scope.moreComplete){
					$scope.complete($scope.training.id);
				}

				//
				if (selectedLabel == $scope.moreCancel){
					$scope.cancel($scope.training.id);
				}

				return true;
			}
		});
	};

	//
	$scope.playerMore = function(playerId, decision){

		if ($scope.training.canDecide == false || $scope.training.adminable == 0){
			return;
		}

		var buttonLabels = [];

		//
		if (decision == 'notyet' || decision == 'willcome'){
			buttonLabels.push({text: $scope.morePlayerApologize});
		}

		if (decision == 'notyet' || decision == 'apologize'){
			buttonLabels.push({text: $scope.morePlayerWillCome});
		}

		//
		$ionicActionSheet.show({

			buttons: buttonLabels,
			titleText: 'فيمَ يفكّر؟',
			cancelText: 'إلغاء',

			cancel: function(){

			},

			buttonClicked: function(index){

				//
				var selectedLabel = buttonLabels[index].text;

				//
				if (selectedLabel == $scope.morePlayerWillCome){
					$scope.decideForPlayerIdToCome($scope.training.id, playerId);
				}

				//
				if (selectedLabel == $scope.morePlayerApologize){
					$scope.decideForPlayerIdToApologize($scope.training.id, playerId);
				}	

				return true;
			}
		});
	};

	//
	$scope.willCome = function(id){

		console.log('Decision will come has been called.');

		// Try to list the groups using the service.
		var promise = TamreenService.trainingWillCome(id);

		// Check what the service promises.
		promise.then(function(){
			$scope.fetchTrainingDetails(id);
		}, function(response){
			TamreenService.helperHandleErrors(response);
		});
	};

	// Confirm this action.
	$scope.apologize = function(id){
		
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
				var promise = TamreenService.trainingApologize(id);

				// Check what the service promises.
				promise.then(function(){
					$scope.fetchTrainingDetails(id);
				}, function(response){
					TamreenService.helperHandleErrors(response);
				});
			}
		});
	};

	$scope.decideForPlayerIdToCome = function(id, playerId){

		//
		var promise = TamreenService.trainingAdminPlayerWillCome(id, playerId);

		// Check what the service promises.
		promise.then(function(){

			//
			$ionicPopup.alert({
				title: 'تم',
				template: 'تم تسجيل حضور اللاعب بنجاح.',
				okText: 'حسنًا',
			});

			$scope.fetchTrainingDetails(id);

		}, function(response){
			TamreenService.helperHandleErrors(response);
		});
	};

	$scope.decideForPlayerIdToApologize = function(id, playerId){

		//
		var confirmPopup = $ionicPopup.confirm({
			title: 'الاعتذار عن الحضور',
			template: 'هل أنت متأكّد من كون اللاعب يريد الاعتذار عن الحضور؟',
			cancelText: 'لا',
			okText: 'نعم',
			okType: 'button-assertive',
		});

		confirmPopup.then(function(yes){

			if(yes){

				// Try to list the groups using the service.
				var promise = TamreenService.trainingAdminPlayerApologize(id, playerId);

				// Check what the service promises.
				promise.then(function(){

					//
					$ionicPopup.alert({
						title: 'تم',
						template: 'تم تسجيل اعتذار اللاعب بنجاح.',
						okText: 'حسنًا',
					});

					//
					$scope.fetchTrainingDetails(id);

				}, function(response){
					TamreenService.helperHandleErrors(response);
				});
			}
		});
	};

	//
	$scope.poke = function(id){

		console.log('Poke has been called.');

		// 
		var promise = TamreenService.trainingPoke(id);

		// Check what the service promises.
		promise.then(function(){
			$scope.fetchTrainingDetails(id);
		}, function(response){
			TamreenService.helperHandleErrors(response);
		});
	};

	//
	$scope.professionalize = function(id){

		console.log('Professionalize has been called.');

		// 
		var promise = TamreenService.trainingProfessionalize(id);

		// Check what the service promises.
		promise.then(function(){
			$scope.fetchTrainingDetails(id);
		}, function(response){
			TamreenService.helperHandleErrors(response);
		});
	};

	//
	$scope.publicize = function(id){

		console.log('Publicize has been called.');

		// 
		var promise = TamreenService.trainingPublicize(id);

		// Check what the service promises.
		promise.then(function(){
			$scope.fetchTrainingDetails(id);
		}, function(response){

			if (!validator.isNull(response) && !validator.isNull(response.status) && response.status == 409){

				$state.go('pages-choosemap');

				//
				$ionicPopup.alert({
					title: 'معلومة',
					template: 'الرجاء تحديد الموقع الجغرافي للملعب ليتسنّى للعموم الحضور.',
					okText: 'حسنًا',
				});

			}else{
				TamreenService.helperHandleErrors(response);
			}

		});
	};

	//
	$scope.cancel = function(id){

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

				// 
				var promise = TamreenService.trainingCancel(id);

				// Check what the service promises.
				promise.then(function(){

					// TODO: $scope.specifiedPullToRefresh();
					$state.go('home.trainings');

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
	};

	//
	$scope.complete = function(id){

		console.log('Cancel the training has been called.');

		// Check if the user is sure about completing.
		var confirmPopup = $ionicPopup.confirm({
			title: 'إلغاء التمرين',
			template: 'هل أنت متأكّد من أنّك تريد الاكتفاء بالعدد الحاليّ؟',
			cancelText: 'لا',
			okText: 'نعم',
			okType: 'button-assertive',
		});

		confirmPopup.then(function(yes){

			if(yes){

				// 
				var promise = TamreenService.trainingComplete(id);

				// Check what the service promises.
				promise.then(function(){
					$scope.fetchTrainingDetails(id);
				}, function(response){
					TamreenService.helperHandleErrors(response);
				});

			}else{
				console.log('Training has not been completed.');
			}
		});
	};

	//
	$scope.bringProfessional = function(id){

		//
		return ContactService.pick()

		//
		.then(function(contact){
			return TamreenService.trainingBringProfessional(id, contact.e164formattedMobileNumber, contact.fullname);
		})

		//
		.then(function(response){
			$scope.fetchTrainingDetails(id);

		//
		}, function(response){
			TamreenService.helperHandleErrors(response);
		});
	};

	//
	switch ($state.current.name){

		case 'trainings-details':
			$scope.fetchTrainingDetails($stateParams.id);
		break;

		// TODO: There is an issue whith the coordinates.
		case 'trainings-add':
			console.log('trainings-add has been called.');
			console.log('parameters.coordinates', $scope.parameters.coordinates);
			$scope.fetchUserGroups();
		break;

		default:
			// console.log($state.current.name);
			//$scope.fetchSpecifiedTrainings();
		break;
	}

});