import { fileURLToPath, URL } from 'node:url'
import gulp from 'gulp'

import { StylesBuilder } from './scripts/utils.js'

// gulp.task('build', gulp.series('clean'))
// gulp.task('build:dev', () )

gulp.task('build:dev', async () => {
  try {
    const gulp = new StylesBuilder(process.env['PREFIX'], undefined, true)

    await gulp.buildSASS()
    await gulp.buildCSS()
  } catch (e) {
    console.log(e)
  }
})

gulp.task('default', function () {
  gulp.start('build:dev')
})

gulp.task('watch', () => {
  return gulp.watch([`./src/**/*.scss`, './tailwind.config.cjs'], gulp.series('build:dev'))
})
