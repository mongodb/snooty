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

const Dot = styled('span')`
  height: 10px;
  width: 10px;
  background-color: ${(props) => (props.isSelected ? `${uiColors.gray.dark3}` : `white`)};
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

const submittedStyle = ({ isCorrect }) => css`
  transition: unset !important;
  ${isCorrect ? `border: 2px solid ${uiColors.green.base}!important;` : `opacity: 0.5;`}
`;

const getCardStyling = ({ isSelected, isSubmitted, isCorrect }) => css`
  box-shadow: none !important;
  margin: auto auto ${theme.size.default} auto;
  padding: ${theme.size.default};
  ${isSelected && `border-color: ${uiColors.black}!important;`};
  ${isSubmitted ? submittedStyle({ isCorrect }) : `:hover{ border-color: ${uiColors.black}!important; }`}
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

const correctIcon = <StyledIcon glyph="Checkmark" fill={uiColors.green.base} size="small" />;
const incorrectIcon = <StyledIcon glyph="X" fill={uiColors.gray.base} size="small" />;
const UnsubmittedIcon = ({ isSelected }) => <Dot isSelected={isSelected} />;

const ChoiceIconFactory = ({ isSubmitted, isSelected, isCorrect }) => {
  if (isSubmitted) return isCorrect ? correctIcon : incorrectIcon;
  else return <UnsubmittedIcon isSelected={isSelected} />;
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
  selectedResponse,
  setSelectedResponse,
  idx,
  isSubmitted,
}) => {
  const isCorrect = !!options?.['is-true'];
  const isSelected = selectedResponse?.index === idx;
  console.log(isSelected);
  return (
    <Card
      className={cx(getCardStyling({ isSelected, isSubmitted, isCorrect }))}
      onClick={() =>
        !isSubmitted &&
        (isSelected ? setSelectedResponse() : setSelectedResponse(createSelectedResponseObj(idx, isCorrect, argument)))
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
