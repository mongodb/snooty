import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from '../components/ComponentFactory';
import Footer from '../components/Footer';
import { getNestedValue } from '../utils/get-nested-value';
import Navbar from '../components/Navbar';

export default class Document extends Component {
  constructor(props) {
    super(props);

    const {
      pageContext: { __refDocMapping },
    } = this.props;

    this.pageNodes = getNestedValue(['ast', 'children'], __refDocMapping) || [];
    this.state = {
      pillstrips: [],
    };
  }

  addPillstrip = pillstripName => {
    this.setState(prevState => ({
      pillstrips: [...prevState.pillstrips, pillstripName],
    }));
  };

  render() {
    const {
      pageContext: { pageMetadata, __refDocMapping },
      substitutions,
    } = this.props;
    const { pillstrips } = this.state;

    return (
      <React.Fragment>
        <Navbar />
        <div className="content">
          <div id="main-column" className="main-column">
            <span className="showNav" id="showNav">
              Navigation
            </span>
            <div className="document">
              <div className="documentwrapper">
                <div className="bodywrapper">
                  <div className="body">
                    <div className="bc" />
                    {this.pageNodes.map((child, index) => (
                      <ComponentFactory
                        addPillstrip={this.addPillstrip}
                        key={index}
                        nodeData={child}
                        refDocMapping={__refDocMapping}
                        pageMetadata={pageMetadata}
                        pillstrips={pillstrips}
                        substitutions={substitutions}
                      />
                    ))}
                    <Footer />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

Document.propTypes = {
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.shape({
      ast: PropTypes.shape({
        children: PropTypes.array,
      }).isRequired,
    }).isRequired,
    pageMetadata: PropTypes.objectOf(PropTypes.object).isRequired,
  }).isRequired,
  substitutions: PropTypes.objectOf(PropTypes.array).isRequired,
};
