import React, { useEffect, useState } from 'react';
import { throttle } from '../utils/throttle';

const defaultContextValue = {
  headingNodes: [],
  activeSectionIndex: 0,
};

const findSectionHeadings = nodes => {
  const maxDepth = 2;
  const key = 'type';
  const results = [];
  let hasContentsDirective = false;

  const searchNode = (node, sectionDepth) => {
    // Search for contents directive before looking for heading nodes
    if (node.name === 'contents' && sectionDepth == 1) {
      hasContentsDirective = true;
    }

    if (sectionDepth > 1) {
      // Return early if no contents directive has been found beyond its expected depth
      if (!hasContentsDirective) {
        return null;
      }

      if (node[key] === 'heading' && sectionDepth - 1 <= maxDepth) {
        const nodeTitle = node.children;
        const newNode = {
          depth: sectionDepth,
          id: node.id,
          title: nodeTitle,
        };

        results.push(newNode);
      }
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
  let positions = [];

  headingNodes.forEach(heading => {
    const el = document.getElementById(heading.id);
    if (el) {
      positions.push(el.offsetTop / height);
    }
  });

  return positions;
};

const ContentsContext = React.createContext(defaultContextValue);

const ContentsProvider = ({ children, nodes = [] }) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const headingNodes = findSectionHeadings(nodes);

  useEffect(() => {
    const height = document.body.clientHeight - window.innerHeight;
    const headingPositions = findHeadingsOnPage(headingNodes, height);

    const handleScroll = () => {
      // Calculate current position of the page similar to guides.js
      const scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
      let currentPosition = scrollTop / height;
      currentPosition = (scrollTop + currentPosition * 0.8 * window.innerHeight) / height;

      // bestMatch = [distance from closest section, closest section index]
      let bestMatch = [Infinity, 0];

      headingPositions.forEach((headingPosition, index) => {
        const delta = Math.abs(headingPosition - currentPosition);
        if (delta <= bestMatch[0]) {
          bestMatch = [delta, index];
        }
      });

      setActiveSectionIndex(bestMatch[1]);
    };

    const throttledScrollFn = throttle(handleScroll, 50);
    document.addEventListener('scroll', throttledScrollFn);

    return () => {
      document.removeEventListener('scroll', throttledScrollFn);
      setActiveSectionIndex(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  return <ContentsContext.Provider value={{ headingNodes, activeSectionIndex }}>{children}</ContentsContext.Provider>;
};

export { ContentsContext, ContentsProvider };
