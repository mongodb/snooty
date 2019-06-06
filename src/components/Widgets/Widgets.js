import React, { Component } from 'react';
import { StaticQuery, graphql } from 'gatsby';
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
    const { guideName, snootyStitchId } = this.props;

    return (
      <StaticQuery
        query={graphql`
          query SiteMetadata {
            site {
              siteMetadata {
                project
              }
            }
          }
        `}
        render={data => (
          <React.Fragment>
            <Deluge
              path={guideName}
              project={data.site.siteMetadata.project}
              openDrawer={this.openDrawer}
              canShowSuggestions={this.isSuggestionPage}
            />
            {this.isSuggestionPage && (
              <Suggestion drawerIsOpen={drawerIsOpen} closeDrawer={this.closeDrawer} stitchId={snootyStitchId} />
            )}
          </React.Fragment>
        )}
      />
    );
  }
}

Widgets.propTypes = {
  guideName: PropTypes.string.isRequired,
  snootyStitchId: PropTypes.string.isRequired,
};
