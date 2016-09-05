// This is Gulp!
var gulp = require('gulp');
// ts
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var tsify = require('tsify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
// tsd
var tsd = require('gulp-tsd');
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
  hbs: ["./src/hbs/**/*.hbs"],
  js: ["./src/js/*.js"],
  wdgt: ["./src/widgets/**/*.*"],
  img: ["./src/img/**/*.*"]
};

// Big Tasks
gulp.task('default', ['install', 'build', 'start']);
gulp.task('install', ['tsd']);
gulp.task('build', ['html', 'ts', 'sass', 'img', 'hbs', 'js', 'wdgt', 'jsl']);
gulp.task('watch', ['watchhtml', 'watchts', 'watchsass', 'watchimg', 'watchhbs', 'watchjs', 'watchwdgt']);
gulp.task('start', function () {
  stream = gulp.src('./dist/')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      host: "localhost",
      port: 8080
    }));
  stream.emit('kill');
});

// Config
{
  gulp.task('tsd', function (callback) {
    tsd({
      command: 'reinstall',
      config: './src/ts/tsd.json'
    }, callback);
  });
}

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
  gulp.task('watchsass', ['sass'], function () {
    gulp.watch(paths.sass, ['sass']);
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
  gulp.task('js', function () {
    return gulp.src(paths.js)
      .pipe(gulp.dest('dist/js/'));
  });
  gulp.task('watchjs', ['js'], function () {
    gulp.watch(paths.js, ['js']);
  });

  // JavaScript libraries from submodules
  gulp.task('jsl_roslibjs', function () {
    return gulp.src('src/js/roslibjs/build/roslib.min.js')
      .pipe(gulp.dest('dist/js/'));
  });
  gulp.task('jsl_mjpegcanvasjs', function () {
    return gulp.src('src/js/mjpegcanvasjs/build/mjpegcanvas.min.js')
      .pipe(gulp.dest('dist/js/'));
  });
  // JavaScript libraries from NodeModules
  gulp.task('jsl_eventemitter', function () {
    return gulp.src('node_modules/eventemitter2/lib/eventemitter2.js')
      .pipe(gulp.dest('dist/js/'));
  });
  gulp.task('jsl_handlebars', function () {
    return gulp.src('node_modules/handlebars/dist/handlebars.min.js')
      .pipe(gulp.dest('dist/js/'));
  });
  gulp.task('jsl_jquery', function () {
    return gulp.src('node_modules/jquery/dist/jquery.min.js')
      .pipe(gulp.dest('dist/js/'));
  });
  gulp.task('jsl', ['jsl_roslibjs', 'jsl_mjpegcanvasjs', 'jsl_eventemitter', 'jsl_handlebars', 'jsl_jquery']);

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
}

// gh-pages
{
  gulp.task('publish', function () {
    gulp.src('dist/**/*.*').pipe(gulp.dest('./docs/'));
  });
}
