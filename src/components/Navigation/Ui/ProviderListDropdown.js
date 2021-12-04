import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Menu, MenuItem, Button } from '@material-ui/core'
import { providers } from '../../../utils/utils'
import Autocomplete from '../../Navigation/Ui/Autocomplete'
import searchSvg from '../../../images/icons/carrortDown.svg'

class ProviderListDropdown extends Component {
  constructor(props) {
    super(props)
    this.state = { menu: null, focus: false }
    this.filter = this.filter.bind(this)
  }

  static propTypes = {
    list: PropTypes.array.isRequired,
    title: PropTypes.string,
    disabled: PropTypes.bool,
    value: PropTypes.object,
    onProviderChange: PropTypes.func.isRequired,
    className: PropTypes.string
    // variant: PropTypes.string
  }
  handleClose = () => {
    this.setState({ menu: null })
  }
  handleClick = event => {
    this.setState({ menu: event.currentTarget })
  }
  filter(option, props) {
    if (this.props.value) return true
    return option.toLowerCase().indexOf(props.text.toLowerCase()) !== -1
  }
  render() {
    const { title, disabled, onProviderChange, value, variant, className } = this.props
    const { focus } = this.state

    return (
      <div className={`w-100 ${className} ${focus ? 'active' : ''}`}>
        <Autocomplete
          id="provider-picker"
          className="provider-drop-down"
          defaultInputValue={'npm'}
          defaultInputValue={value.value}
          selected={[value]}
          onFocus={() => this.setState({ ...this.state, focus: true })}
          onBlur={() => this.setState({ ...this.state, focus: false })}
          onChange={selected => onProviderChange(selected[0])}
          options={providers}
          placeholder={'Type'}
          positionFixed
          filterBy={this.filter}
          selectHintOnEnter
        />
        <div className="search-logo">
          <img src={searchSvg} alt="search" />
        </div>
      </div>
    )
  }
}

export default ProviderListDropdown
