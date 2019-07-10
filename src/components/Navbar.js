import React, { Component } from 'react';
import { withPrefix } from 'gatsby';
import { isBrowser } from '../utils/is-browser';
import { URL_SLUGS, URL_BASES } from '../constants';

export default class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeLink: '',
    };

    // Static navprops by default
    this.navprops = `{"links": [
                            {"url": "https://docs.mongodb.com/manual/","text": "Server"},
                            {"url": "https://docs.mongodb.com/ecosystem/drivers/","text": "Drivers"},
                            {"url": "https://docs.mongodb.com/cloud/","text": "Cloud"},
                            {"url": "https://docs.mongodb.com/tools/","text": "Tools"},
                            {"url": "https://docs.mongodb.com/guides/","text": "Guides"}]}`;
  }

  componentDidMount() {
    // Add script to give navbar functionality and css
    if (document !== undefined) {
      const script = document.createElement('script');
      script.src = withPrefix('docs-tools/navbar.min.js');
      script.async = true;

      document.body.appendChild(script);
    }

    // Update activeLink state on render
    if (isBrowser()) {
      this.setState({ activeLink: this.checkForLink(window.location) });
    }
  }

  // Uses location to check which link should be active
  checkForLink = location => {
    if (location.hostname === 'docs.mongodb.com' || location.hostname === 'docs-mongodbcom-staging.corp.mongodb.com') {
      return this.validateActiveLink(location.pathname, '/', URL_SLUGS);
    }
    if (location.hostname.includes('localhost')) {
      const link = this.validateForLocalhost(URL_SLUGS);
      return link !== '' ? link : this.validateForLocalhost(URL_BASES);
    }
    return this.validateActiveLink(location.hostname, '.', URL_BASES);
  };

  // Takes the appropriate part of the URL and identifies which link it matches
  validateActiveLink = (name, token, urlItems) => {
    const slugs = name.split(token);
    let slug;
    if (slugs[1] === undefined || slugs[1] === '') {
      slug = process.env.GATSBY_SITE;
    } else {
      slug = slugs[1];
    }

    const keys = Object.keys(urlItems);
    const keyIndex = this.checkKeys(slug, keys, urlItems);
    if (keyIndex !== -1) {
      return keys[keyIndex];
    }

    // Slug doesn't match any of the links
    return slug;
  };

  // Localhost at most requires validation from both URL_SLUGS and URL_BASES using the GATSBY_SITE variable
  validateForLocalhost = urlItems => {
    const keys = Object.keys(urlItems);
    const keyIndex = this.checkKeys(process.env.GATSBY_SITE, keys, urlItems);
    if (keyIndex !== -1) {
      return keys[keyIndex];
    }
    return '';
  };

  // Matches the slug with keys of URL_BASES or URL_SLUGS to return the index it is found
  checkKeys = (slug, keys, urlItems) => {
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (urlItems[key].indexOf(slug) >= 0) {
        return i;
      }
    }
    return -1;
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
                    {"url": "https://docs.mongodb.com/ecosystem/drivers/","text": "Drivers", "active": ${this.isActiveLink(
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

    return (
      <div>
        <div id="navbar" data-navprops={this.navprops} />
      </div>
    );
  }
}
