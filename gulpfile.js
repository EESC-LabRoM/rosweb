// This is Gulp!
var gulp = require('gulp');
var paths = {
  html: ["src/*.html"],
  ts: ["./src/ts/**/*.ts"],
  sass: ["./src/sass/**/*.scss"]
};

gulp.task('default', ['html', 'typescript', 'sass'], function() {
  
});

// HTML
var pages = ["src/*.html"];
gulp.task('html', function () {
  return gulp.src(paths.html)
    .pipe(gulp.dest('dist'));
});

// TypeScript
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
gulp.task('typescript', function () {
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
gulp.task('sass', function () {
  return gulp.src('./src/sass/main.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('./dist/'));
});

// Watch
gulp.task('watch', function () {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.ts, ['typescript']);
  gulp.watch(paths.html, ['html']);
});