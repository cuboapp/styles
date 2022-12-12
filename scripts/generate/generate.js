#!/usr/bin/env node
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { createLogger, StylesBuilder } from '../utils.js'

/** @type { import('./generate').CommandGenerateProps } */
const argv = yargs(hideBin(process.argv)).argv

const logger = createLogger()

const prefix = argv.prefix || 'c'
const output = argv.output || undefined
const debug = argv.debug || false

if (debug) {
  if (!output) {
    logger.warn('output directory is not defined')
  }

  logger.info('generation started')
}

try {
  const gulp = new StylesBuilder(prefix, output, debug)

  await gulp.buildSASS()
  await gulp.buildCSS()
  await gulp.minify()

  if (debug) {
    logger.success('generation completed')
  }
} catch (e) {
  logger.error('generation error: ' + e.message)
}
