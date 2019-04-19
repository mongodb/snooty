import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Suggestion from './Suggestion/Suggestion';
import Deluge from './Deluge/deluge';

const whitelist = [
  'tutorial/install-mongodb-on-windows',
  'tutorial/install-mongodb-on-ubuntu',
  'tutorial/query-documents',
  'reference/method/db.collection.find',
  'reference/method/db.collection.updateOne',
];

export default class Widgets extends Component {
  constructor(props) {
    super(props);
    const { path } = this.props;

    this.isSuggestionPage = this.isSuggestionPage(path);
    // this.openDrawer = this.openDrawer.bind(this);
    // this.closeDrawer = this.closeDrawer.bind(this);

    this.state = {
      drawerIsOpen: false,
      drawerHasOpened: false,
    };
  }

  isSuggestionPage = path => {
    return whitelist.indexOf(path) >= 0;
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
