import React from 'react';
import styled from '@emotion/styled';
import Badge from '../../components/dev-hub/badge';
import { StorybookLayout } from '../../components/dev-hub/layout';
import { H1, H2, H3, H4, P } from '../../components/dev-hub/text';
import { colorMap, size } from '../../components/dev-hub/theme';

const StorybookContainer = styled('div')`
  padding: ${size.default};
`;

const Swatch = styled('div')`
  background-color: ${props => props.colorValue};
  font-weight: bold;
  padding: ${size.small};
  margin: ${size.tiny};
`;

const SectionHeader = styled(H2)`
  text-decoration: underline;
`;

export default () => (
  <StorybookLayout>
    <StorybookContainer>
      <H1>DevHub Component "Storybook"</H1>
      <SectionHeader>Text</SectionHeader>
      <H1 collapse>Heading 1</H1>
      <H2>Heading 2</H2>
      <H3>Heading 3</H3>
      <H4>Heading 4</H4>
      <P>Paragraph</P>
      <SectionHeader>Content Label</SectionHeader>
      <Badge>How-To</Badge>
      <Badge>Quick Start</Badge>
      <Badge>Article</Badge>
      <Badge>Event</Badge>
      <Badge>Community</Badge>
      <Badge>Deep Dive</Badge>
      <SectionHeader>Colors</SectionHeader>
      {Object.keys(colorMap).map(colorName => (
        <Swatch key={colorName} colorName={colorName} colorValue={colorMap[colorName]}>
          <P collapse>
            {colorMap[colorName]} - {colorName}
          </P>
        </Swatch>
      ))}
    </StorybookContainer>
  </StorybookLayout>
);
