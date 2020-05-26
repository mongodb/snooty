import React from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import DocumentBody from '../components/DocumentBody';
import Footer from '../components/Footer';
import LandingComponentFactory from '../components/landing/ComponentFactory';
import Navbar from '../components/Navbar';
import '../styles/docs-landing.css';

const Wrapper = styled('main')`
  margin: ${({ theme }) => `${theme.navbar.height}`} auto 0 auto;
  padding: 0 ${({ theme }) => `${theme.size.xxlarge} ${theme.size.xxlarge} ${theme.size.xxlarge}`};
  @media ${({ theme }) => theme.screenSize.upToLarge} {
    padding: 0 ${({ theme }) => `${theme.size.large} ${theme.size.xxlarge} ${theme.size.large}`};
  }
  @media ${({ theme }) => theme.screenSize.upToMedium} {
    padding: 0 ${({ theme }) => `${theme.size.medium} ${theme.size.xxlarge} ${theme.size.medium}`};
  }

  & > section,
  & > section > section {
    display: grid;
    grid-template-columns: repeat(12, [col-span] 1fr);
    grid-column: 1/-1;
  }

  & section > * {
    grid-column-start: 1;
    grid-column-end: 8;
  }
`;

const DocsLanding = ({ pageContext: { slug, __refDocMapping }, ...rest }) => {
  return (
    <React.Fragment>
      <Navbar />
      <Wrapper>
        <DocumentBody DomainFactory={LandingComponentFactory} refDocMapping={__refDocMapping} slug={slug} {...rest} />
      </Wrapper>
      <Footer />
    </React.Fragment>
  );
};

DocsLanding.propTypes = {
  pageContext: PropTypes.shape({
    __refDocMapping: PropTypes.object.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default DocsLanding;
