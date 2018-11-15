import React, { Component } from 'react';
import { RemoteMongoClient } from 'mongodb-stitch-browser-sdk';

const baseStyle = {
  color: 'red',
  cursor: 'pointer'
};

export default class Resolve extends Component {

  componentDidMount() {
    this.client = this.props.stitchClient;
    this.db = this.client.getServiceClient(
      RemoteMongoClient.factory, this.props.service).db(this.props.db);
  }

  handleDelete() {
    this.db.collection(this.props.collection).deleteOne(
      { _id: this.props.thread._id }
    );
    this.props.handleCRUpdate();
  }

  render() {
    return (
      <span style={baseStyle} onClick={this.handleDelete.bind(this)}>Delete</span>
    );
  }
}
