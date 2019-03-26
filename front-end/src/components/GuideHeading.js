import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';
import { stringifyTab } from '../constants';

export default class GuideHeading extends Component {
  getSection(params) {
    const { sections } = this.props;
    return sections.filter(s => s[params[0]] === params[1])[0];
  }

  render() {
    const { setActiveTab, cloud, drivers, activeTabs } = this.props;
    return (
      <div className="section" id="SOMETHING_HERE">
        <h1>
          {this.getSection(['type', 'heading']).children[0].value}
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
            <ul className="guide__pills pillstrip-declaration" role="tablist" data-tab-preference="deployments">
              {cloud.map((deployment, index) => (
                <li
                  className={
                    activeTabs.cloud === deployment
                      ? 'guide__pill guide__deploymentpill guide__deploymentpill--active'
                      : 'guide__pill guide__deploymentpill'
                  }
                  data-tabid={deployment}
                  key={index}
                >
                  <span
                    onClick={() => {
                      setActiveTab(deployment, 'cloud');
                    }}
                    role="button"
                    tabIndex={index}
                  >
                    {stringifyTab(deployment)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {drivers && drivers.length > 0 && (
          <div className="guide-prefs">
            <div className="guide-prefs__caption">
              Client:
              <span className="show-current-language"> {stringifyTab(activeTabs.drivers)}</span>
            </div>
            <ul className="guide__pills pillstrip-declaration" role="tablist" data-tab-preference="languages">
              {drivers.map((driver, index) => (
                <li
                  className={activeTabs.drivers === driver ? 'guide__pill guide__pill--active' : 'guide__pill'}
                  data-tabid={driver}
                  key={index}
                >
                  <span
                    onClick={() => {
                      setActiveTab(driver, 'drivers');
                    }}
                    role="button"
                    tabIndex={index}
                  >
                    {stringifyTab(driver)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <hr />

        <p>Author: {this.getSection(['name', 'author']).argument[0].value}</p>
        <section>
          {this.getSection(['name', 'result_description']).children.map((element, index) => (
            <ComponentFactory {...this.props} nodeData={element} key={index} />
          ))}
        </section>
        <p>
          <em>Time required: {this.getSection(['name', 'time']).argument[0].value} minutes</em>
        </p>
      </div>
    );
  }
}

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
