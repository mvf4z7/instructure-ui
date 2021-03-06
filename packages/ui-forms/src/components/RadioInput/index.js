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

import uid from '@instructure/ui-utils/lib/uid'
import themeable from '@instructure/ui-themeable'
import { omitProps } from '@instructure/ui-utils/lib/react/passthroughProps'
import isActiveElement from '@instructure/ui-utils/lib/dom/isActiveElement'

import styles from './styles.css'
import theme from './theme'
/**
---
category: components/forms
---
**/
@themeable(theme, styles)
class RadioInput extends Component {
  static propTypes = {
    label: PropTypes.node.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    id: PropTypes.string,
    name: PropTypes.string,
    checked: PropTypes.bool,
    disabled: PropTypes.bool,
    variant: PropTypes.oneOf(['simple', 'toggle']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    context: PropTypes.oneOf(['success', 'warning', 'danger', 'off']),
    inline: PropTypes.bool,
    onClick: PropTypes.func,
    onChange: PropTypes.func,
    /** works just like disabled but keeps the same styles as if it were active */
    readOnly: PropTypes.bool
  }

  static defaultProps = {
    onClick: function (event) {},
    onChange: function (event) {},
    variant: 'simple',
    size: 'medium',
    disabled: false,
    inline: false,
    context: 'success',
    readOnly: false
  }

  constructor (props) {
    super(props)

    this.state = {}

    if (props.checked === undefined) {
      this.state.checked = false
    }

    this._defaultId = `RadioInput__${uid()}`
  }

  handleClick = (e) => {
    if (this.props.disabled || this.props.readOnly) {
      e.preventDefault()
      return
    }

    this.props.onClick(e)
  }

  handleChange = (e) => {
    if (this.props.disabled || this.props.readOnly) {
      e.preventDefault()
      return
    }

    if (this.props.checked === undefined) {
      this.setState({ checked: !this.state.checked })
    }

    this.props.onChange(e)
  }

  focus () {
    this._input.focus()
  }

  get id () {
    return this.props.id || this._defaultId
  }

  get focused () {
    return isActiveElement(this._input)
  }

  get checked () {
    return (this.props.checked === undefined) ? this.state.checked : this.props.checked
  }

  render () {
    const {
      disabled,
      label,
      variant,
      size,
      inline,
      context,
      value,
      name,
      readOnly
    } = this.props

    const props = omitProps(this.props, RadioInput.propTypes)

    const classes = {
      [styles.root]: true,
      [styles.disabled]: disabled && !readOnly,
      [styles[variant]]: true,
      [styles[context]]: variant === 'toggle',
      [styles[size]]: true,
      [styles['inline']]: inline
    }

    return (
      <div className={classnames(classes)}>
        <input
          {...props}
          id={this.id}
          ref={(c) => { this._input = c }}
          value={value}
          name={name}
          checked={this.checked}
          type="radio"
          className={styles.input}
          disabled={disabled || readOnly ? 'true' : null}
          aria-disabled={disabled || readOnly ? 'true' : null}
          onChange={this.handleChange}
          onClick={this.handleClick}
        />
        <label className={styles.control} htmlFor={this.id}>
          <span className={styles.facade} aria-hidden="true" />
          <span className={styles.label}>
            {label}
          </span>
        </label>
      </div>
    )
  }
}

export default RadioInput
