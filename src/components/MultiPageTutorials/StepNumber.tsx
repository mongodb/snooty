import React from 'react';
import { css } from '@leafygreen-ui/emotion';
import { theme } from '../../theme/docsTheme';
import Overline from '../Internal/Overline';
import { MultiPageTutorial } from '../../types/data';
import { MPTNextLinkFull } from './MPTNextLinkFull';

const overlineStyle = css`
  font-weight: 600;
  line-height: ${theme.size.default};
  padding-top: 0 !important;
`;

interface StepNumberProps {
  slug: string;
  activeTutorial: MultiPageTutorial;
}

export const StepNumber = ({ slug, activeTutorial }: StepNumberProps) => {
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
