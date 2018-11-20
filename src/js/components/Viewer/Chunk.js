import React from "react"

export default class Chunk extends React.PureComponent {
  render() {
    const {chunker, chunk, rowRenderer} = this.props
    return <div>{chunker.rows(chunk).map(rowRenderer)}</div>
  }
}
