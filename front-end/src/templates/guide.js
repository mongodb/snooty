import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TOC from '../components/TOC';
import GuideSection from '../components/GuideSection';
import GuideHeading from '../components/GuideHeading';
import Modal from '../components/Modal';
import { Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk';

export default class Guide extends Component {

  constructor(propsFromServer) {
    super(propsFromServer);
    // get data from server
    this.sections = this.props.pageContext.__refDocMapping[this.props['*']].ast.children[0].children;
    this.languageList = this.props.pageContext.__languageList;
    this.stitchId = this.props.pageContext.__stitchID;
    this.stitchClient = undefined;
    this.DOMParser = undefined;
    this.validNames = [
      'prerequisites',
      'check_your_environment',
      'procedure',
      'summary',
      'whats_next'
    ];
    this.admonitions = [
      'admonition',
      'note',
      'tip',
      'important',
      'warning'
    ];
    this.state = {
      languages: [],
      activeLanguage: undefined,
      modalPositionLeft: 0,
      modalPositionTop: 0,
      modalVisible: false,
      modalContent: {
        text: null,
        example: null
      }
    }; 
    console.log(2222, this.props.pageContext.__refDocMapping);
    console.log(4544, this.sections);
  }

  componentDidMount() {
    this.DOMParser = new DOMParser();
    this.setupStitch();
  }

  setupStitch() {
    const appName = this.stitchId;
    if (!appName) return;
    this.stitchClient = Stitch.hasAppClient(appName) ? Stitch.defaultAppClient : Stitch.initializeDefaultAppClient(appName);
    this.stitchClient.auth.loginWithCredential(new AnonymousCredential()).then((user) => {
      console.log('logged into stitch');
    });
  }

  // this function gets an array of objects with language pill options
  // and sets the state to this list in the correct order 
  addLanguages(languages) {
    const languagesInGuide = languages.map(langObj => langObj.argument[0].value);
    const setLanguages = this.languageList.filter(langOpts => languagesInGuide.includes(langOpts[0]));
    this.setState({
      'languages': setLanguages,
      'activeLanguage': setLanguages[0]
    });
  }

  changeActiveLanguage(language) {
    this.setState({
      'activeLanguage': language
    });
  }

  modalShow(event) {
    let newX = event.target.offsetLeft + Math.floor(event.target.offsetWidth / 2);
    let newY;
    if (event.screenY < 400) {
      newY = event.target.offsetTop + event.target.offsetHeight;
    } else {
      newY = event.target.offsetTop - 300; // height of modal
    }
    this.setState({
      modalVisible: true,
      modalPositionLeft: newX,
      modalPositionTop: newY
    });
  }

  modalHide() {
    this.setState({
      modalVisible: false
    });
  }

  // TODO: use css instead?? 
  // https://codepen.io/anon/pen/YJEaZo
  modalBeginHidingInterval() {
    let event;
    let modalContainer = document.getElementsByClassName('__ref-modal')[0];
    let saveEvent = (e) => { event = e || window.event; };
    // watch mouse movements globally
    document.addEventListener('mousemove', saveEvent);
    // if not hovered over modal (or any element within the modal) remove it and end event listener
    let interval = setInterval(() => {
      if (event.target.nodeName !== 'A' && !modalContainer.contains(event.target)) {
        document.removeEventListener('mousemove', saveEvent);
        clearInterval(interval);
        this.modalHide();
      }
    }, 1000);
  }

  // when a user hovers over a specific role
  // first fetch the data and then show the modal with the content
  modalFetchData(event, href) {
    event.persist();
    console.log('going to get url', href);
    const findHashPart = href.substr(href.indexOf('#') + 1);
    let contentObj;
    this.stitchClient.callFunction('fetchReferenceUrlContent', [href]).then((response) => {
      if (!response) {
        contentObj = {
          text: 'Error fetching data...'
        };
      } else {
        const parsed = this.DOMParser.parseFromString(response, 'text/html');
        const mainContainer = parsed.getElementById(findHashPart) ? parsed.getElementById(findHashPart).nextElementSibling : null;
        contentObj = {
          text: mainContainer.getElementsByTagName('p')[0] ? mainContainer.getElementsByTagName('p')[0].textContent.trim() : 'FIX: no content found',
          example: 'no code example'
        };
        // if syntax example is within first container
        if (mainContainer.getElementsByClassName('button-code-block')[0]) {
          contentObj.example = mainContainer.getElementsByClassName('copyable-code-block')[0].textContent.trim();
        }
      }
      this.setState({
        modalContent: contentObj
      });
    });
    this.modalShow(event);
    this.modalBeginHidingInterval();
  }

  createSections() {
    return (
      this.sections
      .filter((section) => this.validNames.includes(section.name))
      .map((section, index) => {
        return (
          <GuideSection guideSectionData={ section } 
                        key={ index } 
                        admonitions={ this.admonitions }
                        refDocMapping={ (this.props && this.props.pageContext) ? this.props.pageContext.__refDocMapping : {} } 
                        modal={ this.modalFetchData.bind(this) } 
                        addLanguages={ this.addLanguages.bind(this) } 
                        activeLanguage={ this.state.activeLanguage }
                        stitchClient={ this.stitchClient } />
        )
      })
    )
  }

  render() {
    return (
      <div className="content">
        <TOC />
        <div className="left-nav-space"></div>
        <div id="main-column" className="main-column">
          <div className="body" data-pagename="server/read">
            <ul className="breadcrumbs">
              <li className="breadcrumbs__bc"><a href="/">MongoDB Guides</a> &gt; </li>
            </ul>
            <GuideHeading sections={ this.sections } 
                          languages={ this.state.languages } 
                          activeLanguage={ this.state.activeLanguage } 
                          changeActiveLanguage={ this.changeActiveLanguage.bind(this) }
                          admonitions={ this.admonitions }
                          refDocMapping={ (this.props && this.props.pageContext) ? this.props.pageContext.__refDocMapping : {} } 
                          modal={ this.modalFetchData.bind(this) } 
                          addLanguages={ this.addLanguages.bind(this) } 
                          activeLanguage={ this.state.activeLanguage }
                          stitchClient={ this.stitchClient } />
            <Modal modalProperties={ this.state } />
            { this.createSections() }
            <div className="footer">
              <div className="copyright">
                <p>© MongoDB, Inc 2008-present. MongoDB, Mongo, and the leaf logo are registered trademarks of MongoDB, Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

};
