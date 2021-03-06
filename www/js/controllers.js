angular.module('trinca.controllers', [])


    .controller('MainCtrl', function ($state, $scope, $rootScope, $ionicLoading, $ionicSideMenuDelegate,$ionicNavBarDelegate , SentMessageService, DrawService, TicketService) {

        //$ionicNavBarDelegate.showBar(false);

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

    .controller('HomeCtrl', function ($scope, $state,$http, $ionicLoading,$ionicPopup, $rootScope, AdUtilService, SentMessageService, DrawService, TicketService, InstallationService) {
        
        InstallationService.bindUser($rootScope.user);

        /*METHOD TWO*/
        $scope.adButtonClass = function () {
            if($rootScope.user.get("trincaCounter")>0){
                return '';
            }
            else{
                return 'button-outline';
            }
        } 

        $rootScope.ikusia = function () {
            var trincaCounter = $rootScope.user.get("trincaCounter");
            $rootScope.user.set("trincaCounter", $rootScope.user.get("trincaCounter")+1);
            $rootScope.user.save();
            $scope.$apply();
            var alertPopup = $ionicPopup.alert({
                title: 'Enhorabuena!',
                templateUrl: ' templates/alert/viewAd.html'
            });
        }
        
        $scope.trinca = function (draw) {
            if($rootScope.user.get("trincaCounter")>0){
                $rootScope.user.set("trincaCounter", $rootScope.user.get("trincaCounter")-1);
                $rootScope.user.save();
                TicketService.addTicket($scope, $rootScope.user, draw);
            }
            else{
                alert('No has activado esta opción! ;)');
            }
        }  
        /*METHOD TWO END*/

        /*SHARE ON FB*/

        $scope.shareFB = function (draw) {

            var dialogOpts = {
                method: "feed",
                link: "https://play.google.com/store/apps/details?id=net.sareweb.trinca",
                picture:"https://s3.amazonaws.com/ugc_production.parse.com/parse_app_metadata/119838/icon.png?1418911666",
                caption: "Boletos de Euromillones Gratis con Trinca!",
                description: "He jugado gratis en Trinca para los números " 
                                + draw.get("betNum1") + ","
                                + draw.get("betNum2") + ","
                                + draw.get("betNum3") + ","
                                + draw.get("betNum4") + ","
                                + draw.get("betNum5") + " y estrellas "
                                + draw.get("betStar1") + "," + draw.get("betStar2")
            }
        
            facebookConnectPlugin.showDialog(
                dialogOpts, 
                function(){
                   TicketService.addTicket($scope, $rootScope.user, draw, 3);
                }, 
                function(){alert('No se ha compartido en Facebook :(');}
            );


        }


        $scope.sumMyTickets = function (draw) {
            return TicketService.sumMyTickets(draw);
        }      

        $scope.downloadAndInitValues = function(){
            SentMessageService.loadSentMessages($rootScope.user);
            DrawService.loadDraws($scope);
            TicketService.loadMyTickets($rootScope.user);
        }
        $scope.downloadAndInitValues();

        //document.addEventListener('onLeaveToAd', clickAd);
    })

    .controller('MineCtrl', function ($scope, $state,$http, $ionicLoading, $rootScope, TicketService) {



    })


    .controller('HistCtrl', function ($scope, $rootScope, $state, $http, $ionicLoading, $rootScope, TicketService) {
        $scope.sumMyTickets = function (draw) {
            return TicketService.sumMyTickets(draw);
        }

        $scope.getMyProbForDraw = function (draw) {
            return TicketService.getMyProbForDraw(draw);
        }

        $scope.toggleDraw = function(draw) {
            if ($scope.isDrawShown(draw)) {
                $scope.shownDraw = null;
            } else {
                $scope.shownDraw = draw;
            }
        };

        $scope.isDrawShown = function(draw) {
            return $scope.shownDraw === draw;
        };

        $scope.titleClass = function(draw) {
            if(!draw.get("winner")){
                return "titulo-no-winner";
            }
            else if($rootScope.user.id==draw.get("winner").id){
                return "titulo-winner";
            }else{
                return "titulo";
            }
        };



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
        $scope.delete = function (sentMessage){
            return SentMessageService.delete(sentMessage);
        }
        $scope.isReadClass = function (sentMessage){
            return SentMessageService.isReadClass(sentMessage);
        }


    })
    .controller('SettingsCtrl', function ($scope, $rootScope) {
        $scope.form = {};
        $scope.form.alias=$rootScope.user.get("alias");

        $scope.getAlias = function (){
            if(typeof $scope.form.alias === "undefined"){
                return "<<Ponte un alias!>>";
            }
            else {
                return $scope.form.alias;
            }
        }

        $scope.save = function (){
            $rootScope.user.set("alias", $scope.form.alias);
            $rootScope.user.save();
            alert("Ajustes modificados!");
        }
        


    });