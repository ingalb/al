
angular.module('ngCordova', [
  'ngCordova.plugins'
]);
angular.module('ngCordova.plugins', [	 'device',	 'ga',	 'ocialSharing',	 'plashscreen']);//#### Begin Individual Plugin Code####// install   :     cordova plugin add org.apache.cordova.device
// link      :     https://github.com/apache/cordova-plugin-device/blob/master/doc/index.md

angular.module('ngCordova.plugins.device', [])

  .factory('$cordovaDevice', [function () {

    return {
      getDevice: function () {
        return device;
      },

      getCordova: function () {
        return device.cordova;
      },

      getModel: function () {
        return device.model;
      },

      // Warning: device.name is deprecated as of version 2.3.0. Use device.model instead.
      getName: function () {
        return device.name;
      },

      getPlatform: function () {
        return device.platform;
      },

      getUUID: function () {
        return device.uuid;
      },

      getVersion: function () {
        return device.version;
      }
    }
  }]);
// install   :     cordova plugin add https://github.com/phonegap-build/GAPlugin.git
// link      :     https://github.com/phonegap-build/GAPlugin

angular.module('ngCordova.plugins.ga', [])

  .factory('$cordovaGA', ['$q', '$window', function ($q, $window) {

    return {
      init: function (id, mingap) {
        var q = $q.defer();
        mingap = (mingap >= 0) ? mingap : 10;
        $window.plugins.gaPlugin.init(function (result) {
            q.resolve(result);
          },
          function (error) {
            q.reject(error);
          },
          id, mingap);
        return q.promise;
      },

      trackEvent: function (success, fail, category, eventAction, eventLabel, eventValue) {
        var q = $q.defer();
        $window.plugins.gaPlugin.trackEvent(function (result) {
            q.resolve(result);
          },
          function (error) {
            q.reject(error);
          },
          category, eventAction, eventLabel, eventValue);
        return q.promise;
      },

      trackPage: function (success, fail, pageURL) {
        var q = $q.defer();
        $window.plugins.gaPlugin.trackPage(function (result) {
            q.resolve(result);
          },
          function (error) {
            q.reject(error);
          },
          pageURL);
        return q.promise;
      },

      setVariable: function (success, fail, index, value) {
        var q = $q.defer();
        $window.plugins.gaPlugin.setVariable(function (result) {
            q.resolve(result);
          },
          function (error) {
            q.reject(error);
          },
          index, value);
        return q.promise;
      },

      exit: function (success, fail) {
        var q = $q.defer();
        $window.plugins.gaPlugin.exit(function (result) {
            q.resolve(result);
          },
          function (error) {
            q.reject(error);
          });
        return q.promise;
      }
    };
  }]);
// install   :      cordova plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git
// link      :      https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin

// NOTE: shareViaEmail -> if user cancels sharing email, success is still called
// NOTE: shareViaEmail -> TO, CC, BCC must be an array, Files can be either null, string or array
// TODO: add support for iPad
// TODO: detailed docs for each social sharing types (each social platform has different requirements)

angular.module('ngCordova.plugins.socialSharing', [])

  .factory('$cordovaSocialSharing', ['$q', '$window', function ($q, $window) {

    return {
      share: function (message, subject, file, link) {
        var q = $q.defer();
        $window.plugins.socialsharing.share(message, subject, file, link,
          function () {
            q.resolve(true); // success
          },
          function () {
            q.reject(false); // error
          });
        return q.promise;
      },

      shareViaTwitter: function (message, file, link) {
        var q = $q.defer();
        $window.plugins.socialsharing.shareViaTwitter(message, file, link,
          function () {
            q.resolve(true); // success
          },
          function () {
            q.reject(false); // error
          });
        return q.promise;
      },

      shareViaWhatsApp: function (message, file, link) {
        var q = $q.defer();
        $window.plugins.socialsharing.shareViaWhatsApp(message, file, link,
          function () {
            q.resolve(true); // success
          },
          function () {
            q.reject(false); // error
          });
        return q.promise;
      },

      shareViaFacebook: function (message, file, link) {
        var q = $q.defer();
        $window.plugins.socialsharing.shareViaFacebook(message, file, link,
          function () {
            q.resolve(true); // success
          },
          function () {
            q.reject(false); // error
          });
        return q.promise;
      },

      shareViaSMS: function (message, commaSeparatedPhoneNumbers) {
        var q = $q.defer();
        $window.plugins.socialsharing.shareViaSMS(message, commaSeparatedPhoneNumbers,
          function () {
            q.resolve(true); // success
          },
          function () {
            q.reject(false); // error
          });
        return q.promise;
      },

      shareViaEmail: function (message, subject, toArr, ccArr, bccArr, fileArr) {
        var q = $q.defer();
        $window.plugins.socialsharing.shareViaEmail(message, subject, toArr, ccArr, bccArr, fileArr,
          function () {
            q.resolve(true); // success
          },
          function () {
            q.reject(false); // error
          });
        return q.promise;
      },

      canShareViaEmail: function () {
        var q = $q.defer();
        $window.plugins.socialsharing.canShareViaEmail(
          function () {
            q.resolve(true); // success
          },
          function () {
            q.reject(false); // error
          });
        return q.promise;
      },

      canShareVia: function (via, message, subject, file, link) {
        var q = $q.defer();
        $window.plugins.socialsharing.canShareVia(via, message, subject, file, link,
          function (success) {
            q.resolve(success); // success
          },
          function (error) {
            q.reject(error); // error
          });
        return q.promise;
      },

      shareVia: function (via, message, subject, file, link) {
        var q = $q.defer();
        $window.plugins.socialsharing.shareVia(via, message, subject, file, link,
          function () {
            q.resolve(true); // success
          },
          function () {
            q.reject(false); // error
          });
        return q.promise;
      }

    }
  }]);
// install   :      cordova plugin add org.apache.cordova.splashscreen
// link      :      https://github.com/apache/cordova-plugin-splashscreen/blob/master/doc/index.md

angular.module('ngCordova.plugins.splashscreen', [])

  .factory('$cordovaSplashscreen', [ function () {

    return {
      hide: function () {
        return navigator.splashscreen.hide();
      },

      show: function () {
        return navigator.splashscreen.show();
      }
    };

  }]);
