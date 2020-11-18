import React, { useEffect, useState } from 'react';

const defaultContextValue = {
  headingNodes: [],
  activeSectionIndex: 0,
};

const findSectionHeadings = nodes => {
  const maxDepth = 2;
  const key = 'type';
  const value = 'heading';
  const results = [];

  const searchNode = (node, sectionDepth) => {
    if (node[key] === value && sectionDepth - 1 <= maxDepth && sectionDepth > 1) {
      const nodeTitle = node.children;
      const newNode = {
        depth: sectionDepth,
        id: node.id,
        title: nodeTitle,
      };

      results.push(newNode);
    }
    // Don't include step headings in our TOC regardless of depth
    if (node.children && node.name !== 'step') {
      if (node.type === 'section') {
        sectionDepth += 1; // eslint-disable-line no-param-reassign
      }
      return node.children.forEach(child => searchNode(child, sectionDepth));
    }
    return null;
  };

  nodes.forEach(node => searchNode(node, 0));
  return results;
};

const findHeadingsOnPage = (headingNodes, height) => {
  let locations = [];

  headingNodes.forEach(heading => {
    const el = document.getElementById(heading.id);
    locations.push(el.offsetTop / height);
  });

  return locations;
};

const ContentsContext = React.createContext(defaultContextValue);

const ContentsProvider = ({ children, nodes = [] }) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const headingNodes = findSectionHeadings(nodes);

  useEffect(() => {
    const height = document.body.clientHeight - window.innerHeight;
    const headingLocations = findHeadingsOnPage(headingNodes, height);

    const handleScroll = () => {
      // Calculate current position of the page similar to guides.js
      const scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
      let currentPosition = scrollTop / height;
      currentPosition = (scrollTop + currentPosition * 0.8 * window.innerHeight) / height;

      // Go through each heading location to see if the user has scrolled to or past a particular section
      // Have to try out the guides version of this to check for accuracy
      let currentSectionIndex = 0;
      let i = 1;
      while (currentPosition >= headingLocations[i] && i < headingLocations.length) {
        currentSectionIndex = i++;
      }

      setActiveSectionIndex(currentSectionIndex);
    };

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
      setActiveSectionIndex(0);
    };
  }, [headingNodes, nodes]);

  return <ContentsContext.Provider value={{ headingNodes, activeSectionIndex }}>{children}</ContentsContext.Provider>;
};

export { ContentsContext, ContentsProvider };
