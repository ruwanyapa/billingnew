// Project configuration.

var _files = require("./_files.js"),
    app_scripts = _files["app_scripts"],
    app_styles = _files["app_styles"],
    lib_scripts = _files["lib_scripts"],
    login_scripts = _files["login_scripts"],
    login_styles = _files["login_styles"],
    Login_lib = _files["Login_lib"];

var jsHintFiles = lib_scripts.concat(app_scripts);
var jsHintFilesLogin = Login_lib.concat(login_scripts);
var jsHintFilesIgnores = lib_scripts.concat(Login_lib);

module.exports = function (grunt) {
    //Concat filse
    grunt.initConfig({
        clean: {
            test: ['Resources']
        },
        concat: {
            app: {
                src: app_scripts,
                dest: 'Resources/app.js'
            },
            app_login: {
                src: login_scripts,
                dest: 'Resources/login-app.js'
            }
        },
        uglify: {
            options: {
                mangle: true
            },
            app: {
                src: 'Resources/app.js',
                dest: 'Resources/app.min.js'
            },
            login: {
                src: 'Resources/login-app.js',
                dest: 'Resources/login-app.min.js'
            }
        },
        cssmin: {
            compress: {
                files: {
                    'Resources/app.css': app_styles,
                    'Resources/app-login.css': login_styles
                }
            }
        },
        jshint: {
            app: jsHintFiles,
            login: jsHintFilesLogin,
            options : {
                ignores : jsHintFilesIgnores
            }
        }
    });

    // Clean Resource Folder
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Javascript Statnderd check
    grunt.loadNpmTasks('grunt-contrib-jshint');

    //[cmd] grunt concat;
    grunt.loadNpmTasks('grunt-contrib-concat');

    //	[cmd] grunt uglify;
    grunt.loadNpmTasks('grunt-contrib-uglify');

    //	[cmd] grunt uglify;
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    //	Set default [cmd] grunt;
    grunt.registerTask('default', ['clean', 'cssmin', 'concat', 'uglify']);

};