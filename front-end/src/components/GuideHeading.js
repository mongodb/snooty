import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

export default class GuideHeading extends Component {
  getSection(params) {
    const { sections } = this.props;
    return sections.filter(s => s[params[0]] === params[1])[0];
  }

  render() {
    const { setActiveTab, activeLanguage, languages, activeDeployment, deployments } = this.props;
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
              <span className="show-current-deployment"> {activeDeployment}</span>
            </div>
            <ul className="guide__pills pillstrip-declaration" role="tablist" data-tab-preference="cloud">
              {deployments.map((deployment, index) => (
                <li
                  className={
                    activeDeployment === deployment.name
                      ? 'guide__pill guide__deploymentpill guide__deploymentpill--active'
                      : 'guide__pill guide__deploymentpill'
                  }
                  data-tabid={deployment.name}
                  key={index}
                >
                  <span
                    onClick={() => {
                      setActiveTab(deployment, 'activeDeployment');
                    }}
                    role="button"
                    tabIndex={index}
                  >
                    {deployment.value}
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
              <span className="show-current-language"> {activeLanguage}</span>
            </div>
            <ul className="guide__pills pillstrip-declaration" role="tablist" data-tab-preference="languages">
              {languages.map((language, index) => (
                <li
                  className={activeLanguage === language.name ? 'guide__pill guide__pill--active' : 'guide__pill'}
                  data-tabid={language.name}
                  key={index}
                >
                  <span
                    onClick={() => {
                      setActiveTab(language, 'activeLanguage');
                    }}
                    role="button"
                    tabIndex={index}
                  >
                    {language.value}
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
  activeDeployment: PropTypes.string.isRequired,
  activeLanguage: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  deployments: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
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
