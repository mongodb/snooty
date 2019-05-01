import React from 'react';
import PropTypes from 'prop-types';
import Pills from '../Pills';
import { stringifyTab } from '../../constants';
import { setLocalValue } from '../../localStorage';

const CardPills = ({ pillsNode, pillsetName }) => {
  const getPillTitle = node => node.children[0].children[0].value;

  // Get the name of each pill. If the total character length of pills > 50, truncate them and add a "See All" pill.
  const mapPills = node => {
    let totalLength = 0;
    let isTruncated = false;
    const pills = [];
    node.children[0].children.forEach(pillObj => {
      const pill = getPillTitle(pillObj);
      if (totalLength > 50) {
        isTruncated = true;
      } else {
        pills.push(pill);
      }
      // Include estimated padding length in the total pillset length
      const paddingLength = 4;
      totalLength += stringifyTab(pill).length + paddingLength;
    });
    return [pills, isTruncated];
  };

  const [pills, isTruncated] = mapPills(pillsNode);

  const setActiveLanguage = pill => {
    setLocalValue(pillsetName, pill);
  };

  return <Pills pills={pills} handleClick={setActiveLanguage} isTruncated={isTruncated} />;
};

CardPills.propTypes = {
  pillsetName: PropTypes.string.isRequired,
  pillsNode: PropTypes.shape({
    name: PropTypes.oneOf(['languages']).isRequired,
    children: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(['list']).isRequired,
        children: PropTypes.arrayOf(
          PropTypes.shape({
            type: PropTypes.oneOf(['listItem']).isRequired,
            children: PropTypes.arrayOf(
              PropTypes.shape({
                type: PropTypes.oneOf(['paragraph']).isRequired,
                children: PropTypes.arrayOf(
                  PropTypes.shape({
                    type: PropTypes.oneOf(['text']).isRequired,
                    value: PropTypes.string.isRequired,
                  })
                ).isRequired,
              })
            ).isRequired,
          })
        ).isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default CardPills;
