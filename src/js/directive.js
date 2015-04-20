'use strict';

var mod = angular.module('angular-sly-directive', []);

mod.directive('angular-sly', function() {
  return {
    restrict: 'E',
    scope: {

    },
    template: '<div class="angular-sly"></div>',
    transclude: true,
    link: function() {

    }
  };
});
