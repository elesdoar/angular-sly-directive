/*! angular-sly-directive - v0.1.0 - 2015-04-20 */

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
