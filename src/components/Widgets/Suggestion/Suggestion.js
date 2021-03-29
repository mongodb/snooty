import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AnonymousCredential, Stitch } from 'mongodb-stitch-browser-sdk';
import SuggestionCardList from './SuggestionCardList';
import { reportAnalytics } from '../../../utils/report-analytics';

function getPageName() {
  const bodyElements = document.getElementsByClassName('body');
  if (!bodyElements.length) {
    return null;
  }

  const pagename = bodyElements[0].getAttribute('data-pagename');

  return pagename;
}

export default class Suggestion extends Component {
  constructor(props) {
    super(props);

    this.pageName = getPageName();

    this.state = {
      showThankYouMessage: false,
      suggestions: [],
    };
  }

  componentDidMount() {
    this.setupStitch();
  }

  handleCloseDrawer = () => {
    const { showThankYouMessage } = this.state;
    const { closeDrawer } = this.props;

    closeDrawer();
    reportAnalytics('Suggestion Drawer Closed', {
      userDismissedSuggestions: showThankYouMessage,
    });
  };

  handleDismissCard = () => {
    this.setState({ showThankYouMessage: true });
    reportAnalytics('Suggestions Dismissed');
  };

  setupStitch = () => {
    const { stitchId } = this.props;
    this.stitchClient = Stitch.hasAppClient(stitchId)
      ? Stitch.getAppClient(stitchId)
      : Stitch.initializeAppClient(stitchId);
    this.stitchClient.auth
      .loginWithCredential(new AnonymousCredential())
      .then(() => {
        this.fetchStitchSuggestions();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  fetchStitchSuggestions = () => {
    this.stitchClient.callFunction('fetchSuggestions', [this.pageName]).then(
      (result) => {
        this.setState({
          suggestions: result,
        });
      },
      (error) => {
        console.error('error:', error);
      }
    );
  };

  render() {
    const { showThankYouMessage, suggestions } = this.state;
    const { drawerIsOpen } = this.props;

    const drawerIsOpenClass = drawerIsOpen ? 'is-open' : '';
    let bodyDisplay;

    if (showThankYouMessage) {
      bodyDisplay = (
        <div>
          <span
            onClick={() => this.handleCloseDrawer()}
            className="fa fa-times suggestion-close suggestion-close-button"
            role="button"
            tabIndex={0}
          />
          <h1>Thanks for your feedback.</h1>
          <p>We&apos;ll use it to make more helpful suggestions in the future.</p>
        </div>
      );
    } else {
      bodyDisplay = (
        <div>
          <span
            onClick={() => this.handleCloseDrawer()}
            className="fa fa-times suggestion-close suggestion-close-button"
            role="button"
            tabIndex={0}
          />
          <h1>Need help?</h1>
          <p>Other MongoDB users have found these resources useful.</p>
          <SuggestionCardList
            suggestions={suggestions}
            handleDismissCard={this.handleDismissCard}
            pageName={this.pageName}
          />
        </div>
      );
    }
    return <div className={`suggestion ${drawerIsOpenClass}`}>{bodyDisplay}</div>;
  }
}

Suggestion.propTypes = {
  closeDrawer: PropTypes.func.isRequired,
  drawerIsOpen: PropTypes.bool.isRequired,
  stitchId: PropTypes.string.isRequired,
};
