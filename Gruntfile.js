'use strict';

module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n\n'
      },
      dist: {
        src: ['src/js/directive.js', 'services.js'],
        dest: 'dist/js/angular-sly-directive.js'
      }
    },
    less: {
      options: {
        paths: ['src/less']
      },
      dist: {
        files: {
          'dist/css/angular-sly-directive.css': 'src/less/angular-sly-directive.less'
        }
      }
    }
  });

  grunt.registerTask('default', ['concat', 'less']);
};
