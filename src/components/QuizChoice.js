import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Card from '@leafygreen-ui/card';
import { InlineCode } from '@leafygreen-ui/typography';
import { uiColors } from '@leafygreen-ui/palette';
import { Radio, RadioGroup } from '@leafygreen-ui/radio-group';
import ComponentFactory from './ComponentFactory';

const StyledCard = styled(Card)`
  box-shadow: none;
  height: 56px;
  margin: auto;
  padding: 10px;
`;

const CardBody = styled()`
  font-family: Akzidenz;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
`;

const Dot = styled('span')`
  height: 25px;
  width: 25px;
  background-color: #fff;
  border-color: black;
  border-radius: 50%;
  display: inline-block;
`;

const QuizChoice = ({ nodeData }) => {
  return (
    <StyledCard>
      <Dot />
    </StyledCard>
  );
};

QuizChoice.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default QuizChoice;
