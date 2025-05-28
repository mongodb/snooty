import React, { ReactNode, useMemo } from 'react';
import { Directive } from '../types/ast';
import ComponentFactory from './ComponentFactory';

const VersionModified = ({ nodeData: { argument, children, name }, ...rest }: { nodeData: Directive }) => {
  const { introText, childIndex } = useMemo(() => {
    const version = argument.length > 0 ? <ComponentFactory nodeData={argument[0]} /> : null;
    let childIndex = 0;
    let additionalArg: ReactNode = '.';
    if (argument.length > 1) {
      additionalArg = (
        <>
          :{' '}
          {argument.slice(1).map((arg, i) => (
            <ComponentFactory nodeData={arg} key={i} />
          ))}
        </>
      );
    } else if (children.length > 0) {
      childIndex = 1;
      additionalArg = (
        <>
          : <ComponentFactory nodeData={children[0]} skipPTag />
        </>
      );
    }
    let text: ReactNode = '';
    if (name === 'deprecated') {
      text = <>Deprecated{version && <> since version {version}</>}</>;
    } else if (name === 'versionadded') {
      text = <>New{version && <> in version {version}</>}</>;
    } else if (name === 'versionchanged') {
      text = <>Changed{version && <> in version {version}</>}</>;
    }

    return {
      childIndex,
      introText: (
        <>
          <em>{text}</em>
          {additionalArg}
        </>
      ),
    };
  }, [argument, children, name]);

  return (
    <div>
      <p>{introText}</p>
      {children.slice(childIndex).map((child, index) => (
        <ComponentFactory {...rest} nodeData={child} key={index} />
      ))}
    </div>
  );
};

export default VersionModified;
