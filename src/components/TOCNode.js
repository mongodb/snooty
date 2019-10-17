import React from 'react';
import PropTypes from 'prop-types';

const TOCNode = ({ node, level }) => {
  const { title, slug, url, children } = node;
  const target = slug || url;
  const hasChildren = !!children.length;
  const classNames = [];
  const isExternal = !!url;
  const activeSlug = window.location.pathname;
  const isActive = s => s === activeSlug || activeSlug === `/${s}`;
  const liClassNames = [`toctree-l${level}`];
  if (isActive(slug)) {
    classNames.push('current');
    liClassNames.push('current selected-item');
  }
  if (isExternal) {
    classNames.push('reference external');
  } else {
    classNames.push('reference internal');
  }
  return (
    <li className={liClassNames.join(' ')}>
      <a href={target} className={classNames.join(' ')}>
        <span className={hasChildren ? 'expand-icon docs-expand-arrow' : 'expand-icon'} />
        {title}
      </a>
      {isActive(slug) ? (
        <ul>
          {children.map(c => (
            <TOCNode node={c} level={level + 1} key={c.title} />
          ))}
        </ul>
      ) : null}
    </li>
  );
};

TOCNode.propTypes = {
  node: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string,
    url: PropTypes.string,
    children: PropTypes.array.isRequired,
    options: PropTypes.shape({
      drawer: PropTypes.bool,
      styles: PropTypes.objectOf(PropTypes.string),
    }),
  }).isRequired,
  level: PropTypes.number.isRequired,
};

export default TOCNode;
