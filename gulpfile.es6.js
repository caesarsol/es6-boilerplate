import gulp from 'gulp'
import browserify from 'browserify'
import watchify from 'watchify'
import babelify from 'babelify'
import rimraf from 'rimraf'
import source from 'vinyl-source-stream'
import sass from 'gulp-sass'
import browserSyncModule from 'browser-sync'

let browserSync = browserSyncModule.create()

const config = {
  entryFile:  './src/app.es6.js',
  styleFile:  './src/style.sass',
  htmlFile:  './src/index.html',
  outputDir:  './build/',
  outputFile: 'app.js',
}

function getBundler() {
  if (!global.bundler) {
    let conf = {
      entries: [config.entryFile],
      debug: true,
    }
    Object.assign(conf, watchify.args)
    global.bundler = watchify(browserify(conf))
  }
  return global.bundler
}

gulp.task('clean', function (cb) {
  return rimraf(config.outputDir, cb)
})

gulp.task('server', function () {
  return browserSync.init({
    server: {baseDir: config.outputDir},
    ui: false,
  })
})

gulp.task('js', function () {
  return getBundler()
    .transform(babelify)
    .bundle()
    .on('error', (err) => console.error('Error: ' + err.message))
    .pipe(source(config.outputFile))
    .pipe(gulp.dest(config.outputDir))
    .pipe(browserSync.stream())
})

gulp.task('sass', function () {
  return gulp.src(config.styleFile)
    .pipe(sass())
    .pipe(gulp.dest(config.outputDir))
    .pipe(browserSync.stream())
})

gulp.task('html', function () {
  return gulp.src(config.htmlFile)
    .pipe(gulp.dest(config.outputDir)) // Just copy.
    .pipe(browserSync.stream())
})

gulp.task('watch', ['clean', 'server', 'js', 'sass', 'html'], function () {
  // FIXME: initial build is done two times
  getBundler().on('update', () => gulp.start('js'))
  gulp.watch(config.styleFile, ['sass'])
  gulp.watch(config.htmlFile, ['html'])
})
