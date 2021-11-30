import React from 'react';
import { mount } from 'enzyme';
import Footnote from '../../src/components/ComponentFactory/Footnote';
import FootnoteContext from '../../src/components/ComponentFactory/Footnote/footnote-context';

// data for this component
import mockData from './data/Footnote.test.json';

const mountFootnotes = (footnotes) =>
  mount(
    <FootnoteContext.Provider value={{ footnotes: footnotes }}>
      <Footnote nodeData={mockData} />
    </FootnoteContext.Provider>
  );

const mockFootnotes = { 1: { label: 1, references: ['id1'] } };

it('renders correctly', () => {
  const footnotes = mountFootnotes(mockFootnotes);
  expect(footnotes).toMatchSnapshot();
});
