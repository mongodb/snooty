import Comment from './Comment';
import CommentForm from './CommentForm';
import Delete from './Delete';
import Jira from './Jira';
import React, { Component } from 'react';
import Resolve from './Resolve';
import { RemoteMongoClient } from 'mongodb-stitch-browser-sdk';

const paddingStyle = {
  padding: '1rem',
};

const threadStyle= {
  backgroundColor: '#24292e',
  borderRadius: '4px',
  overflowX: 'hidden',
  padding: '1rem'
};

const h3Style = {
  color: 'white',
  fontWeight: 'normal'
};

const floatStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  margin: '1rem 0'
}

export default class Thread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: this.props.active,
      value: ''
    };

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

  handleSubmit(e) {
    e.preventDefault();
    const reply = {
      author: this.client.auth.user.id,
      body: this.state.value,
      position: this.props.commentLineNumber,
      date: new Date(),
      commit_sha: this.props.activeCommit,
    };

    this.db.collection(this.props.collection).updateOne(
      { _id: this.props.thread._id },
      { $push: { replies: reply } }
    );
    this.props.handleCRUpdate();
  }

  render() {
    const thread = this.props.thread;
    const isActive = this.props.active ? 'highlight' : '';
    const replies = thread.replies.map((comment, index) =>
      <Comment key={index} comment={comment} />
    );
    return (
      <div className={isActive} style={paddingStyle}>
        <div style={threadStyle}>
          <div onClick={(event) => this.props.handleClick(event, thread.position, thread.file)}>
            <h3 style={h3Style}>@{thread.author}: {thread.body}</h3>
            {replies}
          </div>
          <div style={floatStyle}>
            <Resolve {...this.props} />
            <Jira />
            <Delete {...this.props} />
          </div>
          <CommentForm
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            placeholder="Reply"
          />
        </div>
      </div>
    );
  }
}
