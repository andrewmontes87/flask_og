var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  minifyCSS = require('gulp-clean-css'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  webserver = require('gulp-webserver'),
  jshint = require('gulp-jshint'),
  del = require('del');

var appSrcFiles = ['node_modules/jquery/dist/jquery.min.js',
    'node_modules/d3/d3.min.js',
    'node_modules/topojson/build/topojson.min.js',
    'node_modules/queue-async/build/queue.min.js',
    'src/lib/crossfilter.min.js',
    'src/js/og_co_core.js',
    'src/js/og_co_bar.js',
    'src/js/og_co_bio.js',
    'src/js/og_co_map.js',
    'src/js/og_co_menu.js',
    'src/js/og_co_timeline.js',
    'src/js/og_co_main.js',
    'node_modules/materialize-css/dist/js/materialize.min.js'];

var appCssFiles = ['node_modules/materialize-css/dist/css/materialize.min.css',
  'src/css/app.scss'];

var appFontFiles = ['node_modules/materialize-css/dist/fonts/**/*'];


// DEVELOPMENT //

// PREP STAGING

// pipe html + images to build/
gulp.task('html-staging', function() {
  return gulp.src(['src/**/*.html'])
  .pipe(gulp.dest('static/'))
});

gulp.task('img-staging', function() {
  return gulp.src(['static/img/**/*.png',
    'static/img/**/*.jpg',
    'static/img/**/*.eot',
    'static/img/**/*.svg',
    'static/img/**/*.ttf',
    'static/img/**/*.woff'])
    .pipe(gulp.dest('static/img'))
});



// minify css, pipe to build/
gulp.task('scss-staging', function() {
  return gulp.src(appCssFiles)
    .pipe(concat('app.css'))
    .pipe(sass({ includePaths : ['src/css/'] }))
    .pipe(minifyCSS({keepBreaks:true}))
    .pipe(gulp.dest('static/css/'))
});

gulp.task('clean-staging', function () {
  return del([
    'static/*.js'
  ]);
});

// concat + uglify js, pipe to build/
gulp.task('scripts-staging', function() {
  return gulp.src(appSrcFiles)
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('static/js/'))
});

// concat + uglify js, pipe to build/
gulp.task('data-staging', function() {
  return gulp.src(['src/data/*.json','src/data/*.csv'])
    .pipe(gulp.dest('static/data/'))
});

// concat + uglify js, pipe to build/
gulp.task('font-staging', function() {
  return gulp.src(appFontFiles)
    .pipe(gulp.dest('static/fonts/'))
});




// watch for changes
gulp.task('watch', function() {
  gulp.watch(['src/**/*.html'], ['html-staging']);
  gulp.watch(['src/**/*.scss'], ['scss-staging']);
  gulp.watch(['src/**/*.js'], ['scripts-staging']);
});

// // webserver
// gulp.task('webserver', function() {
//   return gulp.src('staging/')
//     .pipe(webserver({
//       livereload: true,
//       open: true,
//       port:5757
//     }));
// });


// // BUILD //

// // pipe html + images to build/
// gulp.task('html-build', function() {
//   return gulp.src(['app/**/*.html', 'staging/**/*.html'])
//   .pipe(gulp.dest('build/'))
// });

// gulp.task('img-build', function() {
//   return gulp.src(['app/img/**/*.png',
//     'app/img/**/*.jpg',
//     'app/img/**/*.eot',
//     'app/img/**/*.svg',
//     'app/img/**/*.ttf',
//     'app/img/**/*.woff'])
//     .pipe(gulp.dest('build/img'))
// });


// // minify css, pipe to build/
// gulp.task('scss-build', function() {
//   return gulp.src('app/css/app.scss')
//     .pipe(sass({ includePaths : ['app/css/'] }))
//     .pipe(minifyCSS({keepBreaks:false}))
//     .pipe(gulp.dest('build/css/'))
// });

// gulp.task('clean-build', function () {
//   return del([
//     'build/*.js'
//   ]);
// });

// // concat + uglify js, pipe to build/
// gulp.task('scripts-build', function() {
//   return gulp.src(appSrcFiles)
//     .pipe(concat('app.min.js'))
//     .pipe(uglify())
//     .pipe(rename({suffix:"." + new Date().getTime(),extname:".js"}))
//     .pipe(gulp.dest('build/'))
// });




// TASKS //

// default task
gulp.task('default', [ 'img-staging', 'scss-staging', 'clean-staging',
   'scripts-staging', 'data-staging', 'font-staging', 'watch']); // 'webserver', 'html-staging',

// build task
// gulp.task('build', ['html-build', 'img-build',  'scss-build', 'clean-build', 'scripts-build']);

