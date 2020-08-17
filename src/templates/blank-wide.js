import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import DocumentBody from '../components/DocumentBody';
import { theme } from '../theme/docsTheme';

const Content = styled('div')`
  margin: 0 ${theme.size.default};
`;

const Wrapper = styled('div')`
  margin: 40px auto;
  max-width: ${theme.size.maxWidth};
  width: 100%;
`;

const BlankWide = ({ pageContext: { metadata, slug, __refDocMapping }, ...rest }) => (
  <React.Fragment>
    <div className="content">
      <Wrapper id="main-column">
        <Content>
          <DocumentBody refDocMapping={__refDocMapping} slug={slug} metadata={metadata} {...rest} />
          <Footer />
        </Content>
      </Wrapper>
    </div>
    <Navbar />
  </React.Fragment>
);

BlankWide.propTypes = {
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.object.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default BlankWide;
