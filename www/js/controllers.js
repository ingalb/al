angular.module('albania.controllers', [])

.controller('AppCtrl', function($scope) {
   if(navigator.splashscreen){
      navigator.splashscreen.hide();
	  console.log("hide splash 1");
   }
    //$scope.menu = true;
	var future = new Date('June 23, 2016 08:00:00');
	var diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
		if(diff<0)
		{
			$scope.menu = true;
		}
   /** MenuService.getMenuStatus(function(data) {
		$scope.menu = data.data.menu;
    });
	**/
})

    .filter('html',function($sce){
     return function(input){
        return $sce.trustAsHtml(input);
      }
    })

	.filter('indexOrari', function($filter){
     return function(input)
     {
       if(input == null){ return ""; }
       var value = input.split("+");
       var _date = $filter('date')(new Date(value[0]),'HH:mm');
       return _date;
     };
    })

   .filter('indexData', function($filter){
     return function(input)
     {
       if(input == null){ return ""; }
       var value = input.split("+");
       var _date = $filter('date')(new Date(value[0]),'dd/MM/yyyy - HH:mm');
       return _date;
     };
    })

	.filter('matchData', function($filter){
     return function(input)
     {
       if(input == null){ return ""; }
       var value = input.split("+");
       var _date = $filter('date')(new Date(value[0]),'dd MMM HH:mm');
       return _date;
     };
    })

    .filter('lajmeData', function($filter){
      return function(input)
      {
        if(input == null){ return ""; }
        var value = input.split("+");
        var _date = $filter('date')(new Date(value[0]),'dd/MM/yyyy');
        return _date;
      };
     })

  .filter('orderObjectBy', function() {
   return function(items, field, reverse) {
    var filtered = [];
    angular.forEach(items, function(item) {
      filtered.push(item);
    });
    filtered.sort(function (a, b) {
      return (a[field] > b[field] ? 1 : -1);
    });
     if(reverse) filtered.reverse();
      return filtered;
    };
  })

    .controller('IndexCtrl', function($scope, $ionicSlideBoxDelegate, $state, $timeout, $ionicLoading, $ionicPopup, LajmeService, $ionicModal, $rootScope, NdeshjetService) {
        var tani = new Date();
        var timerhide = 15000;
        ga_storage._trackPageview('#/app/index', 'Albania App Index');
        if(navigator.splashscreen){
           navigator.splashscreen.hide();
		       console.log("hide splash");
        }

		$ionicLoading.show();
		var future = new Date('June 10, 2016 21:00:00');
		var diff = Math.floor((future.getTime() - new Date().getTime()) / 1000);
		$scope.countd = diff;

		//console.log($scope.countd);

        $scope.CloseNotification = function() {
           $scope.modal.hide();
          //notifica();
       };

       $ionicModal.fromTemplateUrl('modal.html', function($ionicModal) {
          $scope.modal = $ionicModal;
       }, {
       // Use our scope for the scope of the modal to keep it simple
       scope: $scope,
       // The animation we want to use for the modal entrance
       animation: 'slide-in-up'
       });

       var notifica = $rootScope.$on('pushEvent', function(event,message){
         console.log(JSON.stringify(message));
         $scope.titulli=message.additionalData.title;
         $scope.teksti=message.message;
         //$scope.dati = JSON.stringify(message);
		 //$scope.teksti=message.additionalData;
		 //console.log(JSON.stringify(message.additionalData));
		 var myVar = message.additionalData.page;
		 //console.log(myVar);
		 var pattern = /match/;
		//returns true or false...
		var exists = pattern.test(myVar);
		if(exists){
			//true statement, do whatever
			console.log(myVar.substr(5));
			$state.go('app.ndeshja', {ndeshjaId: parseInt(myVar.substr(5))} );

		}else{
			//false statement..do whatever
			if(myVar=="lajme")
			{$scope.lajmi = true;}
			$scope.modal.show();
		}
       });

        $scope.loadNdeshje = false;
        $scope.go = function ( path ) {
          //alert(path);
          $state.go('app.ndeshja', {ndeshjaId: path} );
        };
        $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 100
	        });

        NdeshjetService.getAlbaniaNdeshje(function(data) {
            //alert(tani);
            $scope.items = data;
            //$scope.items = data.slice(0,3);
		  	//console.log($scope.items);
            $ionicLoading.hide();
            $scope.loadNdeshje = true;
            $ionicSlideBoxDelegate.update();
        });

        NdeshjetService.getTodayNdeshje(function(data) {
            //alert(tani);
            $scope.itemsT = data;
            //$scope.itemsT = data.slice(0,1);
            //console.log(data);
            $ionicLoading.hide();
        });
		LajmeService.getSlider(function(data) {
            $scope.lajme = data;
            $ionicLoading.hide();
        });

       $scope.customArrayFilter = function (item) {
         //console.log(tani);
         d2 = new Date(tani.getTime()- 800000000);
        // d3 = new Date(tani.getTime() + 800000000);

         //console.log(d2);
         d1 = new Date(item.data);
         //$scope.data = d1;
         return ( d1>d2);
       };

    $timeout(function(){
			$ionicLoading.hide();
			AdMob.showBanner(8);
		    console.log("hide loading + show banner");
		},timerhide);

      })

    .controller('LajmeCtrl', function($scope, $sce, $timeout, $ionicLoading, LajmeService) {
      ga_storage._trackPageview('#/app/lajmet', 'Albania App Lajmet');
      //window.analytics.trackView('Lajmet Page');
	    $scope.anim = "ion-ios-bell-outline";
      $scope.loadingIndicator = $ionicLoading.show({
	    content: 'Loading Data',
	    animation: 'fade-in',
	    showBackdrop: true,
	    maxWidth: 200,
	    showDelay: 100
	  });
	    var isSubscribed = function(){
		      window.plugins.OneSignal.getTags(function(tag) {
			     if(tag["news"]=="true")
			     {
				     $scope.notification = true;
				     $scope.anim = "ion-ios-bell";
			     }
			     else{
				     $scope.notification = false;
				     $scope.anim = "ion-ios-bell-outline";
			     }
		      });
	    }
		  isSubscribed();

      $scope.$on('$ionicView.enter', function(){
         isSubscribed();
      });

	    var subscribe = function(){
			$scope.notification = true;
			$scope.anim = "ion-ios-bell";
			window.plugins.OneSignal.setSubscription(true);
			window.plugins.OneSignal.sendTag("news",true);
		}
		var unSubscribe = function(){
			$scope.notification = false;
			$scope.anim = "ion-ios-bell-outline";
			window.plugins.OneSignal.deleteTag("news");
		}
        //FacebookAds.showInterstitial();
	    AdMob.showBanner(8);
        LajmeService.getAll(function(data) {
            $scope.lajme = data;
            //console.log($scope.lajme);
            $ionicLoading.hide();
        });
		$scope.subNotification = function(){
			$scope.notification = $scope.notification === true ? false: true;
			if($scope.notification)
			{
				subscribe();
			}
			else{
				unSubscribe();
			}
	    }
        $scope.doRefresh = function() {
          LajmeService.getAll(function(data) {
            $scope.lajme = data;
			isSubscribed();
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        });
       }
       $timeout(function(){
         $ionicLoading.hide();
		 //admob.showBanner(admob.BannerSize.SMART_BANNER,admob.Position.BOTTOM_APP);
		 console.log("hide loading + show banner");
       },10000);
    })

    .controller('LajmeDetCtrl', function($scope, $sce, $stateParams, $ionicLoading, LajmeService) {
        ga_storage._trackPageview('#/app/lajmi/'+ $stateParams.lajmiId+'', 'Albania App Lajme Det');
        $scope.shareL = function(message, subject, image, link){
          ga_storage._trackEvent('Lajme', 'Share', subject);
          window.plugins.socialsharing.share(message, subject, image, link, this.onSuccess, this.onError);
        }
		//admob.showBanner(admob.BannerSize.BANNER,admob.Position.BOTTOM_APP);
        $scope.loadingIndicator = $ionicLoading.show({
	        content: 'Loading Data',
	        animation: 'fade-in',
	        showBackdrop: true,
	        maxWidth: 200,
	        showDelay: 100
	    });
        $scope.lajmi = LajmeService.getId($stateParams.lajmiId);
        $ionicLoading.hide();

		//admob.cacheInterstitial();
		//AdMob.showInterstitial();
		AdMob.prepareInterstitial({
			adId: 'ca-app-pub-7925487268042880/3804502366',
			autoShow: true
		});
		//AdMob.prepareInterstitial('ca-app-pub-7925487268042880/6932118769');
        AdMob.showInterstitial();
		$scope.showAds = function()
		{
			console.log("call ads");
			AdMob.showInterstitial();
			//admob.showInterstitial();
		}
    })

    .controller('NdeshjetDetCtrl', function($scope, $sce, $stateParams, $timeout, $ionicNavBarDelegate, $ionicScrollDelegate, $ionicSlideBoxDelegate, $ionicLoading, NdeshjaService) {
       ga_storage._trackPageview('#/app/ndeshja/'+ $stateParams.ndeshjaId+'', 'Albania App Ndeshja Det');
       var tani = new Date();
       var time = 1;
       var d1, minuti, percenti;
       $scope.selected = 0;
	   $scope.notification = false;
	   $scope.anim = "ion-ios-bell-outline";
	   //console.log($scope.notification);
	   var tags = "match"+ $stateParams.ndeshjaId;
       console.log('User Tag: '+tags);
	   var isSubscribed = function(tags){
		  window.plugins.OneSignal.getTags(function(tag) {
			if(tag[tags]=="true" && tag["match"]=="true")
			{
				$scope.notification = true;
				$scope.anim = "ion-ios-bell";
			}
			else{
				$scope.notification = false;
				$scope.anim = "ion-ios-bell-outline";
			}
		  });
	    }
	   isSubscribed(tags);
	   var subscribe = function(tags){
		console.log("sub called");
		console.log(tags);
		$scope.notification = true;
		$scope.anim = "ion-ios-bell";
		window.plugins.OneSignal.setSubscription(true);
		window.plugins.OneSignal.sendTag("match",true);
		window.plugins.OneSignal.sendTag(tags,true);
	   }
	   var unSubscribe = function(tags){
		console.log("unsub called");
		console.log(tags);
		$scope.notification = false;
		$scope.anim = "ion-ios-bell-outline";
		window.plugins.OneSignal.deleteTag(tags);
	   }
       //$scope.minuta = "minuta";
       //admob.showBannerAd(false);
       $scope.loadingIndicator = $ionicLoading.show({
	        content: 'Loading Data',
	        animation: 'fade-in',
	        showBackdrop: true,
	        maxWidth: 200,
	        showDelay: 100
	    });
       $scope.percent = Math.floor(time/90*100);
       $scope.percenti=time;
       $scope.options = {
            animate:{
                duration:1000,
                enabled:true
            },
            barColor:'#cc3333',
            scaleColor:'#ddd',
            lineWidth:3,
            lineCap:'round',
            size:'60'
        };

		$scope.$on('$ionicView.beforeLeave', function(){
         $timeout.cancel(timer);
		 console.log("leave view");
		});

		$scope.$on('$ionicView.enter', function(){
	    	console.log("enter view");
			var update = function update() {
				timer = $timeout(update, 59000);
				isSubscribed(tags);
				NdeshjaService.getReport($stateParams.ndeshjaId, function(data) {
					$scope.item = data;
					$scope.content = data.kronika;
					$scope.percent = data.percent;
					$ionicNavBarDelegate.title(data.java);
					$ionicSlideBoxDelegate.update();
					$ionicScrollDelegate.resize();
					$ionicLoading.hide();
				});
			}();
		});
       $scope.slideTo = function(index) {
          $ionicSlideBoxDelegate.slide(index);
          $scope.selected = index;
          $ionicSlideBoxDelegate.update();
          $ionicScrollDelegate.resize();
          $ionicScrollDelegate.scrollTop(true);
       }
	   $scope.slideNext = function() {
          $ionicSlideBoxDelegate.next();
          $ionicSlideBoxDelegate.update();
          $ionicScrollDelegate.resize();
       }
	   $scope.slidePrevious = function() {
          $ionicSlideBoxDelegate.previous();
          $ionicSlideBoxDelegate.update();
          $ionicScrollDelegate.resize();
       }

	    $scope.subNotification = function(){
		   $scope.notification = $scope.notification === true ? false: true;
		   var tag = "match"+ $stateParams.ndeshjaId;
		   if($scope.notification)
		   {
			    console.log("sub");
		        console.log(tag);
				subscribe(tag);
		   }
		   else{
			    console.log("unsub");
		        console.log(tag);
				unSubscribe(tag);
		   }
	    }
       $scope.doRefresh = function() {
         $scope.loadingIndicator = $ionicLoading.show({
	          content: 'Loading Data',
	           animation: 'fade-in',
	           showBackdrop: true,
	           maxWidth: 200,
	           showDelay: 100
	       });
       NdeshjaService.getReport($stateParams.ndeshjaId, function(data) {
            tani = new Date();
            $scope.item = data;
            $scope.content = data.kronika;
            $scope.percent = data.percent;
            $ionicNavBarDelegate.title(data.java);
			isSubscribed(tags);
            $scope.$broadcast('scroll.refreshComplete');
            $ionicScrollDelegate.resize();
            $ionicScrollDelegate.scrollTop(true);
            $ionicSlideBoxDelegate.update();
            $ionicLoading.hide();
        });
       }
    })

	.controller('GrupetCtrl', function($scope, $stateParams, $timeout, $ionicLoading, $ionicScrollDelegate, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $ionicTabsDelegate, $ionicBackdrop, KlasifikimiGrupetService, NdeshjetService, $ionicPopover) {
     ga_storage._trackPageview('#/app/grupi'+$stateParams.grId+'', 'Euro2016 App Grupi');
     var titulliPop = "Zgjidh Grupin";
	   var valActive = 1;
     $scope.selected = 0;
     $scope.SezoneList = [
       { text: "Grupi A", value: 24 },
       { text: "Grupi B", value: 25 },
       { text: "Grupi C", value: 26 },
       { text: "Grupi D", value: 27 },
       { text: "Grupi E", value: 28 },
       { text: "Grupi F", value: 29 },
      ];
      $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 500
	     });
       $ionicLoading.show();
       $ionicPopover.fromTemplateUrl('popover-template.html', {
          scope: $scope,
        }).then(function(popover) {
          $scope.popover = popover;
        });

       // $scope.sezoni = "2014-15";
       // $scope.sezoni_id = 100;
       // $scope.sezoni_id = $scope.SezoneList[0].value;
	   $scope.gr_id = $scope.SezoneList[($stateParams.grId-1)].value;
       $scope.sezoni_text = $scope.SezoneList[($stateParams.grId-1)].text;

        KlasifikimiGrupetService.getAllKlasifikimi(P_ID, $scope.gr_id,function(data) {
            $scope.items = data;
            //$ionicLoading.hide();
			     $ionicSideMenuDelegate.canDragContent(false);
        });
        //console.log($scope.gr_id);
		    NdeshjetService.getGrupetNdeshje($scope.gr_id, function(data) {
            $scope.itemsN = data;
			//console.log(data);
            $ionicLoading.hide();
			      $ionicSideMenuDelegate.canDragContent(false);
        });

	    $scope.activeVew = function(valActive){
			$ionicLoading.show();
			if(!valActive)
			{
				KlasifikimiGrupetService.getAllKlasifikimi(P_ID, $scope.gr_id,function(data) {
                $scope.items = data;
                $ionicLoading.hide();
                });
			}
			else{
				NdeshjetService.getGrupetNdeshje($scope.gr_id, function(data) {
                $scope.itemsN = data;
                $ionicLoading.hide();
                });
			}
		}
     $scope.slideTo = function(index) {
       $ionicSlideBoxDelegate.slide(index);
       $scope.selected = index;
       $ionicScrollDelegate.resize();
       $ionicSlideBoxDelegate.update();
       //$ionicScrollDelegate.scrollTop(true);
     }
	    $scope.slideNext = function() {
            //$ionicTabsDelegate.select(1);
            $ionicSlideBoxDelegate.next();
        }
	    $scope.slidePrevious = function() {
            //$ionicTabsDelegate.select(0);
            $ionicSlideBoxDelegate.previous();
        }

      $scope.changeSezoni = function(item) {
        $scope.sezoni_text = item.text;
        $scope.gr_id = item.value;
        $scope.popover.hide();
        $ionicBackdrop.retain();
        KlasifikimiGrupetService.getAllKlasifikimi(P_ID, $scope.gr_id,function(data) {
            $scope.items = data;
            //selectPopup.close();
          //$scope.popover.hide();
            //$ionicBackdrop.release();
        });
		NdeshjetService.getGrupetNdeshje($scope.gr_id, function(data) {
            $scope.itemsN = data;
            //$ionicLoading.hide();
        });
		$ionicBackdrop.release();
       };
       $timeout(function(){
          $ionicLoading.hide();
          //selectPopup.close();
          $scope.popover.hide();
        //  $ionicBackdrop.release();
      },60000);

    })

	.controller('AllGrupetCtrl', function($scope, $stateParams, $timeout, $ionicLoading, $ionicSideMenuDelegate,$ionicSlideBoxDelegate, $ionicTabsDelegate, $ionicBackdrop, KlasifikimiGrupetService, NdeshjetService, $ionicPopover) {
     ga_storage._trackPageview('#/app/Allgrupet', 'Euro2016 App All Grupet');
     var titulliPop = "Zgjidh Grupin";
	   var valActive = 0;
	   $scope.gr_id = 24;
     $scope.selected = 0;
     $scope.SezoneList = [
       { text: "Grupi A", value: 24 },
       { text: "Grupi B", value: 25 },
       { text: "Grupi C", value: 26 },
       { text: "Grupi D", value: 27 },
       { text: "Grupi E", value: 28 },
       { text: "Grupi F", value: 29 },
      ];
      $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 200
	     });
       $ionicLoading.show();
       $ionicPopover.fromTemplateUrl('popover1-template.html', {
          scope: $scope,
        }).then(function(popover) {
          $scope.popover = popover;
        });

       // $scope.sezoni = "2014-15";
       // $scope.sezoni_id = 100;
       // $scope.sezoni_id = $scope.SezoneList[0].value;

       $scope.sezoni_text = $scope.SezoneList[($scope.gr_id-24)].text;


        KlasifikimiGrupetService.getAllKlasifikimi(P_ID, $scope.gr_id,function(data) {
            $scope.items = data;
            $ionicLoading.hide();
			      $ionicSideMenuDelegate.canDragContent(false);
        });
        //console.log($scope.gr_id);
		    NdeshjetService.getGrupetNdeshje($scope.gr_id, function(data) {
            $scope.itemsN = data;
            $ionicLoading.hide();
			      $ionicSideMenuDelegate.canDragContent(false);
        });

	    $scope.activeVew = function(valActive){
			if(!valActive)
			{
				KlasifikimiGrupetService.getAllKlasifikimi(P_ID, $scope.gr_id,function(data) {
					$scope.items = data;
                });
				NdeshjetService.getGrupetNdeshje($scope.gr_id, function(data) {
					$scope.itemsN = data;
					$ionicLoading.hide();
                });
			}
		};
		$scope.selectedTab = function(selectedId){
			//alert("ok");
			$ionicLoading.show();
      $scope.selected = selectedId-1;
			//$ionicTabsDelegate.select(selectedId-1);
      $ionicSlideBoxDelegate.slide(selectedId-1);
			$scope.gr_id = selectedId+23;
			$scope.sezoni_text = $scope.SezoneList[($scope.gr_id-24)].text;
			KlasifikimiGrupetService.getAllKlasifikimi(P_ID, $scope.gr_id, function(data) {
                $scope.items = data;
			});
			NdeshjetService.getGrupetNdeshje($scope.gr_id, function(data) {
                $scope.itemsN = data;
                $ionicLoading.hide();
			});
			//$ionicLoading.hide();
		 }

	    $scope.slideNext = function() {
			$ionicLoading.show();
			$scope.gr_id = $scope.gr_id+1;
			if($scope.gr_id>29)
		    {$scope.gr_id=29;}
            //$scope.sezoni_text = $scope.SezoneList[($scope.gr_id-1)].text;
			 $scope.selectedTab($scope.gr_id-23);
            //$ionicTabsDelegate.select($scope.gr_id-1);
       }
	   $scope.slidePrevious = function() {
		   $scope.gr_id= $scope.gr_id-1;
		   if($scope.gr_id<24)
		   {$scope.gr_id=24;}
           //$scope.sezoni_text = $scope.SezoneList[($scope.gr_id-23)].text;
		   $scope.selectedTab($scope.gr_id-23);
           //$ionicTabsDelegate.select($scope.gr_id-1);
       }

      $scope.changeSezoni = function(item) {
		$ionicLoading.show();
        $scope.sezoni_text = item.text;
        $scope.gr_id = item.value;
        $scope.sezoni_text = $scope.SezoneList[($scope.gr_id-24)].text;
        $scope.popover.hide();
        $ionicBackdrop.retain();
		//$ionicLoading.show();
        KlasifikimiGrupetService.getAllKlasifikimi(P_ID, $scope.gr_id,function(data) {
            $scope.items = data;
        });
		NdeshjetService.getGrupetNdeshje($scope.gr_id, function(data) {
            $scope.itemsN = data;
        });
		$ionicBackdrop.release();
		$ionicLoading.hide();
		//$ionicTabsDelegate.select($scope.gr_id-24);
    $ionicSlideBoxDelegate.slide($scope.gr_id-24);
       };
       $timeout(function(){
          $ionicLoading.hide();
          //selectPopup.close();
          $scope.popover.hide();
        //  $ionicBackdrop.release();
      },10000);

    })


	.controller('AllFazatCtrl', function($scope, $stateParams, $timeout, $ionicLoading, $ionicSlideBoxDelegate, $ionicSideMenuDelegate, $ionicTabsDelegate, $ionicBackdrop, NdeshjetService, $ionicPopover) {
     ga_storage._trackPageview('#/app/faza-finale', 'Euro2016 App Fazat finale');
     var titulliPop = "Zgjidh Grupin";
	 var valActive = 1;
     $scope.selected = 0;
	 $scope.selected_id = 1; //$ionicSlideBoxDelegate.currentIndex();
	 $scope.gr_id = 4;
     $scope.SezoneList = [
       { text: "1/8", value: 4 },
       { text: "1/4", value: 5 },
       { text: "1/2", value: 6 },
       { text: "Finalja", value: 7 },
      ];
      $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 500
	     });
       $ionicLoading.show();
       $ionicPopover.fromTemplateUrl('popover1-template.html', {
          scope: $scope,
        }).then(function(popover) {
          $scope.popover = popover;
        });

       // $scope.sezoni = "2014-15";
       // $scope.sezoni_id = 100;
       // $scope.sezoni_id = $scope.SezoneList[0].value;

       $scope.sezoni_text = $scope.SezoneList[$scope.gr_id-4].text;

        //console.log($scope.gr_id);
		NdeshjetService.getGrNdeshje($scope.gr_id, function(data) {
            $scope.itemsN = data;
            $ionicLoading.hide();
			$ionicSideMenuDelegate.canDragContent(false);
        });

		$scope.selectedTab = function(selectedId){
			//alert("ok");
			$ionicLoading.show();
            $scope.selected = selectedId;
			$scope.gr_id = parseInt(selectedId) + parseInt(3);
			//$scope.gr_id = 3 + $scope.gr_id;
			if($scope.gr_id>7)
		    {$scope.gr_id=7;}
		    if($scope.gr_id<=3)
		    {$scope.gr_id=4;}
			console.log("select" + $scope.gr_id);
			$scope.sezoni_text = $scope.SezoneList[selectedId-1].text;
			NdeshjetService.getGrNdeshje($scope.gr_id, function(data) {
                $scope.itemsN = data;
                $ionicLoading.hide();
			});
			//$ionicTabsDelegate.select($scope.gr_id-3);
            $ionicSlideBoxDelegate.slide($scope.gr_id-3);
			$scope.selected_id = $scope.gr_id-3;//$ionicSlideBoxDelegate.currentIndex();
			console.log($scope.selected_id);
		 }

	    $scope.slideNext = function() {
			$scope.gr_id = $scope.gr_id+1;
			console.log("Slide" + $scope.gr_id);
			if($scope.gr_id>7)
		    {$scope.gr_id=7;}
            $scope.sezoni_text = $scope.SezoneList[($scope.gr_id-4)].text;
			$ionicLoading.show();
			$scope.selectedTab($scope.gr_id-3);
            //$ionicSlideBoxDelegate.slide($scope.gr_id-4);
            $scope.selected = $scope.gr_id-4;
            //$ionicTabsDelegate.select($scope.gr_id-4);
       }
	   $scope.slidePrevious = function() {
		   $scope.gr_id= $scope.gr_id-1;
		   if($scope.gr_id>7)
		    {$scope.gr_id=7;}
		    if($scope.gr_id<=3)
		    {$scope.gr_id=4;}
           $scope.sezoni_text = $scope.SezoneList[($scope.gr_id-4)].text;
		   $scope.selectedTab($scope.gr_id-3);
           //$ionicSlideBoxDelegate.slide($scope.gr_id-4);
           //$ionicTabsDelegate.select($scope.gr_id-4);
       }

       $scope.changeSezoni = function(item) {
        $scope.sezoni_text = item.text;
        $scope.gr_id = item.value;
        $scope.sezoni_text = $scope.SezoneList[($scope.gr_id-4)].text;
        $scope.popover.hide();
        $ionicBackdrop.retain();
		    $ionicLoading.show();
		    NdeshjetService.getGrNdeshje($scope.gr_id, function(data) {
            $scope.itemsN = data;
        });
		//$ionicTabsDelegate.select($scope.gr_id-4);
		   $ionicBackdrop.release();
		   $ionicLoading.hide();
           $ionicSlideBoxDelegate.slide($scope.gr_id-4);
           $scope.selected_id = $scope.gr_id-3;
       };
       $timeout(function(){
          $ionicLoading.hide();
          //selectPopup.close();
          $scope.popover.hide();
        //  $ionicBackdrop.release();
      },10000);

    })

    .controller('LojtaretCtrl', function($scope, $timeout, $stateParams, $ionicLoading, EkipiService) {
        ga_storage._trackPageview('#/app/ekipi', 'Albania App Ekipi');
        $scope.sezoni_id = 109;
        $scope.ekipiId = 4;
        $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 500
	      });
        EkipiService.getAllEkipi($scope.sezoni_id,$scope.ekipiId, function(data) {
            $scope.items = data;
            //console.log(data);
            $ionicLoading.hide();
        });
        $timeout(function(){
          $ionicLoading.hide();
        },6000);
    })


    .controller('Lojtaret1Ctrl', function($scope, $timeout, $stateParams, $ionicLoading, EkipiService) {
        ga_storage._trackPageview('#/app/ekipi', 'Albania Euro2016 App Ekipi');
        $scope.sezoni_id =109;
        $scope.ekipiId = 4;
        $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 500
	      });
        //EkipiService.getAllEkipi($scope.sezoni_id,$scope.ekipiId, function(data) {
		EkipiService.getAlb($scope.sezoni_id,$scope.ekipiId, function(data) {
            $scope.items = data;
            //console.log(data);
            $ionicLoading.hide();
        });
        $timeout(function(){
          $ionicLoading.hide();
        },6000);
    })

    .controller('LojtaretDetCtrl', function($scope, $stateParams, $timeout, $ionicLoading, EkipiService) {
        ga_storage._trackPageview('#/app/ekipi/'+ $stateParams.lojtariId+'', 'Albania Euro2016 App Lojtari Det');

        //alert($stateParams.lojtariId);
        //$scope.playerID = 1;
        //$scope.item.pid = 1;
        //console.log($stateParams.lojtariId);
		var maxlen = 25;
        $scope.anim="zoomInDown";
        $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 50
	      });
        EkipiService.get($stateParams.lojtariId, function(data){$scope.item = data[$stateParams.lojtariId-1]; maxlen=Object.keys(data).length;});
        $ionicLoading.hide();
        //console.log($scope.item.pid);
        $scope.lojtariN = function(numri){
          if($scope.anim === "zoomInDown")
		  { $scope.anim = "zoomInUp";}
          else
		  { $scope.anim = "zoomInDown";}
           // $scope.anim="slideLeft";
           numri = $scope.item.pid +1;
		   //console.log(maxlen);
           if(numri>maxlen){numri=1;
            $scope.item.pid=1;}
           EkipiService.get(numri,function(data){$scope.item = data[numri-1]; maxlen=Object.keys(data).length;});
		   //console.log($scope.item);
           $ionicLoading.hide();
           //console.log($scope.item.pid);
           //numri = $scope.item.pid;
          // $scope.playerID = index+1;
         }
         $scope.lojtariP = function(numri){
           if($scope.anim === "zoomInUp")
              $scope.anim = "zoomInDown";
           else
            $scope.anim = "zoomInUp";
            numri = $scope.item.pid - 1;
           if(numri<1){numri=maxlen;
           $scope.item.pid=25;}
           EkipiService.get(numri,function(data){$scope.item = data[numri-1]; maxlen=Object.keys(data).length;});
           $ionicLoading.hide();
           // console.log($scope.item.pid);
           //numri = $scope.item.pid;
           // $scope.playerID = index+1;
         }
         $timeout(function(){
           $ionicLoading.hide();
         },10000);
    })

	.controller('SettingsCtrl', function($scope, $ionicPopup) {
     ga_storage._trackPageview('#/app/settings', 'Albania settings');
		//$scope.pushNotification = { checked: true };
		//$scope.pushNews = { checked: true };
		//$scope.pushMatch = { checked: false };

		var isSubscribed = function(){
		  window.plugins.OneSignal.getIds(function(ids){
		  //alert('getIds: ' + JSON.stringify(ids));
		  if(ids["pushToken"])
			{
				$scope.pushNotification = { checked: true };
			}
			else{
				$scope.pushNotification = { checked: false };
				$scope.pushNews = { checked: false };
				$scope.pushMatch = { checked: false };
			}
		  });
		  window.plugins.OneSignal.getTags(function(tag) {
			if(tag["match"]=="true")
			{
				$scope.pushMatch = { checked: true };
			}
			else{
				$scope.pushMatch = { checked: false };
			}
			if(tag["news"]=="true")
			{
				$scope.pushNews = { checked: true };
			}
			else{
				$scope.pushNews = { checked: false };
			}
		  });
	  }
	isSubscribed();
    $scope.$on('$ionicView.enter', function(){
       isSubscribed();
    });
	$scope.$on('$ionicView.beforeEnter', function(){
       isSubscribed();
    });
		$scope.pushNotificationChange = function(data) {
			//console.log(data);
            ga_storage._trackEvent('settings', 'action', $scope.pushNotification.checked);
			console.log('Push Notification Change', $scope.pushNotification.checked);
			console.log('Push Notification Change', $scope.pushNews.checked);
			console.log('Push Notification Change', $scope.pushMatch.checked);

			if(!$scope.pushNotification.checked)
			{
				$scope.pushNotification = { checked: false };
				console.log("Unsubscribe");
				window.plugins.OneSignal.deleteTags(["news", "match"]);
				window.plugins.OneSignal.setSubscription(false);
				if(data)
				{
					console.log(data);
					$scope.pushNews = { checked: false };
					$scope.pushMatch = { checked: false };
				}
                if($scope.pushNews.checked)
				{
					console.log("Subscribe News");
					window.plugins.OneSignal.setSubscription(true);
					window.plugins.OneSignal.sendTag("news", true);
					$scope.pushNews = { checked: true };
					$scope.pushNotification = { checked: true };
				}
				if($scope.pushMatch.checked)
				{
					console.log("Subscribe Match");
					window.plugins.OneSignal.setSubscription(true);
					window.plugins.OneSignal.sendTag("match", true);
					$scope.pushMatch = { checked: true };
					$scope.pushNotification = { checked: true };
				}
			}
		    else{
				console.log("Subscribe");
				window.plugins.OneSignal.setSubscription(true);
				$scope.pushNotification = { checked: true };
				if($scope.pushNews.checked)
				{
					console.log("Subscribe News");
					window.plugins.OneSignal.sendTag("news", true);
					$scope.pushNews = { checked: true };
				}
			    else{
					console.log("UnSubscribe News");
					window.plugins.OneSignal.deleteTag("news");
					$scope.pushNews = { checked: false };
				}
				if($scope.pushMatch.checked)
				{
					console.log("Subscribe Match");
					window.plugins.OneSignal.sendTag("match", true);
					$scope.pushMatch = { checked: true };
				}
			    else{
					console.log("UnSubscribe Match");
					window.plugins.OneSignal.deleteTag("match");
					$scope.pushMatch = { checked: false };
				}
			}
		};
	})

	.controller('NdeshjetCtrl', function($scope, $sce, $timeout, $stateParams, $ionicLoading, $ionicBackdrop, $ionicPopover, NdeshjetService) {

	  ga_storage._trackPageview('#/app/ndeshjet', 'Vllaznia App Ndeshjet');

      $scope.clubId = 13;

      $scope.SezoneList = [
        { text: "1/8", value: 4 },
        { text: "Cerekfinalet", value: 5 },
        { text: "Gjysemfinalet", value: 6 },
        { text: "Finalja", value: 7 },
       ];

      //admob.showBannerAd(true);
      //$scope.sezoni_id = $scope.SezoneList[$stateParams.grId-4].value;
      $scope.sezoni_text = $scope.SezoneList[$stateParams.grId-4].text;
	  $scope.sezoni_id = $stateParams.grId;
	  //console.log($scope.sezoni_text);

      $scope.loadingIndicator = $ionicLoading.show({
	    content: 'Loading Data',
	    animation: 'fade-in',
	    showBackdrop: true,
	    maxWidth: 200,
	    showDelay: 500
	   });
     $ionicLoading.show();
     $ionicPopover.fromTemplateUrl('popover-template.html', {
        scope: $scope,
      }).then(function(popover) {
        $scope.popover = popover;
      });

      $scope.changeSezoni = function(item) {
        $scope.sezoni_text = item.text;
        $scope.sezoni_id = item.value;
        $scope.popover.hide();
        //$scope.loadingIndicator.show;
        $ionicBackdrop.retain();
        NdeshjetService.getGrNdeshje($scope.sezoni_id, function(data) {
            $scope.items = data;
            //selectPopup.close();
            $scope.popover.hide();
            $ionicBackdrop.release();
        });
      };

     NdeshjetService.getGrNdeshje($scope.sezoni_id, function(data) {
            $scope.items = data;
            $ionicLoading.hide();
        });
        $timeout(function(){
          $ionicLoading.hide();
        },10000);
      });
