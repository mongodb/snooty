import React, { Component} from 'react';

export default class GuideHeading extends Component {

  getSection(params) {
    return this.props.sections.filter(s => s[params[0]] === params[1])[0];
  }

  render() {
    return (
      <div className="section" id="SOMETHING_HERE">

        <h1> 
          { this.getSection(['type', 'heading']).children[0].value } 
          <a className="headerlink" href="#read-data-from-mongodb" title="Permalink to this headline">¶</a>
        </h1>

        <div className="guide-prefs__deploy" style={ { display: 'none'} }>
          <div className="guide-prefs__caption">Deployment Type: <span className="show-current-deployment">local</span></div>
          <ul className="guide__pills pillstrip-declaration" role="tablist" data-tab-preference="cloud">
            <li className="guide__pill guide__deploymentpill" data-tabid="cloud">cloud</li>
            <li className="guide__pill guide__deploymentpill guide__deploymentpill--active" data-tabid="local">local</li>
          </ul>
        </div>

        {
          (this.props.languages && this.props.languages.length > 0) ?
            <div className="guide-prefs">
              <div className="guide-prefs__caption">Client: <span className="show-current-language">{ this.props.activeLanguage[1] }</span></div>
              <ul className="guide__pills pillstrip-declaration" role="tablist" data-tab-preference="languages">
                {
                  this.props.languages.map((langOpts, index) => {
                    return <li className={ (this.props.activeLanguage[0] === langOpts[0]) ? 'guide__pill guide__pill--active' : 'guide__pill' } 
                               data-tabid={ langOpts[0] } 
                               key={ index }
                               onClick={ () => { this.props.changeActiveLanguage(langOpts) } }>{ langOpts[1] }</li>
                  })
                }
              </ul>
            </div> : ''
        }

        <hr />

        <p>Author: { this.getSection(['name', 'author']).argument[0].value }</p>
        <p>{ this.getSection(['name', 'result_description']).children[0].children[0].value }</p>
        <ul className="simple">
          <li>{ this.getSection(['name', 'result_description']).children[1].children[0].children[0].children[0].value }</li>
          <li>{ this.getSection(['name', 'result_description']).children[1].children[1].children[0].children[0].value }</li>
        </ul>
        <p><em>Time required: { this.getSection(['name', 'time']).argument[0].value } minutes</em></p>

      </div>
    );
  }

}

