var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync = require('browser-sync').create(),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    babel = require('gulp-babel');

js = 'src/js_src/*.js';
styles = 'src/styles_src/main.scss';
watchStyles = 'src/styles_src/*.scss';
cssPub = 'src/css';
jsPub = 'src/js';

gulp.task('babel', () =>
    gulp.src(js)
        .pipe(babel({
            presets: [["env", {
                "targets": {
                    "browsers": ["last 2 versions"]
                }
            }]]
        }))
        .on('error', function (e) {
            console.log('>>> ERROR', e);
            this.emit('end');
        })
        .pipe(gulp.dest('src/js'))
);

gulp.task('sass', function () {
    return gulp.src(styles)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 version'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(cssPub))
        .pipe(browserSync.stream());
});

gulp.task('watch', function () {
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });
    gulp.watch("src/**/*").on('change', browserSync.reload);
    gulp.watch(js, ['babel']).on('change', browserSync.reload);
    gulp.watch(watchStyles, ['sass']);

});
