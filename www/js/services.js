angular.module('trinca.services', [])


.factory('AdUtilService', function() {

        //var publisherID = '80187188f458cfde788d961b6882fd53';//TESTING
        var publisherID = '576cb3fbb172f6686420dd47278cf4b6';//REAL
  return {




    adRequestURL: function (){
       return 'http://my.mobfox.com/request.php?rt=api&r_type=native&r_resp=json&s=' + publisherID+ '&n_img=icon&n_txt=headline&u=' + navigator.userAgent + '&i='+ device_ip + '&v=3.0';
    }/*,
    userAgent: function() {
      return navigator.userAgent;
    },
    publisherID: function() {
      //return '576cb3fbb172f6686420dd47278cf4b6';//REAL
      return '80187188f458cfde788d961b6882fd53';//TESTING

    }*/
  }
});
