"use strict";

//CONTROLLERS
function ADController($scope, adServices) {

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
