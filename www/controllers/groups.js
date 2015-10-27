
//
tamreen.controller('GroupsController', function($scope, $state, $stateParams, $ionicActionSheet, TamreenService){

	//
	$scope.groups = [];

	//
	$scope.group = null;

	// //
	// $scope.group = {

	// 	// 
	// 	id: 12,
	// 	name: 'لعب الليقا',
	// 	createdAt: new Date(),
	// 	adminable: true,

	// 	//
	// 	players: [
	// 		{id: 1, fullname: 'محمد الخالد', role: 'admin', joinedAt: new Date(), },
	// 		{id: 2, fullname: 'خالد الموسى', role: 'member', joinedAt: new Date(), },
	// 		{id: 3, fullname: 'فهد الفهد', role: 'member', joinedAt: new Date(), },
	// 		{id: 4, fullname: 'عبدالعزيز الصالح', role: 'member', joinedAt: new Date(), },
	// 		{id: 5, fullname: 'صالح الإبراهيم', role: 'member', joinedAt: new Date(), },
	// 		{id: 6, fullname: 'سليمان الحمد', role: 'member', joinedAt: new Date(), },
	// 		{id: 7, fullname: 'محمد المحمد', role: 'member', joinedAt: new Date(), },
	// 		{id: 8, fullname: 'إبراهيم العلي', role: 'member', joinedAt: new Date(), },
	// 		{id: 9, fullname: 'علي الوائل', role: 'member', joinedAt: new Date(), },
	// 		{id: 10, fullname: 'هاشم المحمد', role: 'member', joinedAt: new Date(), },
	// 	],
	// };

	//
	$scope.fetchGroups = function(){

		//
		return TamreenService.groupList()

		//
		.then(function(response){
			$scope.groups = response.data;
		});

	};

	//
	$scope.fetchGroupDetails = function(id){

		//
		return TamreenService.groupDetails(id)

		//
		.then(function(response){
			$scope.group = response.data;
		});

	};

	//
	$scope.pullToRefresh = function(){

		// Fetch the groups.
		$scope.fetchGroups();

		//
		$scope.$broadcast('scroll.refreshComplete');
	};

	//
	$scope.playerMore = function(){

		//
		$ionicActionSheet.show({

			buttons: [
				{text: 'إضافة اللاعب إلى المُدراء'},
			],

			destructiveText: 'حذف اللاعب من المجموعة',
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
	switch ($state.current.name){

		case 'groups-details':
			$scope.fetchGroupDetails($stateParams.id);
		break;

		default:
			$scope.fetchGroups();
		break;

	}

});