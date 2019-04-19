import React, { Component } from 'react';
import PropTypes from 'prop-types';

// State enum
const STATE_INITIAL = 'Initial';
const STATE_VOTED = 'Voted';

class MainWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state: STATE_INITIAL,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onInitialVote = this.onInitialVote.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  onSubmit() {
    const { state } = this.state;
    const { onSubmit } = this.props;

    onSubmit(state);
    this.setState({ state: STATE_VOTED });
  }

  onInitialVote(e, state) {
    const { handleOpenDrawer } = this.props;

    e.stopPropagation();
    this.setState({ state });
    if (state === false) {
      handleOpenDrawer();
    }
  }

  onToggle() {
    const { state } = this.state;
    const { onClear } = this.props;

    onClear();
    if (state === STATE_INITIAL) {
      return;
    }
    this.setState({ state: STATE_INITIAL });
  }

  render() {
    const { state } = this.state;
    const { canShowSuggestions, children, error, voteAcknowledgement } = this.props;
    const delugeBodyClass = state === STATE_INITIAL ? 'deluge-body' : 'deluge-body deluge-body-expanded';
    const delugeHeaderClass = state === STATE_INITIAL ? 'deluge-header' : 'deluge-header deluge-header-expanded';
    const delugeClass = state === STATE_INITIAL ? 'deluge' : 'deluge deluge-expanded';

    let body = null;
    if (state === STATE_VOTED && voteAcknowledgement === 'down') {
      body = (
        <p>
          If this page contains an error, you may{' '}
          <a className="deluge-fix-button" href="https://jira.mongodb.org/">
            report the problem on Jira.
          </a>
        </p>
      );
    } else if (state === STATE_VOTED && !voteAcknowledgement) {
      body = <p>Submitting feedback...</p>;
    } else if (typeof state === 'boolean') {
      const sorry = state === false ? <li>We&apos;re sorry! Please help us improve this page.</li> : null;

      if (canShowSuggestions) {
        const commentBox = children[0];
        body = (
          <div className="deluge-questions">
            <ul>
              {sorry}
              <li>{commentBox}</li>
            </ul>

            <div className="deluge-button-group">
              <button onClick={this.onToggle} type="button">
                Cancel
              </button>
              <button className="primary" onClick={this.onSubmit} disabled={error} type="submit">
                Submit
              </button>
            </div>
          </div>
        );
      } else {
        body = (
          <div className="deluge-questions">
            <ul>
              {sorry}
              {children.map((el, i) => (
                <li key={i}>{el}</li>
              ))}
            </ul>

            <div className="deluge-button-group">
              <button onClick={this.onToggle} type="button">
                Cancel
              </button>
              <button className="primary" onClick={this.onSubmit} disabled={error} type="submit">
                Submit
              </button>
            </div>
          </div>
        );
      }
    }

    return (
      <div className={delugeClass}>
        <div className={delugeHeaderClass} onClick={this.onToggle}>
          {state === STATE_INITIAL && <span className="fa fa-comments deluge-comment-icon" />}
          <span className="deluge-helpful">Was this page helpful?</span>
          {state !== STATE_INITIAL && <span className="fa fa-angle-down deluge-close-icon" />}
        </div>
        {state === STATE_INITIAL && (
          <div className="deluge-vote">
            <a key="voteup" id="rate-up" onClick={e => this.onInitialVote(e, true)}>
              Yes
            </a>
            <a key="votedown" id="rate-down" onClick={e => this.onInitialVote(e, false)}>
              No
            </a>
          </div>
        )}

        <div className={delugeBodyClass}>
          {state === STATE_VOTED && voteAcknowledgement === 'up' && <p>Thank you for your feedback!</p>}
          {body}
        </div>
      </div>
    );
  }
}

MainWidget.propTypes = {
  error: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
  voteAcknowledgement: PropTypes.string,
  handleOpenDrawer: PropTypes.func.isRequired,
  canShowSuggestions: PropTypes.bool.isRequired,
};

export default MainWidget;
