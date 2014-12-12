'use strict';

//MODULE
// Setting up our angular module.
// This is where we would depndency inject other modules.
var adApp = angular.module('adApp', ['ngMaterial'])
    .controller("ADController", function($scope, $mdSidenav) {

          $scope.openRightMenu = function() {
            $mdSidenav('right').open();
          };

          $scope.close = function() {
            $mdSidenav('left').close();
            };
});

//SERVICES
// facotry service used for passing our singletons,
// along with get and post objects to the controller
adApp.factory('adServices', function ($http) {
	return {

        formData: {
            name:null,
            email:null,
            subject:null,
            message:null

        },

        getMSData: function() {
            console.log("ahoy mate")
		    //return the promise directly.
			return $http.get('/get', {
			})
			.then(function (results) {
				return results.data;
			});
        },

		get: function() {
		//return the promise directly.
			return $http.get('/rss', {
				params: { format: "json" }
			})
			.then(function (results) {
				return results.data;
			});
		},

		post: function (data, form) {
            console.log(data)
            return $http.post('/post', {form: form, data: data}, {
            })
            .then(function (result) {
                //resolve the promise as the result
                return result.data;
            });
		}
	}
});

