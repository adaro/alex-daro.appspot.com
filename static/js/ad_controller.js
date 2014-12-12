"use strict";

//CONTROLLERS
function ADController($scope, adServices) {

    $scope.openRightMenu = function() {

    };

    var moviePromise = adServices.getMSData(); //use msServices to get csv data
      moviePromise.then(function (data) {
          $scope.movieData = data; // movieData
      });


    $scope.submitForm = function(data, form) {
        console.log(data);
        if ( !form.$valid ) {

        }
        else {
            console.log("posting");
            adServices.post(data, form).then(function(response) {
                console.log(response);
            })
        }
    }

}