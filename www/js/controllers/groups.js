
// Groups controller.
starter.controller('GroupsController', function($ionicHistory, $scope, $state, $stateParams, $cordovaContacts, $ionicPopup, $ionicActionSheet, TamreenService){

	console.log('Groups controller has been initialized.');

	// Parameters.
	$scope.parameters = {};

	// Groups.
	$scope.groups = [];

	// Players.
	$scope.players = [];

	// Chosen group and/or player.
	$scope.group = null;
	$scope.player = null;

	$scope.list = function(){

		console.log('List groups has been called.');

		// Try to list the groups using the service.
		var promise = TamreenService.groupList();

		// Check what the service promises.
		promise.then(function(response){
			$scope.groups = response.data;
		}, function(response){
			$ionicPopup.alert({
				title: 'خطأ',
				template: 'يبدو أنّ هناك خطأٌ ما في جلب المجموعات، حاول مرّة أخرى تكرّمًا.',
				okText: 'حسنًا',
			});
		});
	}

	$scope.fetchUpdates = function(){

		// This function could act like list() function.
		console.log('Fetching updates has been called.');

		// Call another method that make all that.
		$scope.list();

		// Okay, every this is done.
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.add = function(){

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

			// Normalize the history.
			// $ionicHistory.clearHistory();

			// Redirect the user to the group players.
			$state.go('groups-players-list', {'groupId': response.data.id});

		}, function(response){

			$ionicPopup.alert({
				title: 'خطأ',
				template: 'يبدو أنّ هناك خطأٌ ما عند إضافة مجموعة، حاول مرّة أخرى تكرّمًا.',
				okText: 'حسنًا',
			});
		});
	}

	$scope.playersBack = function(){
		$state.go('groups-list');
	}

	$scope.listPlayers = function(groupId){

		console.log('List players has been called.');

		// Try to list the groups using the service.
		var promise = TamreenService.groupPlayerList(groupId);

		// Check what the service promises.
		promise.then(function(response){
			$scope.players = response.data;
		}, function(response){
			$ionicPopup.alert({
				title: 'خطأ',
				template: 'يبدو أنّ هناك خطأٌ ما عند جلب اللاعبين، حاول مرّة أخرى تكرّمًا.',
				okText: 'حسنًا',
			});
		});
	}

	$scope.playerMore = function(playerId){

		if ($scope.group.adminable == false){
			return;
		}

		var buttonLabels = [{text: 'إضافة اللاعب إلى المدراء'}, {text: 'حذف اللاعب من المجموعة'}];

		var hideSheet = $ionicActionSheet.show({

	     	buttons: buttonLabels,
	     	titleText: 'فيمَ تفكّر؟',
	     	cancelText: 'إلغاء',
	     	destructiveText: null,

	     	cancel: function() {
	          // Add cancel code here.
	        },

	     	buttonClicked: function(index){

		    	if (index == 0){
		       		$scope.adminizePlayer(playerId);
		       }
		       else if (index == 1){
		       		$scope.deletePlayer(playerId);
		       }

		       	// Not sure why this returns.
	       		return true;
	     	}
   		});
	}

	$scope.fetchPlayerUpdates = function(groupId){

		// This function could act like list() function.
		console.log('Fetching updates has been called.');

		// Call another method that does all that.
		$scope.listPlayers(groupId);

		// Okay, every this is done.
		$scope.$broadcast('scroll.refreshComplete');
	}

	$scope.addPlayer = function(groupId){

		$cordovaContacts.pickContact().then(function(contact){

			// Validate if the chosen contact have a mobile number.
			// TODO: There is an issue when the phone number is missing.
			if (validator.isNull(contact.phoneNumbers) || contact.phoneNumbers.length == 0 || TamreenService.helperMobileNumberValidable(contact.phoneNumbers[0].value) == false || validator.isNull(contact.name.formatted)){

				$ionicPopup.alert({
					title: 'خطأ',
					template: 'الرجاء التأكّد من اختيار اسم لاعبٍ لديه رقم جوّال صحيح.',
					okText: 'حسنًا',
				});

				return;
			}

			// Set the e164 formatted mboile number and the name of the player.
			var e164formattedMobileNumber = TamreenService.helperMobileNumberE164Format(contact.phoneNumbers[0].value);
			var fullname = contact.name.formatted;

			// Great!
			console.log('Getting the mobile number ' + e164formattedMobileNumber);

			// Try to list the groups using the service.
			var promise = TamreenService.groupPlayerAdd(groupId, e164formattedMobileNumber, fullname);

			// Check what the service promises.
			
			promise.then(function(response){

				$scope.players.push(response.data);

				// Done.
				console.log('Adding a player has been done.');

			}, function(response){

				$ionicPopup.alert({
					title: 'خطأ',
					template: 'يبدو أنّ هناك خطأٌ ما عند إضافة اللاعب، حاول مرّة أخرى تكرّمًا.',
					okText: 'حسنًا',
				});
			});

		}, function(failure){

			// Contact error.
			console.log('Adding player has been canceled.');

        });
	}

	// Admin function.
	// Delete a player in a group.
	$scope.deletePlayer = function(playerId){

		console.log('Delete a player has been called.');

		// Check if the user is sure about deleting.
		var confirmPopup = $ionicPopup.confirm({
			title: 'حذف اللاعب',
			template: 'هل أنت متأكّد من أنّك تريد حذف اللاعب؟',
			cancelText: 'لا',
			okText: 'نعم',
			okType: 'button-assertive',
		});

		confirmPopup.then(function(yes){

			if(yes){

				// Try to list the groups using the service.
				var promise = TamreenService.groupPlayerDelete(playerId, $scope.group.id);

				// Check what the service promises.
				promise.then(function(){

					$scope.listPlayers($scope.group.id);
					$state.go('groups-players-list');

					$ionicPopup.alert({
						title: 'تمَ',
						template: 'تمً حذف اللاعب من المجموعةِ بنجاح.',
						okText: 'حسنًا',
					});

					// Done.
					console.log('Deleting a player has been done.');

				}, function(response){
					TamreenService.helperHandleErrors(response);
				});

			}else{
				console.log('Cancel deleting the player.');
			}
		});
	}

	// Admin function.
	// Make a player an admin.
	$scope.adminizePlayer = function(playerId){

		console.log('Mak a player an admin has been called.');

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
				var promise = TamreenService.groupPlayerAdminimize(playerId, $scope.group.id);

				// Check what the service promises.
				promise.then(function(){

					$scope.listPlayers($scope.group.id);
					$state.go('groups-players-list');

					$ionicPopup.alert({
						title: 'تمَ',
						template: 'تمً إضافة اللاعب إلى المدراء بنجاح.',
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
	}

	// TODO: Confirm if the user wants to log out.
	$scope.logoutUser = function(){

		var confirmPopup = $ionicPopup.confirm({
			title: 'تسجيل الخروج',
			template: 'هل أنت متأكّد من أنّك تريد تسجيل الخروج؟',
			cancelText: 'لا',
			okText: 'نعم',
			okType: 'button-assertive',
		});

		confirmPopup.then(function(yes){

			if(yes){

				var promise = TamreenService.userLogout();

				// Check what the service promises.
				promise.then(function(response){
					TamreenService.helperUserForgetInfo();
				}, function(response){
					TamreenService.helperUserForgetInfo();
				});

				// Anyway, it means let the user log out.
				// $ionicHistory.clearHistory();

				// Disable the back button.
				$ionicHistory.nextViewOptions({
		  			disableBack: true,
		  			disableAnimate: true,
				});

				$state.go('users-firsthandshake');

				$ionicPopup.alert({
					title: 'تم',
					template: 'تمّ تسجيل الخروج بنجاح.',
					okText: 'حسنًا',
				});
			}
		});
	};

	// More.
	$scope.more = function(){

		console.log('Group more has been called.');

		var buttonLabels = [{text: 'حول التطبيق'}, {text: 'تسجيل الخروج'}];

		var hideSheet = $ionicActionSheet.show({

	     	buttons: buttonLabels,
	     	titleText: 'تعرّف على التطبيق أكثر.',
	     	cancelText: 'إلغاء',
	     	destructiveText: null,

	     	cancel: function() {
	          // Add cancel code here.
	        },

	     	buttonClicked: function(index){

		    	if (index == 0){
		       		$state.go('pages-about');
		       }
		       else if (index == 1){
		       		$scope.logoutUser();
		       }

		       	// Not sure why this returns.
	       		return true;
	     	}
   		});
	}

	// Define a group if any.
	if ($stateParams.groupId){

		// Try to get the group using the service.
		var promise = TamreenService.groupDetails($stateParams.groupId);

		// Check what the service promises.
		promise.then(function(response){

			// Save the current group.
			$scope.group = response.data;

			// Load data or do not.
			if ($state.current.name == 'groups-players-list'){
				$scope.listPlayers($scope.group.id);
			}

		}, function(response){
			console.log('There is an error when getting a group details.');
		});
	}

	// Define a player if any.
	if ($stateParams.playerId){
		// Get the player information from the service (if needed).
		$scope.player = {id: $stateParams.playerId};
	}

	// Load data or do not.
	if ($state.current.name == 'groups-list'){
		$scope.list();
	}

});