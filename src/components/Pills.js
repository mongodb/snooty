import React from 'react';
import PropTypes from 'prop-types';
import { stringifyTab } from '../constants';
import { reportAnalytics } from '../utils/report-analytics';
import pillStyles from '../styles/pills.module.css';

const Pills = ({
  activeClass,
  activePill,
  dataTabPreference,
  handleClick,
  isTruncated,
  liClass,
  pills,
  pillsetName,
  ulClass,
}) => {
  return (
    <ul className={`guide__pills ${ulClass}`} role="tablist" data-tab-preference={dataTabPreference}>
      {pills.map((pill, index) => (
        <li data-tabid={pill} key={index}>
          <span
            className={['guide__pill', activePill === pill ? activeClass : '', liClass, pillStyles.guide__pill].join(
              ' '
            )}
            onClick={() => {
              handleClick(pill);
              reportAnalytics('Pill Selected', {
                tabId: pill,
                title: stringifyTab(pill),
                pillSet: pillsetName,
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
  pillsetName: PropTypes.string,
  ulClass: PropTypes.string,
};

Pills.defaultProps = {
  activeClass: 'guide__pill--active',
  activePill: undefined,
  dataTabPreference: undefined,
  isTruncated: false,
  liClass: '',
  pillsetName: '',
  ulClass: '',
};

export default Pills;
