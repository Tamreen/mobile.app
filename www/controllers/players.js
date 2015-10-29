
tamreen.controller('PlayersController', function($scope, $rootScope, $state, $q, TamreenService){

	//
	$scope.parameters = {};

	//
	$scope.firstUpdatePlayer = function(){

		console.log('$scope.firstUpdatePlayer');

		$scope.updatePlayerPromise()

		//
		.then(function(response){
			return TamreenService.helperSaveUserInfo(response.data);
		})

		//
		.then(function(){
			$state.go('home.trainings');
		//
		}, function(response){
			TamreenService.helperHandleErrors(response);
		});

	};

	//
	$scope.updatePlayer = function(){

		console.log('$scope.updatePlayer');

		$scope.updatePlayerPromise()

		//
		.then(function(response){
			return TamreenService.helperSaveUserInfo(response.data);
		})

		//
		.then(function(){
			$rootScope.$emit('users.update');
			$state.go('home.profile', {});

		//
		}, function(response){
			TamreenService.helperHandleErrors(response);
		});

	};

	//
	$scope.updatePlayerPromise = function(){

		//
		var deferred = $q.defer();

		// Validate the input of the user.
		if (validator.isNull($scope.parameters.fullname) || validator.isNull($scope.parameters.fullname.trim())){
			deferred.reject('الرجاء التأكّد من إدخال اسم المجموعة.');
		}else{
			deferred.resolve(TamreenService.playerUpdate({fullname: $scope.parameters.fullname}));
		}

		//
		return deferred.promise;
	};

	//
	if ($state.current.name == 'players-update'){
		$scope.parameters.fullname = TamreenService.user.fullname;
	}

});