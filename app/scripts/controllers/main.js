'use strict';

/**
 * @ngdoc function
 * @name angularStates.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularStatesApp
 */
angular.module('angularStates')
.controller('MainCtrl', ['$scope', 'otherService', function ($scope, service) {
    console.log(service.stuff, service.outraInfo);
    $scope.serviceData = {
        data1: service.stuff,
        data2: service.outraInfo,
        data3: service.singleBoolean
    };
    $scope.reset = function() {
      service.reset();
    };
    $scope.action = function() {
      service.update();
      service.save();
    };

}]);
