/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2015 - present Instructure, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const requireDir = require('require-dir')

requireDir('./tasks', { recurse: true })

const sequence = require('run-sequence')

const config = require('./config')

exports.buildAll = (cb) => {
  const tasks = []

  if (config.react) {
    tasks.push('generate-react')
  }

  if (config.fonts) {
    tasks.push('generate-fonts')
  }

  sequence(
     'generate-svgs',
     tasks,
     cb
   )
}

exports.exportFromSketch = (cb) => {
  sequence(
     'clean',
     'generate-svgs-from-sketch',
     cb
   )
}

exports.buildSVGs = (cb) => {
  sequence(
    'generate-svgs-index',
    cb
  )
}

exports.buildFonts = (cb) => {
  sequence(
     'generate-fonts',
     cb
   )
}

exports.buildReact = (cb) => {
  sequence(
     'generate-react',
     cb
   )
}
