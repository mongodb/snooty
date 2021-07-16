import React from 'react';
import { useEffect, useState } from 'react';
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
  margin: auto auto 16px auto;
  padding: 15px;
  &:hover {
    border-color: black;
  }
`;

const Dot = styled('span')`
  height: 10px;
  width: 10px;
  background-color: #fff;
  border-color: black;
  border-radius: 50%;
  display: inline-block;
  border-style: solid;
  border-width: thin;
  margin-right: 16px;
`;

const QuizChoice = ({ nodeData: { argument, children }, selectedResponse, parentCallback }) => {
  const [isSelected, setSelected] = useState();
  const sendData = () => {
    parentCallback('myinfo');
  };

  console.log(isSelected);
  return (
    <StyledCard onClick={(e) => sendData()}>
      <Dot />
      {argument.map((node, i) => (
        <ComponentFactory nodeData={node} key={i} />
      ))}
    </StyledCard>
  );
};

QuizChoice.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default QuizChoice;
