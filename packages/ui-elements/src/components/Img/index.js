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
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import Container from '@instructure/ui-container/lib/components/Container'
import ScreenReaderContent from '@instructure/ui-a11y/lib/components/ScreenReaderContent'

import themeable from '@instructure/ui-themeable'
import ThemeablePropTypes from '@instructure/ui-themeable/lib/utils/ThemeablePropTypes'
import { omitProps } from '@instructure/ui-utils/lib/react/passthroughProps'

import styles from './styles.css'
import theme from './theme'

/**
---
category: components
---
**/
@themeable(theme, styles)
export default class Img extends Component {
  static propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    inline: PropTypes.bool,
    /**
    * Valid values are `0`, `none`, `auto`, `xxx-small`, `xx-small`, `x-small`,
    * `small`, `medium`, `large`, `x-large`, `xx-large`. Apply these values via
    * familiar CSS-like shorthand. For example: `margin="small auto large"`.
    */
    margin: ThemeablePropTypes.spacing,
    /**
    * Valid values for `opacity` are `0` - `10`. Valid values for `blend` are
    * `normal` (default), `multiply`, `screen`, `overlay`, and `color-burn`.
    */
    overlay: PropTypes.shape({
      color: PropTypes.string.isRequired,
      opacity: PropTypes.oneOf([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).isRequired,
      blend: PropTypes.oneOf(['normal', 'multiply', 'screen', 'overlay', 'color-burn'])
    }),
    grayscale: PropTypes.bool,
    blur: PropTypes.bool,
    cover: PropTypes.bool
  }

  static defaultProps = {
    alt: '',
    inline: true,
    grayscale: false,
    blur: false,
    cover: false
  }

  renderFilter () {
    const blur = `blur(${this.theme.imageBlurAmount})`
    const grayscale = 'grayscale(1)'

    if (this.props.grayscale && this.props.blur) {
      return `${blur} ${grayscale}`
    } else if (this.props.grayscale) {
      return grayscale
    } else if (this.props.blur) {
      return blur
    } else {
      return null
    }
  }

  render () {
    const {
      src,
      alt,
      margin,
      inline,
      overlay,
      grayscale,
      blur,
      cover
    } = this.props

    // Detect browser support for object-fit
    // Don't need to sniff for Edge 16 bc it supports object-fit for <img>
    const supportsObjectFit = 'objectFit' in document.documentElement.style !== false

    const imgClasses = {
      [styles.image]: true,
      [styles['has-overlay']]: overlay,
      [styles['has-filter']]: blur || grayscale,
      [styles.cover]: cover && supportsObjectFit
    }

    const imgStyle = {
      filter: (blur || grayscale) ? this.renderFilter() : 'none'
    }

    const props = {
      ...omitProps(this.props, Img.propTypes, ['padding']),
      className: classnames(imgClasses),
      src,
      alt
    }

    if (overlay) {
      const containerClasses = {
        [styles['container--has-overlay']]: true,
        [styles['container--has-cover']]: cover,
        [styles['container--has-background']]: !supportsObjectFit
      }

      const containerStyle = {
        backgroundImage: !supportsObjectFit ? `url(${src})` : null
      }

      const overlayStyle = {
        backgroundColor: overlay.color,
        opacity: overlay.opacity * 0.1,
        mixBlendMode: (overlay.blend) ? overlay.blend : null
      }

      /* eslint-disable jsx-a11y/alt-text, jsx-a11y/no-redundant-roles*/
      const image = <img {...props} className={classnames(imgClasses)} style={imgStyle} role="img"/>
      /* eslint-enable jsx-a11y/alt-text, jsx-a11y/no-redundant-roles */

      return (
        <Container
          as="span"
          margin={margin}
          display={(inline) ? 'inline' : 'block'}
          className={classnames(containerClasses)}
          style={containerStyle}
        >
          {(!supportsObjectFit) ? <ScreenReaderContent>{image}</ScreenReaderContent> : image}
          <span className={styles.overlay} style={overlayStyle} />
        </Container>
      )
    } else {
      return (
        <Container
          {...props}
          as="img"
          margin={margin}
          display={(inline) ? 'inline' : 'block'}
          className={classnames(imgClasses)}
          style={imgStyle}
        />
      )
    }
  }
}
