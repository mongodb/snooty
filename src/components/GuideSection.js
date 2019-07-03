import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { setLocalValue } from '../utils/browser-storage';
import { SECTION_NAME_MAPPING } from '../constants';

export default class GuideSection extends Component {
  constructor() {
    super();
    this.state = {
      uriWriter: {
        cloudURI: {},
        localURI: {},
      },
    };
  }

  handleUpdateURIWriter = uri => {
    this.setState(
      prevState => ({
        uriWriter: {
          ...prevState.uri,
          ...uri,
        },
      }),
      () => {
        setLocalValue('uri', this.state.uriWriter); // eslint-disable-line react/destructuring-assignment
      }
    );
  };

  render() {
    const {
      guideSectionData: { children, name },
      headingRef,
    } = this.props;
    const { uriWriter } = this.state;
    const section = SECTION_NAME_MAPPING[name];

    return (
      <div className="section">
        <h2 ref={headingRef} id={section.id}>
          {section.title}
          <a className="headerlink" href={`#${section.id}`} title="Permalink to this headline">
            ¶
          </a>
        </h2>
        {children.map((child, index) => (
          <ComponentFactory
            {...this.props}
            handleUpdateURIWriter={this.handleUpdateURIWriter}
            key={index}
            nodeData={child}
            uriWriter={uriWriter}
          />
        ))}
      </div>
    );
  }
}

GuideSection.propTypes = {
  headingRef: PropTypes.shape({
    // for server-side rendering, replace Element with an empty function
    current: PropTypes.instanceOf(typeof Element === 'undefined' ? () => {} : Element),
  }).isRequired,
  guideSectionData: PropTypes.shape({
    children: PropTypes.array.isRequired,
    name: PropTypes.oneOf(Object.keys(SECTION_NAME_MAPPING)),
  }).isRequired,
};
