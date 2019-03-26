// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Select from 'antd/lib/select'
import Icon from 'antd/lib/icon'
import Tag from 'antd/lib/tag'
import isEqual from 'lodash/isEqual'
import Contribution from '../utils/contribution'

/**
 * Specific renderer for Facets
 *
 */
class FacetsRenderer extends Component {
  static propTypes = {
    isFolder: PropTypes.bool.isRequired,
    onFacetSelected: PropTypes.func,
    record: PropTypes.object,
    values: PropTypes.array.isRequired
  }

  state = {
    inputVisible: false
  }

  onFacetSelected = (val, facet) => {
    const { onFacetSelected, record } = this.props
    onFacetSelected && onFacetSelected(val, record, facet)
  }

  handleInputConfirm = inputValues => {
    if (!inputValues[0]) return this.setState({ inputVisible: false })

    const currentFacets = this.getFacetsForCurrentFolder()
    let newFacets = currentFacets
    if (currentFacets.indexOf(inputValues[0]) === -1) newFacets = [...currentFacets, inputValues[0]]
    if (inputValues.length > 0 && !isEqual(newFacets, currentFacets)) {
      this.onFacetSelected(newFacets)
    }
    this.setState({ inputVisible: false })
  }

  handleClose = removedFacet => {
    this.onFacetSelected(null, removedFacet)
  }

  showInput = () => this.setState({ inputVisible: true })

  getFacetsForCurrentFolder = () => {
    const { isFolder, facets, record } = this.props
    if (!isFolder || !facets) return []
    const facetsFiltered = Object.values(facets).map(
      globs => globs.filter(glob => Contribution.folderMatchesGlob(record, glob)).length > 0
    )
    return Object.keys(facets).filter((_, i) => facetsFiltered[i])
  }

  renderExistingFacets = currentFacets => {
    const { facets, record } = this.props
    return currentFacets.map((tag, i) => {
      const isMatchingThisFolder =
        facets && facets[tag].filter(glob => Contribution.folderMatchesGlobExactly(record, glob)).length > 0
      return (
        <Tag key={i} closable={isMatchingThisFolder} afterClose={() => this.handleClose(tag)}>
          {tag}
        </Tag>
      )
    })
  }

  render() {
    const { isFolder, values } = this.props
    const { inputVisible } = this.state

    const currentFacets = this.getFacetsForCurrentFolder()

    return (
      <div>
        {values.length > 0
          ? values.map((val, i) => (
              <Tag
                key={i}
                closable={isFolder}
                afterClose={() => this.handleClose(val)}
                className={val.isDifferent ? 'facets--isEdited' : ''}
              >
                {val.value}
              </Tag>
            ))
          : currentFacets.length === 0 && <Tag>core</Tag>}
        {isFolder && this.renderExistingFacets(currentFacets)}
        {isFolder &&
          (!inputVisible ? (
            <Tag onClick={this.showInput} style={{ background: '#fff', borderStyle: 'dashed' }}>
              <Icon type="plus" />
            </Tag>
          ) : (
            <Select
              autoFocus
              mode="multiple"
              maxTagCount={1}
              style={{ width: '50%' }}
              onChange={this.handleInputConfirm}
              onBlur={this.handleInputConfirm}
            >
              {Contribution.nonCoreFacets
                .filter(el => !currentFacets.includes(el))
                .map(facet => (
                  <Select.Option key={facet}>{facet}</Select.Option>
                ))}
            </Select>
          ))}
      </div>
    )
  }
}

export default FacetsRenderer
