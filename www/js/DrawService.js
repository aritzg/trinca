angular.module('trinca.services.draws', [])


    .factory('DrawService', function ($rootScope) {
        $rootScope.draws;
        $rootScope.openDraws;
        $rootScope.closedDraws;
        $rootScope.myDraws;


        var service ={

            loadDraws: function ($scope) {

                var Draw = Parse.Object.extend("Draw");
                var query = new Parse.Query(Draw);
                //query.doesNotExist("closedDate");
                query.descending("drawDate");
                query.equalTo("type", "bet");
                query.find({
                    success: function (results) {
                        $rootScope.draws = results;
                        $rootScope.openDraws = _.filter(results, function(draw){return draw.get("state")=='ongoing'});
                        $rootScope.closedDraws = _.filter(results, function(draw){return draw.get("state")=='finished'});
                        $scope.$apply();
                    },
                    error: function (object, error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });

            },

            loadMyDraws: function (drawIds) {
                var Draw = Parse.Object.extend("Draw");

                var query = new Parse.Query(Draw);
                //query.doesNotExist("closedDate");
                query.containedIn("objectId", drawIds);
                query.find({
                    success: function (results) {
                        $rootScope.myDraws=results;
                    },
                    error: function (object, error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });


            }
        }
        return  service;
    });
