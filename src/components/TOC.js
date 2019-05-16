import React from 'react';
import PropTypes from 'prop-types';
import { SECTION_NAME_MAPPING } from '../constants';
import { slugifyTitle } from '../util';

const TOC = ({ activeSection, sectionKeys }) => (
  <aside className="left-toc hide-first-toc-level">
    <div className="left-toc__title">Overview:</div>
    <ul>
      <li>
        <ul>
          {sectionKeys.map((section, index) => (
            <li className={section === activeSection ? 'active' : ''} key={index}>
              <a className="reference internal" href={`#${slugifyTitle(SECTION_NAME_MAPPING[section])}`}>
                {SECTION_NAME_MAPPING[section]}
              </a>
            </li>
          ))}
        </ul>
      </li>
    </ul>
  </aside>
);

TOC.propTypes = {
  activeSection: PropTypes.string,
  sectionKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
};

TOC.defaultProps = {
  activeSection: undefined,
};

export default TOC;
