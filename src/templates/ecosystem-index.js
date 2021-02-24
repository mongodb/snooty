import React from 'react';
import { css } from '@emotion/core';
import MainColumn from '../components/MainColumn';
import EcosystemHomepageStyles from '../styles/ecosystem-homepage.module.css';
import EcosystemHomepageTiles from '../components/EcosystemHomepageTiles';

const EcosystemIndex = () => (
  <div className="content">
    <MainColumn className={EcosystemHomepageStyles.fullWidth}>
      <div
        className={[EcosystemHomepageStyles.document, 'body'].join(' ')}
        css={css`
          margin-left: 25px;
        `}
      >
        <section className={EcosystemHomepageStyles.mainContentPadding}>
          <h1>Start Developing with MongoDB</h1>
          <p>Connect your application to your database with one of our official libraries.</p>
          <p>
            The following libraries are officially supported by MongoDB. They are actively maintained, support new
            MongoDB features, and receive bug fixes, performance enhancements, and security patches.
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
      </div>
    </MainColumn>
  </div>
);

export default EcosystemIndex;
