var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    connect = require('gulp-connect')
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect');


// Gulp plumber error handler
var onError = function (err) {
    console.log(err);
};

gulp.task('reload', function () {
    // Change the filepath, when you want to live reload a different page in your project1.
    // livereload.reload();// 
    //
});

var PATH ={
    src : {
        html : "View/**/*.html",
        scss : "src/assets/scss/**/*.scss",
        images : "src/assets/images/**/*",
        vendorScript : [
            "Scripts/angularJS/angular.js",
            "Scripts/angularJS/angular-route.min.js"
        ],
        app: [
             
            "Scripts/app/app.js",
            "!Scripts/app/Common/Services/AuthService.js",
            "!Scripts/app/Common/appConstant.js",
            "!Scripts/app/AppNavigation/app.js",
            "!Scripts/app/AppNavigation/**/*.js",
            "Scripts/app/Common/**/*.js",
            "Scripts/app/KPIManagement/app.js",
            "Scripts/app/KPIManagement/**/*.js",
            "Scripts/app/UserManagement/app.js",
            "Scripts/app/UserManagement/**/*.js",
            "Scripts/app/BulkPayment/app.js",
            "Scripts/app/BulkPayment/**/*.js",
          
          
        ],
        bower : "bower_components",
        bowerCss : [
            "bower_components/angular-toastr/dist/angular-toastr.min.css",
            "bower_components/angularjs-datepicker/dist/angular-datepicker.min.css",
            "bower_components/select2/select2.css"
        ]
    },
    build : {
        html : "build/",
        app : "build",
        js : "build/assets/js",
        css : "build/assets/css",
        images : "build/assets/images"
    }
};




//connect.server({
 //   port: 48461,
//    host: 'dev02.dialog.lk'
//});


gulp.task('setMinify', function(){
    console.log('in set minify');
    gulp.src(PATH.src.app)
        .pipe(plumber())
        .pipe(concat('app-scriptsALL.min.js'))
       // .pipe(uglify())
        .pipe(gulp.dest('Scripts/app/MinifiedJS'))
        .pipe(livereload());
})

gulp.task('MinifyAngular', function(){
    gulp.src(PATH.src.vendorScript)
        .pipe(concat('MinifiedAngularJS.min.js'))
        .pipe(gulp.dest('Scripts/app/MinifiedJS'))
        .pipe(livereload());
});
 
gulp.task('sampleTask', function(){
    console.log('watching is running')
});

// watching task with gulp
gulp.task('watch', function(){
    console.log("init");
    gulp.watch(PATH.src.app,['sampleTask','setMinify'])
});


gulp.task('default',['watch'] );
