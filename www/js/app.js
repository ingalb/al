var P_ID = 109;
var EKIPI_ID = 4;
var URL_APP = "http://api1.ingalb.info/";

// Ionic Starter App
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var albania = angular.module('albania', ['ionic', 'albania.services', 'albania.controllers', 'easypiechart', 'ngSanitize', 'admobModule'])
//angular.module('starter', ['angular-carousel'])

.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
   var admobid = {};
   try{
          ga_storage._setAccount('UA-70272201-2');
          ga_storage._trackPageview('#/app/appJS', 'Albania App load v1.2');
		  navigator.splashscreen.hide();
    
	    admobid = { 
          banner: 'ca-app-pub-7925487268042880/9744485565',
          interstitial: 'ca-app-pub-7925487268042880/3804502366'
       };
	   

    //admob.initAdmob("ca-app-pub-7925487268042880/9744485565","ca-app-pub-7925487268042880/3804502366");
	//admob.showBanner(admob.BannerSize.SMART_BANNER,admob.Position.BOTTOM_APP);
	//admob.cacheInterstitial();

	
	AdMob.createBanner( {
        adId: admobid.banner, 
        isTesting: false,
        overlap: false, 
        offsetTopBar: false, 
        position: AdMob.AD_POSITION.BOTTOM_CENTER,
        bgColor: 'black'
    } );
    
    AdMob.prepareInterstitial({
        adId: admobid.interstitial,
        autoShow: true
    });
    
    } catch (e) {
          console.log(e.message);
		  //alert(e.message);
    }

    var notificationOpenedCallback = function(jsonData) {
      //alert("Notification received:\n" + JSON.stringify(jsonData));
      //console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
      // firing an event downwards
      $rootScope.$broadcast('pushEvent', jsonData);
    };
    //window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
    // Update with your OneSignal AppId and googleProjectNumber before running.
    window.plugins.OneSignal.init("989f0128-8884-11e5-bfb9-a0369f2d9328",
                                   {googleProjectNumber: "656349133735",
								    autoRegister: true},
                                    notificationOpenedCallback);

    window.plugins.OneSignal.sendTags({app: "euro2016", news: "true"});

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
          templateUrl: "templates/ndeshja.html",
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
	.state('app.finalet', {
      url: "/finalet",
      views: {
        'menuContent' :{
          templateUrl: "templates/faza-finale.html",
          controller: 'AllFazatCtrl'
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
          templateUrl: "templates/lojtaret1.html",
          controller: 'Lojtaret1Ctrl'
        }
      }
    })
	
	.state('app.ekipi1', {
      url: "/ekipi1",
      views: {
        'menuContent' :{
          templateUrl: "templates/lojtaret1.html",
          controller: 'Lojtaret1Ctrl'
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

	.state('app.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "templates/settings.html",
		  controller: 'SettingsCtrl'
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

albania.directive('countdown', ['Util','$interval', function (Util, $interval) {
            return {
                restrict: 'A',
                scope: { date: '@' },
                link: function (scope, element) {
                    var future;
                    future = new Date(scope.date);
					//console.log(scope.date);
                    $interval(function () {
                        var diff;
                        diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
						//var test = Util.dhms(diff);
						//console.log(test);
                        return element.html(Util.dhms(diff));
                    }, 1000);
                }
            };
        }
]);
 
	
