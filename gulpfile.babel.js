import gulp from 'gulp'
import babel from 'gulp-babel'
import install from 'gulp-install'
import del from 'del'
import zip from 'gulp-zip'

gulp.task('clean', () => {
  del(['dist', 'dist.zip'])
})

gulp.task('compile', () => {
  gulp
    .src('src/**/*.js')
    .pipe(babel({ optional: ['runtime'] }))
    .pipe(gulp.dest('dist/'))
})

gulp.task('node-modules', () => {
  gulp
    .src('package.json')
    .pipe(gulp.dest('dist/'))
    .pipe(install({production: true}))
})

gulp.task('zip', () => {
  gulp
    .src(['dist/**/*', '!dist/package.json'])
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest('./'))
})
