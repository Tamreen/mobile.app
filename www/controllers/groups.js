
//
tamreen.controller('GroupsController', function($scope){

	//
	$scope.groups = [];

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

	}

});