import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import MainColumn from '../components/MainColumn';

const Wrapper = styled(MainColumn)`
  max-width: unset;
  margin-right: 64px;
`;

const Changelog = ({ children }) => <Wrapper>{children}</Wrapper>;

Changelog.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};

export default Changelog;
