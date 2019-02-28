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
              <span className="show-current-deployment"> {activeDeployment[1]}</span>
            </div>
            <ul className="guide__pills pillstrip-declaration" role="tablist" data-tab-preference="cloud">
              {deployments.map((langOpts, index) => (
                <li
                  className={
                    activeDeployment[0] === langOpts[0]
                      ? 'guide__pill guide__deploymentpill guide__deploymentpill--active'
                      : 'guide__pill guide__deploymentpill'
                  }
                  data-tabid={langOpts[0]}
                  key={index}
                >
                  <span
                    onClick={() => {
                      setActiveTab(langOpts, 'activeDeployment');
                    }}
                    role="button"
                    tabIndex={index}
                  >
                    {langOpts[1]}
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
              <span className="show-current-language"> {activeLanguage[1]}</span>
            </div>
            <ul className="guide__pills pillstrip-declaration" role="tablist" data-tab-preference="languages">
              {languages.map((langOpts, index) => (
                <li
                  className={activeLanguage[0] === langOpts[0] ? 'guide__pill guide__pill--active' : 'guide__pill'}
                  data-tabid={langOpts[0]}
                  key={index}
                >
                  <span
                    onClick={() => {
                      setActiveTab(langOpts, 'activeLanguage');
                    }}
                    role="button"
                    tabIndex={index}
                  >
                    {langOpts[1]}
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
  activeLanguage: PropTypes.arrayOf(PropTypes.string),
  activeDeployment: PropTypes.arrayOf(PropTypes.string),
  setActiveTab: PropTypes.func.isRequired,
  languages: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  deployments: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
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
  activeLanguage: undefined,
  languages: [],
  activeDeployment: undefined,
  deployments: [],
};
