import gulp from 'gulp'
import babel from 'gulp-babel'
import zip from 'gulp-zip'

gulp.task('default', () => {
  gulp
    .src('./src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./'))
})

gulp.task('build', () => {
  gulp
    .src(['./index.js','./node_modules/md5hex.js'])
    .pipe(zip('qutto.zip'))
    .pipe(gulp.dest('./'))
})
