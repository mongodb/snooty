import React from 'react';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import { getNestedValue } from '../utils/get-nested-value';
import Navbar from '../components/Navbar';
import { Helmet } from 'react-helmet';
import { getPlaintextTitle } from '../utils/get-plaintext-title.js';
import EcosystemHomepageStyles from '../styles/ecosystem-homepage.module.css';
import EcosystemHomepageTiles from '../components/EcosystemHomepageTiles';

const EcosystemIndex = props => {
  const {
    pageContext: {
      slug,
      metadata: { slugToTitle: slugTitleMapping },
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
          <div className={[EcosystemHomepageStyles.document, 'document'].join(' ')}>
            <div className="documentwrapper">
              <div className="bodywrapper">
                <div className="body">
                  <section className={EcosystemHomepageStyles.mainContentPadding}>
                    <h1>Start Developing with MongoDB</h1>
                    <p>Connect your application to your database with one of our official libraries.</p>
                    <p>
                      The following libraries are officially supported by MongoDB. They are actively maintained, support
                      new MongoDB features, and receive bug fixes, performance enhancements, and security patches.
                    </p>
                    <EcosystemHomepageTiles />
                    <p>
                      Don’t see your desired language? Browse a list of{' '}
                      <a href="https://docs.mongodb.com/ecosystem/drivers/community-supported-drivers/">
                        community supported libraries
                      </a>
                      .
                    </p>
                  </section>
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
