import React, { useEffect, useMemo, useState } from 'react';
import { getNestedValue } from '../utils/get-nested-value';

const defaultContextValue = {
  headingNodes: [],
  activeSectionId: null,
};

const findSectionHeadings = (nodes) => {
  // Max depth is 2 by default to not make the "On This Page" feel too crowded
  let maxDepth = 2;
  const key = 'type';
  const results = [];
  let hasContentsDirective = false;

  const searchNode = (node, sectionDepth) => {
    // Search for contents directive before looking for heading nodes.
    // Ideally, we'd want this in the postprocess layer of the parser.
    if (node.name === 'contents' && sectionDepth === 1) {
      hasContentsDirective = true;
      maxDepth = getNestedValue(['options', 'depth'], node) || maxDepth;
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
      return node.children.forEach((child) => searchNode(child, sectionDepth));
    }

    return null;
  };

  nodes.forEach((node) => searchNode(node, 0));
  return results;
};

const observeHeadings = (headingNodes, observer) => {
  let headingElements = [];
  headingNodes.forEach(heading => {
    const el = document.getElementById(heading.id);
    if (el) {
      observer.observe(el);
      headingElements.push(el);
    }
  });
  return headingElements;
};

const unobserveHeadings = (headings, observer) => {
  headings.forEach(el => {
    observer.unobserve(el);
  });
};

const ContentsContext = React.createContext(defaultContextValue);

const ContentsProvider = ({ children, nodes = [] }) => {
  const headingNodes = useMemo(() => findSectionHeadings(nodes), [nodes]);
  const [activeSectionId, setActiveSectionId] = useState(headingNodes[0]?.id);

  useEffect(() => {
    const options = {
      root: document.querySelector('.content'),
      rootMargin: '0px',
      threshold: 1.0,
    };

    // Callback is first performed upon page load. Ignore checking entries on first load to allow
    // headings[0] to be counted first when headings[0] and headings[1] are both intersecting
    let firstLoad = true;
    let defaultActiveSectionId = window.location.hash.slice(1) || headingNodes[0]?.id;
    const callback = entries => {
      if (firstLoad) {
        firstLoad = false;
        setActiveSectionId(defaultActiveSectionId);
        return;
      }

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSectionId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    const headings = observeHeadings(headingNodes, observer);
    return () => {
      unobserveHeadings(headings, observer);
      setActiveSectionId(defaultActiveSectionId);
    };
  }, [headingNodes]);

  return <ContentsContext.Provider value={{ headingNodes, activeSectionId }}>{children}</ContentsContext.Provider>;
};

export { ContentsContext, ContentsProvider };
