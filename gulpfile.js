// This is Gulp!
var gulp = require('gulp');
// ts
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
// glob
var glob = require('glob');
// hbs
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var declare = require('gulp-declare');
var concat = require('gulp-concat');
// sass
var sass = require('gulp-sass');
// webserver
var webserver = require('gulp-webserver');
var http = require('http');
var stream;
// typedoc
var typedoc = require("gulp-typedoc");
// paths
var paths = {
  html: ["src/*.html"],
  ts: ["./src/ts/**/*.ts"],
  sass: ["./src/sass/**/*.scss"],
  sass_wdgt: ["./src/widgets/**/*.scss"],
  hbs: ["./src/hbs/**/*.hbs"],
  js: ["./src/js/*.js"],
  wdgt: ["./src/widgets/**/*.hbs", "./src/widgets/**/*.js"],
  wdgt_ts: ["./src/widgets/**/main.ts"],
  img: ["./src/img/**/*.*"]
};

// Big Tasks
gulp.task('default', ['build', 'start']);
gulp.task('build', ['html', 'ts', 'sass', 'sass_wdgt', 'img', 'hbs', 'jsl', 'wdgt', 'wdgt_ts']);
gulp.task('watch', ['watchhtml', 'watchts', 'watchsass', 'watchimg', 'watchhbs', 'watchjsl', 'watchwdgt', 'watchwdgt_ts']);
gulp.task('start', function () {
  stream = gulp.src('./dist/')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: false,
      host: "0.0.0.0",
      port: 8000
    }));
  stream.emit('kill');
});

// Dist
{
  // TypeDoc
  gulp.task("typedoc", function () {
    return gulp
      .src(["src/ts/**/*.ts"])
      .pipe(typedoc({
        // TypeScript options (see typescript docs) 
        module: "commonjs",
        target: "es5",
        includeDeclarations: true,

        // Output options (see typedoc docs) 
        out: "./typedoc/",
        json: "./typedoc/log.json",

        // TypeDoc options (see typedoc docs) 
        name: "my-project",
        //theme: "/path/to/my/theme",
        ignoreCompilerErrors: false,
        version: true,
      }))
      ;
  });
  // HTML
  gulp.task('html', function () {
    return gulp.src(paths.html)
      .pipe(gulp.dest('dist'));
  });
  gulp.task('watchhtml', ['html'], function () {
    gulp.watch(paths.html, ['html']);
  });

  // TypeScript
  gulp.task('ts', function () {
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
      .pipe(gulp.dest('dist/js'));
  });
  gulp.task('watchts', ['ts'], function () {
    gulp.watch(paths.ts, ['ts']);
  });

  // SASS
  gulp.task('sass', function () {
    return gulp.src('./src/sass/main.scss')
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(gulp.dest('./dist/'));
  });
  gulp.task('sass_wdgt', function () {
    return gulp.src('./src/widgets/**/*.scss')
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(concat('widgets.css'))
      .pipe(gulp.dest('./dist/'));
  });
  gulp.task('watchsass', ['sass', 'sass_wdgt'], function () {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.sass_wdgt, ['sass_wdgt']);
  });

  // Images
  gulp.task('img', function () {
    return gulp.src(paths.img)
      .pipe(gulp.dest('dist/img/'));
  });
  gulp.task('watchimg', ['img'], function () {
    gulp.watch(paths.img, ['img']);
  });

  // Handlebars
  gulp.task('hbs', function () {
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
      .pipe(gulp.dest('dist/js'));
  });
  gulp.task('watchhbs', ['hbs'], function () {
    gulp.watch(paths.hbs, ['hbs']);
  });

  // JavaScript libraries
  gulp.task('jsl', function () {
    return gulp.src(paths.js)
      .pipe(gulp.dest('dist/js/'));
  });
  gulp.task('watchjsl', ['jsl'], function () {
    gulp.watch(paths.js, ['js']);
  });

  // Images
  gulp.task('img', function () {
    return gulp.src(paths.img)
      .pipe(gulp.dest('dist/img'));
  });
  gulp.task('watchimg', ['img'], function () {
    gulp.watch(paths.img, ['img']);
  });

  // Widgets
  gulp.task('wdgt', function () {
    return gulp.src(paths.wdgt)
      .pipe(gulp.dest('dist/widgets'));
  });
  gulp.task('watchwdgt', ['wdgt'], function () {
    gulp.watch(paths.wdgt, ['wdgt']);
  });
  gulp.task('wdgt_ts', function() {
    var files = glob.sync('src/widgets/**/*.ts');
    return browserify({
      basedir: '.',
      debug: true,
      entries: files,
      cache: {},
      packageCache: {}
    })
    .plugin(tsify)
    .transform("babelify")
    .bundle()
    .pipe(source('widgets.bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/js/'));
  });
  gulp.task('watchwdgt_ts', ['wdgt_ts'], function() {
    gulp.watch(paths.wdgt_ts, ['wdgt_ts']);
  });
}
