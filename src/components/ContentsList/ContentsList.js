import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Label } from '../Select';

const List = styled('ul')`
  list-style-type: none;
  padding: 0;
`;

const ContentsList = ({ children, label }) => {
  return (
    <>
      <Label>{label}</Label>
      <List>{children}</List>
    </>
  );
};

ContentsList.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
};

export default ContentsList;
