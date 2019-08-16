import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { stringifyTab } from '../constants';
import { reportAnalytics } from '../utils/report-analytics';
import { TabContext } from './tab-context';
import pillStyles from '../styles/pills.module.css';

const Pills = ({ activeClass, dataTabPreference, isTruncated, liClass, pills, pillsetName, ulClass }) => {
  const { activeTabs, setActiveTab } = useContext(TabContext);
  return (
    <ul
      className={`guide__pills pillstrip-declaration ${ulClass}`}
      role="tablist"
      data-tab-preference={dataTabPreference}
    >
      {pills.map((pill, index) => (
        <li data-tabid={pill} key={index}>
          <span
            className={[
              'guide__pill',
              activeTabs[pillsetName] === pill ? activeClass : '',
              liClass,
              pillStyles.guide__pill,
            ].join(' ')}
            onClick={() => {
              setActiveTab(pillsetName, pill);
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
  dataTabPreference: PropTypes.string,
  isTruncated: PropTypes.bool,
  liClass: PropTypes.string,
  pills: PropTypes.arrayOf(PropTypes.string).isRequired,
  pillsetName: PropTypes.string,
  ulClass: PropTypes.string,
};

Pills.defaultProps = {
  activeClass: 'guide__pill--active',
  dataTabPreference: undefined,
  isTruncated: false,
  liClass: '',
  pillsetName: '',
  ulClass: '',
};

export default Pills;
