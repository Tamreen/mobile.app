
//
tamreen.factory('ContactService', function($q, $injector, $ionicPlatform, TamreenService){

	console.log('ContactService has been called.');

	//
	var service = {};

	//
	service.contact = null;

	//
	// The validation should be here.
	service.pick = function(){

		console.log('service.pick has been called.');

		//
		var deferred = $q.defer();

		if (configs.environment == 'development'){

			// Make a dummy contact.
			service.contact = {
				fullname: Math.floor(Math.random()*9000000) + 1000000,
				e164formattedMobileNumber: '+96655' + (Math.floor(Math.random()*9000000) + 1000000),
			};

			//
			deferred.resolve(service.contact);

		}else{

			// If the environment is not development.
			$ionicPlatform.ready(function(){

				$cordovaContacts = $injector.get('$cordovaContacts');

				//
				$cordovaContacts.pickContact()

				//
				.then(function(contact){

					// Validate if the chosen contact have a mobile number.
					if (validator.isNull(contact.phoneNumbers) || contact.phoneNumbers.length == 0 || TamreenService.helperMobileNumberValidable(contact.phoneNumbers[0].value) == false || validator.isNull(contact.name.formatted)){
						return deferred.reject('Cannot pick this contact.');
					}

					// Set the e164 formatted mboile number and the name of the player.
					var e164formattedMobileNumber = TamreenService.helperMobileNumberE164Format(contact.phoneNumbers[0].value);
					var fullname = contact.name.formatted;

					//
					service.contact = {
						fullname: fullname,
						e164formattedMobileNumber: e164formattedMobileNumber,
					};

					console.log('contact', e164formattedMobileNumber);

					//
					deferred.resolve(service.contact);

				}, function(error){
					deferred.reject('لا يُمكن الوصول إلى جهات الإتصال.');
				});

			});
		}

		//
		return deferred.promise;
	};

	//
	return service;
});