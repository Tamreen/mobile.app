
// Tabs controller.
starter.controller('TabsController', function($scope, $state){

	// Trainings.
	$scope.specifiedTrainings = [];
	$scope.aroundTrainings = [];

	// Groups.
	$scope.groups = [];

	// Profile.
	$scope.profile = {};

	// Trainings pull to refresh.
	$scope.trainingsPullToRefresh = function(){

		// Truncate the trainings list.
		$scope.specifiedTrainings = [];
		$scope.aroundTrainings = [];

		//
		$scope.specifiedTrainings.push({id: 1, name: 'الرياض، السليّ، ملاعب الشرق', status: 'gathering', activitiesCount: 1, startedAt: new Date()});
		$scope.specifiedTrainings.push({id: 2, name: 'الرياض، الإزدهار، ملاعب الروّاد', status: 'completed', activitiesCount: 1, startedAt: new Date()});
		$scope.specifiedTrainings.push({id: 3, name: 'البدائع، الأندلس، هاتريك', status: 'canceled', activitiesCount: 1, startedAt: new Date()});

		//
		$scope.aroundTrainings.push({id: 3, name: 'الرياض، الإزدهار، ملاعب الروّاد', status: 'gathering', activitiesCount: 1, startedAt: new Date(), });

		$scope.$broadcast('scroll.refreshComplete');

	}

	// Groups pull to refresh.
	$scope.groupsPullToRefresh = function(){

		//
		$scope.groups = [];

		//
		$scope.groups.push({id: 1, name: 'لعب الليقا', playersCount: 43,});
		$scope.groups.push({id: 2, name: 'لعب حيّ الريّان', playersCount: 37,});
		$scope.groups.push({id: 3, name: 'لعب هاتريك القصيم', playersCount: 29,});

		$scope.$broadcast('scroll.refreshComplete');
	}

});