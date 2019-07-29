import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { getNestedValue } from '../utils/get-nested-value';

export default class CssClass extends React.Component {
  componentDidMount() {
    const { nodeData } = this.props;
    const className = getNestedValue(['argument', 0, 'value'], nodeData);

    /*
     * Using findDOMNode() is discouraged in favor of passing refs to children, but we use it here
     * because refs cannot be attached to stateless function components.
     *
     * GitHub issue: https://github.com/yannickcr/eslint-plugin-react/issues/678
     */
    const childNode = findDOMNode(this); // eslint-disable-line react/no-find-dom-node
    if (childNode) {
      childNode.classList.add(className);
    }
  }

  render() {
    const {
      nodeData: { children },
    } = this.props;

    return (
      <React.Fragment>
        {children.map((child, index) => (
          <ComponentFactory {...this.props} key={index} nodeData={child} />
        ))}
      </React.Fragment>
    );
  }
}

CssClass.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ).isRequired,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        children: PropTypes.array,
      })
    ),
  }).isRequired,
};
