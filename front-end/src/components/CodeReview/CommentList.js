import React, { Component} from 'react';
import Thread from './Thread';
import { AnonymousCredential, RemoteMongoClient, Stitch } from 'mongodb-stitch-browser-sdk';

const style = {
  float: 'right',
  height: '100vh',
  overflowY: 'scroll',
  position: 'sticky',
  top: '45px',
  width: '20%'
}

export default class GitHubCommentList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeCommentLine: this.props.activeCommentLine,
      comments: []
    }

    this.createThreads = this.createThreads.bind(this);
  }

  componentDidMount() {
    this.client = this.props.stitchClient;
    this.db = this.client.getServiceClient(
      RemoteMongoClient.factory, this.props.service).db(this.props.db);
    this.fetchStitchComments();
  }

  componentDidUpdate(prevState) {
    if (prevState.activeCommentLine !== this.props.activeCommentLine) {
      this.setState({activeCommentLine: this.props.activeCommentLine});
    }
  }

  componentWillReceiveProps(props) {
    const { refresh } = this.props;
    if (props.refresh !== refresh) {
      this.fetchStitchComments();
    }
  }

  fetchStitchComments() {
    this.client.auth.loginWithCredential(new AnonymousCredential())
      .then(() =>
        this.db.collection(this.props.collection).find({
          commit_sha: this.props.activeCommit,
          repo: this.props.repo
        }, {sort: {position: 1}}).asArray()
      ).then(docs => {
        this.setState({comments: docs});
        this.props.highlightLinesWithComments(this.getCommentPositions(docs));
      });
  }

  getCommentPositions(comments) {
    return comments.map(comment => {
      return {filename: comment.file, position: comment.position}
    });
  }

  createThreads(thread) {
      const isActive = thread.position === this.state.activeCommentLine && thread.file === this.props.activeFile;
      return (
        <Thread
          active={isActive}
          key={thread._id.generationTime}
          thread={thread}
          {...this.props}
        />
      );
  }

  render() {
    return (
      <div style={style}>
        {this.state.comments.map(this.createThreads)}
      </div>
    );
  }

}

