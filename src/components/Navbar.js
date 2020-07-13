import React, { Component } from 'react';
import { withPrefix } from 'gatsby';
import { isBrowser } from '../utils/is-browser';
import { URL_SLUGS } from '../constants';
import Searchbar from './Searchbar';

export default class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLink: '',
    };

    // Static navprops by default
    this.navprops = `{"links": [
                            {"url": "https://docs.mongodb.com/manual/","text": "Server"},
                            {"url": "https://docs.mongodb.com/drivers/","text": "Drivers"},
                            {"url": "https://docs.mongodb.com/cloud/","text": "Cloud"},
                            {"url": "https://docs.mongodb.com/tools/","text": "Tools"},
                            {"url": "https://docs.mongodb.com/guides/","text": "Guides"}]}`;
  }

  componentDidMount() {
    // Add script to give navbar functionality and css
    const script = document.createElement('script');
    script.src = withPrefix('docs-tools/navbar.min.js');
    script.async = true;

    document.body.appendChild(script);

    this.setState({ activeLink: this.getActiveSection(process.env.GATSBY_SITE, URL_SLUGS) });
  }

  getActiveSection = (slug, urlItems) => {
    const urlMapping = Object.entries(urlItems).find(([, value]) => value.includes(slug));
    if (urlMapping) {
      return urlMapping[0];
    }

    if (isBrowser) {
      switch (window.location.pathname) {
        case 'tools':
          return 'tools';
        case 'cloud':
          return 'cloud';
        default:
          return null;
      }
    }

    return null;
  };

  isActiveLink = link => {
    const { activeLink } = this.state;
    return link.toLowerCase() === activeLink;
  };

  // Modify navprops
  modifyActiveLink = () => {
    return `{"links": [
                    {"url": "https://docs.mongodb.com/manual/","text": "Server", "active": ${this.isActiveLink(
                      'Server'
                    )}},
                    {"url": "https://docs.mongodb.com/drivers/","text": "Drivers", "active": ${this.isActiveLink(
                      'Drivers'
                    )}},
                    {"url": "https://docs.mongodb.com/cloud/","text": "Cloud", "active": ${this.isActiveLink('Cloud')}},
                    {"url": "https://docs.mongodb.com/tools/","text": "Tools", "active": ${this.isActiveLink('Tools')}},
                    {"url": "https://docs.mongodb.com/guides/","text": "Guides", "active": ${this.isActiveLink(
                      'Guides'
                    )}}
    ]}`;
  };

  render() {
    this.navprops = this.modifyActiveLink();
    return (
      <>
        <div id="navbar" className="navbar" data-navprops={this.navprops} tabIndex="0" />
        <Searchbar />
      </>
    );
  }
}
