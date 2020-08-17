import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import DocumentBody from '../components/DocumentBody';
import { theme } from '../theme/docsTheme';

const Wrapper = styled('div')`
  max-width: ${theme.size.maxWidth};
  margin: 40px auto;
  width: 100%;
`;

const BlankWide = ({ pageContext: { metadata, slug, __refDocMapping }, ...rest }) => (
  <React.Fragment>
    <div className="content">
      <Wrapper id="main-column">
        <DocumentBody refDocMapping={__refDocMapping} slug={slug} metadata={metadata} {...rest} />
        <Footer />
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
