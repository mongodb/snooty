import React from 'react';
import PropTypes from 'prop-types';
import { stringifyTab } from '../constants';
import { reportAnalytics } from '../util';

const Pills = ({ activeClass, activePill, dataTabPreference, handleClick, isTruncated, liClass, pills, ulClass }) => {
  return (
    <ul className={`guide__pills ${ulClass}`} role="tablist" data-tab-preference={dataTabPreference}>
      {pills.map((pill, index) => (
        <li
          className={['guide__pill', activePill === pill ? activeClass : '', liClass].join(' ')}
          data-tabid={pill}
          key={index}
        >
          <span
            onClick={() => {
              handleClick(pill);
              reportAnalytics('Tab Selected', {
                tabSet: pills,
                tabSelected: pill,
              });
            }}
            role="button"
            tabIndex={index}
          >
            {stringifyTab(pill)}
          </span>
        </li>
      ))}
      {isTruncated && <li className="guide__pill guide__pill--seeall">See All</li>}
    </ul>
  );
};

Pills.propTypes = {
  activeClass: PropTypes.string,
  activePill: PropTypes.string,
  dataTabPreference: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  isTruncated: PropTypes.bool,
  liClass: PropTypes.string,
  pills: PropTypes.arrayOf(PropTypes.string).isRequired,
  ulClass: PropTypes.string,
};

Pills.defaultProps = {
  activeClass: 'guide__pill--active',
  activePill: undefined,
  dataTabPreference: undefined,
  isTruncated: false,
  liClass: '',
  ulClass: '',
};

export default Pills;
