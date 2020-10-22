import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ComponentFactory from './ComponentFactory';

const VersionModified = ({ nodeData: { argument, children, name }, ...rest }) => {
  const introText = useMemo(() => {
    const version = argument.length > 0 ? <ComponentFactory nodeData={argument[0]} /> : null;
    const additionalArg =
      argument.length > 1 ? (
        <>
          : <ComponentFactory nodeData={argument[1]} />
        </>
      ) : (
        '.'
      );
    let text = '';
    if (name === 'deprecated') {
      text = <>Deprecated{version && <> since version {version}</>}</>;
    } else if (name === 'versionadded') {
      text = <>New{version && <> in version {version}</>}</>;
    } else if (name === 'versionchanged') {
      text = <>Changed{version && <> in version {version}</>}</>;
    }

    return (
      <>
        <em>{text}</em>
        {additionalArg}
      </>
    );
  }, [argument, name]);

  return (
    <div className={name}>
      <p>{introText}</p>
      {children.map((child, index) => (
        <ComponentFactory {...rest} nodeData={child} key={index} />
      ))}
    </div>
  );
};

VersionModified.propTypes = {
  nodeData: PropTypes.shape({
    argument: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.string,
      })
    ).isRequired,
    children: PropTypes.arrayOf(PropTypes.object),
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default VersionModified;
