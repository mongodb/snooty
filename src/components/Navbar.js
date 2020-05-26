import React, { Component } from 'react';
import { withPrefix } from 'gatsby';
import { isBrowser } from '../utils/is-browser';
import { URL_SLUGS, URL_SUBDOMAINS } from '../constants';

const DOCS_SITE = 'docs.mongodb.com';
const STAGING_SITE = 'docs-mongodbcom-staging.corp.mongodb.com';
const LOCALHOST_NAMES = ['localhost', '0.0.0.0', '127.0.0.1'];

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

    // Update activeLink state on render
    if (isBrowser) {
      this.setState({ activeLink: this.checkForLink(window.location) });
    }
  }

  // Uses location to check which link should be active
  checkForLink = location => {
    if (location.hostname === DOCS_SITE || location.hostname === STAGING_SITE) {
      return this.validateActiveLink(location.pathname, '/', URL_SLUGS);
    }
    if (this.isLocalhost(location.hostname)) {
      const link = this.checkUrlItems(process.env.GATSBY_SITE, URL_SLUGS);
      return link !== null ? link : this.checkUrlItems(process.env.GATSBY_SITE, URL_SUBDOMAINS);
    }
    return this.validateActiveLink(location.hostname, '.', URL_SUBDOMAINS);
  };

  // Takes the appropriate part of the URL and identifies which link it matches
  validateActiveLink = (name, token, urlItems) => {
    const slugs = name.split(token);
    return this.checkUrlItems(slugs[1], urlItems);
  };

  checkUrlItems = (slug, urlItems) => {
    const urlMapping = Object.entries(urlItems).find(([, value]) => value.includes(slug));
    return urlMapping ? urlMapping[0] : null;
  };

  isLocalhost = hostname => {
    const found = LOCALHOST_NAMES.find(localhostName => {
      return localhostName.includes(hostname);
    });
    return found !== undefined;
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
                    )}}]}`;
  };

  render() {
    this.navprops = this.modifyActiveLink();
    return <div id="navbar" className="navbar" data-navprops={this.navprops} />;
  }
}
