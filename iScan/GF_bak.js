
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
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
                },
                files:{
                    'controller/bMin.js': ['controller/beacon.js'],
                    'controller/dMin.js': ['controller/device.js'],
                    'controller/tMin.js': ['controller/tagger.js'],
                    'controller/uMin.js': ['controller/user.js'],
                    'model/bMin.js': ['model/beacon.js'],
                    'model/dMin.js': ['model/device.js'],
                    'model/tMin.js': ['model/tagger.js'],
                    'model/uMin.js': ['model/user.js'],
                    'routes/index.js': ['routes/indexDev.js'],
                    'app.min.js': ['app.js']
                }
            }
        },
        concat : {

            css : {

                src: ['frontEnd/css/bootstrap.min.css',
                    'frontEnd/css/bootstrap-theme.min.css',
                    'frontEnd/css/daterangepicker-bs3.css',
                    'frontEnd/css/main.css'
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