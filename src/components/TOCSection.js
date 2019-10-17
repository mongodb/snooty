import React from 'react';
import PropTypes from 'prop-types';
import TOCNode from './TOCNode';

const TOCSection = ({ sectionData, handleDrawer, activeSection }) => {
  const { title, slug, url, children, options } = sectionData;
  const isExternal = !!url;
  const target = url || slug;
  const liClassNames = ['toctree-l1'];
  const classNames = [];
  const isActive = slug =>
    activeSection && (slug === activeSection || activeSection === `/${slug}` || activeSection.includes(slug));
  if (isExternal) {
    classNames.push('reference external');
  } else {
    classNames.push('reference internal');
  }
  if (isActive(slug)) {
    liClassNames.push('current selected-item');
    classNames.push('current');
  }
  if (options && options.drawer) {
    return (
      <li className={liClassNames.join(' ')}>
        <a onClick={() => handleDrawer(slug)} className={classNames.join(' ')}>
          {title}
        </a>
        <ul style={{ display: isActive(slug) ? 'block' : 'none' }}>
          {children.map(c => (
            <TOCNode node={c} level={2} key={c.title} />
          ))}
        </ul>
      </li>
    );
  }
  return (
    <li className={liClassNames.join(' ')}>
      <a href={target} className={classNames.join(' ')}>
        {title}
      </a>
      <ul style={{ display: isActive(slug) ? 'block' : 'none' }}>
        {children.map(c => (
          <TOCNode node={c} level={2} key={c.title} />
        ))}
      </ul>
    </li>
  );
};

TOCSection.propTypes = {
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
  handleDrawer: PropTypes.func.isRequired,
  activeSection: PropTypes.string.isRequired,
};

export default TOCSection;
