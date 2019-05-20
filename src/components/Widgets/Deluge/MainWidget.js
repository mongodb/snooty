import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getSessionValue, setSessionValue } from '../../../browserStorage';

// State enum
const STATE_INITIAL = 'Initial';
const STATE_VOTED = 'Voted';

class MainWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closed: false,
      state: STATE_INITIAL,
    };
  }

  componentDidMount() {
    const savedFeedbackState = getSessionValue('feedbackHidden');
    if (savedFeedbackState) {
      this.setState({ closed: savedFeedbackState });
    }
  }

  onSubmitFeedback = () => {
    const { state } = this.state;
    const { onSubmitFeedback } = this.props;

    onSubmitFeedback(state);
    this.setState({ state: STATE_VOTED });
  };

  onSubmitVote = (e, state) => {
    const { handleOpenDrawer, onSubmitVote } = this.props;

    e.stopPropagation();
    this.setState({ state });
    onSubmitVote(state);
    if (state === false) {
      handleOpenDrawer();
    }
  };

  toggleVisibility = event => {
    const { closed, state } = this.state;
    event.stopPropagation();
    if ((typeof state === 'boolean' || state === STATE_VOTED) && closed === false) {
      this.setState({ state: STATE_INITIAL });
    }
    this.setState(
      prevState => ({ closed: !prevState.closed }),
      // eslint-disable-next-line react/destructuring-assignment
      () => setSessionValue('feedbackHidden', JSON.stringify(this.state.closed))
    );
  };

  render() {
    const { closed, state } = this.state;
    const { canShowSuggestions, children, error, voteAcknowledgement } = this.props;
    const delugeBodyClass = state === STATE_INITIAL ? 'deluge-body' : 'deluge-body deluge-body-expanded';
    const delugeHeaderClass = 'deluge-header';
    const delugeClass = state !== STATE_INITIAL && closed === false ? 'deluge deluge-expanded' : 'deluge';

    let body = null;
    if (state === STATE_VOTED) {
      body = (
        <React.Fragment>
          <p>Thank you for your feedback!</p>
          <p>
            If this page contains an error, you may{' '}
            <a className="deluge-fix-button" href="https://jira.mongodb.org/">
              report the problem on Jira.
            </a>
          </p>
          <p>
            We also recommend you explore{' '}
            <a className="deluge-fix-button" href="https://groups.google.com/group/mongodb-user">
              the MongoDB discussion forum
            </a>{' '}
            for additional support.
          </p>
          <p className="deluge-close-link">
            <small>
              <span onClick={this.toggleVisibility} role="button" tabIndex={0}>
                Close
              </span>
            </small>
          </p>
        </React.Fragment>
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
              <button onClick={this.toggleVisibility} type="button">
                Cancel
              </button>
              <button className="primary" onClick={this.onSubmitFeedback} disabled={error} type="submit">
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
              <button onClick={this.toggleVisibility} type="button">
                Cancel
              </button>
              <button className="primary" onClick={this.onSubmitFeedback} disabled={error} type="submit">
                Submit
              </button>
            </div>
          </div>
        );
      }
    }

    return (
      <div className={delugeClass}>
        {closed ? (
          <div
            className="deluge-header deluge-header-minimized"
            onClick={this.toggleVisibility}
            role="button"
            tabIndex={0}
          >
            <span className="fa fa-angle-up deluge-open-icon" />
          </div>
        ) : (
          <React.Fragment>
            <div className={delugeHeaderClass}>
              <span className="fa fa-angle-down deluge-close-icon-hidden" />
              <span className="deluge-helpful">Was this page helpful?</span>
              <span
                className="fa fa-angle-down deluge-close-icon"
                onClick={this.toggleVisibility}
                role="button"
                tabIndex={0}
              />
            </div>
            {state === STATE_INITIAL && (
              <div className="deluge-vote">
                <a // eslint-disable-line jsx-a11y/anchor-is-valid
                  key="voteup"
                  id="rate-up"
                  role="button"
                  tabIndex={0}
                  onClick={e => this.onSubmitVote(e, true)}
                >
                  Yes
                </a>
                <a // eslint-disable-line jsx-a11y/anchor-is-valid
                  key="votedown"
                  id="rate-down"
                  role="button"
                  tabIndex={0}
                  onClick={e => this.onSubmitVote(e, false)}
                >
                  No
                </a>
              </div>
            )}

            <div className={delugeBodyClass}>{body}</div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

MainWidget.propTypes = {
  error: PropTypes.bool.isRequired,
  onSubmitFeedback: PropTypes.func.isRequired,
  onSubmitVote: PropTypes.func.isRequired,
  children: PropTypes.arrayOf(PropTypes.node),
  voteAcknowledgement: PropTypes.string,
  handleOpenDrawer: PropTypes.func.isRequired,
  canShowSuggestions: PropTypes.bool.isRequired,
};

MainWidget.defaultProps = {
  children: null,
  voteAcknowledgement: undefined,
};

export default MainWidget;
