import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import Pills from './Pills';
import { stringifyTab } from '../constants';

const GuideHeading = ({ activeTabs, cloud, drivers, sections, setActiveTab, ...rest }) => {
  const getSection = params => {
    return sections.filter(s => s[params[0]] === params[1])[0];
  };

  const setActivePill = pillsetName => pill => {
    setActiveTab(pill, pillsetName);
  };

  return (
    <div className="section" id="SOMETHING_HERE">
      <h1>
        {getSection(['type', 'heading']).children[0].value}
        <a className="headerlink" href="#read-data-from-mongodb" title="Permalink to this headline">
          ¶
        </a>
      </h1>

      {cloud && cloud.length > 0 && (
        <div className="guide-prefs">
          <div className="guide-prefs__caption">
            Deployment Type:
            <span className="show-current-deployment"> {stringifyTab(activeTabs.cloud)}</span>
          </div>
          <Pills
            pills={cloud}
            ulClass="pillstrip-declaration"
            liClass="guide__deploymentpill"
            activePill={activeTabs.cloud}
            activeClass="guide__deploymentpill--active"
            handleClick={setActivePill('cloud')}
            dataTabPreference="deployments"
          />
        </div>
      )}

      {drivers && drivers.length > 0 && (
        <div className="guide-prefs">
          <div className="guide-prefs__caption">
            Client:
            <span className="show-current-language"> {stringifyTab(activeTabs.drivers)}</span>
          </div>
          <Pills
            pills={drivers}
            ulClass="pillstrip-declaration"
            activePill={activeTabs.drivers}
            handleClick={setActivePill('drivers')}
            dataTabPreference="languages"
          />
        </div>
      )}

      <hr />

      <p>Author: {getSection(['name', 'author']).argument[0].value}</p>
      <section>
        {getSection(['name', 'result_description']).children.map((element, index) => (
          <ComponentFactory {...rest} nodeData={element} key={index} />
        ))}
      </section>
      <p>
        <em>Time required: {getSection(['name', 'time']).argument[0].value} minutes</em>
      </p>
    </div>
  );
};

GuideHeading.propTypes = {
  activeTabs: PropTypes.shape({
    cloud: PropTypes.string,
    drivers: PropTypes.string,
  }).isRequired,
  setActiveTab: PropTypes.func.isRequired,
  cloud: PropTypes.arrayOf(PropTypes.string),
  drivers: PropTypes.arrayOf(PropTypes.string),
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      children: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string,
        })
      ),
    })
  ).isRequired,
};

GuideHeading.defaultProps = {
  cloud: [],
  drivers: [],
};

export default GuideHeading;
