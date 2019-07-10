import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TOC from '../components/TOC';
import ComponentFactory from '../components/ComponentFactory';
import Footer from '../components/Footer';
import GuideBreadcrumbs from '../components/GuideBreadcrumbs';
import GuideSection from '../components/GuideSection';
import GuideHeading from '../components/GuideHeading';
import Widgets from '../components/Widgets/Widgets';
import { LANGUAGES, DEPLOYMENTS, SECTION_NAME_MAPPING } from '../constants';
import { getLocalValue } from '../utils/browser-storage';
import { findKeyValuePair } from '../utils/find-key-value-pair';
import { throttle } from '../utils/throttle';
import { getNestedValue } from '../utils/get-nested-value';
import { TabContext } from '../components/tab-context';

export default class Guide extends Component {
  constructor(propsFromServer) {
    super(propsFromServer);

    const {
      pageContext: { __refDocMapping },
    } = this.props;

    // get data from server
    this.sections = getNestedValue(['ast', 'children', 0, 'children'], __refDocMapping);
    this.bodySections = this.sections.filter(section => Object.keys(SECTION_NAME_MAPPING).includes(section.name));

    this.state = {
      activeSection: getNestedValue([0, 'name'], this.bodySections),
    };

    this.sectionRefs = this.bodySections.map(() => React.createRef());
    this.namedTabsets = new Set();
  }

  componentDidMount() {
    document.addEventListener('scroll', throttle(this.recalculate, 150));
  }

  recalculate = () => {
    if (this.sectionRefs.map(ref => ref.current).some(ref => ref === null)) {
      return;
    }
    const height = document.body.clientHeight - window.innerHeight;
    const headings = this.sectionRefs.map((ref, index) => [ref, this.bodySections[index].name]);

    // This is a bit hacky, but it mostly works. Choose our current
    // position in the page as a decimal in the range [0, 1], adding
    // our window size multiplied by 80% of the unadjusted [0, 1]
    // position.
    // The 80% is necessary because the last sections of a guide tend to
    // be shorter, and we need to make sure that scrolling to the bottom
    // highlights the last section.
    const scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
    let currentPosition = scrollTop / height;
    currentPosition = (scrollTop + currentPosition * 0.8 * window.innerHeight) / height;

    let bestMatch = [Infinity, null];

    headings.forEach(([headingRef, sectionName]) => {
      const headingPosition = headingRef.current.offsetTop / height;
      const delta = Math.abs(headingPosition - currentPosition);
      if (delta <= bestMatch[0]) {
        bestMatch = [delta, sectionName];
      }
    });

    this.setState({ activeSection: bestMatch[1] });
  };

  addGuidesTabset = (tabsetName, tabData) => {
    const { setActiveTab } = this.context;
    let tabs = tabData.map(tab => tab.argument[0].value);
    if (tabsetName === 'cloud') {
      tabs = DEPLOYMENTS.filter(tab => tabs.includes(tab));
      this.setNamedTabData(tabsetName, tabs, DEPLOYMENTS);
    } else if (tabsetName === 'drivers') {
      tabs = LANGUAGES.filter(tab => tabs.includes(tab));
      this.setNamedTabData(tabsetName, tabs, LANGUAGES);
    } else {
      setActiveTab(tabsetName, getLocalValue(tabsetName) || tabs[0]);
    }
  };

  matchArraySorting = (tabs, referenceArray) => referenceArray.filter(t => tabs.includes(t));

  setNamedTabData = (tabsetName, tabs, constants) => {
    const { setActiveTab } = this.context;
    this.setState(
      prevState => ({
        [tabsetName]: this.matchArraySorting(
          Array.from(new Set([...(prevState[tabsetName] || []), ...tabs])),
          constants
        ),
      }),
      () => setActiveTab(tabsetName, getLocalValue(tabsetName) || tabs[0])
    );
  };

  createSections() {
    const { pageContext } = this.props;
    if (this.bodySections.length === 0) {
      return this.sections.map(section => {
        return (
          <ComponentFactory
            nodeData={section}
            refDocMapping={getNestedValue(['__refDocMapping'], pageContext) || {}}
            includes={pageContext.includes}
            pageMetadata={pageContext.pageMetadata}
          />
        );
      });
    }

    return this.bodySections.map((section, index) => {
      return (
        <GuideSection
          guideSectionData={section}
          key={index}
          headingRef={this.sectionRefs[index]}
          refDocMapping={getNestedValue(['__refDocMapping'], pageContext) || {}}
          addTabset={this.addGuidesTabset}
          includes={pageContext.includes}
          pageMetadata={pageContext.pageMetadata}
        />
      );
    });
  }

  render() {
    const { pageContext, path } = this.props;
    const { activeSection, cloud, drivers } = this.state;
    const pageSlug = path.substr(1);

    return (
      <div className="content">
        <TOC activeSection={activeSection} sectionKeys={this.bodySections.map(section => section.name)} />
        <div className="left-nav-space" />
        <div id="main-column" className="main-column">
          <div className="body" data-pagename={pageSlug}>
            <GuideBreadcrumbs />
            <GuideHeading
              author={findKeyValuePair(this.sections, 'name', 'author')}
              cloud={cloud}
              description={findKeyValuePair(this.sections, 'name', 'result_description')}
              drivers={drivers}
              includes={pageContext.includes}
              pageMetadata={pageContext.pageMetadata}
              refDocMapping={getNestedValue(['__refDocMapping'], pageContext) || {}}
              time={findKeyValuePair(this.sections, 'name', 'time')}
              title={findKeyValuePair(this.sections, 'type', 'heading')}
            />
            {this.createSections()}
            <Footer />
          </div>
        </div>
        <Widgets guideName={pageSlug} snootyStitchId={pageContext.snootyStitchId} />
      </div>
    );
  }
}

Guide.propTypes = {
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.shape({
      ast: PropTypes.shape({
        children: PropTypes.array,
      }).isRequired,
    }).isRequired,
    snootyStitchId: PropTypes.string.isRequired,
    includes: PropTypes.objectOf(PropTypes.object).isRequired,
    pageMetadata: PropTypes.objectOf(PropTypes.object).isRequired,
  }).isRequired,
  path: PropTypes.string.isRequired,
};

Guide.contextType = TabContext;
