import React, { Component} from 'react';
import CommentForm from './CommentForm';
import { RemoteMongoClient } from 'mongodb-stitch-browser-sdk';

const style = {
  backgroundColor: '#24292e',
  borderRadius: '4px',
  boxShadow: '4px 4px 16px -4px rgba(0,0,0,0.75)',
  color: 'blue',
  left: 0,
  margin: '1rem',
  padding: '1rem',
  position: 'fixed'
}

export default class NewCRComment extends Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount() {
    this.client = this.props.stitchClient;
    this.db = this.client.getServiceClient(
      RemoteMongoClient.factory, this.props.service).db(this.props.db);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.db.collection(this.props.collection).insertOne({
      author: this.client.auth.user.id,
      body: this.state.value,
      position: this.props.commentLineNumber,
      date: new Date(),
      file: this.props.filename,
      repo: this.props.repo,
      resolved: false,
      commit_sha: this.props.activeCommit,
      replies: []
    });
    this.props.hideModal();
    this.props.handleCRUpdate();
  }

  render() {
    return (
      <div style={style}>
        <CommentForm
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          placeholder="Leave a comment"
        />
      </div>
    )
  }

}

