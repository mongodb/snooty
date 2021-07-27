import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css, cx } from '@leafygreen-ui/emotion';
import Card from '@leafygreen-ui/card';
import { uiColors } from '@leafygreen-ui/palette';
import Icon from '@leafygreen-ui/icon';
import ComponentFactory from '../../ComponentFactory';
import { theme } from '../../../theme/docsTheme';
import { getPlaintext } from '../../../utils/get-plaintext';

const submittedChoiceStyle = css`
  pointer-events: none;
  transition: unset !important;
`;

const Dot = styled('span')`
  height: 10px;
  width: 10px;
  background-color: ${(props) => (props.isSelected && !props.isSubmitted ? `${uiColors.gray.dark3}` : `white`)};
  border-color: black;
  border-radius: 50%;
  display: inline-block;
  border-style: solid;
  border-width: thin;
  margin-right: ${theme.size.default};
`;

const StyledIcon = styled(Icon)`
  margin-right: 12px;
`;

const DescriptionBody = styled('div')`
  p {
    padding-left: 26px;
    margin-top: ${theme.size.small} !important;
    margin-bottom: 0 !important;
  }
`;

const getCardStyling = ({ isSelected, isSubmitted, submittedChoiceStyle, isCorrect }) => css`
  box-shadow: none;
  margin: auto auto ${theme.size.default} auto;
  padding: 15px;
  ${isSelected && `border-color: ${uiColors.black}`};
  ${isSubmitted ? submittedChoiceStyle : `&:hover { border-color: black; }`}
  ${isSubmitted && (isCorrect ? `border: 2px solid ${uiColors.green.base};` : `opacity: 0.5;`)}}
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

const correctChoice = <StyledIcon glyph="Checkmark" fill={uiColors.green.base} size="small" />;
const incorrectChoice = <StyledIcon glyph="X" fill={uiColors.gray.base} size="small" />;
const UnsubmittedChoice = ({ isSelected, isSubmitted }) => <Dot isSelected={isSelected} isSubmitted={isSubmitted} />;

const ChoiceIconFactory = ({ isSubmitted, isSelected, isCorrect }) => {
  if (isSubmitted) return isCorrect ? correctChoice : incorrectChoice;
  else return <UnsubmittedChoice isSelected={isSelected} isSubmitted={isSubmitted} />;
};

const createSelectedResponseObj = (idx, isCorrect, argument) => {
  return {
    index: idx,
    isCorrect: isCorrect,
    choiceText: getPlaintext(argument),
  };
};

const QuizChoice = ({
  nodeData: { argument, children, options },
  selectedResponseIdx,
  setSelectedResponse,
  idx,
  isSubmitted,
}) => {
  const isCorrect = !!options?.['is-true'];
  const isSelected = selectedResponseIdx === idx;
  return (
    <Card
      className={cx(getCardStyling({ isSelected, isSubmitted, submittedChoiceStyle, isCorrect }))}
      onClick={() =>
        !isSelected ? setSelectedResponse(createSelectedResponseObj(idx, isCorrect, argument)) : setSelectedResponse()
      }
    >
      <ChoiceIconFactory isSubmitted={isSubmitted} isSelected={isSelected} isCorrect={isCorrect} />
      {argument.map((node, i) => (
        <ComponentFactory nodeData={node} key={i} />
      ))}
      {isSubmitted && children && <AnswerDescription description={children} />}
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
  isSubmitted: PropTypes.bool,
};

export default QuizChoice;
