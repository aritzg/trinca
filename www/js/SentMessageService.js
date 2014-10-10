angular.module('trinca.services.sentMessages', [])


    .factory('SentMessageService', function ($rootScope) {
        $rootScope.sentMessages;
        $rootScope.messages;

        var service ={

            loadSentMessages: function (user) {

                var SentMessage = Parse.Object.extend("SentMessage");
                var query = new Parse.Query(SentMessage);
                query.equalTo("toUser", user);
                query.descending("createdAt");
                query.find({
                    success: function (results) {
                        $rootScope.sentMessages = results;

                    },
                    error: function (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });

                var Message = Parse.Object.extend("Message");
                var queryMsg = new Parse.Query(Message);
                queryMsg.descending("createdAt");
                queryMsg.find({
                    success: function (results) {
                        $rootScope.messages = results;
                    },
                    error: function (error) {
                        alert("Error: " + error.code + " " + error.message);
                    }
                });

            },
            countUnread: function () {
                return  _.filter( $rootScope.sentMessages, function(sentMsg){ return  typeof sentMsg.get("readDate") === 'undefined'; }).length;
            }
            ,
            getMessages: function () {
                return   $rootScope.sentMessages;
            },
            getMessageBody: function (sentMessage) {
                return _.filter($rootScope.messages, function(message){return sentMessage.get("message").id==message.id})[0].get("text");
            },
            getMessageTitle: function (sentMessage) {
                return _.filter($rootScope.messages, function(message){return sentMessage.get("message").id==message.id})[0].get("title");
            },
            markAsRead: function (sentMessage) {
                var readDate = sentMessage.get("readDate");
                if(typeof readDate === 'undefined'){
                    sentMessage.set("readDate", new Date());

                    sentMessage.save({
                        success: function(gameScore) {
                    },
                    error: function(gameScore, error) {
                        alert('Failed marking message as read, with error code: ' + error.message);
                    }}
                    );
                }
            },
            isReadClass : function (sentMessage) {
                var readDate = sentMessage.get("readDate");
                if(typeof readDate === 'undefined'){
                   return ('not-read');
                }
                else{
                    return ('read');
                }
            }
        }
        return  service;
    });
