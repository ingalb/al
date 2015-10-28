// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('vllaznia', ['ionic', 'vllaznia.services', 'vllaznia.controllers', 'easypiechart', 'ngSanitize', 'admobModule'])
//angular.module('starter', ['angular-carousel'])

.run(function($ionicPlatform, $ionicPopup) {

  $ionicPlatform.ready(function() {
    try{
        ga_storage._setAccount('UA-2341193-9');
        ga_storage._trackPageview('#/app/index', 'Vllaznia App Home');
        //ga_storage._trackPageview('#/app/klasifikimi', 'Vllaznia App klasifikimi');
  /**
        admob.setOptions({
            publisherId: "ca-app-pub-7925487268042880/6770099564",  // Required
            interstitialAdId: "ca-app-pub-7925487268042880/7097196767",
            autoShowInterstitial: false
          });

        admob.createBannerView();
        admob.requestInterstitialAd();
    } catch (e) {
          alert(e.message);
    }
**/

//     ga_storage._setAccount('UA-2341193-1'); //Replace with your own
//     ga_storage._trackPageview('/index.html');

     PushNotification.registerDevice('455582282730', '9128f99a-4783-4c6e-803d-a77f13d332ca', function (pushToken) {
      console.log("My push token: " + pushToken);
      },
      function (error) {
      console.log("Alert token: " + error);
      });

      PushNotification.getDeviceId(function (deviceId) {
                                        console.log("Your device ID: " + deviceId);
                                    },
                                    function (error) {
                                        console.log("Error Device: " + error);
                                    });
     PushNotification.setTags([{
        identifier: "vllaznia-popover",
        value: true
        }], function () {
        console.log("Your tag was successfully added");
       }, function (message) {
        console.log("ERROR: " + message);
       });
/**
     document.addEventListener('pushapps.message-received', function(event, $ionicPopup) {
                                var notification = event.notification;
                                var PopNotification;
                                try {
                                  PopNotification = $ionicPopup.alert({
                                      title: notification.Title,
                                      template: notification.Message
                                    });
                                    alert("Notification");
                                }
                                catch (e) {
                                  alert(e.message);
                                  alert(notification.Title + "\n" + notification.Message);
                                }
                                // This is the entire object, just take the wanted property
                                console.log("Recive Notification" + notification);

                              //alert("message-received, Message: " + notification.Message + " , Title: " + notification.Title + " , D: " + notification.D);
                              });
*/

//   alert("Ready");
/*     gaPlugin = window.plugins.gaPlugin;
     gaPlugin.init(function(msg) {
                    console.log("ga loaded "+msg);
                },
                function(msg) {
                    console.log("ga failed "+msg);
                }, "UA-2341193-8", 10);
*/
//   alert("Ready 1");
//     pushNotification = window.plugins.pushNotification;
//   alert("Ready 2");
//     pushNotification.onDeviceReady();
//   alert("Ready 3");
/*     pushNotification.registerDevice({ projectid: "455582282730", appid : "1539D-59149" },
        function(status) {
            //this is push token
            var pushToken = status;
            console.warn('push token: ' + pushToken);
            alert("Ok reg");
        },
        function(status) {
            console.warn(JSON.stringify(['failed to register ', status]));
            alert("Failed reg");
        }
    );
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

.config(function($stateProvider, $urlRouterProvider) {
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
      url: "/ndeshjet",
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

    .state('app.klubi', {
      url: "/klubi",
      views: {
        'menuContent' :{
          templateUrl: "templates/klubi.html",
          controller: 'KlubiCtrl'
        }
      }
    })
    .state('app.tv', {
      url: "/tv",
      views: {
        'menuContent' :{
          templateUrl: "templates/tv.html",
          controller: 'TvCtrl'
        }
      }
    })
    .state('app.forumi', {
      url: "/forumi",
      views: {
        'menuContent' :{
          templateUrl: "templates/forumi.html",
          controller: 'ForumiCtrl'
        }
      }
    })
    .state('app.multimedia', {
      url: "/multimedia",
      views: {
        'menuContent' :{
          templateUrl: "templates/multimedia.html"
        }
      }
    })
    .state('app.klasifikimi', {
      url: "/klasifikimi",
      views: {
        'menuContent' :{
          templateUrl: "templates/klasifikimi.html",
          controller: 'KlasifikimiCtrl'
        }
      }
    })
    .state('app.klasifikimidet', {
      url: "/klasifikimidet/:klasifikimiId",
      views: {
        'menuContent' :{
          templateUrl: "templates/klasifikimidet.html",
          controller: 'KlasifikimiDetCtrl'
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
