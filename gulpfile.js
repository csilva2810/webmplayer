'use strict';

var babelify   = require('babelify'),
    browserify = require('browserify'),
    buffer     = require('vinyl-buffer'),
    gulp       = require('gulp'),
    gutil      = require('gulp-util'),
    sass       = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    merge      = require('merge'),
    rename     = require('gulp-rename'),
    source     = require('vinyl-source-stream'),
    sourceMaps = require('gulp-sourcemaps'),
    watchify   = require('watchify');

var config = {
  js: {
    src: './src/js/main.js',
    outputDir: './dist/js/', 
    mapDir: './maps/',
    outputFile: 'bundle.js'
  },
  css: {
    src: './sass/**/*.scss',
    outputDir: './dist/css/',
    outputFile: 'main.css'
  }
};

function bundle (bundler) {

  return bundler
    .bundle() // Start bundle
    .pipe(source(config.js.src)) // Entry point
    .pipe(buffer()) // Convert to gulp pipeline
    .pipe(rename(config.js.outputFile)) // Rename output from 'main.js' to 'bundle.js'
    .pipe(sourceMaps.init({ loadMaps : true })) // Strip inline source maps
    .pipe(sourceMaps.write(config.js.mapDir)) // Save source maps to their own directory
    .pipe(gulp.dest(config.js.outputDir)) // Save 'bundle' to build/
    .pipe(livereload()); // Reload browser if relevant

}

gulp.task('bundle', function () {
  var bundler = browserify(config.js.src) // Pass browserify the entry point
                  .transform(babelify, { presets : [ 'es2015' ] }); // Then, babelify, with ES2015 preset

  return bundle(bundler); // Chain other options -- sourcemaps, rename, etc.
});
 
gulp.task('sass', function () {
  return gulp.src(config.css.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.css.outputDir));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});