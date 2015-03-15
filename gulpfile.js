var gulp = require('gulp'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    autoprefixer = require('gulp-autoprefixer'),
    accord = require('gulp-accord');

var connect = require('gulp-connect');

var gulpif = require('gulp-if'),
    clean = require('gulp-clean');

var sprite = require('css-sprite').stream;

var path = {
  jade: ['src/*.jade', '!src/_*.jade'],
  stylus: ['src/css/*.styl', '!src/css/_*.styl'],
  src: ['src/js/**/*', 'src/fonts/**/*', 'src/img/**/*']
};

gulp.task('copy', function(){
  gulp.src('src/js/**/*')
    .pipe(clean({force: true}))
    .pipe(gulp.dest('dest/js'));
  gulp.src('src/fonts/**/*')
    .pipe(clean({force: true}))
    .pipe(gulp.dest('dest/fonts'));
  gulp.src('src/img/**/*')
    .pipe(clean({force: true}))
    .pipe(gulp.dest('dest/img'));
});

gulp.task('jade', function(){
  gulp.src(path.jade)
  .pipe(accord('jade', { pretty: true }))
  .on('error', function (error) {
    console.log('error!!!!!');
  })
  .pipe(gulp.dest('dest'))
  .pipe(connect.reload());
});

gulp.task('stylus', function(){
  gulp.src(path.stylus)
  .pipe(sourcemaps.init())
  .pipe(accord('stylus'))
  .on('error', function (error) {
    console.log('error!!!!!');
  })
  .pipe(autoprefixer())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dest/css'))
  .pipe(connect.reload());
});

gulp.task('imagemin', function(){
  gulp.src('src/img/**/*.{gif,jpg,png,svg}')
    .pipe(imagemin())
    .pipe(gulp.dest('dest/img'))
    .pipe(connect.reload());
});


gulp.task('sprites', function () {
  gulp.src('./src/img/png-sprite/*.png')
    .pipe(sprite({
      name: 'sprite',
      style: '_sprite.styl',
      cssPath: '../img/',
      processor: 'stylus',
      margin: 4,
      orientation: 'binary-tree',
    }))
    .pipe(gulpif('*.png', gulp.dest('./src/img/'), gulp.dest('./src/css/')))
});



gulp.task('server', function() {
  connect.server({
    root: 'dest',
    livereload: true
  });
});


gulp.task('default', ['stylus', 'jade', 'copy', 'server'], function() {
  gulp.watch('src/css/**/*.styl', ['stylus']);
  gulp.watch('src/*.jade', ['jade']);
  gulp.watch(path.src, ['copy']);
});