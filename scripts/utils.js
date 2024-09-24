#!/usr/bin/env node

import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { existsSync, rmSync } from 'node:fs'
import { log } from 'console-log-colors'
import gulp from 'gulp'
import sass from 'sass'
import gulpSass from 'gulp-sass'
import rename from 'gulp-rename'
import sourcemaps from 'gulp-sourcemaps'
import gulpAutoprefixer from 'gulp-autoprefixer'
import insert from 'gulp-insert'
import concat from 'gulp-concat-css'

export function createLogger(prefix = 'Styles') {
  const txt = text => (prefix ? prefix + ': ' : '') + text

  return {
    info: text => log.gray(txt(text)),
    warn: text => log.yellow(txt(text)),
    error: text => log.red(txt(text)),
    success: text => log.green(txt(text)),
    blue: text => log.blue(txt(text))
  }
}

export class StylesBuilder {
  converter = gulpSass(sass)
  logger = createLogger('')

  baseDir = fileURLToPath(new URL('..', import.meta.url)).replace(/\/$/, '')
  prefix = ''
  dir = ''

  /**
   * Construct builder
   * @param {string} prefix
   * @param {string} dir
   * @param {boolean} debug
   */
  constructor(prefix = 'cubo', outputDir = undefined, debug = false) {
    if (outputDir) {
      this.dir = resolve(outputDir.replace(/\/$/, ''))
    } else {
      this.dir = this.baseDir + '/dist'
    }

    this.prefix = prefix
    this.debug = debug
  }

  get srcDir() {
    return this.baseDir + '/src'
  }

  get cssDir() {
    return this.dir + '/css'
  }

  get sassDir() {
    return this.dir + '/sass'
  }

  /**
   * Building sass styles - inject prefix and copy to sass/ folder
   * @returns
   */
  buildSASS() {
    if (this.debug) {
      this.logger.blue('Building SASS')
      this.logger.info(`${this.srcDir}\n->>>\n${this.sassDir}\n`)
    }

    rmSync(this.sassDir, { recursive: true, force: true })

    return new Promise((resolve, reject) => {
      gulp
        .src(`${this.srcDir}/**/*.scss`)
        .pipe(insert.prepend('$prefix: "' + this.prefix + '";\n\n'))
        .pipe(gulp.dest(this.sassDir))
        .on('end', resolve)
        .on('error', reject)
    })
  }

  /**
   * Building css styles - transform from sass and copy to css/ folder
   * @returns
   */
  buildCSS() {
    if (this.debug) {
      this.logger.blue('Building CSS')
      this.logger.info(`${this.sassDir}\n->>>\n${this.cssDir}\ntw:${this.baseDir}/tailwind.config.cjs`)
    }

    rmSync(this.cssDir, { recursive: true, force: true })

    const p1 = new Promise((resolve, reject) => {
      gulp
        .src(`${this.sassDir}/index.scss`)
        .pipe(sourcemaps.write('.'))
        .pipe(this.converter().on('error', console.error))
        .pipe(gulpAutoprefixer())
        .pipe(concat('styles.css'))
        // .pipe(postcss([tailwindcss(`${this.baseDir}/tailwind.config.cjs`), autoprefixer()]))
        .pipe(gulp.dest(this.cssDir))
        .on('end', resolve)
        .on('error', reject)
    })

    const p2 = new Promise((resolve, reject) => {
      gulp
        .src(`${this.sassDir}/typography.scss`)
        .pipe(sourcemaps.write('.'))
        .pipe(this.converter().on('error', console.error))
        .pipe(gulpAutoprefixer())
        .pipe(concat('typography.css'))
        // .pipe(postcss([tailwindcss(`${this.baseDir}/tailwind.config.cjs`), autoprefixer()]))
        .pipe(gulp.dest(this.cssDir))
        .on('end', resolve)
        .on('error', reject)
    })

    const p3 = new Promise((resolve, reject) => {
      gulp
        .src(`${this.sassDir}/utils/variables.scss`)
        .pipe(sourcemaps.write('.'))
        .pipe(this.converter().on('error', console.error))
        .pipe(gulpAutoprefixer())
        .pipe(concat('variables.css'))
        // .pipe(postcss([tailwindcss(`${this.baseDir}/tailwind.config.cjs`), autoprefixer()]))
        .pipe(gulp.dest(this.cssDir))
        .on('end', resolve)
        .on('error', reject)
    })

    return Promise.all([p1, p2])
  }

  minify() {
    const filename = 'styles.min.css'

    if (existsSync(this.cssDir + '/' + filename)) {
      rmSync(this.cssDir + '/' + filename, { recursive: true, force: true })
    }

    if (this.debug) {
      this.logger.blue('Minifying CSS')
      this.logger.info(`${this.cssDir}/styles.min.css\n`)
    }

    return new Promise((resolve, reject) => {
      gulp
        .src(`${this.cssDir}/**/*.css`)
        .pipe(this.converter({ outputStyle: 'compressed' }).on('error', reject))
        .pipe(rename(filename))
        .pipe(gulp.dest(this.cssDir))
        .on('end', resolve)
        .on('error', reject)
    })
  }

  watch() {
    return gulp.watch(`${this.srcDir}/**/*.scss`, gulp.series('build:dev', 'build'))
  }
}
