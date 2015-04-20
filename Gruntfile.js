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
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },
    less: {
      options: {
        paths: ['src/less']
      },
      dist: {
        files: {
          'dist/css/<%= pkg.name %>.css': 'src/less/<%= pkg.name %>.less'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: 'dist/js/<%= pkg.name %>.js',
        dest: 'dist/js/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.registerTask('default', ['concat', 'less', 'uglify']);
};
