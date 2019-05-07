import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Suggestion from './Suggestion/Suggestion';
import Deluge from './Deluge/Deluge';
import { SUGGESTION_WHITELIST } from '../../constants';

export default class Widgets extends Component {
  constructor(props) {
    super(props);

    const { guideName } = this.props;
    this.isSuggestionPage = this.isSuggestionPage(guideName);

    this.state = {
      drawerIsOpen: false,
      drawerHasOpened: false,
    };
  }

  isSuggestionPage = path => {
    return SUGGESTION_WHITELIST.includes(path);
  };

  openDrawer = () => {
    const { drawerHasOpened } = this.state;

    // Don't display suggestions again after closing
    if (drawerHasOpened) {
      return;
    }

    this.setState({
      drawerIsOpen: true,
      drawerHasOpened: true,
    });
  };

  closeDrawer = () => {
    this.setState({
      drawerIsOpen: false,
    });
  };

  render() {
    const { drawerIsOpen } = this.state;
    const { guideName, project } = this.props;

    return (
      <div>
        <Deluge
          path={guideName}
          project={project}
          openDrawer={this.openDrawer}
          canShowSuggestions={this.isSuggestionPage}
        />
        {this.isSuggestionPage && <Suggestion drawerIsOpen={drawerIsOpen} closeDrawer={this.closeDrawer} />}
      </div>
    );
  }
}

Widgets.propTypes = {
  guideName: PropTypes.string.isRequired,
  project: PropTypes.string.isRequired,
};
