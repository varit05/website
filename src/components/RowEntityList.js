// Copyright (c) Microsoft Corporation and others. Licensed under the MIT license.
// SPDX-License-Identifier: MIT

import React from 'react'
import PropTypes from 'prop-types'
import { InfiniteList } from './'

export default class RowEntityList extends React.Component {
  static propTypes = {
    list: PropTypes.array,
    listLength: PropTypes.number,
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    rowRenderer: PropTypes.func.isRequired,
    loadMoreRows: PropTypes.func,
    noRowsRenderer: PropTypes.func,
    sortOrder: PropTypes.string,
    contentSeq: PropTypes.number // value upper levels can change to sign non-shallow content/display change
  }

  static defaultProps = {
    rowHeight: 50,
    noRowsRenderer: () => <div>Nothing found</div>
  }

  constructor(props) {
    super(props)
    this.state = { expanded: [] }
    this.length = this.length.bind(this)
    this.isRowLoaded = this.isRowLoaded.bind(this)
  }

  render() {
    const {
      loadMoreRows,
      listLength,
      rowRenderer,
      noRowsRenderer,
      rowHeight,
      contentSeq,
      sortOrder,
      customClassName
    } = this.props
    return (
      <InfiniteList
        role="row"
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={loadMoreRows}
        totalRows={() => listLength}
        currentRows={this.length}
        rowRenderer={rowRenderer}
        noRowsRenderer={noRowsRenderer}
        rowHeight={rowHeight}
        sortOrder={sortOrder}
        contentSeq={contentSeq}
        customClassName={customClassName}
      />
    )
  }

  isRowLoaded({ index }) {
    return this.length() > index
  }

  length() {
    const { list } = this.props
    return list ? (list.length > 20 ? list.length - 5 : list.length) : 0
  }
}
