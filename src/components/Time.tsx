import React from 'react';
import { getPlaintext } from '../utils/get-plaintext';
import { Directive } from '../types/ast';

const Time = ({ nodeData: { argument } }: { nodeData: Directive }) => {
  const time = getPlaintext(argument);
  if (!time) {
    return null;
  }

  return (
    <p>
      <em>Time required: {time} minutes</em>
    </p>
  );
};

export default Time;
