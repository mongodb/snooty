import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@leafygreen-ui/emotion';
import { theme } from '../../theme/docsTheme';
import Overline from '../Internal/Overline';
import { MPTNextLinkFull } from './MPTNextLinkFull';

const overlineStyle = css`
  font-weight: 600;
  line-height: ${theme.size.default};
  padding-top: 0 !important;
`;

export const StepNumber = ({ slug, activeTutorial }) => {
  const totalSteps = activeTutorial.total_steps;
  const currentStep = activeTutorial.slugs.indexOf(slug) + 1;

  return (
    <>
      <Overline className={overlineStyle}>
        Step {currentStep} of {totalSteps}
      </Overline>
      <MPTNextLinkFull />
    </>
  );
};

StepNumber.propTypes = {
  slug: PropTypes.string.isRequired,
  activeTutorial: PropTypes.shape({
    parent: PropTypes.string,
    total_steps: PropTypes.number,
    slugs: PropTypes.arrayOf(PropTypes.string),
  }),
};
