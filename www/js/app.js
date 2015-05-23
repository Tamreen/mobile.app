
// Tamreen App.

// export ANDROID_HOME=/Users/hossamzee/android-sdk-macosx
// export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
// adb logcat

// Remove all plugins.
// rm -Rf platforms/*
// rm -Rf plugins/*
// cordova platform add ios android
// cordova build ios

// "https://github.com/forcedotcom/PushPlugin#unstable",

// TODO: If there is no internet connection, there should be handling.
// TODO: Logs should be canceled.

// cordova build --release
// jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keys/TamreenApp.keystore platforms/android/ant-build/CordovaApp-release-unsigned.apk TamreenApp
// /Users/hossamzee/android-sdk-macosx/build-tools/21.1.2/zipalign -v 4 platforms/android/ant-build/CordovaApp-release-unsigned.apk TamreenApp1.0.1.apk

var starter = angular.module('starter', ['ionic', 'ngCordova']);

// Run first.
starter.run(function($ionicPlatform, $rootScope, TamreenService, $ionicLoading){
  
  $ionicPlatform.ready(function(){

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    if(window.cordova && window.cordova.plugins.Keyboard){
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }

    if(window.StatusBar){
      StatusBar.styleDefault();
    }

  });

  // Show the loading.
  $rootScope.$on('loading:show', function(){
    $ionicLoading.show({template: 'لحظةً من فضلك...'});
  });

  // Hide the loading.
  $rootScope.$on('loading:hide', function(){
    $ionicLoading.hide();
  });

});

// From now filter.
starter.filter('fromNow', [
    '$filter', function($filter){
        return function(input){
          moment.locale('ar-sa');
          return moment(input).fromNow();
        };
    }
]);

// Arabic date.
starter.filter('arDate', [
    '$filter', function($filter){
        return function(input){
          moment.locale('ar-sa');
          return moment(input).format('DD MMMM YYYY، hh:mm a');
        };
    }
]);

// Routes and loading.
starter.config(function($stateProvider, $urlRouterProvider, $httpProvider){

  $httpProvider.interceptors.push(function($rootScope, $q){

    return {
      request: function(config){
        console.log(JSON.stringify(config)); // TODO: This line was for debugging matters.
        $rootScope.$broadcast('loading:show');
        return config;
      },
      requestError: function(rejection){
        console.log(JSON.stringify(rejection)); // TODO: This line was for debugging matters.
        $rootScope.$broadcast('loading:hide');
        return $q.reject(rejection);
      },
      response: function(response){
        console.log(JSON.stringify(response)); // TODO: This line was for debugging matters.
        $rootScope.$broadcast('loading:hide');
        return response;
      },
      responseError: function(rejection){
        console.log(JSON.stringify(rejection)); // TODO: This line was for debugging matters.
        $rootScope.$broadcast('loading:hide');
        return $q.reject(rejection);
      }
    }

  });

  // Set the default state url.
  // $urlRouterProvider.otherwise('/users/firsthandshake');

  $stateProvider

    // Page states.

    // About.
    .state('pages-about', {
      url: '/pages/about',
      templateUrl: 'templates/pages/about.html',
      controller: 'PagesController',
    })

    // Legal.
    .state('pages-feedback', {
      url: '/pages/feedback',
      templateUrl: 'templates/pages/feedback.html',
      controller: 'PagesController',
    })

    // User states.

    // First hand shake.
    .state('users-firsthandshake', {
      url: '/users/firsthandshake',
      templateUrl: 'templates/users/firsthandshake.html',
      controller: 'UsersController',
    })

    // Second hand shake.
    .state('users-secondhandshake', {
      url: '/users/secondhandshake',
      templateUrl: 'templates/users/secondhandshake.html',
      controller: 'UsersController'
    })

    // Update.
    .state('players-update', {
      url: '/players/update',
      templateUrl: 'templates/players/update.html',
      controller: 'PlayersController'
    })

    // Group states.

    // List.
    .state('groups-list', {
      url: '/groups',
      templateUrl: 'templates/groups/list.html',
      controller: 'GroupsController',
      cache: false,
    })

    // Add.
    .state('groups-add', {
      url: '/groups/add',
      templateUrl: 'templates/groups/add.html',
      controller: 'GroupsController'
    })

    // List players.
    .state('groups-players-list', {
      url: '/groups/:groupId/players',
      templateUrl: 'templates/groups/players/list.html',
      controller: 'GroupsController',
      cache: false,
    })

    // Training states.

    // List.
    .state('trainings-list', {
      url: '/groups/:groupId/trainings',
      templateUrl: 'templates/trainings/list.html',
      controller: 'TrainingsController',
      cache: false,
    })

    // Add.
    .state('trainings-add', {
      url: '/groups/:groupId/trainings/add',
      templateUrl: 'templates/trainings/add.html',
      controller: 'TrainingsController'
    })

    // Details.
    .state('trainings-details', {
      url: '/trainings/:trainingId',
      templateUrl: 'templates/trainings/details.html',
      controller: 'TrainingsController',
    })

    // Activity states.

    // List.
    .state('activities-list', {
      url: '/trainings/:trainingId/activities',
      templateUrl: 'templates/activities/list.html',
      controller: 'ActivitiesController',
      cache: false,
    })

});