
// Pages controller.
starter.controller('PagesController', function($scope, $state, TamreenService){

	console.log('Pages controller has been initialized.');

	$scope.appVersion = TamreenService.appVersion;

});