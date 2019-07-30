module.exports = function(grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    cssmin: {
      add_banner: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          'build/src/atm.app.min.css': [
            'css/default.css',
            './css/overall.css',
            './css/overall2.css',
            'lib/angular-loading-bar/build/loading-bar.min.css'
          ]
        }
      }
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'script/initHtmlTitle.js',
          'lib/angular/angular.min.js',
          'lib/angular-route/angular-route.min.js',
          'lib/angular-touch/angular-touch.min.js',
          'lib/angularjs-geolocation/src/geolocation.js',
          'script/app.js',
          'script/init.js',
          'script/route.js',
          'script/home/controller.js',
          'script/building/controller.js',
          'script/shop/controller.js',
          'script/collect/controller.js',
          'script/search/controller.js',
          'script/hotkey/controller.js',
          'script/brand/controller.js',
          'script/searchinmall/controller.js',
          'script/coupon/controller.js',
          'script/districts/controller.js',
          'script/outdoormap/controller.js',
          'script/category/controller.js',
          'script/eat/controller.js',
          'script/submit/controller.js',
          'script/malltag/controller.js',
          'script/mycollect/controller.js',
          'script/go/controller.js',
          'script/service/mall.js',
          'script/service/building.js',
          'script/service/search.js',
          'script/service/shop.js',
          'script/service/localstorage.js',
          'script/service/hotkey.js',
          'script/service/brand.js',
          'script/service/searchinmall.js',
          'script/service/cache.js',
          'script/service/districts.js',
          'script/service/mapofbuilding.js',
          'script/service/malltag.js',
          'script/service/subway.js',
          'script/service/prods.js',
          'script/service/citylist.js',
          'script/service/wxcollect.js',
          'script/service/Uid.js',
          'script/filter/gps.js',
          'script/filter/img.js',
          'script/filter/logo.js',
          'script/filter/random.js',
          'script/filter/floorname.js',
          'script/filter/hasCoupon.js',
          'script/filter/commenttype.js',
          'script/filter/commenttime.js',
          'script/filter/couponimg.js',
          'script/filter/prodname.js',
          'script/filter/prodicon.js',
          'script/filter/cityName.js',
          'script/directive/bestlazyload.js',
          'lib/js/snap.js',
          'lib/angular-loading-bar/build/loading-bar.min.js',
          'newMap/js/zoomer-animate.js',
          'newMap/js/zoomer-core.js',
          'newMap/js/zoomer-eventHandler.js',
          'newMap/js/hammer.js',
          'newMap/js/encryptJSON.js',
          'newMap/js/sdk-dataModel.js',
          'newMap/js/atlasSDK.ui.js'
        ],
        dest: 'build/js/app.js'
      }
    },
    uglify: {
      development: {
        options: {
          mangle: false,
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
        },
        files: {
          'build/src/app.min.js': [
            'build/js/app.js'
          ]
        }
      }
    },
    watch: {
      js: {
        files: ['js/**'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['Example/**'],
        options: {
          livereload: true
        }
      },
      css: {
        files: ['css/**'],
        options: {
          livereload: true
        }
      }
    },
  });
  //Load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-connect');

  //Making grunt default to force in order not to break the project.
  grunt.option('force', true);

  //Default task(s).
  grunt.registerTask('default', ['watch']);

  // release task
  grunt.registerTask('release', ['concat', 'uglify', 'cssmin']);
};