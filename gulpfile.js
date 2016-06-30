// This is Gulp!
var gulp = require('gulp');
var paths = {
  html: ["src/*.html"],
  ts: ["./src/ts/**/*.ts"],
  sass: ["./src/sass/**/*.scss"],
  hbs: ["./src/hbs/**/*.hbs"],
  jslibs: ["./src/js/**/*.js"],
  jswidgets: ["./src/js/widgets/**/*.*"]
};

gulp.task('default', ['html', 'typescript', 'sass', 'handlebars', 'jslibs'], function() {

});

// HTML
var pages = ["src/*.html"];
gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest('dist'));
});

// TypeScript
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
gulp.task('typescript', function() {
  return browserify({
    basedir: '.',
    debug: true,
    entries: ['src/ts/main.ts'],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .transform("babelify")
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'));
});

// SASS
var sass = require('gulp-sass');
gulp.task('sass', function() {
  return gulp.src('./src/sass/main.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/'));
});

// Handlebars
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
gulp.task('handlebars', function() {
  gulp.src('src/hbs/**/*.hbs')
    .pipe(handlebars({
      handlebars: require('handlebars')
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'MyApp.templates',
      noRedeclare: true, // Avoid duplicate declarations 
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('dist/'));
});

// JavaScript libraries
gulp.task('jslibs', function() {
  return gulp.src(paths.jslibs)
    .pipe(gulp.dest('dist'));
});

// Widgets
gulp.task('widgets', function() {
  return gulp.src(paths.jswidgets)
    .pipe(gulp.dest('dist/widgets'));
});

gulp.task('watchbasic', ['watchsass', 'watchhbs', 'watchhtml', 'watchhbs']);

// Watch
gulp.task('watchhtml', function() {
  gulp.watch(paths.html, ['html']);
});
gulp.task('watchsass', function() {
  gulp.watch(paths.sass, ['sass']);
});
gulp.task('watchts', function() {
  gulp.watch(paths.sass, ['typescript']);
});
gulp.task('watchhbs', function() {
  gulp.watch(paths.hbs, ['handlebars']);
});
gulp.task('watchjslibs', function() {
  gulp.watch(paths.jslibs, ['jslibs']);
});
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.jslibs, ['jslibs']);
  gulp.watch(paths.ts, ['typescript']);
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.hbs, ['handlebars']);
});

// Web server
gulp.task('ws', function() {
  var gulp = require('gulp');
  var webserver = require('gulp-webserver');
  var stream = gulp.src('./')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true,
      host: "localhost",
      port: 8080
    }));
  stream.emit('kill');
});
