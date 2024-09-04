import React from 'react';
import PropTypes from 'prop-types';
import { css, cx } from '@leafygreen-ui/emotion';
import Kicker from '../Kicker';
import { theme } from '../../theme/docsTheme';

const overlineStyle = css`
  font-weight: 600;
  line-height: ${theme.size.default};
`;

const StepNumber = ({ slug, activeTutorial }) => {
  const totalSteps = activeTutorial.total_steps;
  const currentStep = activeTutorial.slugs.indexOf(slug) + 1;
  const nodeData = {
    argument: [
      {
        type: 'text',
        value: `step ${currentStep} of ${totalSteps}`,
      },
    ],
  };

  // The next component would also need to be included in this component.
  return <Kicker className={cx(overlineStyle)} nodeData={nodeData} />;
};

StepNumber.propTypes = {
  slug: PropTypes.string.isRequired,
  activeTutorial: PropTypes.shape({
    parent: PropTypes.string,
    total_steps: PropTypes.number,
    slugs: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default StepNumber;
