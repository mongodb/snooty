import React from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import Pills from './Pills';
import { stringifyTab } from '../constants';

// TODO: Improve validation of template content
const GuideHeading = ({ activeTabs, author, cloud, description, drivers, setActiveTab, time, title, ...rest }) => {
  const setActivePill = pillsetName => pill => {
    setActiveTab(pill, pillsetName);
  };

  const displayTitle = title.children[0].value;
  return (
    <div className="section">
      <h1 id={title.id}>
        {displayTitle}
        <a className="headerlink" href={`#${title.id}`} title="Permalink to this headline">
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
            pillsetName="cloud"
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
            pillsetName="drivers"
            dataTabPreference="languages"
          />
        </div>
      )}

      <hr />

      <p>Author: {author.argument[0].value}</p>
      <section>
        {description.children.map((element, index) => (
          <ComponentFactory {...rest} nodeData={element} key={index} />
        ))}
      </section>
      <p>
        <em>Time required: {time.argument[0].value} minutes</em>
      </p>
    </div>
  );
};

GuideHeading.propTypes = {
  author: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  activeTabs: PropTypes.shape({
    cloud: PropTypes.string,
    drivers: PropTypes.string,
  }).isRequired,
  cloud: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  drivers: PropTypes.arrayOf(PropTypes.string),
  setActiveTab: PropTypes.func.isRequired,
  time: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
  title: PropTypes.shape({
    children: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ).isRequired,
  }).isRequired,
};

GuideHeading.defaultProps = {
  cloud: [],
  drivers: [],
};

export default GuideHeading;
