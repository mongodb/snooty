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
    const { setActiveTab, languages, deployments, activeTabs } = this.props;
    return (
      <div className="section" id="SOMETHING_HERE">
        <h1>
          {this.getSection(['type', 'heading']).children[0].value}
          <a className="headerlink" href="#read-data-from-mongodb" title="Permalink to this headline">
            ¶
          </a>
        </h1>

        {deployments && deployments.length > 0 && (
          <div className="guide-prefs">
            <div className="guide-prefs__caption">
              Deployment Type:
              <span className="show-current-deployment"> {stringifyTab(activeTabs.deployments)}</span>
            </div>
            <ul className="guide__pills pillstrip-declaration" role="tablist" data-tab-preference="deployments">
              {deployments.map((deployment, index) => (
                <li
                  className={
                    activeTabs.deployments === deployment
                      ? 'guide__pill guide__deploymentpill guide__deploymentpill--active'
                      : 'guide__pill guide__deploymentpill'
                  }
                  data-tabid={deployment}
                  key={index}
                >
                  <span
                    onClick={() => {
                      setActiveTab(deployment, 'deployments');
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

        {languages && languages.length > 0 && (
          <div className="guide-prefs">
            <div className="guide-prefs__caption">
              Client:
              <span className="show-current-language"> {stringifyTab(activeTabs.languages)}</span>
            </div>
            <ul className="guide__pills pillstrip-declaration" role="tablist" data-tab-preference="languages">
              {languages.map((language, index) => (
                <li
                  className={activeTabs.languages === language ? 'guide__pill guide__pill--active' : 'guide__pill'}
                  data-tabid={language}
                  key={index}
                >
                  <span
                    onClick={() => {
                      setActiveTab(language, 'languages');
                    }}
                    role="button"
                    tabIndex={index}
                  >
                    {stringifyTab(language)}
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
    deployments: PropTypes.string,
    languages: PropTypes.string,
  }).isRequired,
  setActiveTab: PropTypes.func.isRequired,
  languages: PropTypes.arrayOf(PropTypes.string),
  deployments: PropTypes.arrayOf(PropTypes.string),
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
  languages: [],
  deployments: [],
};
