var gulp = require('gulp'),
	 sourcemaps = require('gulp-sourcemaps'),
	 //imagemin = require('gulp-imagemin'),
	 autoprefixer = require('gulp-autoprefixer'),
	 gulpif = require('gulp-if'),
	 accord = require('gulp-accord'),
	 plumber = require('gulp-plumber');


//var watch = require('gulp-watch');

// var browserSync = require("browser-sync"),
// 	 reload      = browserSync.reload;



var sprity     = require('sprity'),
	 svgSprite  = require('gulp-svg-sprite');


var path = {
  jade: ['./src/*.jade', '!./src/_*.jade'],
  stylus: ['./src/css/*.styl', '!./src/css/_*.styl']
};

/* ==========================================================================
	preprocess
	========================================================================== */

gulp.task('jade', function(){
  gulp.src(path.jade)
	 .pipe(plumber())
	 .pipe(accord('jade', { pretty: true }))
	 .pipe(gulp.dest('./dest'))
	 //.pipe(browserSync.reload({stream:true}));
});

gulp.task('stylus', function(){
  gulp.src(path.stylus)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(accord('stylus'))
  .pipe(autoprefixer())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./dest/css'));
});


/* ==========================================================================
	image
	========================================================================== */

// gulp.task('imagemin', function(){
//   gulp.src('./src/img/**/*', '!./src/img/*.db')
// 	 .pipe(imagemin({
// 		progressive: true,
// 		svgoPlugins: [{removeViewBox: false}],
// 		use: [pngquant()]
// 	 }))
// 	 .pipe(gulp.dest('./dest/img'))
// 	 .pipe(browserSync.reload({stream:true}));
// });


/* ==========================================================================
	sprite
	========================================================================== */

gulp.task('sprites', function () {
  gulp.src('./src/img/png-sprite/**/*.png')
	 return sprity.src({
	 src: [
		  './src/img/png-sprite/test/*.png',
		  './src/img/png-sprite/test2/*.png'
		],
	 cssPath: './src/img',
	 processor: 'css',
	 style: '_sprite.styl',
	 split: true,
	 template: './sprite.hbs',
	 orientation: 'binary-tree',
	 dimension: [{ ratio: 1, dpi: 72}, { ratio: 2, dpi: 192 }]
	 // ... other optional options
  })
  .pipe(gulpif('*.png', gulp.dest('./src/img/'), gulp.dest('./src/css/')))
});


var configSvg  = {
	 //dest: "../",
	"shape": {
		"spacing": {
				"padding": 10
		}
	 },
	 mode: {
		css: {
			prefix: "icon-",
			dimensions: "-xy",
			bust: false,
			dest: '.',
			sprite: "src/img/svg-sprite.svg",
			render: {
				styl: {
					dest: "src/css/_svg-sprite.styl"
				}
			},
			example: true
		}
	 }
	 // "mode": {
	 //     "css": {
	 //       render: {
	 //             styl: true
	 //         },
	 //       dest: '../../../'
	 //     }
	 // }
};

gulp.task('svg', function () {
	gulp.src('**/*.svg', {cwd: './src/img/svg/sprite'})
		.pipe(svgSprite(configSvg))
		.pipe(gulp.dest('./'));
});

/* ==========================================================================
	server
	========================================================================== */

// gulp.task('server', function() {
//   browserSync({
// 		  server: {
// 				baseDir: "./dest"
// 		  },
// 		  port: 3000,
// 		  directory: true,
// 		  files: [
// 			 'dest/css/*.css',
// 			 'dest/js/*.js',
// 			 'dest/img/**'
// 		  ],
// 		  injectChanges: true
// 	 });
// });


/* ==========================================================================
	task
	========================================================================== */

gulp.task('default', ['stylus', 'jade'], function() {
  gulp.watch('src/css/**/*.styl', ['stylus']);
  gulp.watch('src/*.jade', ['jade']);
});