import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import MainColumn from '../components/MainColumn';

const Wrapper = styled(MainColumn)`
  max-width: unset;
  margin-right: 160px;
`;

const Instruqt = ({ children, offlineBanner }) => (
  <Wrapper>
    {offlineBanner}
    {children}
  </Wrapper>
);

Instruqt.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export default Instruqt;
