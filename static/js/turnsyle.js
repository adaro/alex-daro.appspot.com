//module
var turnStyle = angular.module('turnStyle', []);

//service
turnStyle.factory('turnStyleServices', function () {
    return {

        State: {
            Locked: true,
            Unlocked: false
        },

        Input: {
            coin: false,
            push: false

        }
    }
});

//controller
turnStyle.controller('TurnStyleController', ['$scope', 'turnStyleServices', function($scope, turnStyleServices) {
    var State = turnStyleServices.State;
    var Input = turnStyleServices.Input;
    Input.coin = true;
    $scope.enterTurnStyle = function (Input) {
        if (Input.coin) {
            State.Locked = false;
            State.Unlocked = true;
            console.log("Please Push Through...")
            Input.push = true;
        }
        if (Input.push) {
            State.Locked = true;
            State.Unlocked = false;
            console.log("Thank you!")
        }
    };
}]);