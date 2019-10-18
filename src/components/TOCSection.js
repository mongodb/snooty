import React from 'react';
import PropTypes from 'prop-types';
import TOCNode from './TOCNode';

/**
 * Sub-Section (top level) of the Table of Contents. May be a drawer or a link to a page
 */
const TOCSection = ({ activeSection, sectionData, toggleDrawer }) => {
  const { title, slug, url, children, options } = sectionData;
  const isExternal = !!url;
  const target = url || slug;
  const classNames = [];
  const isActive =
    activeSection && (slug === activeSection || activeSection === `/${slug}` || activeSection.includes(slug));
  if (isExternal) {
    classNames.push('reference external');
  } else {
    classNames.push('reference internal');
  }
  if (isActive) {
    classNames.push('current');
  }
  const liClassNames = isActive ? 'toctree-l1 current selected-item' : 'toctree-l1';
  const childListStyle = { display: isActive ? 'block' : 'none' };
  const ChildNodeList = () => (
    <ul style={childListStyle}>
      {children.map(c => (
        <TOCNode node={c} key={c.title} />
      ))}
    </ul>
  );
  const NodeLink = () => {
    const isDrawer = !!(options && options.drawer);
    let formattedTitle = title;
    if (options && options.styles) {
      Object.keys(options.styles).forEach(tagname => {
        const keyword = options.styles[tagname];
        const styledKeyword = `<${tagname}>${keyword}</${tagname}>`;
        formattedTitle = formattedTitle.replace(keyword, styledKeyword);
      });
    }
    if (isDrawer) {
      const result = (
        <a
          onClick={() => toggleDrawer(slug)}
          className={classNames.join(' ')}
          dangerouslySetInnerHTML={{ __html: formattedTitle }}
        />
      );
      return result;
    }
    return <a href={target} className={classNames.join(' ')} dangerouslySetInnerHTML={{ __html: formattedTitle }} />;
  };
  return (
    <li className={liClassNames}>
      <NodeLink />
      <ChildNodeList />
    </li>
  );
};

TOCSection.propTypes = {
  activeSection: PropTypes.string.isRequired,
  sectionData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string,
    url: PropTypes.string,
    children: PropTypes.array.isRequired,
    options: PropTypes.shape({
      drawer: PropTypes.bool,
      styles: PropTypes.objectOf(PropTypes.string),
    }),
  }).isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

export default TOCSection;
