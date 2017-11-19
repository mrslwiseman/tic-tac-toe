var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    gutil = require('gulp-util');





gulp.task('styles', function() {
return sass('./src/styles/main.scss', { style: 'expanded' })
  .pipe(autoprefixer('last 2 version'))
  .pipe(gulp.dest('dist/assets/css'))
  .pipe(rename({suffix: '.min'}))
  .pipe(cssnano())
  .pipe(gulp.dest('dist/assets/css'))
  .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function() {

  return gulp.src('./src/scripts/*.js')
    .pipe(jshint({esversion:6, laxcomma:true}))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js').on('error', gutil.log))
    .pipe(gulp.dest('./dist/assets/js'))
    .pipe(rename({suffix: '.min'}))
    //.pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('dist/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
  return gulp.src('src/images/*')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/assets/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function() {
    return del(['dist/assets/css', 'dist/assets/js', 'dist/assets/img', 'dist/*.html']);
});

gulp.task('html', function(){
  return gulp.src('src/*.html')
  .pipe(gulp.dest('dist'))
  .pipe(notify({ message: 'Html task complete' }));

})


gulp.task('default', ['clean'], function() {
    gulp.start('clean','styles', 'scripts', 'images', 'html');
});


// Static Server + watching scss/html fi``les
gulp.task('watch', ['default'], function() {
    browserSync.init({
        server: "./dist"
    });
    gulp.watch('src/styles/*.scss', ['styles', browserSync.reload]);
    gulp.watch('src/scripts/*.js', ['scripts', browserSync.reload]);
    gulp.watch('src/images/*', ['images', browserSync.reload]);
    gulp.watch('src/*.html', ['html', browserSync.reload]);

});
