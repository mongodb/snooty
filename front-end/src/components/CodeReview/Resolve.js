import React, { Component } from 'react';
import { RemoteMongoClient } from 'mongodb-stitch-browser-sdk';

const baseStyle = {
  color: 'white',
  cursor: 'pointer'
};

const resolvedStyle = {
  color: 'rgb(105, 178, 65)',
  margin: 0
};

const toResolveStyle = {
  margin: 0
};

export default class Resolve extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resolved: this.props.thread.resolved
    };
  }

  componentDidMount() {
    this.client = this.props.stitchClient;
    this.db = this.client.getServiceClient(
      RemoteMongoClient.factory, this.props.service).db(this.props.db);
  }

  toggleResolved() {
    this.setState({
      resolved: !this.state.resolved
    }, () => {
      this.db.collection(this.props.collection).updateOne(
        { _id: this.props.thread._id },
        { $set: { resolved: this.state.resolved } }
      );
    });
  }

  render() {
    const isResolved = this.state.resolved ? '✓ Resolved' : 'Mark as resolved';
    const style = this.state.resolved ? resolvedStyle : toResolveStyle;
    return (
      <div>
        <span style={baseStyle} onClick={this.toggleResolved.bind(this)}><p style={style}>{isResolved}</p></span>
      </div>
    );
  }
}
