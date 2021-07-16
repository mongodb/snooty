import React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Card from '@leafygreen-ui/card';
import { uiColors } from '@leafygreen-ui/palette';
import ComponentFactory from './ComponentFactory';

const StyledCard = styled(Card)`
  box-shadow: none;
  margin: auto auto 16px auto;
  padding: 15px;
  ${(props) => console.log(props)}
  ${(props) =>
    props.hasSelectedResponse
      ? props.selectedThisChoice && !props.isCorrect
        ? `border-color: ${uiColors.black};`
        : ``
      : ``}

  ${(props) =>
    props.hasSelectedResponse
      ? props.isCorrect
        ? `border-color: ${uiColors.green.base}; border-width: 2px;`
        : `opacity: 0.5;`
      : `color: blue;`}

  &:hover {
    ${(props) => (!props.hasSelectedResponse ? `border-color: black;` : ``)}
  }
`;

const Dot = styled('span')`
  height: 10px;
  width: 10px;
  background-color: ${(props) => (props.selectedThisChoice ? `black` : `white`)};
  border-color: black;
  border-radius: 50%;
  display: inline-block;
  border-style: solid;
  border-width: thin;
  margin-right: 16px;
`;

const DescriptionBody = styled('p')`
  margin-top: 8px !important;
  margin-bottom: 0px !important;

  padding-left: 26px;
`;

const AnswerDescription = ({ description }) => {
  return (
    <DescriptionBody>
      {description.map((node, i) => (
        <ComponentFactory nodeData={node} key={i} />
      ))}
    </DescriptionBody>
  );
};

const QuizChoice = ({ nodeData: { argument, children, options }, selectedChoice }) => {
  const [hasSelectedResponse, setSelectedResponse] = useState(true);
  const description = children[0].children;
  const rightAnswer = options?.['is-true'] ? true : false;
  const selectedThisChoice = false;
  return (
    <StyledCard
      hasSelectedResponse={hasSelectedResponse}
      isCorrect={rightAnswer}
      selectedThisChoice={selectedThisChoice}
    >
      <Dot selectedThisChoice={selectedThisChoice} />
      {argument.map((node, i) => (
        <ComponentFactory nodeData={node} key={i} />
      ))}
      {hasSelectedResponse && <AnswerDescription description={description} />}
    </StyledCard>
  );
};

QuizChoice.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default QuizChoice;
