
//
tamreen.controller('TrainingsController', function($scope, $ionicActionSheet){

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

	//
	$scope.specifiedPullToRefresh = function(){

		// Truncate the trainings list.
		$scope.specifiedTrainings = [];

		//
		$scope.specifiedTrainings.push({id: 1, name: 'الرياض، السليّ، ملاعب الشرق', status: 'gathering', percentage: 80, startedAt: new Date(), });
		$scope.specifiedTrainings.push({id: 2, name: 'الرياض، الإزدهار، ملاعب الروّاد', status: 'completed', percentage: 43, startedAt: new Date(), });
		$scope.specifiedTrainings.push({id: 3, name: 'البدائع، جادّة الجماميل، هاتريك', status: 'canceled', percentage: 21, startedAt: new Date(), });

		//
		$scope.$broadcast('scroll.refreshComplete');

	};

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

	}

});