import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TOC from '../components/TOC';
import GuideSection from '../components/GuideSection';
import GuideHeading from '../components/GuideHeading';
import { LANGUAGES, DEPLOYMENTS } from '../constants';
import { getLocalValue, setLocalValue } from '../localStorage';

export default class Guide extends Component {
  constructor(propsFromServer) {
    super(propsFromServer);

    const { pageContext } = this.props;

    // get data from server
    this.sections =
      pageContext.__refDocMapping[
        this.props['*'] // eslint-disable-line react/destructuring-assignment
      ].ast.children[0].children;
    this.validNames = ['prerequisites', 'check_your_environment', 'procedure', 'summary', 'whats_next', 'seealso'];
    this.admonitions = ['admonition', 'note', 'tip', 'important', 'warning'];
    this.state = {
      activeTabs: {},
    };
  }

  addTabset = (tabsetName, tabData) => {
    let tabs = tabData.map(tab => tab.argument[0].value);
    if (tabsetName === 'cloud') {
      tabs = DEPLOYMENTS.filter(tab => tabs.includes(tab));
      this.setNamedTabData(tabsetName, tabs, DEPLOYMENTS);
    } else if (tabsetName === 'drivers') {
      tabs = LANGUAGES.filter(tab => tabs.includes(tab));
      this.setNamedTabData(tabsetName, tabs, LANGUAGES);
    }
    this.setActiveTab(getLocalValue(tabsetName) || tabs[0], tabsetName);
  };

  matchArraySorting = (tabs, referenceArray) => referenceArray.filter(t => tabs.includes(t));

  setNamedTabData = (tabsetName, tabs, constants) => {
    this.setState(prevState => ({
      [tabsetName]: this.matchArraySorting(Array.from(new Set([...(prevState[tabsetName] || []), ...tabs])), constants),
    }));
  };

  setActiveTab = (value, tabsetName) => {
    this.setState(prevState => ({
      activeTabs: {
        ...prevState.activeTabs,
        [tabsetName]: value,
      },
    }));
    setLocalValue(tabsetName, value);
  };

  createSections() {
    const { pageContext } = this.props;
    const { activeTabs } = this.state;
    return this.sections
      .filter(section => this.validNames.includes(section.name))
      .map((section, index) => (
        <GuideSection
          guideSectionData={section}
          key={index}
          admonitions={this.admonitions}
          refDocMapping={pageContext ? pageContext.__refDocMapping : {}}
          setActiveTab={this.setActiveTab}
          addTabset={this.addTabset}
          activeTabs={activeTabs}
        />
      ));
  }

  render() {
    const { pageContext } = this.props;
    const { activeTabs, cloud, drivers } = this.state;

    return (
      <div className="content">
        <TOC />
        <div className="left-nav-space" />
        <div id="main-column" className="main-column">
          <div className="body" data-pagename="server/read">
            <ul className="breadcrumbs">
              <li className="breadcrumbs__bc">
                <a href="/">MongoDB Guides</a> &gt;{' '}
              </li>
            </ul>
            <GuideHeading
              sections={this.sections}
              drivers={drivers}
              cloud={cloud}
              setActiveTab={this.setActiveTab}
              addTabset={this.addTabset}
              admonitions={this.admonitions}
              refDocMapping={pageContext ? pageContext.__refDocMapping : {}}
              activeTabs={activeTabs}
            />
            {this.createSections()}
            <div className="footer">
              <div className="copyright">
                <p>
                  © MongoDB, Inc 2008-present. MongoDB, Mongo, and the leaf logo are registered trademarks of MongoDB,
                  Inc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Guide.propTypes = {
  '*': PropTypes.string.isRequired,
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.objectOf(PropTypes.object).isRequired,
  }).isRequired,
};
