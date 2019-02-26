import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Stitch, AnonymousCredential } from 'mongodb-stitch-browser-sdk';
import TOC from '../components/TOC';
import GuideSection from '../components/GuideSection';
import GuideHeading from '../components/GuideHeading';
import Modal from '../components/Modal';

export default class Guide extends Component {
  constructor(propsFromServer) {
    super(propsFromServer);

    const { pageContext } = this.props;

    // get data from server
    this.sections =
      pageContext.__refDocMapping[
        this.props['*'] // eslint-disable-line react/destructuring-assignment
      ].ast.children[0].children;
    this.languageList = pageContext.__languageList;
    this.OSTabList = pageContext.__OSTabList;
    this.stitchId = pageContext.__stitchID;
    this.stitchClient = undefined;
    this.DOMParser = undefined;
    this.validNames = ['prerequisites', 'check_your_environment', 'procedure', 'summary', 'whats_next'];
    this.admonitions = ['admonition', 'note', 'tip', 'important', 'warning'];
    this.state = {
      languages: [],
      activeLanguage: undefined,
      OSTabs: [],
      activeOSTab: undefined,
      modalPositionLeft: 0,
      modalPositionTop: 0,
      modalVisible: false,
      modalContent: {
        text: null,
        example: null,
      },
    };
  }

  componentDidMount() {
    this.DOMParser = new DOMParser();
    this.setupStitch();
  }

  setupStitch() {
    const appName = this.stitchId;
    if (!appName) return;
    this.stitchClient = Stitch.hasAppClient(appName)
      ? Stitch.defaultAppClient
      : Stitch.initializeDefaultAppClient(appName);
    this.stitchClient.auth.loginWithCredential(new AnonymousCredential()).then(user => {
      console.log(`logged in as user ${user.id}`);
    });
  }

  createTabsetType = (opts, setTabs) => {
    this.setState({
      [opts.type]: setTabs,
      [opts.active]: setTabs[0],
    });
  };

  // this function gets an array of objects that compose some tabset
  // currently only supports: language pills, OS tabs
  // TODO: cloud/local
  addTabset = languages => {
    // language tabset
    const tabsInGuide = languages.map(langObj => langObj.argument[0].value);
    let setTabs = this.languageList.filter(langOpts => tabsInGuide.includes(langOpts[0]));
    // OS tabset
    if (!setTabs || setTabs.length === 0) {
      setTabs = this.OSTabList.filter(langOpts => tabsInGuide.includes(langOpts[0]));
      this.createTabsetType({ type: 'OSTabs', active: 'activeOSTab' }, setTabs);
    } else {
      this.createTabsetType({ type: 'languages', active: 'activeLanguage' }, setTabs);
    }
    return setTabs;
  };

  changeActiveLanguage = language => {
    this.setState({
      activeLanguage: language,
    });
  };

  changeActiveOSTab = language => {
    this.setState({
      activeOSTab: language,
    });
  };

  // when a user hovers over a specific role
  // first fetch the data and then show the modal with the content
  modalFetchData = (event, href) => {
    event.persist();
    const findHashPart = href.substr(href.indexOf('#') + 1);
    let contentObj;
    this.stitchClient.callFunction('fetchReferenceUrlContent', [href]).then(response => {
      if (!response) {
        contentObj = {
          text: 'Error fetching data...',
        };
      } else {
        const parsed = this.DOMParser.parseFromString(response, 'text/html');
        const mainContainer = parsed.getElementById(findHashPart)
          ? parsed.getElementById(findHashPart).nextElementSibling
          : null;
        contentObj = {
          text: mainContainer.getElementsByTagName('p')[0]
            ? mainContainer.getElementsByTagName('p')[0].textContent.trim()
            : 'FIX: no content found',
          example: 'no code example',
        };
        // if syntax example is within first container
        if (mainContainer.getElementsByClassName('button-code-block')[0]) {
          contentObj.example = mainContainer.getElementsByClassName('copyable-code-block')[0].textContent.trim();
        }
      }
      this.setState({
        modalContent: contentObj,
      });
    });
    this.modalShow(event);
    const refElement = event.target;
    this.modalBeginHidingInterval(refElement);
  };

  modalShow(event) {
    const newX = event.target.offsetLeft + Math.floor(event.target.offsetWidth / 2);
    let newY;
    if (event.screenY < 400) {
      newY = event.target.offsetTop + event.target.offsetHeight;
    } else {
      newY = event.target.offsetTop - 300; // height of modal
    }
    this.setState({
      modalVisible: true,
      modalPositionLeft: newX,
      modalPositionTop: newY,
    });
  }

  modalHide() {
    this.setState({
      modalVisible: false,
    });
  }

  // TODO: use css instead??
  // https://codepen.io/anon/pen/YJEaZo
  modalBeginHidingInterval(refElement) {
    let event;
    const modalContainer = document.getElementsByClassName('__ref-modal')[0];
    const saveEvent = e => {
      event = e || window.event;
    };
    // watch mouse movements globally
    document.addEventListener('mousemove', saveEvent);
    // if not hovered over modal (or any element within the modal) remove it and end event listener
    const interval = setInterval(() => {
      if (
        event.target.nodeName !== 'A' &&
        !modalContainer.contains(event.target) &&
        !refElement.contains(event.target)
      ) {
        document.removeEventListener('mousemove', saveEvent);
        clearInterval(interval);
        this.modalHide();
      }
    }, 1000);
  }

  createSections() {
    const { pageContext } = this.props;
    const { activeLanguage, activeOSTab, OSTabs } = this.state;
    return this.sections
      .filter(section => this.validNames.includes(section.name))
      .map((section, index) => (
        <GuideSection
          guideSectionData={section}
          key={index}
          admonitions={this.admonitions}
          refDocMapping={pageContext ? pageContext.__refDocMapping : {}}
          modal={this.modalFetchData}
          changeActiveLanguage={this.changeActiveLanguage}
          addTabset={this.addTabset}
          activeLanguage={activeLanguage}
          OSTabs={OSTabs}
          activeOSTab={activeOSTab}
          changeActiveOSTab={this.changeActiveOSTab}
          stitchClient={this.stitchClient}
        />
      ));
  }

  render() {
    const { pageContext } = this.props;
    const { activeLanguage, languages, modalContent, modalPositionLeft, modalPositionTop, modalVisible } = this.state;

    return (
      <div className="content">
        <TOC />
        <div className="left-nav-space" />
        <div id="main-column" className="main-column">
          <div className="body" data-pagename="server/read">
            <ul className="breadcrumbs">
              <li className="breadcrumbs__bc">
                <a href="/">MongoDB Guides</a> &gt;{' '}
              </li>
            </ul>
            <GuideHeading
              sections={this.sections}
              languages={languages}
              activeLanguage={activeLanguage}
              changeActiveLanguage={this.changeActiveLanguage}
              addTabset={this.addTabset}
              admonitions={this.admonitions}
              refDocMapping={pageContext ? pageContext.__refDocMapping : {}}
              modal={this.modalFetchData}
              stitchClient={this.stitchClient}
            />
            <Modal
              modalProperties={{
                modalContent,
                modalPositionLeft,
                modalPositionTop,
                modalVisible,
              }}
            />
            {this.createSections()}
            <div className="footer">
              <div className="copyright">
                <p>
                  © MongoDB, Inc 2008-present. MongoDB, Mongo, and the leaf logo are registered trademarks of MongoDB,
                  Inc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Guide.propTypes = {
  '*': PropTypes.string.isRequired,
  pageContext: PropTypes.shape({
    __languageList: PropTypes.arrayOf(PropTypes.array).isRequired,
    __OSTabList: PropTypes.arrayOf(PropTypes.array).isRequired,
    __refDocMapping: PropTypes.objectOf(PropTypes.object).isRequired,
    __stitchID: PropTypes.string.isRequired,
  }).isRequired,
};
