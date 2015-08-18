
//
tamreen.controller('GroupsController', function($scope, $ionicActionSheet){

	//
	$scope.groups = [];

	//
	$scope.group = {

		// 
		id: 12,
		name: 'لعب الليقا',
		createdAt: new Date(),
		adminable: true,

		//
		players: [
			{id: 1, fullname: 'محمد الخالد', role: 'admin', joinedAt: new Date(), },
			{id: 2, fullname: 'خالد الموسى', role: 'member', joinedAt: new Date(), },
			{id: 3, fullname: 'فهد الفهد', role: 'member', joinedAt: new Date(), },
			{id: 4, fullname: 'عبدالعزيز الصالح', role: 'member', joinedAt: new Date(), },
			{id: 5, fullname: 'صالح الإبراهيم', role: 'member', joinedAt: new Date(), },
			{id: 6, fullname: 'سليمان الحمد', role: 'member', joinedAt: new Date(), },
			{id: 7, fullname: 'محمد المحمد', role: 'member', joinedAt: new Date(), },
			{id: 8, fullname: 'إبراهيم العلي', role: 'member', joinedAt: new Date(), },
			{id: 9, fullname: 'علي الوائل', role: 'member', joinedAt: new Date(), },
			{id: 10, fullname: 'هاشم المحمد', role: 'member', joinedAt: new Date(), },
		],
	};

	//
	$scope.pullToRefresh = function(){

		//
		$scope.groups = [];

		//
		$scope.groups.push({id: 1, name: 'لعب الليقا', playersCount: 43, });
		$scope.groups.push({id: 2, name: 'لعب حيّ الريّان', playersCount: 37, });
		$scope.groups.push({id: 3, name: 'لعب هاتريك القصيم', playersCount: 29, });

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

});