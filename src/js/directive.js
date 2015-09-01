'use strict';

var mod = angular.module('angular-sly-directive', []);

mod.directive('sly', function($timeout, $log) {
  var defaults = {
    horizontal: false, // Switch to horizontal mode.

    // Item based navigation
    itemNav:        'basic',  // Item navigation type. Can be: 'basic', 'centered', 'forceCentered'.
    itemSelector:   '.angular-sly-slide',  // Select only items that match this selector.
    smart:          false, // Repositions the activated item to help with further navigation.
    activateOn:     null,  // Activate an item on this event. Can be: 'click', 'mouseenter', ...
    activateMiddle: false, // Always activate the item in the middle of the FRAME. forceCentered only.

    // Scrolling
    scrollSource: null,  // Element for catching the mouse wheel scrolling. Default is FRAME.
    scrollBy:     0,     // Pixels or items to move per one mouse scroll. 0 to disable scrolling.
    scrollHijack: 300,   // Milliseconds since last wheel event after which it is acceptable to hijack global scroll.
    scrollTrap:   false, // Don't bubble scrolling when hitting scrolling limits.

    // Dragging
    dragSource:    null,  // Selector or DOM element for catching dragging events. Default is FRAME.
    mouseDragging: false, // Enable navigation by dragging the SLIDEE with mouse cursor.
    touchDragging: false, // Enable navigation by dragging the SLIDEE with touch events.
    releaseSwing:  false, // Ease out on dragging swing release.
    swingSpeed:    0.2,   // Swing synchronization speed, where: 1 = instant, 0 = infinite.
    elasticBounds: false, // Stretch SLIDEE position limits when dragging past FRAME boundaries.
    interactive:   null,  // Selector for special interactive elements.

    // Scrollbar
    scrollBar:     null,  // Selector or DOM element for scrollbar container.
    dragHandle:    false, // Whether the scrollbar handle should be draggable.
    dynamicHandle: false, // Scrollbar handle represents the ratio between hidden and visible content.
    minHandleSize: 50,    // Minimal height or width (depends on sly direction) of a handle in pixels.
    clickBar:      false, // Enable navigation by clicking on scrollbar.
    syncSpeed:     0.5,   // Handle => SLIDEE synchronization speed, where: 1 = instant, 0 = infinite.

    // Pagesbar
    pagesBar:       null, // Selector or DOM element for pages bar container.
    activatePageOn: null, // Event used to activate page. Can be: click, mouseenter, ...
    pageBuilder:          // Page item generator.
      function (index) {
        return '<li>' + (index + 1) + '</li>';
      },

    // Navigation buttons
    forward:  null, // Selector or DOM element for "forward movement" button.
    backward: null, // Selector or DOM element for "backward movement" button.
    prev:     null, // Selector or DOM element for "previous item" button.
    next:     null, // Selector or DOM element for "next item" button.
    prevPage: null, // Selector or DOM element for "previous page" button.
    nextPage: null, // Selector or DOM element for "next page" button.

    // Automated cycling
    cycleBy:       null,  // Enable automatic cycling by 'items' or 'pages'.
    cycleInterval: 5000,  // Delay between cycles in milliseconds.
    pauseOnHover:  false, // Pause cycling when mouse hovers over the FRAME.
    startPaused:   false, // Whether to start in paused sate.

    // Mixed options
    moveBy:        300,     // Speed in pixels per second used by forward and backward buttons.
    speed:         0,       // Animations speed in milliseconds. 0 to disable animations.
    easing:        'swing', // Easing for duration based (tweening) animations.
    startAt:       null,    // Starting offset in pixels or items.
    keyboardNavBy: null,    // Enable keyboard navigation by 'items' or 'pages'.

    // Classes
    draggedClass:  'dragged', // Class for dragged elements (like SLIDEE or scrollbar handle).
    activeClass:   'active',  // Class for active items and pages.
    disabledClass: 'disabled' // Class for disabled navigation elements.
  };

  return {
    restrict: 'E',
    scope: {
      options: '=',
      change: '&'
    },
    replace: true,
    template: '<div class="angular-sly"><div class="angular-sly-slides clearfix" ng-transclude></div></div>',
    transclude: true,
    controller: function($scope) {
      angular.extend($scope, {
        reload: function() {
          if(angular.isDefined($scope.element)) {
            $scope.element.sly('reload');
          }
        },
        slideTo: function(position, immediate, noActivate) {
          if(angular.isDefined($scope.element)) {
            if(!noActivate) {
              $scope.element.sly('activate', position);
            }
            $scope.element.sly('slideTo', position, immediate);
          }
        },
        activate: function(index) {
          $scope.element.sly('activate', index);
        },
        toStart: function(position, immediate) {
          if(angular.isDefined($scope.element)) {
            $scope.element.sly('toStart', position, immediate);
          }
        },
        toCenter: function(position, immediate) {
          if(angular.isDefined($scope.element)) {
            $scope.element.sly('toCenter', position, immediate);
          }
        },
        toEnd: function(position, immediate) {
          if(angular.isDefined($scope.element)) {
            $scope.element.sly('toEnd', position, immediate);
          }
        }
      });
      $log.info('Sly Controller', $scope);
    },
    link: function(scope, element) {
      scope.element = element;
      var options = angular.copy(defaults);
      angular.extend(options, scope.options);
      options.scrollSource = options.scrollSource === null? element:options.scrollSource;
      options.dragSource = options.dragSource === null? element:options.dragSource;

      var $wrap = element.parent();
      var scrollBar = $wrap.find('.angular-sly-scroll');
      var controls = $wrap.find('.angular-sly-controls');
      if(scrollBar.size() > 0) {
        scrollBar.addClass(options.horizontal? 'horizontal':'vertical');
        options.scrollBar = scrollBar;
      }

      if(controls.size() > 0) {
        options.prev = controls.find('.angular-sly-prev');
        options.next = controls.find('.angular-sly-next');
      }

      // Init Sly
      $timeout(function(){
        element.sly(options);

        // On change slide
        element.sly('on', 'change', function() {
          var index = this.getIndex(element.find('.angular-sly-slide.' + options.activeClass));
          if(angular.isDefined(scope.change) && angular.isFunction(scope.change))  {
            $timeout(function() {
              scope.change({$activeIndex: index});
            }, 0);
          }
        });
      });

      // Resize window event.
      angular.element(window).resize(function() {
        element.sly('reload');
      });

      // On load content.
      $timeout(function(){
        element.sly('reload');
      }, 500);

      scope.$parent.reloadSly = scope.reload;
      scope.$parent.slideTo = scope.slideTo;
      scope.$parent.toStart = scope.toStart;
      scope.$parent.toCenter = scope.toCenter;
      scope.$parent.toEnd = scope.toEnd;

      element.on('$destroy', function() {
        element.sly(false);
      });

      var wc = scope.$watch(function() {
        return element.hasClass('ng-cloak');
      }, function(val) {
        if(!val) {
          element.sly('reload');
        }
        wc();
      });
    }
  };
});

mod.directive('slySlide', function() {
  return {
    restrict: 'EC',
    require: '^sly',
    scope: {

    },
    replace: true,
    template: '<div class="angular-sly-slide" ng-transclude></div>',
    transclude: true,
    link: function() {
    }
  };
});

mod.directive('slyScroll', function() {
  return {
    restrict: 'EC',
    replace: true,
    template: '<div class="angular-sly-scroll"><div class="angular-sly-handle"></div></div>',
    transclude: false
  };
});


mod.directive('slyControls', function() {
  return {
    restrict: 'EC',
    scope: {
      iconClass: '@',
      prevClass: '@',
      nextClass: '@',
      containerClass: '@'
    },
    replace: true,
    template:
      '<div class="angular-sly-controls clearfix">' +
        '<div ng-class="containerClass">' +
          '<a href="javascript:void(0)" class="angular-sly-prev">' +
            '<i class="fa" ng-class="[iconClass, prevClass]"></i>' +
          '</a>' +
          '<a href="javascript:void(0)" class="angular-sly-next">' +
            '<i class="fa" ng-class="[iconClass, nextClass]"></i>' +
          '</a>' +
        '</div>' +
      '</div>',
    transclude: false,
    link: function(scope) {
      scope.prevClass = scope.prevClass || 'fa-chevron-circle-left';
      scope.nextClass = scope.nextClass || 'fa-chevron-circle-right';
    }
  };
});
