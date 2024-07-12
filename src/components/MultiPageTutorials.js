import React from 'react';
import PropTypes from 'prop-types';

const multiPageTutorials = ({ slug, activeTutorial }) => {
  const totalN = activeTutorial.total_steps;
  const currentN = activeTutorial.slugs.indexOf(slug) + 1;
  return (
    <div>
      step {currentN} of {totalN}
    </div>
  );
};

multiPageTutorials.propTypes = {
  slug: PropTypes.string.isRequired,
  activeTutorial: PropTypes.shape({
    parent: PropTypes.string,
    total_steps: PropTypes.number,
    slugs: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default multiPageTutorials;
