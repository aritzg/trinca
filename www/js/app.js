// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'trinca.controllers', 'trinca.services', 'trinca.services.sentMessages', 'trinca.services.draws', 'trinca.services.tickets'])


    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive

            .state('intro', {
                url: '/intro',
                templateUrl: "templates/intro.html"

            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })
            .state('forgot', {
                url: '/forgot',
                templateUrl: 'templates/forgotPassword.html',
                controller: 'ForgotPasswordCtrl'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl'
            })
            .state('menu', {
                url: "/event",
                abstract: true,
                templateUrl: "templates/menu/menu.html"
            })
            .state('menu.home', {
                url: '/home',
                views: {
                    'menuContent': {
                        templateUrl: "templates/home.html",
                        controller: 'HomeCtrl'
                    }
                }

            })
            .state('menu.mine', {
                url: '/mine',
                views: {
                    'menuContent': {
                        templateUrl: "templates/mine.html",
                        controller: 'MineCtrl'
                    }
                }

            })
            .state('menu.hist', {
                url: '/hist',
                views: {
                    'menuContent': {
                        templateUrl: "templates/hist.html",
                        controller: 'HistCtrl'
                    }
                }

            })
            .state('menu.stats', {
                url: '/stats',
                views: {
                    'menuContent': {
                        templateUrl: "templates/stats.html",
                        controller: 'StatsCtrl'
                    }
                }

            })
            .state('menu.messages', {
                url: '/messages',
                views: {
                    'menuContent': {
                        templateUrl: "templates/messages.html",
                        controller: 'MessagesCtrl'
                    }
                }

            })
            .state('menu.howto', {
                url: '/howto',
                views: {
                    'menuContent': {
                        templateUrl: "templates/howto.html"
                    }
                }

            })
            .state('menu.ad_test', {
                url: '/ad_test',
                views: {
                    'menuContent': {
                        templateUrl: "templates/ad_test.html",
                        controller: "AdTestCtrl"
                    }
                }

            });

        // if none of the above states are matched, use this as the fallback
        //$urlRouterProvider.otherwise('/intro');

    })
    .run(function ($state, $rootScope) {
        var APP_ID = 'OlBVD14oguSdo4Q5DSHPXGQ3SNT599AV9vPGfidO';
        var JS_KEY = 'JtAliBkwz4c57Tg2j8FowBItbYfZUVAJ7kO179I2';
        var FB_APP_ID = '783512515021469';



        Parse.initialize(APP_ID, JS_KEY);

        var currentUser = Parse.User.current();
        if (currentUser) {
            $rootScope.user = currentUser;
            $state.go('menu.home', {clear: true});
        }else{
            $state.go('intro', {clear: true});
        }


        window.fbAsyncInit = function() {
            Parse.FacebookUtils.init({
                appId      : FB_APP_ID,
                cookie     : true,
                xfbml      : true
            });
        };

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/all.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));



        ionic.Platform.ready(function(){
           
           onDeviceReady()
        });

        function onDeviceReady() {
            initAd();

            window.plugins.AdMob.createBannerView();
            
            
            // prepare the interstitial
            //window.plugins.AdMob.createInterstitialView({}, function(){alert('OK0');}, function(){alert('ERR0');});

            // somewhere else, show the interstital, not needed if set autoShow = true
            //window.plugins.AdMob.showInterstitialAd({}, function(){alert('OK1');}, function(){alert('ERR1');});
        }

        function initAd(){
            
            if ( window.plugins && window.plugins.AdMob ) {
                var ad_units = {
                    ios : {
                        banner: 'xxxxx',
                        interstitial: 'xxxxx'
                    },
                    android : {
                        banner: 'ca-app-pub-1260905809309513/4572137630',
                        interstitial: 'ca-app-pub-1260905809309513/4888365238'
                    },
                    wp8 : {
                        banner: 'xxxxx',
                        interstitial: 'xxxxx'
                    }
                };
                var admobid = "";
                if( /(android)/i.test(navigator.userAgent) ) {
                    admobid = ad_units.android;
                } else if(/(iphone|ipad)/i.test(navigator.userAgent)) {
                    admobid = ad_units.ios;
                } else {
                    admobid = ad_units.wp8;
                }

               
                window.plugins.AdMob.setOptions( {
                    publisherId: admobid.banner,
                    interstitialAdId: admobid.interstitial,
                    bannerAtTop: false, // set to true, to put banner at top
                    overlap: true, // set to true, to allow banner overlap webview
                    offsetTopBar: true, // set to true to avoid ios7 status bar overlap
                    isTesting: true, // receiving test ad
                    autoShow: true // auto show interstitial ad when loaded
                });

                registerAdEvents();

            } else {
                //alert( 'admob plugin not ready' );
            }
        }

        function registerAdEvents() {
            document.addEventListener('onReceiveAd', function(){window.plugins.AdMob.showAd();});
            document.addEventListener('onFailedToReceiveAd', function(data){});
            document.addEventListener('onPresentAd', function(){});
            document.addEventListener('onDismissAd', function(){});
            document.addEventListener('onLeaveToAd', function(){});
            document.addEventListener('onReceiveInterstitialAd', function(){});
            document.addEventListener('onPresentInterstitialAd', function(){});
            document.addEventListener('onDismissInterstitialAd', function(){alert('Dismiss!');});
        }



    });
