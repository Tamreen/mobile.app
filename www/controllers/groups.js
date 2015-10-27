
//
tamreen.controller('GroupsController', function($scope, $rootScope, $state, $stateParams, $ionicPopup, $ionicActionSheet, TamreenService, ContactService){

	// Parameters.
	$scope.parameters = {};

	//
	$scope.groups = [];

	//
	$scope.group = null;

	//
	$rootScope.$on('groups.update', function(){
		$scope.fetchGroups();
	});

	//
	$scope.addGroup = function(){

		console.log('Adding a group has been called.');

		// Validate the input of the user.
		if (validator.isNull($scope.parameters.name) || validator.isNull($scope.parameters.name.trim())){

			$ionicPopup.alert({
				title: 'خطأ',
				template: 'الرجاء التأكّد من إدخال اسم المجموعة.',
				okText: 'حسنًا',
			});

			return;
		}

		// Try to add a group using the service.
		var promise = TamreenService.groupAdd($scope.parameters.name);

		// Check what the service promises.
		promise.then(function(response){

			// Redirect the user to the group players.
			$state.go('groups-details', {'id': response.data.id}, {reload: true});

			// Notify the list of groups to be updated.
			$rootScope.$emit('groups.update');

		}, function(response){
			TamreenService.helperHandleErrors(response);
		});
	};

	//
	$scope.updateGroup = function(id){

	};

	//
	// TODO: Do we need to specify the id of the group?
	$scope.addGroupPlayer = function(id){

		//
		return ContactService.pick()

		//
		.then(function(contact){
			return TamreenService.groupPlayerAdd(id, contact.e164formattedMobileNumber, contact.fullname);
		})

		//
		.then(function(response){

			$scope.fetchGroupDetails(id);
			$rootScope.$emit('groups.update');

		// TODO: The way that the error appear, it should be different.
		}, function(error){
			alert(error);
		});
	}

	//
	$scope.fetchGroups = function(){

		//
		return TamreenService.groupList()

		//
		.then(function(response){
			$scope.groups = response.data;
		});

		// TODO: Handle errors if they occur.
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
	$scope.elaborateGroupPlayer = function(id, playerId){

		// Check if the user is not an admin, then there is no action sheet.
		if ($scope.group.adminable == 0){
			return;
		}

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

			buttonClicked: function(index){

				if (index == 0){
					$scope.adminizeGroupPlayer(id, playerId);
				}

				return true;
			},

			destructiveButtonClicked: function(){
				$scope.deleteGroupPlayer(id, playerId);
				return true;
			},

		});
	};

	//
	$scope.adminizeGroupPlayer = function(id, playerId){

		console.log('Make a player an admin has been called.');

		// Check if the user is sure about deleting.
		var confirmPopup = $ionicPopup.confirm({
			title: 'إضافة لاعب إلى المدراء',
			template: 'هل أنت متأكّد من أنّك تريد إضافة اللاعب إلى المدراء؟',
			cancelText: 'لا',
			okText: 'نعم',
		});

		confirmPopup.then(function(yes){

			if(yes){

				// Try to list the groups using the service.
				var promise = TamreenService.groupPlayerAdminize(id, playerId);

				// Check what the service promises.
				promise.then(function(){

					// Fetch the group id details.
					$scope.fetchGroupDetails(id);

					// TODO: Maybe there is no need for this popup.
					$ionicPopup.alert({
						title: 'تمَ',
						template: 'تمّ إضافة اللاعب إلى المدراء بنجاح.',
						okText: 'حسنًا',
					});

					// Done.
					console.log('Making a player an admin has been done.');

				}, function(response){
					TamreenService.helperHandleErrors(response);
				});

			}else{
				console.log('Cancel making a player an admin.');
			}
		});

	};

	//
	$scope.deleteGroupPlayer = function(id, playerId){

		// TODO: Call the method to delete a group player.
		return;

	};

	//
	$scope.deleteGroup = function(id){
		// TODO:
	};

	//
	$scope.leaveGroup = function(id){
		// TODO:
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