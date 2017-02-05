// Ionic nyumbani App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'nyumbani' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'nyumbani.controllers' is found in controllers.js
var app = angular.module('nyumbani', ['ionic',
    'firebase',
    'ngCordova',
    'ngAnimate',
    'ngStorage',
    'ngColorThief',
    'ionicRipple',
    'uiGmapgoogle-maps',
    'nyumbani.controllers',
    'nyumbani.services',
    'nyumbani.utils',
    'nyumbani.filters',
    'nyumbani.vrview'
])
    .constant('FirebaseUrl', 'https://rsynyumbani.firebaseio.com/')
    .service('rootRef', ['FirebaseUrl', Firebase]);

app.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
    })


});

app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $compileProvider, $colorThiefProvider, uiGmapGoogleMapApiProvider) {

    $ionicConfigProvider.navBar.alignTitle('left');
    $ionicConfigProvider.tabs.position('top');
    
    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyD4nyZVhvzM9TKe2AToPDKlpCfj1sX-0Zw',
        libraries: 'geometry,drawing',
        mapTypeControl: false
    });
    
    $stateProvider
        .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'views/menu.html',
            controller: 'menuCtrl'
        })

        .state('app.messages', {
            url: '/messages',
            views: {
                'menuContent': {
                    templateUrl: 'views/messages.html',
                    controller: 'messagesCtrl'
                }
            }
        })

        .state('app.listings', {
            url: '/listings',
            views: {
                'menuContent': {
                    templateUrl: 'views/listings.html',
                    controller: 'listingsCtrl'
                }
            }
        })

        .state('app.profile', {
            url: '/profile/{uid}',
            views: {
                'menuContent': {
                    templateUrl: 'views/profile.html',
                    controller: 'profileCtrl'
                }
            }
        })

        .state('app.create', {
            url: '/create',
            views: {
                'menuContent': {
                    templateUrl: 'views/create.html',
                    controller: 'cvCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/listings');
});
