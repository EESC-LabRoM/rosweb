// Gulp
var gulp = require("gulp");

// TypeScript
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

// Taks #0: default
gulp.task("default", function () {
  return tsProject.src()
    .pipe(ts(tsProject))
    .js.pipe(gulp.dest("dist"));
});
