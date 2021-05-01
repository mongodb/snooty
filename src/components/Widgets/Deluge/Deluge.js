import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AnonymousCredential, Stitch } from 'mongodb-stitch-browser-sdk';
import { isBrowser } from '../../../utils/is-browser';
import { sendAnalytics } from '../../../utils/segment';
import FreeformQuestion from './FreeformQuestion';
import InputField from './InputField';
import MainWidget from './MainWidget';

const EMAIL_ERROR_TEXT = 'Please enter a valid email address.';
const EMAIL_PROMPT_TEXT = 'May we contact you about your feedback?';

class Deluge extends Component {
  constructor(props) {
    super(props);

    this.stitchClient = null;
    this.state = {
      answers: {},
      emailError: false,
      interactionId: undefined,
      voteAcknowledgement: null,
    };
  }

  componentDidMount() {
    this.setupStitch();

    if (isBrowser) {
      const crypto = window.crypto || window.msCrypto;
      const buf = new Uint8Array(16);
      crypto.getRandomValues(buf);
      this.setState({
        interactionId: btoa(Array.prototype.map.call(buf, (ch) => String.fromCharCode(ch)).join('')).slice(0, -2),
      });
    }
  }

  // TODO: abstract Stitch environment in order to toggle staging and production Stitch environments
  setupStitch = () => {
    try {
      const appId = 'feedback-ibcyy';
      this.stitchClient = Stitch.hasAppClient(appId) ? Stitch.getAppClient(appId) : Stitch.initializeAppClient(appId);
      this.stitchClient.auth.loginWithCredential(new AnonymousCredential()).catch((err) => {
        console.error(err);
      });
    } catch (error) {
      this.stitchClient = null;
      console.error('Could not connect to Stitch', error);
    }
  };

  onSubmitVote = (vote) => {
    this.sendVote(vote)
      .then(() => {
        this.setState({
          voteAcknowledgement: vote ? 'up' : 'down',
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  sendVote = (vote) => {
    const { path, project } = this.props;
    const { interactionId } = this.state;

    const segmentEvent = sendAnalytics('Vote Submitted', {
      interactionId,
      useful: vote,
    });

    const pathSlug = `${project}/${path}`;
    const url = isBrowser ? window.location.href : null;
    const voteDocument = {
      interactionId,
      useful: vote,
      page: pathSlug,
      'q-url': url,
      date: new Date(),
    };

    // TODO: remove Segment-specific names to Atlas tables and provide an identity type string that identifies
    // the identity source in preparation for SSO integration
    if (segmentEvent.segmentUID) {
      voteDocument['q-segmentUID'] = segmentEvent.segmentUID;
    } else {
      voteDocument['q-segmentAnonymousID'] = segmentEvent.segmentAnonymousID;
    }

    return this.stitchClient.callFunction('submitVoteV2', [voteDocument]);
  };

  onSubmitFeedback = (vote) => {
    const { answers } = this.state;

    const fields = {};
    const keys = Object.keys(answers);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];

      // Report booleans and non-empty strings
      if (answers[key] || answers[key] === false) {
        fields[key] = answers[key];
      }
    }

    this.sendFeedback(vote, fields).catch((err) => {
      console.error(err);
    });
  };

  sendFeedback = (vote, fields) => {
    const { interactionId } = this.state;

    sendAnalytics('Feedback Submitted', {
      interactionId,
      useful: vote,
      ...fields,
    });

    // Prefix fields with q- to preserve Deluge's naming scheme
    Object.keys(fields).forEach((key) => {
      if (!key.startsWith('q-')) {
        Object.defineProperty(fields, `q-${key}`, Object.getOwnPropertyDescriptor(fields, key));
        delete fields[key]; // eslint-disable-line no-param-reassign
      }
    });

    const query = { interactionId };
    const update = {
      $set: {
        ...fields,
      },
    };

    return this.stitchClient.callFunction('submitFeedback', [query, update]);
  };

  makeStore = (key) => {
    const { answers } = this.state;
    return {
      get: () => answers[key],
      set: (val) =>
        this.setState((prevState) => ({
          answers: {
            ...prevState.answers,
            [key]: val,
          },
        })),
    };
  };

  validateEmail = (input) => {
    const hasError = !(input === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input));
    this.setState({ emailError: hasError });
    return hasError;
  };

  render() {
    const { answers, emailError, voteAcknowledgement } = this.state;
    const { canShowSuggestions, openDrawer } = this.props;

    const noAnswersSubmitted = Object.keys(answers).length === 0 || Object.values(answers).every((val) => val === '');
    const hasError = noAnswersSubmitted || emailError;

    return this.stitchClient ? (
      <MainWidget
        voteAcknowledgement={voteAcknowledgement}
        onSubmitFeedback={this.onSubmitFeedback}
        onSubmitVote={this.onSubmitVote}
        onClear={() => this.setState({ answers: {} })}
        canShowSuggestions={canShowSuggestions}
        handleOpenDrawer={openDrawer}
        error={hasError}
      >
        <FreeformQuestion store={this.makeStore('reason')} placeholder="What are you trying to do?" />
        <div className="caption">{EMAIL_PROMPT_TEXT}</div>
        <InputField
          errorText={EMAIL_ERROR_TEXT}
          hasError={(input) => this.validateEmail(input)}
          inputType="email"
          store={this.makeStore('email')}
          placeholder="Email address"
        />
      </MainWidget>
    ) : null;
  }
}

Deluge.propTypes = {
  project: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  canShowSuggestions: PropTypes.bool.isRequired,
  openDrawer: PropTypes.func.isRequired,
};

export default Deluge;
