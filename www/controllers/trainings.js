
//
tamreen.controller('TrainingsController', function($scope){

	console.log('TrainingsController has been initialized.');

	//
	$scope.specifiedTrainings = [];
	$scope.aroundTrainings = [];

	//
	$scope.training = {
		
	};

	$scope.specifiedPullToRefresh = function(){

		// Truncate the trainings list.
		$scope.specifiedTrainings = [];

		//
		$scope.specifiedTrainings.push({id: 1, name: 'الرياض، السليّ، ملاعب الشرق', status: 'gathering', percentage: 80, startedAt: new Date(), });
		$scope.specifiedTrainings.push({id: 2, name: 'الرياض، الإزدهار، ملاعب الروّاد', status: 'completed', percentage: 43, startedAt: new Date(), });
		$scope.specifiedTrainings.push({id: 3, name: 'البدائع، جادّة الجماميل، هاتريك', status: 'canceled', percentage: 21, startedAt: new Date(), });

		//
		$scope.$broadcast('scroll.refreshComplete');

	}

});