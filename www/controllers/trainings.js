
//
tamreen.controller('TrainingsController', function($scope, $ionicActionSheet, TamreenService, LocationService){

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
	$scope.fethcSpecifiedTrainings = function(){

		return TamreenService.trainingListSpecified()

		//
		.then(function(response){

			//console.log(response.data);
			$scope.specifiedTrainings = response.data;
			$scope.triggerBadgesRead();
		});

	};

	//
	$scope.fethcAroundTrainings = function(){

		// return TamreenService.trainingListSpecified()

		// //
		// .then(function(response){

		// 	//console.log(response.data);
		// 	$scope.specifiedTrainings = response.data;
		// 	$scope.triggerBadgesRead();
		// });

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
		ionic.EventController.trigger('badges.update', {trainings: 2, groups: 0, profile: 0,});
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
	$scope.fethcSpecifiedTrainings();

});