var gulp = require('gulp');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var path = require('path');

var gulpIf = require('gulp-if');
var browserSync = require('browser-sync').create();

gulp.task('scripts', () => {
  browserify({
    standalone: 'MiniGame',
    entries: './app/js/game.js',
  })
  .transform('babelify', {presets: ['es2015']})
  .bundle()
  .pipe(source('minigame.js'))
  .pipe(gulp.dest('dist/js'))
});

gulp.task('browserSync', ['scripts'], function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
});

gulp.task('js-watch', ['scripts'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('copy-index-html', function() {
    gulp.src('./app/index.html')
    // Perform minification tasks, etc here
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['copy-index-html', 'browserSync'], function (){
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', ['js-watch']);
});

gulp.task('build', ['copy-index-html', 'scripts']);
