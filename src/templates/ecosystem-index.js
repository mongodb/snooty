import React from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import EcosystemHomepageStyles from '../styles/ecosystem-homepage.module.css';
import EcosystemHomepageTiles from '../components/EcosystemHomepageTiles';

const EcosystemIndex = props => (
  <React.Fragment>
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

export default EcosystemIndex;
