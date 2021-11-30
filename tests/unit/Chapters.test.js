import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { mount } from 'enzyme';
import mockData from './data/Chapters.test.json';
import Chapters from '../../src/components/ComponentFactory/Chapters';
import { tick } from '../utils';
import { SidenavContext } from '../../src/components/Sidenav';
import { theme } from '../../src/theme/docsTheme';
import { getPlaintext } from '../../src/utils/get-plaintext';

const mountChapters = () => {
  const { nodeData, metadata } = mockData;
  return mount(
    <ThemeProvider theme={theme}>
      <SidenavContext.Provider value={{ isCollapsed: false }}>
        <Chapters nodeData={nodeData} metadata={metadata} />
      </SidenavContext.Provider>
    </ThemeProvider>
  );
};

describe('Chapters', () => {
  jest.useFakeTimers();

  it('renders chapters', () => {
    const wrapper = mountChapters();
    expect(wrapper.find('Chapter')).toHaveLength(2);
    expect(wrapper.find('LearningCard')).toHaveLength(1);
  });

  it('renders guides in gallery view', async () => {
    const wrapper = mountChapters();
    const viewOptions = wrapper.find('ViewOption');
    expect(viewOptions).toHaveLength(2);

    const galleryView = viewOptions.at(1);
    galleryView.simulate('click');
    await tick({ wrapper });

    expect(wrapper.find('Chapter')).toHaveLength(0);
    const cardGroup = wrapper.find('div.card-group');
    expect(cardGroup.children()).toHaveLength(4);

    // Make sure that the data passed to a card is correct
    const testCard = cardGroup.children().at(0);
    const data = mockData.metadata.guides['cloud/account'];
    expect(testCard.find('img')).toHaveLength(1);
    expect(testCard.find('h4').text()).toEqual(getPlaintext(data.title));
    expect(testCard.find('Text').text()).toEqual(getPlaintext(data.description));
    expect(testCard.find('a').props()).toHaveProperty('href', '/cloud/account/');
    expect(testCard.find('a').text()).toEqual('15 mins');
  });
});
