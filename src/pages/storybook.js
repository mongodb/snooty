import React from 'react';
import styled from '@emotion/styled';
import { colorMap, size } from '../styles/devhub';

const StorybookContainer = styled('div')`
  padding: ${size.default};
`;

const Swatch = styled('div')`
  background-color: ${props => props.colorValue};
  font-weight: bold;
  padding: ${size.small};
  margin: ${size.tiny};
`;

export default () => (
  <StorybookContainer>
    <h1>DevHub Component "Storybook"</h1>
    <p>Colors</p>
    {Object.keys(colorMap).map(colorName => (
      <Swatch key={colorName} colorName={colorName} colorValue={colorMap[colorName]}>
        {colorMap[colorName]} - {colorName}
      </Swatch>
    ))}
  </StorybookContainer>
);
