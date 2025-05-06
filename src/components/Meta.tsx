import React from 'react';
import { DirectiveOptions, Meta } from '../types/ast';

export type MetaProps = {
  nodeData: Meta;
};

const getFilteredOptions = (options: DirectiveOptions | undefined): [string, string][] => {
  if (!options) {
    return [];
  }

  const skipList = new Set(['canonical']);
  return Object.entries(options).filter(([key]) => !skipList.has(key));
};

const MetaComponent = ({ nodeData: { options } }: MetaProps) => {
  const filteredOptions = getFilteredOptions(options);
  if (!filteredOptions.length) {
    return null;
  }

  return (
    <>
      {filteredOptions.map(([key, value]) => (
        <meta data-testid="directive-meta" key={key} name={key} content={value} />
      ))}
    </>
  );
};

export default MetaComponent;
