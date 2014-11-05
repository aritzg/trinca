// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:

var _ = require('underscore');

Parse.Cloud.define("hello", function (request, response) {
    response.success("Hello world!");
});


Parse.Cloud.afterSave("Message", function (request) {
    query = new Parse.Query("User");
    if (request.object.get('type') == 'broadcast' && request.object.get('state') == 'new') {
        query.find({
            success: function (results) {

                for (var i = 0; i < results.length; i++) {
                    var user = results[i];
                    var SentMessage = Parse.Object.extend("SentMessage");
                    var sentMessage = new SentMessage();
                    sentMessage.set('toUser', user);
                    sentMessage.set('message', request.object);
                    sentMessage.save({success: function () {
                    }});
                }
                request.object.set('state', 'sent');
                request.object.save({success: function () {
                }});
            },
            error: function (error) {

            }
        });

    }
});

Parse.Cloud.afterSave("_User", function (request) {

    if (!request.object.existed()) {

        query = new Parse.Query('Message');
        query.equalTo('type', 'welcome');
        query.find({
            success: function (results) {
                message = results[0];
                var SentMessage = Parse.Object.extend('SentMessage');
                var sentMessage = new SentMessage();
                sentMessage.set('toUser', request.object);
                sentMessage.set('message', message);
                sentMessage.save({success: function () {
                }});

            },
            error: function (error) {
                console.error("Got an error " + error.code + " : " + error.message);
            }
        });
    }
});

Parse.Cloud.afterSave("Draw", function (request) {
    if(request.object.get('state')=='new' && request.object.get('type')=='bet'){
        var Message = Parse.Object.extend("Message");
        var message = new Message();
        message.set('title','Creado Trinca#' + request.object.get('drawNum'));
        message.set('text', 'Participa y gana GRATIS el boleto ' + request.object.get('betNum1') + ', '+ request.object.get('betNum2') + ', '+ request.object.get('betNum3') + ', '+ request.object.get('betNum4') + ', '+ request.object.get('betNum5') + ' y estrellas ' + request.object.get('betStar1') + ', '+ request.object.get('betStar2'));
        message.set('type','broadcast');
        message.set('state','new');
        message.save({success: function () {
        }});

        request.object.set('state', 'ongoing');
        request.object.save({success: function () {
        }});

    }
    else if(request.object.get('state')=='closed' && request.object.get('type')=='bet'){

        query = new Parse.Query("Ticket");
        query.equalTo('drawId', request.object);
        query.find({
            success: function (results) {
                winnerTicket = _.shuffle(results)[0];
                winner = winnerTicket.get('user');

                winner.fetch({
                  success: function(winner) {
                    console.log("And the winner is " + winner.get('email'));

                    var Message = Parse.Object.extend("Message");
                    var message = new Message();
                    message.set('title','Finalizado Trinca#' + request.object.get('drawNum'));
                    message.set('text', 'Se ha finalizado el Trinca#' + request.object.get('drawNum') + '. El ganador se lleva un boleto premiado con ' + request.object.get('prize') + ' Euros.');
                    message.set('type','broadcast');
                    message.set('state','new');
                    message.save({success: function () {
                    }});

                    message = new Message();
                    message.set('title','Felicifades! Ganador de Trinca#' + request.object.get('drawNum'));
                    message.set('text', 'Has ganado elTrinca#' + request.object.get('drawNum') + '. Nos pondremos en contacto para entregarte el boleto premiado con ' + request.object.get('prize') + ' Euros.');
                    message.set('type','prize');
                    message.set('state','new');
                    message.save({success: function () {
                        var SentMessage = Parse.Object.extend("SentMessage");
                        var sentMessage = new SentMessage();
                        sentMessage.set('toUser', winner);
                        sentMessage.set('message', message);
                        sentMessage.save({success: function () {
                        }});
                    }});

                    request.object.set('closedDate', new Date());
                    request.object.set('state', 'finished');
                    request.object.set('winner', winner);

                    request.object.save({success: function () {
                    }});
                  },
                  error: function(myObject, error) {
                    
                  }
                });

                


            },
            error: function (error) {
                console.error("Got an error " + error.code + " : " + error.message);
            }
        });



    }

});

Parse.Cloud.afterSave("Ticket", function (request) {

    query = new Parse.Query('Draw');
    query.get(request.object.get('drawId').id, {
        success: function(draw) {
            if(draw.get('state')=='ongoing' && draw.get('type')=='bet'){
                console.log('Incrementar num de trincas');
                var totalTicketCount = draw.get('totalTicketCount');
                if(typeof totalTicketCount === 'undefined'){
                    totalTicketCount=0;
                }
                totalTicketCount+=request.object.get('value');
                draw.set('totalTicketCount', totalTicketCount);

                console.log('Incrementar num de participantes');
                var participantCount = draw.get('participantCount');
                if(typeof participantCount === 'undefined'){
                    participantCount=0;
                }
                participantCount+=1;
                draw.set('participantCount', participantCount);

                draw.save();
            }

        },
        error: function(error) {
            console.error("Got an error " + error.code + " : " + error.message);
        }
    });

});
