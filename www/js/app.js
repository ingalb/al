var P_ID = 1;
var EKIPI_ID = 87;
var URL_APP = "http://vllaznia.cloudcontrolled.com/";

// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var albania = angular.module('albania', ['ionic', 'albania.services', 'albania.controllers', 'easypiechart', 'ngSanitize', 'admobModule'])
//angular.module('starter', ['angular-carousel'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
   try{

        ga_storage._setAccount('UA-2341193-x');
        ga_storage._trackPageview('#/app/appJS', 'Albania App load');
       //ga_storage._trackPageview('#/app/klasifikimi', 'Vllaznia App klasifikimi');

var ad_units = {
    ios : {
        banner:"32016490754_10152997301780755",
        interstitial:"32016490754_10152997301780755"
    },
    android : {
        banner:"32016490754_10152997570155755",
        interstitial:"32016490754_10152997301780755"
    }
};

var adid = ad_units.android;
/**
if(FacebookAds) FacebookAds.setOptions({
    isTesting: false
});

if(FacebookAds){
   FacebookAds.createBanner( adid.banner );
   alert("banner");
 }
FacebookAds.prepareInterstitial( {adId:adid.interstitial, autoShow:true} );

// show the interstitial later, e.g. at end of game level
FacebookAds.showInterstitial();
**/
        admob.setOptions({
            publisherId: "ca-app-pub-7925487268042880/6770099564",  // Required
            interstitialAdId: "ca-app-pub-7925487268042880/7097196767",
            autoShowInterstitial: false
          });

        admob.createBannerView();
        admob.requestInterstitialAd();

    } catch (e) {
          //alert(e.message);
    }

    var notificationOpenedCallback = function(jsonData) {
      //alert("Notification received:\n" + JSON.stringify(jsonData));
      //console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
      // firing an event downwards
      $rootScope.$broadcast('pushEvent', jsonData);
    };

    // Update with your OneSignal AppId and googleProjectNumber before running.
    window.plugins.OneSignal.init("fb965b9c-e77a-11e4-a9ea-97388ec7efa9",
                                   {googleProjectNumber: "455582282730"},
                                   notificationOpenedCallback);

    window.plugins.OneSignal.sendTags({version: "2"});
/*
window.plugins.OneSignal.init("fb965b9c-e77a-11e4-a9ea-97388ec7efa9",
                       {googleProjectNumber: "455582282730"},
                       didReceiveRemoteNotificationCallBack);


window.plugins.OneSignal.getIds(function(ids) {
    console.log('getIds: ' + JSON.stringify(ids)); // I can see PushToken and UserId in the console.
    window.localStorage["notification"] = JSON.stringify(jsonData);
    //$rootScope.pushToken = ids.pushToken;
});
*/

/*    window.didReceiveRemoteNotificationCallBack = function(jsonData) {
        alert("Notification received:\n" + JSON.stringify(jsonData));
        window.localStorage["notification"] = JSON.stringify(jsonData);
        console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
    }
*/


  // alert("Ready");
   if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })
    .state('app.index', {
      url: "/index",
      views: {
        'menuContent' :{
          templateUrl: "templates/index.html",
          controller: 'IndexCtrl'
        }
      }
    })

    .state('app.lajmet', {
      url: "/lajmet",
      views: {
        'menuContent' :{
          templateUrl: "templates/lajmet.html",
          controller: 'LajmeCtrl'
        }
      }
    })
    .state('app.lajmi', {
      url: "/lajmi/:lajmiId",
      views: {
        'menuContent' :{
          templateUrl: "templates/lajmet-detaje.html",
          controller: 'LajmeDetCtrl'
        }
      }
    })
    .state('app.ndeshjet', {
      url: "/ndeshjet/:grId",
      views: {
        'menuContent' :{
          templateUrl: "templates/ndeshjet.html",
          controller: 'NdeshjetCtrl'
        }
      }
    })
    .state('app.ndeshja', {
      url: "/ndeshja/:ndeshjaId",
      views: {
        'menuContent' :{
          templateUrl: "templates/ndeshja1.html",
          controller: 'NdeshjetDetCtrl'
        }
      }
    })
    .state('app.grupet', {
      url: "/grupet",
      views: {
        'menuContent' :{
          templateUrl: "templates/grupet.html",
          controller: 'AllGrupetCtrl'
        }
      }
    })
    .state('app.gr', {
      url: "/gr/:grId",
      views: {
        'menuContent' :{
          templateUrl: "templates/gr.html",
          controller: 'GrupetCtrl'
        }
      }
    })
    .state('app.ekipi', {
      url: "/ekipi",
      views: {
        'menuContent' :{
          templateUrl: "templates/lojtaret.html",
          controller: 'LojtaretCtrl'
        }
      }
    })

   .state('app.credits', {
      url: "/credits",
      views: {
        'menuContent' :{
          templateUrl: "templates/credits.html"
        }
      }
    })

    .state('app.lojtari', {
      url: "/ekipi/:lojtariId",
      views: {
        'menuContent' :{
          templateUrl: "templates/lojtari.html",
          controller: 'LojtaretDetCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/index');
});


albania.directive('newsHome', ['$compile', 'LajmeService', function($compile, LajmeService){
    return {
        restrict: 'CAE',
		templateUrl: 'templates/lajme-home.html',
        link: function (scope, element, attrs) {
			LajmeService.getSlider(function(data) {
            scope.lajme = data;
            });
        }
    }
 }]);
