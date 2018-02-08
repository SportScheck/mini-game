const gulp = require('gulp');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const path = require('path');
const uglify = require('gulp-uglify');

const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const rename = require('gulp-rename');

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

gulp.task('bundleJS', ['scripts'], () => {
  gulp.src('dist/js/minigame.js')
  .pipe(rename('minigame.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'))
})

gulp.task('browserSync', ['bundleJS'], function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
});

gulp.task('js-watch', ['bundleJS'], function (done) {
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

gulp.task('build', ['copy-index-html', 'bundleJS']);
