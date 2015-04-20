'use strict';

var mod = angular.module('angular-sly-directive', []);

mod.directive('sly', function() {
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
