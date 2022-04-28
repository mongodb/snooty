import React from 'react';
import { render } from '@testing-library/react';
import Footnote from '../../src/components/Footnote';
import FootnoteContext from '../../src/components/Footnote/footnote-context';

// data for this component
import mockData from './data/Footnote.test.json';

const mountFootnotes = (footnotes) =>
  render(
    <FootnoteContext.Provider value={{ footnotes: footnotes }}>
      <Footnote nodeData={mockData} />
    </FootnoteContext.Provider>
  );

const mockFootnotes = { 1: { label: 1, references: ['id1'] } };

it('renders correctly', () => {
  const footnotes = mountFootnotes(mockFootnotes);
  expect(footnotes.asFragment()).toMatchSnapshot();
});
