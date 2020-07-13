import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { withPrefix } from 'gatsby';
import { isBrowser } from '../utils/is-browser';
import { URL_SLUGS } from '../constants';
import Searchbar from './Searchbar';

const getActiveSection = (slug, urlItems) => {
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

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('');
  const [navprops, setNavprops] = useState(`{"links": [
    {"url": "https://docs.mongodb.com/manual/","text": "Server"},
    {"url": "https://docs.mongodb.com/drivers/","text": "Drivers"},
    {"url": "https://docs.mongodb.com/cloud/","text": "Cloud"},
    {"url": "https://docs.mongodb.com/tools/","text": "Tools"},
    {"url": "https://docs.mongodb.com/guides/","text": "Guides"}]}`);

  useEffect(() => {
    // Add script to give navbar functionality and css
    const script = document.createElement('script');
    script.src = withPrefix('docs-tools/navbar.min.js');
    script.async = true;

    document.body.appendChild(script);

    setActiveLink(getActiveSection(process.env.GATSBY_SITE, URL_SLUGS));
  }, []);

  const isActiveLink = useCallback(link => link.toLowerCase() === activeLink, [activeLink]);

  // modify navprops
  const modifyActiveLink = useMemo(
    () =>
      `{"links": [
        {"url": "https://docs.mongodb.com/manual/","text": "Server", "active": ${isActiveLink('Server')}},
        {"url": "https://docs.mongodb.com/drivers/","text": "Drivers", "active": ${isActiveLink('Drivers')}},
        {"url": "https://docs.mongodb.com/cloud/","text": "Cloud", "active": ${isActiveLink('Cloud')}},
        {"url": "https://docs.mongodb.com/tools/","text": "Tools", "active": ${isActiveLink('Tools')}},
        {"url": "https://docs.mongodb.com/guides/","text": "Guides", "active": ${isActiveLink('Guides')}}
    ]}`,
    [isActiveLink]
  );

  useEffect(() => {
    setNavprops(modifyActiveLink);
  }, [activeLink, modifyActiveLink]);

  return (
    <>
      <div tabIndex="0" id="navbar" className="navbar" data-navprops={navprops} style={{ position: 'absolute' }} />
      <Searchbar />
    </>
  );
};

export default Navbar;
