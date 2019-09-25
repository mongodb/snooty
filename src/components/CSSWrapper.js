import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';

export default class CSSWrapper extends React.Component {
  componentDidMount() {
    const { className } = this.props;

    /*
     * Using findDOMNode() is discouraged in favor of passing refs to children, but we use it here
     * because refs cannot be attached to stateless function components.
     *
     * GitHub issue: https://github.com/yannickcr/eslint-plugin-react/issues/678
     */
    const childNode = findDOMNode(this); // eslint-disable-line react/no-find-dom-node
    if (childNode && childNode.classList) {
      // Handle both proptypes for className: a string or an array of strings
      if (typeof className === 'string') {
        childNode.classList.add(className);
      } else if (Array.isArray(className)) {
        className.forEach(name => {
          childNode.classList.add(name);
        });
      }
    }
  }

  render() {
    const { children } = this.props;

    return <React.Fragment>{children}</React.Fragment>;
  }
}

CSSWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
};
