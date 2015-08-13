
//
tamreen.controller('TrainingsController', function($scope){

	console.log('TrainingsController has been initialized.');

	//
	$scope.specifiedTrainings = [];
	$scope.aroundTrainings = [];

	$scope.specifiedTrainingsPullToRefresh = function(){

		// Truncate the trainings list.
		$scope.specifiedTrainings = [];

		//
		$scope.specifiedTrainings.push({id: 1, name: 'الرياض، السليّ، ملاعب الشرق', status: 'gathering', startedAt: new Date()});
		$scope.specifiedTrainings.push({id: 2, name: 'الرياض، الإزدهار، ملاعب الروّاد', status: 'completed', startedAt: new Date()});
		$scope.specifiedTrainings.push({id: 3, name: 'البدائع، جادّة الجماميل، هاتريك', status: 'canceled', startedAt: new Date()});

		//
		$scope.$broadcast('scroll.refreshComplete');	

	}

});