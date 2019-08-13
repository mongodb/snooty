import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import ComponentFactory from './ComponentFactory';
import Pills from './Pills';
import { TabContext } from './tab-context';
import { stringifyTab } from '../constants';
import { getNestedValue } from '../utils/get-nested-value';

// TODO: Improve validation of template content
const GuideHeading = ({ author, cloud, description, drivers, time, title, ...rest }) => {
  const { activeTabs } = useContext(TabContext);
  const displayTitle = getNestedValue(['children', 0, 'value'], title);
  const titleId = getNestedValue(['id'], title);
  const authorName = getNestedValue(['argument', 0, 'value'], author);
  const descriptionChildren = getNestedValue(['children'], description);
  const timeLength = getNestedValue(['argument', 0, 'value'], time);
  return (
    <div className="section">
      <Helmet>
        <title>{displayTitle}</title>
      </Helmet>
      <h1 id={titleId}>
        {displayTitle}
        <a className="headerlink" href={`#${titleId}`} title="Permalink to this headline">
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
            liClass="guide__deploymentpill"
            activeClass="guide__deploymentpill--active"
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
          <Pills pills={drivers} pillsetName="drivers" dataTabPreference="languages" />
        </div>
      )}

      <hr />

      {authorName && <p>Author: {authorName}</p>}
      {descriptionChildren && (
        <section>
          {descriptionChildren.map((element, index) => (
            <ComponentFactory {...rest} nodeData={element} key={index} />
          ))}
        </section>
      )}
      {timeLength && (
        <p>
          <em>Time required: {timeLength} minutes</em>
        </p>
      )}
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
  cloud: PropTypes.arrayOf(PropTypes.string),
  description: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  drivers: PropTypes.arrayOf(PropTypes.string),
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
