
//
tamreen.controller('TrainingsController', function($scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicActionSheet, TamreenService, LocationService){

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
	$rootScope.$on('pages.maps.choose', function(event, coordinates){
		$scope.parameters.coordinates = coordinates;
	});

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
			$scope.triggerBadgesRead();
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
			$scope.triggerBadgesRead();
		}, function(error){
			// TODO: Make this error prettier.
			alert('Error occur');
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
	$scope.triggerBadgesRead = function(){
		$rootScope.$emit('badges.update');
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
	$scope.more = function(){

		// If the user cannot decide for this training.
		if ($scope.training.canDecide == false){
			return;
		}

		//
		$ionicActionSheet.show({

			buttons: [
				{text: 'فتح الباب لجلب محترفين'},
				{text: 'جعل التمرين عامًا'},
				{text: 'نكز'},
			],

			destructiveText: 'إلغاء التمرين',
			titleText: 'فيمَ تفكّر؟',
			cancelText: 'إلغاء',

			cancel: function(){

			},

			buttonClicked: function(index) {
				return true;
			}
		});
	};

	//
	$scope.notyetPlayerMore = function(playerId){

		//
		$ionicActionSheet.show({

			buttons: [
				{text: 'سيحضر بإذن الله'},
				{text: 'يعتذر عن الحضور'},
			],

			titleText: 'فيمَ يفكّر محمّد الخالد؟',
			cancelText: 'إلغاء',

			cancel: function(){

			},

			buttonClicked: function(index) {
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

	//
	// if ($state.name == 'home.trainings'){
	// 	$scope.fethcSpecifiedTrainings();
	// }

	switch ($state.current.name){

		case 'trainings-details':
			$scope.fetchTrainingDetails($stateParams.id);
		break;

		case 'trainings-add':
			console.log('trainings-add has been called.');
			console.log('parameters.coordinates', $scope.parameters.coordinates);
			$scope.fetchUserGroups();
		break;

		default:
			$scope.fetchSpecifiedTrainings();
		break;
	}

});