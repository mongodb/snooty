import React from 'react';
import PropTypes from 'prop-types';
import { SECTION_NAME_MAPPING } from '../constants';

const TOC = ({ activeSection, sectionKeys, disableScrollable }) => (
  <aside className="left-toc hide-first-toc-level">
    <div className="left-toc__title">Overview:</div>
    <ul>
      <li>
        <ul>
          {sectionKeys.map((section, index) => (
            <li className={section === activeSection ? 'active' : ''} key={index}>
              <a
                className="reference internal"
                href={`#${SECTION_NAME_MAPPING[section].id}`}
                onClick={() => {
                  disableScrollable(section);
                }}
              >
                {SECTION_NAME_MAPPING[section].title}
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
  disableScrollable: PropTypes.func,
};

TOC.defaultProps = {
  activeSection: undefined,
  disableScrollable: () => {},
};

export default TOC;
