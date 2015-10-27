
//
tamreen.controller('TrainingsController', function($scope, $rootScope, $state, $stateParams, $ionicActionSheet, TamreenService, LocationService){

	console.log('TrainingsController has been initialized.');

	//
	$scope.specifiedTrainings = [];
	$scope.aroundTrainings = [];

	//
	$scope.training = {

		//
		id: 13,
		status: 'gathering',
		adminable: true,
		startedAt: new Date(),
		stadium: 'ملعب الإبداع',

		//
		willcomePlayers: [
			{id: 1, fullname: 'محمد الخالد', decidedAt: new Date(), },
			{id: 2, fullname: 'خالد الموسى', decidedAt: new Date(), },
			{id: 3, fullname: 'فهد الفهد', decidedAt: new Date(), },
			{id: 4, fullname: 'عبدالعزيز الصالح', decidedAt: new Date(), },
		],

		//
		apologizePlayers: [
			{id: 5, fullname: 'عبدالعزيز الصالح', decidedAt: new Date(), },
		],

		//
		notyetPlayers: [
			{id: 6, fullname: 'محمد الخالد', decidedAt: new Date(), },
			{id: 7, fullname: 'خالد الموسى', decidedAt: new Date(), },
			{id: 8, fullname: 'فهد الفهد', decidedAt: new Date(), },
		],
	};

	// TODO: What if an error occur.
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

			return TamreenService.trainingListAround(coordinates)

			//
			.then(function(response){
				$scope.aroundTrainings = response.data;
				$scope.triggerBadgesRead();
			})

		}, function(error){

			alert('Error occur');
		});

	};

	//
	$scope.specifiedPullToRefresh = function(){

		// Truncate the trainings list.
		$scope.specifiedTrainings = [];

		//
		$scope.fethcSpecifiedTrainings();
		//
		$scope.$broadcast('scroll.refreshComplete');

	};

	// TODO:
	$scope.triggerBadgesRead = function(){
		$rootScope.$emit('badges.update');
	}

	//
	$scope.getTrainingDetails = function(id){
		
	}

	//
	$scope.more = function(){

		//
		$ionicActionSheet.show({

			buttons: [
				{text: 'فتح الباب لجب محترفين'},
				{text: 'جعل التمرين عامًا'},
				{text: 'وكز'},
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
	// if ($state.name == 'home.trainings'){
	// 	$scope.fethcSpecifiedTrainings();
	// }
	switch ($state.name){

		case 'trainings-details':
			$scope.getTrainingDetails($stateParams.id);
		break;

		default:
			$scope.fetchSpecifiedTrainings();
		break;

	}

});