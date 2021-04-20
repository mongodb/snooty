import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TOC from '../components/TOC';
import ComponentFactory from '../components/ComponentFactory';
import GuideBreadcrumbs from '../components/GuideBreadcrumbs';
import GuideSection from '../components/GuideSection';
import GuideHeading from '../components/GuideHeading';
import { SECTION_NAME_MAPPING } from '../constants';
import { findKeyValuePair } from '../utils/find-key-value-pair';
import { throttle } from '../utils/throttle';
import { getNestedValue } from '../utils/get-nested-value';

export default class Guide extends Component {
  constructor(propsFromServer) {
    super(propsFromServer);

    const {
      pageContext: { page },
    } = this.props;

    // get data from server
    this.sections = getNestedValue(['children', 0, 'children'], page);
    this.bodySections = this.sections.filter((section) => Object.keys(SECTION_NAME_MAPPING).includes(section.name));

    this.state = {
      activeSection: getNestedValue([0, 'name'], this.bodySections),
      isScrollable: true,
    };

    this.sectionRefs = this.bodySections.map(() => React.createRef());
  }

  componentDidMount() {
    document.addEventListener('scroll', throttle(this.recalculate, 150));
  }

  recalculate = () => {
    const { isScrollable } = this.state;

    if (isScrollable) {
      if (this.sectionRefs.map((ref) => ref.current).some((ref) => ref === null)) {
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
    } else {
      this.setState({ isScrollable: true });
    }
  };

  // Temporarily disable scrolling listener by changing state of 'isScrollable'
  disableScrollable = (clickedSection) => {
    this.setState({
      isScrollable: false,
      activeSection: clickedSection,
    });
  };

  createSections() {
    const { pageContext } = this.props;
    if (this.bodySections.length === 0) {
      return this.sections.map((section) => {
        return <ComponentFactory nodeData={section} page={pageContext.page} />;
      });
    }

    return this.bodySections.map((section, index) => {
      return (
        <GuideSection
          sectionDepth={2}
          guideSectionData={section}
          key={index}
          headingRef={this.sectionRefs[index]}
          page={pageContext.page}
        />
      );
    });
  }

  render() {
    const { pageContext } = this.props;
    const { activeSection, cloud, drivers } = this.state;

    return (
      <div className="content">
        <TOC
          activeSection={activeSection}
          sectionKeys={this.bodySections.map((section) => section.name)}
          disableScrollable={this.disableScrollable}
        />
        <div className="left-nav-space" />
        <div id="main-column" className="main-column">
          <div className="body" data-pagename={pageContext.slug}>
            <GuideBreadcrumbs />
            <GuideHeading
              author={findKeyValuePair(this.sections, 'name', 'author')}
              cloud={cloud}
              description={findKeyValuePair(this.sections, 'name', 'result_description')}
              drivers={drivers}
              page={pageContext.page}
              time={findKeyValuePair(this.sections, 'name', 'time')}
              title={findKeyValuePair(this.sections, 'type', 'heading')}
            />
            {this.createSections()}
          </div>
        </div>
      </div>
    );
  }
}

Guide.propTypes = {
  pageContext: PropTypes.shape({
    page: PropTypes.shape({
      children: PropTypes.array,
    }).isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  path: PropTypes.string.isRequired,
};
