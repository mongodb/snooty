import React from 'react';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import { getNestedValue } from '../utils/get-nested-value';
import Navbar from '../components/Navbar';
import Breadcrumbs from '../components/Breadcrumbs';
import InternalPageNav from '../components/InternalPageNav';
import { Helmet } from 'react-helmet';
import { getPlaintextTitle } from '../utils/get-plaintext-title.js';
import EcosystemHomepageStyles from '../styles/ecosystemHomepage.module.css';
import EcosystemHomepageTiles from '../components/EcosystemHomepageTiles';

const EcosystemIndex = props => {
  const {
    pageContext: {
      slug,
      metadata: { parentPaths, slugToTitle: slugTitleMapping, toctreeOrder },
    },
  } = props;

  const title = getPlaintextTitle(getNestedValue([slug], slugTitleMapping));

  return (
    <React.Fragment>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Navbar />
      <div className="content">
        <div className={[EcosystemHomepageStyles.fullWidth, 'main-column'].join(' ')} id="main-column">
          <div className="document">
            <div className="documentwrapper">
              <div className="bodywrapper">
                <div className="body">
                  <Breadcrumbs parentPaths={getNestedValue([slug], parentPaths)} slugTitleMapping={slugTitleMapping} />
                  <section>
                    <h1>Start Developing with MongoDB</h1>
                    <p>Connect your application to your database with one of our official libraries.</p>
                    <p>
                      The following libraries are officially supported by MongoDB. They are actively maintained, support
                      new MongoDB features, and receive bug fixes, performance enhancements, and security patches.
                    </p>
                    <EcosystemHomepageTiles />
                    <p>more stuff here</p>
                  </section>
                  <InternalPageNav slug={slug} slugTitleMapping={slugTitleMapping} toctreeOrder={toctreeOrder} />
                  <Footer />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

EcosystemIndex.propTypes = {
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.shape({
      ast: PropTypes.shape({
        children: PropTypes.array,
      }).isRequired,
    }).isRequired,
    parentPaths: PropTypes.arrayOf(PropTypes.string),
    slug: PropTypes.string.isRequired,
    slugTitleMapping: PropTypes.shape({
      [PropTypes.string]: PropTypes.string,
    }),
    toctree: PropTypes.object,
    toctreeOrder: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default EcosystemIndex;
