angular.module('trinca.controllers', [])


    .controller('MainCtrl', function ($state, $scope, $rootScope, $ionicLoading, $ionicSideMenuDelegate, SentMessageService, DrawService, TicketService) {

        $scope.leftButtons = [
            {
                type: 'button-icon button-clear ion-navicon',
                tap: function (e) {
                    $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
                }
            }
        ];

        $scope.toggleMenu = function () {
            $ionicSideMenuDelegate.toggleLeft($scope.$$childHead);
        };

        $scope.leftButtons = [
            {
                type: 'button-positive',
                content: '<i class="icon ion-navicon"></i>',
                tap: function (e) {
                    $scope.toggleMenu();
                }
            }
        ];



        $scope.login = {
            username: '',
            password: ''
        };

        $scope.error = {};

        $scope.login = function () {
            $ionicLoading.show({
                content: 'Logging in',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            var login = $scope.login;
            /*if(typeof login.username ==='undefined'){
                $scope.error.message = 'Dirección de correo no válida.';
                $ionicLoading.hide();
                return;
            }*/

            Parse.User.logIn(login.username.toLowerCase(), login.password, {
            //Parse.User.logIn('aritz@indaba.es', 'pf0093', {

            success: function (user) {
                    $ionicLoading.hide();
                    $rootScope.user = user;
                    //$scope.downloadAndInitValues();
                    $state.go('menu.home', {clear: true});
                    $scope.login.password='';
                },
                error: function (user, err) {
                    $ionicLoading.hide();
                    // The login failed. Check error to see why.
                    if (err.code === 101) {
                        $scope.error.message = 'Credenciales incorrectas.';
                    } else {
                        $scope.error.message = 'Error inesperado.';
                    }
                    $scope.login.password='';
                    $scope.$apply();

                }
            });
        };

        $scope.withFB = function () {

            $ionicLoading.show({
                content: 'Logging in',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            facebookConnectPlugin.logout(
                null,
                function (error) { /alert("LogoutError" + error); alert('1')*/ }
            );


            var getEmailFromFB = function (userData) {
                facebookConnectPlugin.api(
                    "/me",["email"],
                    function (obj) {
                        loginToParse(userData, obj.email);
                    },
                    function (err) {
                        alert(err);
                    }
                );
            }

            var loginToParse = function (userData, email) {

                var facebookAuthData = {
                    "id": userData.authResponse['userID']+"",
                    "access_token": userData.authResponse["accessToken"]
                    ,"expiration_date": "2016-08-27T00:14:14.832Z"
                };

                Parse.FacebookUtils.logIn(facebookAuthData, {
                    success: function (user) {
                        user.set("email", email);
                        user.save({success: function () { }});
                        $rootScope.user = user;
                        $ionicLoading.hide();
                        //$scope.downloadAndInitValues();
                        $state.go('menu.home', {clear: true});
                    },
                    error: function (user, error) {
                        alert("User cancelled the Facebook login or did not fully authorize.");
                        $ionicLoading.hide();
                    }
                });
            }

            facebookConnectPlugin.login(["email"],
                getEmailFromFB,
                function (error) {$ionicLoading.hide(); alert("LOgin error " + error) }
            );

        };

        $scope.logout = function () {
            Parse.User.logOut();
            $rootScope.user = null;
            $state.go('intro', {clear: true});
            $scope.dataLoaded=false;
        };

        $scope.forgot = function () {
            $state.go('forgot');
        };

        $scope.signUp = function () {
            $state.go('register');
        };

        $scope.getUnreadMsgNum = function () {
            return(SentMessageService.countUnread());
        }

    })

    .controller('ForgotPasswordCtrl', function ($scope, $state,
                                                      $ionicLoading) {
        $scope.user = {};
        $scope.error = {};
        $scope.state = {
            success: false
        };

        $scope.reset = function () {
            $scope.loading = $ionicLoading.show({
                content: 'Sending',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            Parse.User.requestPasswordReset($scope.user.email, {
                success: function() {
                    // TODO: show success
                    $scope.loading.hide();
                    $scope.state.success = true;
                    $scope.$apply();
                },
                error: function(err) {
                    $scope.loading.hide();
                    if (err.code === 125) {
                        $scope.error.message = 'Email address does not exist';
                    } else {
                        $scope.error.message = 'An unknown error has occurred, ' +
                            'please try again';
                    }
                    $scope.$apply();
                }
            });
        };

        $scope.login = function () {
            $state.go('intro');
        };
    })

    .controller('RegisterCtrl', function ($scope, $state, $ionicLoading, $rootScope) {
        $scope.user = {};
        $scope.error = {};

        $scope.register = function () {

            // TODO: add age verification step

            $scope.loading = $ionicLoading.show({
                content: 'Sending',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });

            var user = new Parse.User();
            user.set("username", $scope.user.email);
            user.set("password", $scope.user.password);
            user.set("email", $scope.user.email);

            user.signUp(null, {
                success: function (user) {
                    $scope.loading.hide();
                    $rootScope.user = user;
                    $state.go('menu.home', {clear: true});
                },
                error: function (user, error) {
                    $scope.loading.hide();
                    if (error.code === 125) {
                        $scope.error.message = 'Please specify a valid email ' +
                            'address';
                    } else if (error.code === 202) {
                        $scope.error.message = 'The email address is already ' +
                            'registered';
                    } else {
                        alert('doh!' + error.code);
                        $scope.error.message = error.message;
                    }
                    $scope.$apply();
                }
            });
        };
    })

    .controller('AdTestCtrl', function ($scope, $http, AdUtilService) {
        var adRequestURL = AdUtilService.adRequestURL();
        $http.get(
            adRequestURL,
            { headers: {
                'Access-Control-Allow-Origin': '*'}
            }
        ).
        success(function (data, status) {
            if(status==200){

               $scope.click_url=data.click_url;
                $scope.img_url=data.imageassets.icon.url;

             }

        })

        .error(function (data) {
            alert("Error obteniendo anuncio");
        });


    })

    .controller('HomeCtrl', function ($scope, $state,$http, $ionicLoading, $rootScope, AdUtilService, SentMessageService, DrawService, TicketService) {


        $scope.sumMyTickets = function (draw) {
            return TicketService.sumMyTickets(draw);
        }


        $scope.viewAd = function (draw) {

            var adRequestURL = AdUtilService.adRequestURL();
            $http.get(
                adRequestURL,
                { headers: {
                    'Access-Control-Allow-Origin': '*'}
                }
            ).
                success(function (data, status) {
                    if(status==200){

                        window.open(data.click_url, '_blank', 'location=yes');

                        TicketService.addTicket($scope, $rootScope.user, draw);
                    }
                })

                .error(function (data) {

                    alert("Error obteniendo anuncio");
                });

        }


        $scope.downloadAndInitValues = function(){
            SentMessageService.loadSentMessages($rootScope.user);
            DrawService.loadDraws($scope);
            TicketService.loadMyTickets($rootScope.user);
        }
        $scope.downloadAndInitValues();

    })

    .controller('MineCtrl', function ($scope, $state,$http, $ionicLoading, $rootScope, TicketService) {



    })


    .controller('HistCtrl', function ($scope, $state,$http, $ionicLoading, $rootScope, TicketService) {
        $scope.sumMyTickets = function (draw) {
            return TicketService.sumMyTickets(draw);
        }

        $scope.getMyProbForDraw = function (draw) {
            return TicketService.getMyProbForDraw(draw);
        }

        $scope.getWinner = function (draw) {
            var winner = draw.get("winner");
            winner.fetch({
                success: function(winner) {
                    $scope.$apply();
                }
            });

            return winner.get("email");
        }


    })

    .controller('StatsCtrl', function ($scope, $state) {

        $scope.mostFreq;
        $scope.userCount;
        $scope.playedDraws;
        $scope.totalPrize;
        $scope.activeDraws;


        //Most freq. nums
        var Draw = Parse.Object.extend("Draw");
        var query = new Parse.Query(Draw);
        query.equalTo("type", "stat");
        query.find({
            success: function (results) {
                $scope.mostFreq = results[0];
                $scope.$apply();
            },
            error: function (object, error) {

            }
        });

        //User count
        var query = new Parse.Query(Parse.User);
        query.find({
            success: function (allUsers) {
                $scope.userCount = allUsers.length;
                $scope.$apply();
            }
        });

        //played Draws
        query = new Parse.Query(Draw);
        query.equalTo("type", "bet");
        query.equalTo("state", "finished");
        query.exists("closedDate");
        query.find({
            success: function (results) {
                $scope.playedDraws = results.length;
                $scope.totalPrize = _.reduce(results, function (memo, draw) {
                    return memo + draw.get("prize");
                }, 0);
                $scope.$apply();
            }
        });

        //Active Draws
        query = new Parse.Query(Draw);
        query.doesNotExist("closedDate");
        query.equalTo("type", "bet");
        query.find({
            success: function (results) {
                $scope.activeDraws = results.length;
                $scope.$apply();
            }
        });

    })
    .controller('MessagesCtrl', function ($scope, SentMessageService) {

        $scope.getMessageTitle = function (sentMessage){
            return SentMessageService.getMessageTitle(sentMessage);
        }
        $scope.getMessageBody = function (sentMessage){
            return SentMessageService.getMessageBody(sentMessage);
        }
        $scope.markAsRead = function (sentMessage){
            return SentMessageService.markAsRead(sentMessage);
        }
        $scope.isReadClass = function (sentMessage){
            return SentMessageService.isReadClass(sentMessage);
        }


    })




    .directive('stellax', function ($timeout) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attr) {

                $timeout(function () {
                    $('.scroll').stellar({
                        scrollProperty: 'transform',
                        positionProperty: 'transform',
                        horizontalScrolling: false,
                        verticalOffset: -150
                    });
                });



            }
        };
    });