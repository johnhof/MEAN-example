module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);
  require('colors');

  //////////////////////////////////////////////////////////////////////////////////
  //
  // Internal config
  //
  //////////////////////////////////////////////////////////////////////////////////

  var config = require('config.json')();

  var appConfig = {
    app  : config.path.app,
    dist : config.path.dist,
  };


  //////////////////////////////////////////////////////////////////////////////////
  //
  // Configurations
  //
  //////////////////////////////////////////////////////////////////////////////////


  grunt.initConfig({

    // Project settings
    server : appConfig,

    //
    // execute the express server file
    //
    express : {
      options : {},
      web : {
        options : {
          script : './server.js',
        }
      },
    },

    //
    // watch files for changes to run the appropriate tasks
    //
    watch : {

      // rebuilt assets on change
      bower : {
        files : ['bower.json'],
        tasks : ['wiredep']
      },
      js : {
        files : ['<%= server.app %>/**/*.js'],
        tasks : ['build-js']
      },
      css : {
        files : ['<%= server.app %>/**/*.{scss,sass}'],
        tasks : ['build-scss']
      },
      views : {
        files : ['<%= server.app %>/**/*.html'],
        tasks : ['build-html'],
      },
      images : {
        files : ['<%= server.app %>/assets/images/**/*'],
        tasks : ['copy:dist:images']
      },
      gruntfile : {
        files : ['Gruntfile.js'],
        tasks : ['build']
      },

      // restart server on API changes
      web : {
        files : [
          'api/**/*.js',
          'server.js',
        ],
        tasks : [
          'express:web'
        ],
        options : {
          nospawn : true,
          atBegin : true,
        }
      }
    },

    //
    // remove distribution files
    //
    clean : {
      dist : {
        files : [{
          dot : true,
          src :'<%= server.dist %>/'
        }]
      },
      tmp : {
        files : [{
          dot : true,
          src : '.tmp'
        }]
      },
      js: {
        files: [{
          dot: true,
          src: '<%= server.dist %>/**/*.js'
        }]
      },
      css: {
        files: [{
          dot: true,
          src: '<%= server.dist %>/**/*.css'
        }]
      },
      html: {
        files: [{
          dot: true,
          src: '<%= server.dist %>/**/*.html'
        }]
      }
    },

    concat : {
      js : {
        files : {
          '<%= server.dist %>/scripts/main.js': [
            '<%= server.app %>/core/app.js',
            '<%= server.app %>/core/api.js',
            '<%= server.app %>/scripts/services.js',
            '<%= server.app %>/scripts/helpers.js',
            '<%= server.app %>/**/*.js'
          ]
        }
      },
      css : {
        files : {
          '<%= server.dist %>/styles/main.css': ['.tmp/**/main.css', '.tmp/**/*.css']
        }
      }
    },

    //
    // append vendor prefix's
    //
    autoprefixer : {
      options : {
        browsers : ['last 1 version']
      },
      dist : {
        files : [{
          expand : true,
          src    : '<%= server.dist %>/styles/*.css'
        }]
      }
    },

    //
    // inject 3rd party components into index.hmtl
    //
    wiredep : {
      app : {
        src        : ['<%= server.app %>/core/index.html'],
        ignorePath :  /\.\.\//
      },
      sass: {
        src        : ['<%= server.app %>/**/*.{scss,sass}'],
        ignorePath : /(\.\.\/){1,2}bower_components\//
      }
    },

    //
    // compile css
    //
    compass : {
      options : {
        sassDir   : '.tmp/styles',
        cssDir    : '.tmp/styles',
        raw       : 'Sass::Script::Number.precision = 10\n'
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    //
    // copy files
    //
    copy : {
      images : {
        files: [{
          expand  : true,
          dot     : true,
          flatten : true,
          src     : '<%= server.app %>/assets/images/**/*',
          dest    : '<%= server.dist %>/images/'
        }, {
          expand  : true,
          dot     : true,
          flatten : true,
          src     : '<%= server.app %>/assets/images/favicon.ico',
          dest    : '<%= server.dist %>/'
        }]
      },
      css : {
        files : [{
          expand  : true,
          dot     : true,
          flatten : true,
          src     : '<%= server.app %>/**/*.{sass,scss}',
          dest    : '.tmp/styles/'
        }]
      },
      html : {
        files : [{
          expand  : true,
          dot     : true,
          flatten : true,
          src     : '<%= server.app %>/core/index.html',
          dest    : '<%= server.dist %>/'
        }, {
          expand  : true,
          dot     : true,
          flatten : true,
          src     : '<%= server.app %>/**/*.html',
          dest    : '<%= server.dist %>/views'
        }]
      }
    },
  });

  //////////////////////////////////////////////////////////////////////////////////
  //
  // Primary tasks
  //
  //////////////////////////////////////////////////////////////////////////////////


  // run the app
  grunt.registerTask('serve', 'Starting server...', function () {
    grunt.task.run(['watch']);
  });


  // run the app
  grunt.registerTask('app', 'Building and starting server...', function () {
    grunt.task.run([
      'build',
      'watch'
    ]);
  });


  //////////////////////////////////////////////////////////////////////////////////
  //
  // Secondary tasks
  //
  //////////////////////////////////////////////////////////////////////////////////

  // rebuild all
  grunt.registerTask('build', [
    'clean',
    'wiredep',
    'copy',
    'concat:js',
    'compass',
    'concat:css',
    'autoprefixer',
    'clean:tmp',
  ]);

  // re-build js
  grunt.registerTask('build-js', [
    'clean:js',
    'concat:js'
  ]);

  // re-build scss
  grunt.registerTask('build-scss', [
    'clean:css',
    'copy:css',
    'compass',
    'concat:css',
    'autoprefixer',
    'clean:tmp',
  ]);

  // re-build html
  grunt.registerTask('build-html', [
    'clean:html',
    'wiredep',
    'copy:html',
  ]);
};