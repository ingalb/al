angular.module('albania.services', [])

.factory('LoaderService', function($rootScope, $ionicLoading) {
  // Trigger the loading indicator
  return {
        show : function() { //code from the ionic framework doc
            // Show the loading overlay and text
            $rootScope.loading = $ionicLoading.show({
              // The text to display in the loading indicator
              content: 'Loading',
              // The animation to use
              animation: 'fade-in',
              // Will a dark overlay or backdrop cover the entire view
              showBackdrop: true,
              // The maximum width of the loading indicator
              // Text will be wrapped if longer than maxWidth
              maxWidth: 400,
              // The delay in showing the indicator
              showDelay: 20
            });
        },
        hide : function(){
            $rootScope.loading.hide();
        }
    }
})

	.factory('MenuService', function($http) {
        var menu = [];
        return {
            getMenuStatus: function(callback){
				$http.get('http://www.ingalb.info/apps/menu.php').then(function successCallback(data) {
					menu = data;
					window.localStorage["menu"] = JSON.stringify(menu);
                    callback(menu);
				}, function errorCallback(data) {
					console.log("ERROR loading" + data);
					if(window.localStorage["menu"] !== undefined) {
                    menu = JSON.parse(window.localStorage["menu"]);
                    callback(menu);
					}
				});
            },
			getMenuStatus1: function(callback) {
                $http.get('http://www.ingalb.info/apps/menu.php').success(
                    function(data) {
                        menu = data;
                        window.localStorage["menu"] = JSON.stringify(menu);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR:" + data);
                   if(window.localStorage["menu"] !== undefined) {
                    menu = JSON.parse(window.localStorage["menu"]);
                    callback(menu);
                }
              });

            }
        }
    })


   .factory('NdeshjetService', function($http) {
        var ndeshjet = [];
        return {
            getSuperligaVllaznia: function(callback) {
                $http.get(URL_APP+'ndeshjet.php?id=superliga&ekipi=13').success(
                    function(data) {
                        ndeshjet = data;
                        window.localStorage["ndeshjet"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR:" + data);
                if(window.localStorage["ndeshjet"] !== undefined) {
                    ndeshjet = JSON.parse(window.localStorage["ndeshjet"]);
                    callback(ndeshjet);
                }
              });

            },
            getAllNdeshjet: function(sezoniId, clubId, callback) {
                $http.get(URL_APP+'ndeshjet.php',{params:{id: sezoniId, ekipi: clubId}}).success(
                    function(data) {
                        allndeshje = data;
                        window.localStorage["allNdeshje"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: " + data);
                if(window.localStorage["allNdeshje"] !== undefined) {
                    allndeshje = JSON.parse(window.localStorage["allNdeshje"]);
                    callback(allndeshje);
                }
              });
            },
            getGrNdeshje: function(grId, callback) {
                $http.get(URL_APP+'euro2016-results.php?id='+P_ID+'&type=1&java='+grId).success(
                    function(data) {
                        ndeshjet = data;
                        window.localStorage["GrNdeshje"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: last ndeshje" + data);
                if(window.localStorage["GrNdeshje"] !== undefined) {
                    lastndeshjet = JSON.parse(window.localStorage["GrNdeshje"]);
                    callback(lastndeshjet);
                }
              });
            },
            getGrupetNdeshje: function(divId, callback) {
                $http.get(URL_APP+'euro2016-results.php?id='+P_ID+'&type=3&division='+divId).success(
                    function(data) {
                        ndeshjet = data;
                        window.localStorage["TodayNdeshjet"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: last ndeshje" + data);
                if(window.localStorage["GrupetNdeshjet"] !== undefined) {
                    lastndeshjet = JSON.parse(window.localStorage["GrupetNdeshjet"]);
                    callback(lastndeshjet);
                }
              });
            },
			getTodayNdeshje: function(callback) {
                $http.get(URL_APP+'euro2016-results.php?id='+P_ID+'&type=2').success(
                    function(data) {
                        ndeshjet = data;
                        window.localStorage["TodayNdeshjet"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: last ndeshje" + data);
                if(window.localStorage["TodayNdeshjet"] !== undefined) {
                    lastndeshjet = JSON.parse(window.localStorage["TodayNdeshjet"]);
                    callback(lastndeshjet);
                }
              });
            },
			     getAlbaniaNdeshje: function(callback) {
                $http.get(URL_APP+'ndeshjet.php?id='+P_ID+'&ekipi='+EKIPI_ID).success(
                    function(data) {
                        ndeshjet = data;
                        window.localStorage["AlbaniaNdeshjet"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: last ndeshje" + data);
                if(window.localStorage["AlbaniaNdeshjet"] !== undefined) {
                    albaniandeshjet = JSON.parse(window.localStorage["AlbaniaNdeshjet"]);
                    callback(albaniadeshjet);
                }
              });
            },
            getReport: function(ndeshjaId, callback) {
                $http.get(URL_APP+'ndeshja.php',{params:{id: 'superliga', ndeshja: ndeshjaId}}).success(
                    function(data) {
                        //console.log(ndeshjaId);
                        //console.log(data);
                        ndeshja = data;
                        callback(data);
                    }
                );
            }
        }
    })

   .factory('NdeshjaService', function($http) {
        var ndeshja = [];
        return {
            getReport: function(ndeshjaId, callback) {
                $http.get(URL_APP+'/ndeshja.php',{params:{id: 'superliga', ndeshja: ndeshjaId}}).success(
                    function(data) {
                        ndeshja = data;
                        callback(data);
                    }
                );
            }
        }
    })

   .factory('LajmeService', function($http) {
        var lajmet = [];
        return {
            getAll: function(callback) {
                $http.get(URL_APP+'/as-news.php',{params:{id: 'euro2016', limit: '100'}}).success(
                    function(data) {
                        lajmet = data;
                        window.localStorage["lajmet"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: " + data);
                if(window.localStorage["lajmet"] !== undefined) {
                    lajmet = JSON.parse(window.localStorage["lajmet"]);
                    callback(lajmet);
                }
              });
            },
           getSlider: function(callback) {
                $http.get(URL_APP+'/as-news.php',{params:{id: 'euro2016', limit: '4'}}).success(
                    function(data) {
                        lajmet = data;
                        window.localStorage["lajmetSlider"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: " + data);
                if(window.localStorage["lajmetSlider"] !== undefined) {
                    lajmetSlider = JSON.parse(window.localStorage["lajmetSlider"]);
                    callback(lajmetSlider);
                }
              });

            },
            getId: function(lajmiId) {
                return lajmet[lajmiId - 1];
            }
        }
    })

    .factory('KlasifikimiGrupetService', function($http) {
         var klasifikimi = [];

         return {
             getAllKlasifikimi: function(sezoniId, grId, callback) {
                 $http.get(URL_APP+'euro2016-klasifikimi.php',{params:{id: sezoniId, division: grId}}).success(
                     function(data) {
                         ndeshja = data;
                         window.localStorage["klasifikimigr"] = JSON.stringify(data);
                         callback(data);
                     }
                 )
                 .error(function(data) {
                    console.log("ERROR: " + data);
                 if(window.localStorage["klasifikimigr"] !== undefined) {
                     klasifikimi = JSON.parse(window.localStorage["klasifikimigr"]);
                     callback(klasifikimi);
                 }
               });
             }
         }
     })

   .factory('KlasifikimiService1', function($http) {
        var klasifikimi = [];

        return {
            getAllKlasifikimi: function(sezoniId, callback) {
                $http.get(URL_APP+'klasifikimi.php',{params:{id: sezoniId}}).success(
                    function(data) {
                        ndeshja = data;
                        window.localStorage["klasifikimi"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: " + data);
                if(window.localStorage["klasifikimi"] !== undefined) {
                    klasifikimi = JSON.parse(window.localStorage["klasifikimi"]);
                    callback(klasifikimi);
                }
              });
            }
        }
    })

   .factory('EkipiService', function($http) {
        var ekipi = [];
        return {
            getAllEkipi: function(sezoniId, ekipiId, callback) {
                $http.get(URL_APP+'ekipi.php',{params:{id: sezoniId, ekipi: ekipiId}}).success(
                    function(data) {
                        ekipi1 = data;
                        window.localStorage["ekipi"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: " + data);
                if(window.localStorage["ekipi"] !== undefined) {
                    ekipi1 = JSON.parse(window.localStorage["ekipi"]);
                    callback(ekipi);
                  }
                });
            },
			      getAlb: function(sezoniId, ekipiId, callback) {
                $http.get(URL_APP+'ekipi.php',{params:{id: sezoniId, ekipi: ekipiId, type: "1"}}).success(
                    function(data) {
                        ekipi = data;
                        window.localStorage["ekipi"] = JSON.stringify(data);
                        callback(data);
                    }
                )
                .error(function(data) {
                   console.log("ERROR: " + data);
                if(window.localStorage["ekipi"] !== undefined) {
                    ekipi = JSON.parse(window.localStorage["ekipi"]);
                    callback(ekipi);
                  }
                });
            },
            get: function(lojtariId, callback) {
				$http.get(URL_APP+'ekipi.php',{params:{id: 109, ekipi: 4}}).success(
                    function(data) {
                        ekipi1 = data;
                        window.localStorage["ekipi1"] = JSON.stringify(data);
                        callback(ekipi1);
                    }
                );
                //return ekipi1[lojtariId - 1];
            }
        }
    })

	.factory('Util1', [function () {
            return {
                dhms: function (t) {
                    var days, hours, minutes, seconds;
                    days = Math.floor(t / 86400);
                    t -= days * 86400;
                    hours = Math.floor(t / 3600) % 24;
                    t -= hours * 3600;
                    minutes = Math.floor(t / 60) % 60;
                    t -= minutes * 60;
                    seconds = t % 60;
                    return [
                        days + ' dite',
                        hours + ' ore',
                        minutes + ' m e ',
                        seconds + ' s'
                    ].join(' ');
                }
            };
    }])

	.factory('Util', [function () {
            return {
                dhms: function (t) {
                    var days, hours, minutes, seconds;
                    days = Math.floor(t / 86400);
					d3 = parseInt(days / 100);
					if(d3<1)
					{d3='';}
				    else{
						d3 = '<span class="position"><span class="digit static">'+d3+'</span></span>'
					}
					d2 = parseInt(days / 10)%10;
					d1 = days%10;
                    t -= days * 86400;
                    hours = Math.floor(t / 3600) % 24;
					h1 = hours%10;
					h2 = parseInt(hours / 10);
                    t -= hours * 3600;
                    minutes = Math.floor(t / 60) % 60;
					m1= minutes%10;
					m2= parseInt(minutes / 10);
                    t -= minutes * 60;
                    seconds = t % 60;
					s1 = seconds%10;
					s2 = parseInt(seconds / 10);
                    return [
                        '<div class="row timer-center pull-center"><div class="text-center"><span class="countDays">'+d3,
						'<span class="position"><span class="digit static">'+d2+'</span></span>',
						'<span class="position"><span class="digit static">'+d1+'</span></span></span></span><span class="countDiv countDiv0"></span><br>Dit&euml;</div>',
                        '<div class="text-center"><span class="countHours"><span class="position"><span class="digit static">'+h2+'</span></span>',
						'<span class="position"><span class="digit static">'+h1+'</span></span></span></span><span class="countDiv countDiv0"></span><br>Or&euml;</div>',
                        '<div class="text-center"><span class="countMinutes"><span class="position"><span class="digit static">'+m2+'</span></span>',
						'<span class="position"><span class="digit static">'+m1+'</span></span></span></span><span class="countDiv countDiv0"></span><br>Min</div>',
                        '<div class="text-center"><span class="countSeconds"><span class="position"><span class="digit static">'+s2+'</span></span>',
						'<span class="position"><span class="digit static">'+s1+'</span></span></span></span></br>Sek</div></div>'
                    ].join(' ');
                }
            };
    }]);
