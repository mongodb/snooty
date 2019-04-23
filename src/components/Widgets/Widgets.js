import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Suggestion from './Suggestion/Suggestion';
import Deluge from './Deluge/Deluge';
import { SUGGESTION_WHITELIST } from '../../constants';

export default class Widgets extends Component {
  constructor(props) {
    super(props);
    const { path } = this.props;

    this.isSuggestionPage = this.isSuggestionPage(path);

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
    const { path, project } = this.props;
    return (
      <div>
        <Deluge project={project} path={path} openDrawer={this.openDrawer} canShowSuggestions={this.isSuggestionPage} />
        {this.isSuggestionPage && <Suggestion drawerIsOpen={drawerIsOpen} closeDrawer={this.closeDrawer} />}
      </div>
    );
  }
}

Widgets.propTypes = {
  project: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};
