angular.module('albania.controllers', [])

.controller('AppCtrl', function($scope, $ionicPopup) {
   if(navigator.splashscreen){
      navigator.splashscreen.hide();
   }
   $scope.menu = true;
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
        var timerhide = 10000;
        ga_storage._trackPageview('#/app/index', 'Albania App Index');
        if(navigator.splashscreen){
           navigator.splashscreen.hide();
        }

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
        // alert("Notification received:\n" + JSON.stringify(message));
         $scope.titulli=message.additionalData.title;
         $scope.teksti=message.message;
         //$scope.dati = JSON.stringify(message);
         $scope.modal.show();
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
      },timerhide);

      })

    .controller('LajmeCtrl', function($scope, $sce, $timeout, $ionicLoading, LajmeService) {
      ga_storage._trackPageview('#/app/lajmet', 'Vllaznia App Lajmet');
      $scope.loadingIndicator = $ionicLoading.show({
	    content: 'Loading Data',
	    animation: 'fade-in',
	    showBackdrop: true,
	    maxWidth: 200,
	    showDelay: 100
	    });
      //FacebookAds.showInterstitial();
        LajmeService.getAll(function(data) {
            $scope.lajme = data;
            //console.log($scope.lajme);
            $ionicLoading.hide();
        });
        $scope.doRefresh = function() {
          LajmeService.getAll(function(data) {
            $scope.lajme = data;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
        });
       }
       $timeout(function(){
         $ionicLoading.hide();
       },5000);
    })

    .controller('LajmeDetCtrl', function($scope, $sce, $stateParams, $ionicLoading, LajmeService) {
        ga_storage._trackPageview('#/app/lajmi/'+ $stateParams.lajmiId+'', 'Vllaznia App Lajme Det');
        $scope.shareL = function(message, subject, image, link){
          ga_storage._trackEvent('Lajme', 'Share', subject);
          window.plugins.socialsharing.share(message, subject, image, link, this.onSuccess, this.onError);
        }
        $scope.loadingIndicator = $ionicLoading.show({
	        content: 'Loading Data',
	        animation: 'fade-in',
	        showBackdrop: true,
	        maxWidth: 200,
	        showDelay: 100
	      });
        $scope.lajmi = LajmeService.getId($stateParams.lajmiId);
        $ionicLoading.hide();
		admob.showInterstitial();
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
       //alert('User Tag: '+tags);
	   var isSubscribed = function(tags){
		  window.plugins.OneSignal.getTags(function(tag) {
			 //alert('Tags Received: ' + JSON.stringify(tag));
			 //alert('R2: '+tag[tags]);
			 //alert('Tags Received: ' + JSON.stringify(tag));
			if(tag[tags]=="true")
			{
				$scope.notification = true;
				$scope.anim = "ion-ios-bell";
                //alert('TAG founded: '+tag[tags]);
				//break;
			}
			else{
				$scope.notification = false;
				$scope.anim = "ion-ios-bell-outline";
			}
		  });
	    }
	   isSubscribed(tags);
	   var subscribe = function(){
		$scope.notification = true;
		$scope.anim = "ion-ios-bell";
		window.plugins.OneSignal.sendTag(tags, true);
	   }
	   var unSubscribe = function(){
		$scope.notification = false;
		$scope.anim = "ion-ios-bell-outline";
		window.plugins.OneSignal.sendTag(tags, false);
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
       (function update() {
        $timeout(update, 59000);
        NdeshjaService.getReport($stateParams.ndeshjaId, function(data) {
            $scope.item = data;
            $scope.content = data.kronika;
            $scope.percent = data.percent;
            $ionicNavBarDelegate.title(data.java);
            $ionicSlideBoxDelegate.update();
            $ionicScrollDelegate.resize();
            $ionicLoading.hide();
			      isSubscribed(tags);
        });
       }());
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
		   if($scope.notification)
		   {
				subscribe();
		   }
		   else{
				unSubscribe();
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
            $scope.$broadcast('scroll.refreshComplete');
            $ionicScrollDelegate.resize();
            $ionicScrollDelegate.scrollTop(true);
            $ionicSlideBoxDelegate.update();
            $ionicLoading.hide();
			      isSubscribed(tags);
        });
       }
    })

	.controller('GrupetCtrl', function($scope, $stateParams, $timeout, $ionicLoading, $ionicSideMenuDelegate, $ionicTabsDelegate, $ionicBackdrop, KlasifikimiGrupetService, NdeshjetService, $ionicPopover) {
     ga_storage._trackPageview('#/app/grupi', 'Euro2016 App Grupi');
     var titulliPop = "Zgjidh Grupin";
	 var valActive = 1;
     $scope.SezoneList = [
       { text: "Grupi A", value: 1 },
       { text: "Grupi B", value: 2 },
       { text: "Grupi C", value: 3 },
       { text: "Grupi D", value: 4 },
       { text: "Grupi E", value: 5 },
       { text: "Grupi F", value: 6 },
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
	     $scope.gr_id = $stateParams.grId;
       $scope.sezoni_text = $scope.SezoneList[($scope.gr_id-1)].text;

        KlasifikimiGrupetService.getAllKlasifikimi(P_ID, $scope.gr_id,function(data) {
            $scope.items = data;
            //$ionicLoading.hide();
			      $ionicSideMenuDelegate.canDragContent(false);
        });
        //console.log($scope.gr_id);
		   NdeshjetService.getGrupetNdeshje($scope.gr_id, function(data) {
            $scope.itemsN = data;
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

	    $scope.slideNext = function() {
            $ionicTabsDelegate.select(1);
       }
	   $scope.slidePrevious = function() {
            $ionicTabsDelegate.select(0);
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

	.controller('AllGrupetCtrl', function($scope, $stateParams, $timeout, $ionicLoading, $ionicSideMenuDelegate, $ionicTabsDelegate, $ionicBackdrop, KlasifikimiGrupetService, NdeshjetService, $ionicPopover) {
     ga_storage._trackPageview('#/app/grupi', 'Euro2016 App Grupi');
     var titulliPop = "Zgjidh Grupin";
	   var valActive = 0;
	   $scope.gr_id = 1;
     $scope.SezoneList = [
       { text: "Grupi A", value: 1 },
       { text: "Grupi B", value: 2 },
       { text: "Grupi C", value: 3 },
       { text: "Grupi D", value: 4 },
       { text: "Grupi E", value: 5 },
       { text: "Grupi F", value: 6 },
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

       $scope.sezoni_text = $scope.SezoneList[($scope.gr_id-1)].text;


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
			$scope.gr_id = selectedId;
			$scope.sezoni_text = $scope.SezoneList[($scope.gr_id-1)].text;
			KlasifikimiGrupetService.getAllKlasifikimi(P_ID, $scope.gr_id, function(data) {
                $scope.items = data;
			});
			NdeshjetService.getGrupetNdeshje($scope.gr_id, function(data) {
                $scope.itemsN = data;
                $ionicLoading.hide();
			});
		 }

	    $scope.slideNext = function() {
			$scope.gr_id = $scope.gr_id+1;
			if($scope.gr_id>6)
		   {$scope.gr_id=6;}
            $scope.sezoni_text = $scope.SezoneList[($scope.gr_id-1)].text;
			$ionicLoading.show();
			$scope.selectedTab($scope.gr_id);
            $ionicTabsDelegate.select($scope.gr_id-1);
       }
	   $scope.slidePrevious = function() {
		   $scope.gr_id= $scope.gr_id-1;
		   if($scope.gr_id<1)
		   {$scope.gr_id=1;}
           $scope.sezoni_text = $scope.SezoneList[($scope.gr_id-1)].text;
		   $scope.selectedTab($scope.gr_id);
           $ionicTabsDelegate.select($scope.gr_id-1);
       }

      $scope.changeSezoni = function(item) {
        $scope.sezoni_text = item.text;
        $scope.gr_id = item.value;
        $scope.sezoni_text = $scope.SezoneList[($scope.gr_id-1)].text;
        $scope.popover.hide();
        $ionicBackdrop.retain();
		$ionicLoading.show();
        KlasifikimiGrupetService.getAllKlasifikimi(P_ID, $scope.gr_id,function(data) {
            $scope.items = data;
        });
		    NdeshjetService.getGrupetNdeshje($scope.gr_id, function(data) {
            $scope.itemsN = data;
        });
		    $ionicBackdrop.release();
		    $ionicLoading.hide();
       };
       $timeout(function(){
          $ionicLoading.hide();
          //selectPopup.close();
          $scope.popover.hide();
        //  $ionicBackdrop.release();
      },10000);

    })


    .controller('LojtaretCtrl', function($scope, $timeout, $stateParams, $ionicLoading, EkipiService) {
        ga_storage._trackPageview('#/app/ekipi', 'Vllaznia App Ekipi');
        $scope.sezoni_id ='superliga';
        $scope.ekipiId =13;
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

    .controller('LojtaretDetCtrl', function($scope, $stateParams, $timeout, $ionicLoading, EkipiService) {
        ga_storage._trackPageview('#/app/ekipi/'+ $stateParams.lojtariId+'', 'Vllaznia App Lojtari Det');
        //alert($stateParams.lojtariId);
        //$scope.playerID = 1;
       //$scope.item.pid = 1;
        //console.log($stateParams.lojtariId);
        $scope.anim="";
        $scope.loadingIndicator = $ionicLoading.show({
	         content: 'Loading Data',
	         animation: 'fade-in',
	         showBackdrop: true,
	         maxWidth: 200,
	         showDelay: 50
	      });
        $scope.item = EkipiService.get($stateParams.lojtariId);
        $ionicLoading.hide();
        //console.log($scope.item.pid);
        $scope.lojtariN = function(numri){
          if($scope.anim === "zoomInRight")
             $scope.anim = "zoomInLeft";
         else
            $scope.anim = "zoomInRight";
          // $scope.anim="slideLeft";
           numri = $scope.item.pid +1;
           if(numri>25){numri=1;
            $scope.item.pid=1;}
           $scope.item = EkipiService.get(numri);
           $ionicLoading.hide();
           //console.log($scope.item.pid);
           //numri = $scope.item.pid;
          // $scope.playerID = index+1;
         }
         $scope.lojtariP = function(numri){
           if($scope.anim === "zoomInRight")
              $scope.anim = "zoomInLeft";
           else
            $scope.anim = "zoomInRight";
           numri = $scope.item.pid - 1;
           if(numri<1){numri=25;
           $scope.item.pid=25;}
           $scope.item = EkipiService.get(numri);
           $ionicLoading.hide();
          // console.log($scope.item.pid);
           //numri = $scope.item.pid;
          // $scope.playerID = index+1;
         }
         $timeout(function(){
           $ionicLoading.hide();
         },6000);
    })

	.controller('NdeshjetCtrl', function($scope, $sce, $timeout, $stateParams, $ionicLoading, $ionicBackdrop, $ionicPopover, NdeshjetService) {

	  ga_storage._trackPageview('#/app/ndeshjet', 'Vllaznia App Ndeshjet');

      $scope.clubId = 13;

      $scope.SezoneList = [
        { text: "1/16", value: 4 },
        { text: "1/8", value: 5 },
        { text: "Cerekfinalet", value: 6 },
        { text: "Gjysemfinalet", value: 7 },
        { text: "Finalja", value: 8 }
       ];

      //admob.showBannerAd(true);
      $scope.sezoni_id = $scope.SezoneList[0].value;
      $scope.sezoni_text = $scope.SezoneList[0].text;
	  $scope.sezoni_id = $stateParams.grId;

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
