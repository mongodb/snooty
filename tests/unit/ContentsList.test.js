import React from 'react';
import { render } from '@testing-library/react';
import ContentsList from '../../src/components/ContentsList/ContentsList';

const renderContentsList = (label) => {
  return render(
    <ContentsList label={label}>
      <li>List Item 1</li>
      <li>List Item 2</li>
    </ContentsList>
  );
};

describe('ContentsList', () => {
  it('renders correctly with a label', () => {
    const labelText = 'On This Page';
    const wrapper = renderContentsList(labelText);

    expect(wrapper.getByText(labelText)).toBeTruthy();
    expect(wrapper.container.querySelectorAll('li')).toHaveLength(2);
    expect(wrapper.getAllByText('List Item', { exact: false })).toHaveLength(2);
  });

  it('renders correctly without a label', () => {
    const wrapper = renderContentsList();

    expect(wrapper.container.querySelectorAll('li')).toHaveLength(2);
    expect(wrapper.getAllByText('List Item', { exact: false })).toHaveLength(2);
  });
});
