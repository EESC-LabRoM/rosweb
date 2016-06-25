// Gulp
var gulp = require("gulp");

// TypeScript
// var ts = require("gulp-typescript");
// var tsProject = ts.createProject("tsconfig.json");

// Browserify
var browserify = require("browserify");
var source = require("vinyl-source-stream");
var tsify = require("tsify");
var paths = { pages: ["src/*.html"] };

// Task #copy-html
gulp.task("copy-html", function() {
  return gulp.src(paths.pages)
    .pipe(gulp.dest("dist"));
});

// Task #default
gulp.task("default", ["copy-html"], function () {
  return browserify({
    basedir: ".",
    debug: false,
    entries: ["src/main.ts"],
    cache: {},
    packageCache: {}
  })
    .plugin(tsify)
    .bundle()
    .pipe(source("bundle.js"))
    .pipe(gulp.dest("dist"));
});
