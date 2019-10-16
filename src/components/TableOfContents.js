import React from 'react';
import PropTypes from 'prop-types';
import TEST_DATA from '../../tests/unit/data/Table-Of-Contents.test.json';

const renderContents = props => {
  const { nodeData, level } = props;
  // // Dev check for hardcoded data to be removed
  // if (!nodeData || (!nodeData.title && !nodeData.slug)) {
  //   nodeData = TEST_DATA;
  // }
  const { title, slug, url, children, options } = nodeData;
  const isExternal = !!url;
  const target = url || slug;
  const classNames = [];
  const ulClassNames = [`toctree-l${level} current`];

  if (isExternal) {
    classNames.push('reference external');
  }
  return (
    <li className={ulClassNames}>
      <a href={target} className={classNames}>
        {level !== 1 && <span className={children.length ? 'expand-icon docs-expand-arrow' : 'expand-icon'} />}

        {title}
      </a>
      <ul className="current" style={{ display: 'block' }}>
        {children.map(c => renderContents({ nodeData: c, level: level + 1 }))}
      </ul>
    </li>
  );
};

const TableOfContents = props => {
  let { nodeData } = props;
  // Dev check for hardcoded data to be removed
  if (!nodeData || (!nodeData.title && !nodeData.slug)) {
    nodeData = TEST_DATA;
  }
  const { title, slug, url, children, options } = nodeData;
  const isExternal = !!url;
  const target = url || slug;
  return (
    <aside className="sidebar" id="sidebar">
      <div className="sphinxsidebar" id="sphinxsidebar">
        <div id="sphinxsidebarwrapper" className="sphinxsidebarwrapper">
          <h3>
            <a href={target}>{title}</a>
          </h3>
          <ul>{children.map(c => renderContents({ nodeData: c, level: 1 }))}</ul>
        </div>
      </div>
    </aside>
  );
};

TableOfContents.propTypes = {
  nodeData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string,
    url: PropTypes.string,
    children: PropTypes.array.isRequired,
    options: PropTypes.shape({
      drawer: PropTypes.bool,
      styles: PropTypes.objectOf(PropTypes.string),
    }),
  }).isRequired,
};

export default TableOfContents;
