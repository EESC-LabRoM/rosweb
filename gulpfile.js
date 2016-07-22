// This is Gulp!
var gulp = require('gulp');
// ts
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
// hbs
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
// sass
var sass = require('gulp-sass');
var paths = {
  html: ["src/*.html"],
  ts: ["./src/ts/**/*.ts"],
  sass: ["./src/sass/**/*.scss"],
  hbs: ["./src/hbs/**/*.hbs"],
  js: ["./src/js/**/*.js"],
  wdgt: ["./src/widgets/**/*.*"],
  img: ["./src/img/**/*.*"]
};

gulp.task('default', ['html', 'ts', 'sass', 'img', 'hbs', 'js', 'wdgt', 'ws'], function() {

});

// HTML
gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest('dist'));
});
gulp.task('watchhtml', ['html'], function() {
  gulp.watch(paths.html, ['html']);
});

// TypeScript
gulp.task('ts', function() {
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
gulp.task('watchts', ['ts'], function() {
  gulp.watch(paths.ts, ['ts']);
});

// SASS
gulp.task('sass', function() {
  return gulp.src('./src/sass/main.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/'));
});
gulp.task('watchsass', ['sass'], function() {
  gulp.watch(paths.sass, ['sass']);
});

// Images
gulp.task('img', function() {
  return gulp.src(paths.img)
    .pipe(gulp.dest('dist/img/'));
});
gulp.task('watchimg', ['img'], function() {
  gulp.watch(paths.img, ['img']);
});

// Handlebars
gulp.task('hbs', function() {
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
gulp.task('watchhbs', ['hbs'], function() {
  gulp.watch(paths.hbs, ['hbs']);
});

// JavaScript libraries
gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(gulp.dest('dist'));
});
gulp.task('watchjs', ['js'], function() {
  gulp.watch(paths.js, ['js']);
});

// Images
gulp.task('img', function() {
  return gulp.src(paths.img)
    .pipe(gulp.dest('dist/img'));
});
gulp.task('watchimg', ['img'], function() {
  gulp.watch(paths.img, ['img']);
});

// Widgets
gulp.task('wdgt', function() {
  return gulp.src(paths.wdgt)
    .pipe(gulp.dest('dist/widgets'));
});
gulp.task('watchwdgt', ['wdgt'], function() {
  gulp.watch(paths.wdgt, ['wdgt']);
});

gulp.task('watch0', ['watchhtml', 'watchsass', 'watchimg', 'watchhbs', 'watchwdgt', 'watchjs', 'watchts']);
gulp.task('watch1', ['watchhtml', 'watchsass', 'watchimg', 'watchhbs', 'watchwdgt', 'watchjs']);

// Watch

// Web server
gulp.task('ws', function() {
  var gulp = require('gulp');
  var webserver = require('gulp-webserver');
  var stream = gulp.src('./dist/')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      host: "localhost",
      port: 8080
    }));
  stream.emit('kill');
});
