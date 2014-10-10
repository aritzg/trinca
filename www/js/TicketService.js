angular.module('trinca.services.tickets', [])


    .factory('TicketService', function ($rootScope, DrawService) {
        $rootScope.myTickets;


        var service = {

            loadMyTickets: function (user) {

                var Ticket = Parse.Object.extend("Ticket");
                var queryTicket = new Parse.Query(Ticket);
                queryTicket.equalTo("user", user);
                queryTicket.find({
                    success: function (results) {
                        $rootScope.myTickets = results;
                        var drawIds = [];
                        for(i=0;i<$rootScope.myTickets.length;i++){
                            drawIds.push($rootScope.myTickets[i].get("drawId").id);
                        }
                        DrawService.loadMyDraws(_.uniq(drawIds));
                    },
                    error: function (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });
            },
            addTicket: function ($scope, user, draw) {

                var Ticket = Parse.Object.extend("Ticket");
                var ticket = new Ticket();
                ticket.set("drawId", draw);
                ticket.set("user", user);
                ticket.set("value", 1);
                ticket.save({success: function () {
                    $rootScope.myTickets.push(ticket);
                    $scope.$apply();
                }});
            },
            sumMyTickets: function (draw) {
                var drawId = draw.id;
                var filtered = _.filter($rootScope.myTickets, function (ticket) {
                    return drawId == ticket.get("drawId").id;
                });
                if(filtered.length==0) return 0;

                var sum = _.reduce(filtered, function (memo, ticket) {
                    return memo + ticket.get("value");
                }, 0);

                return(sum);
            },
            getMyProbForDraw: function(draw){
                var totalTicketCount = draw.get('totalTicketCount');
                if(totalTicketCount==0) return 0;
                return (this.sumMyTickets(draw) / totalTicketCount)*100;
            }
        }
        return  service;
    });
