import React, { Component} from 'react';
import Paragraph from '../components/Paragraph';
import CodeBlock from '../components/CodeBlock';
import LiteralInclude from '../components/LiteralInclude';
import Tabs from '../components/Tabs';
import Admonition from '../components/Admonition';

export default class Step extends Component {

  stepRendering(sectionData, index) {
    if (sectionData.type === 'paragraph') {
      return <Paragraph paragraphData={ sectionData } key={ index } modal={ this.props.modal } />
    } 
    else if (sectionData.type === 'directive' && this.props.admonitions.includes(sectionData.name)) {
      return <Admonition admonitionData={ sectionData } key={ index } modal={ this.props.modal } />
    }
    else if (sectionData.type === 'directive' && sectionData.name === 'literalinclude') {
      return <LiteralInclude literalIncludeData={ sectionData } refDocMapping={ this.props.refDocMapping } key={ index } />
    }
    else if (sectionData.type === 'directive' && sectionData.name === 'tabs') {
      return <Tabs tabsData={ sectionData } refDocMapping={ this.props.refDocMapping } key={ index } addLanguages={ this.props.addLanguages } activeLanguage={ this.props.activeLanguage } />
    }
    else if (sectionData.type === 'code') {
      return <CodeBlock codeData={ sectionData } key={ index } />
    }
    else if (sectionData.type === 'heading') {
      return (
        <h3 key={ index }>{ sectionData.children[0].value }
          <a className="headerlink" href="#BLA-BLA" title="Permalink to this headline">¶</a>
        </h3>
      )
    }
    else if (sectionData.type === 'section') {
      return sectionData.children.map((sectionChildData, innerIndex) => {
        return this.stepRendering(sectionChildData, innerIndex);
      });
    } 
  }

  render() {
    return (
      <div className="sequence-block" style={
        { display: (this.props.showAllSteps || this.props.showStepIndex === this.props.stepNum) ? 'block' : 'none' }
      }>
        <div className="bullet-block" style={ {display: (this.props.showAllSteps) ? 'block' : 'none'} }>
          <div className="sequence-step">{ this.props.stepNum + 1 }</div>
        </div>
        <div className="section" id="SOMETHING-HERE">
          {
            this.props.stepData.children.map((sectionData, index) => {
              return this.stepRendering(sectionData, index);
            })
          }
        </div>
      </div>
    )
  }

}