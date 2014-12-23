angular.module('trinca.services.installation', [])


    .factory('InstallationService', function ($state, $rootScope, $ionicPlatform) {
 
        var service = {

            bindInstallation: function (user) {
                if(typeof installation === 'undefined'){
                    alert('this is not an installation!');
                }
                else{
                    installation.getInstallationId(
                        function(successParam) {
                            var installationQuery = new Parse.Query(Parse.Installation);
                            
                            installationQuery.equalTo('installationId', successParam.installationId);
                            installationQuery.find({
                                success: function (results) {
                                    inst = results[0];
                                    inst.set('user', currentUser);
                                    inst.save({success: function () {alert('yep')}});
                                },
                                error: function(error) {
                                    // Handle error
                                    alert("Error" + error.code + " : " + error.message);
                                }
                            });
                        }
                    );    
                }
                
            },
            bindUser: function (user) {
                if(typeof installation === 'undefined'){
                    alert('this is not an installation!');
                }
                else{
                    installation.bindUser(
                        user,
                        function(successParam) {
                            alert('thatscool!');
                        }
                    );    
                }
                
            }
        }
        return  service;
    });
