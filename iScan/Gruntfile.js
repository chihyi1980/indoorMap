module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '',
                separator: ';'
            },
            task1:{
                options: {
                    banner: '',
                    separator: ';'
                },
                src: [
                    'frontEnd/lib/mapSdk/dev.js',
                    'frontEnd/lib/mapSdk/ui.js',
                    'frontEnd/js/atlasSdk.extra.js',
                    'frontEnd/lib/jquery/jquery-1.8.3.min.js',
                    'frontEnd/lib/hightchart/highcharts.js',
                    'frontEnd/lib/hightchart/exporting.js',
                    'frontEnd/lib/bootstrap/bootstrap.min.js',
                    'frontEnd/lib/bootstrap/moment.js',
                    'frontEnd/lib/bootstrap/daterangepicker.js',
                    'frontEnd/lib/angular/angular.min.js',
                    'frontEnd/lib/angular-route/angular-route.min.js',
                    'frontEnd/js/config.js',
                    'frontEnd/js/app.js',
                    'frontEnd/js/route.js',
                    'frontEnd/js/service/index.js',
                    'frontEnd/js/controller/login.js',
                    'frontEnd/js/controller/home.js',
                    'frontEnd/js/controller/nav.js',
                    'frontEnd/js/controller/menu.js',
                    'frontEnd/js/controller/leftMenu.js',
                    'frontEnd/js/controller/beacon.js',
                    'frontEnd/js/controller/device.js',
                    'frontEnd/js/controller/overview.js',
                    'frontEnd/js/controller/analysis.js',
                    'frontEnd/js/controller/tagger.js',
                    'frontEnd/js/controller/user.js',
                    'frontEnd/js/controller/jobsite.js',
                    'frontEnd/js/controller/player.js',
                    'frontEnd/js/controller/indoorMap.js'
                ],
                dest: 'frontEnd/build/iscan.js'
            }
        },
        concat : {

            css : {

                src: ['frontEnd/css/bootstrap.min.css',
                    'frontEnd/css/bootstrap-theme.min.css',
                    'frontEnd/css/daterangepicker-bs3.css',
                    'frontEnd/css/main.css',
                    'frontEnd/lib/mapSdk/min.css'
                ],

                dest:'frontEnd/build/iscan.css'
            }
        },

        cssmin: {
            css: {
                src:'frontEnd/build/iscan.css',
                dest:'frontEnd/build/iscan.min.css'
            }
        }
    });


    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-css');

    // 默认被执行的任务列表。
    grunt.registerTask('default', [ 'uglify','concat','cssmin']);

}