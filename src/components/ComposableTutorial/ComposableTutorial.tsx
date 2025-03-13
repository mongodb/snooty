import React, { useCallback, useEffect, useState } from 'react';
import {
  ComposableNode,
  ComposableTutorialNode,
} from '../../types/ast';
import Composable from './Composable';
import ConfigurableOption from './ConfigurableOption';

interface ComposableProps {
  nodeData: ComposableTutorialNode;
}

const ComposableTutorial = ({ nodeData: { options, children }, ...rest }: ComposableProps) => {
  const composableOptions = options['composable-options'];
  const [currentSelections, setCurrentSelections] = useState<{ [key: string]: string }>(() => ({}));

  // TODO:
  // read query params
  // if no params, send to default: (local storage, defaults, first values)
  // if params, set the right ones for currentSelections
  useEffect(() => {}, []);

  const showComposable = useCallback(
    (dependencies: { [key: string]: string }[]) =>
      dependencies.every((d) => {
        const key = Object.keys(d)[0];
        const value = Object.values(d)[0];
        return currentSelections[key] === value;
      }),
    [currentSelections]
  );

  return (
    <>
      <div>
        {composableOptions.map((option, index) => (
          <ConfigurableOption
            option={option}
            selections={currentSelections}
            setCurrentSelections={setCurrentSelections}
            showComposable={showComposable}
            key={index}
          />
        ))}
      </div>
      {children.map((c, i) => {
        if (showComposable(c.options.selections)) {
          return <Composable nodeData={c as ComposableNode} key={i} />;
        }
        return null;
      })}
    </>
  );
};

export default ComposableTutorial;
