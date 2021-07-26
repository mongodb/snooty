import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css, cx } from '@leafygreen-ui/emotion';
import Card from '@leafygreen-ui/card';
import { uiColors } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import ComponentFactory from './ComponentFactory';

const submittedChoiceStyle = css`
  pointer-events: none;
  transition: unset !important;
`;

const Dot = styled('span')`
  height: 10px;
  width: 10px;
  background-color: ${(props) =>
    props.selectedThisChoice && !props.hasSubmitted ? `${uiColors.gray.dark3}` : `white`};
  border-color: black;
  border-radius: 50%;
  display: inline-block;
  border-style: solid;
  border-width: thin;
  margin-right: 16px;
`;

const SyledIcon = styled(Icon)`
  margin-right: 12px;
`;

const DescriptionBody = styled('p')`
  margin-top: 8px !important;
  margin-bottom: 0px !important;
  padding-left: 26px;
`;

const getCardStyling = ({ selectedThisChoice, hasSubmitted, submittedChoiceStyle, isCurrentChoiceCorrect }) => css`
  box-shadow: none;
  margin: auto auto 16px auto;
  padding: 15px;
  ${selectedThisChoice && `border-color: ${uiColors.black}`};
  ${hasSubmitted ? submittedChoiceStyle : `&:hover { border-color: black; }`}
  ${hasSubmitted && (isCurrentChoiceCorrect ? `border: 2px solid ${uiColors.green.base};` : `opacity: 0.5;`)}}
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

const CorrectChoice = () => <SyledIcon glyph="Checkmark" fill={uiColors.green.base} size="small" />;
const IncorrectChoice = () => <SyledIcon glyph="X" fill={uiColors.gray.base} size="small" />;
const UnsubmittedChoice = ({ selectedThisChoice, hasSubmitted }) => (
  <Dot selectedThisChoice={selectedThisChoice} hasSubmitted={hasSubmitted} />
);

const ChoiceIconFactory = ({ hasSubmitted, selectedThisChoice, isCurrentChoiceCorrect }) => {
  if (hasSubmitted) return isCurrentChoiceCorrect ? <CorrectChoice /> : <IncorrectChoice />;
  else return <UnsubmittedChoice selectedThisChoice={selectedThisChoice} hasSubmitted={hasSubmitted} />;
};

const QuizChoice = ({
  nodeData: { argument, children, options },
  selectedResponseIdx,
  setSelectedResponse,
  idx,
  hasSubmitted,
}) => {
  const description = children[0].children;
  const isCurrentChoiceCorrect = !!options?.['is-true'];
  const selectedThisChoice = selectedResponseIdx === idx;
  return (
    <Card
      className={cx(getCardStyling({ selectedThisChoice, hasSubmitted, submittedChoiceStyle, isCurrentChoiceCorrect }))}
      onClick={() =>
        !selectedThisChoice
          ? setSelectedResponse({ index: idx, isCurrentChoiceCorrect: isCurrentChoiceCorrect })
          : setSelectedResponse()
      }
    >
      <ChoiceIconFactory
        hasSubmitted={hasSubmitted}
        selectedThisChoice={selectedThisChoice}
        isCurrentChoiceCorrect={isCurrentChoiceCorrect}
      />
      {argument.map((node, i) => (
        <ComponentFactory nodeData={node} key={i} />
      ))}
      {hasSubmitted && <AnswerDescription description={description} />}
    </Card>
  );
};

QuizChoice.propTypes = {
  nodeData: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  selectedResponseIdx: PropTypes.number,
  setSelectedResponse: PropTypes.func,
  idx: PropTypes.number,
  hasSubmitted: PropTypes.bool,
};

export default QuizChoice;
