import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

import ContentsList from '../../src/components/Contents/ContentsList';
import { setDesktop, setMatchMedia, setMobile } from '../utils';
import { theme } from '../../src/theme/docsTheme';

const renderContentsList = (label) => {
  return render(
    <ContentsList label={label}>
      <li>List Item 1</li>
      <li>List Item 2</li>
    </ContentsList>
  );
};

const resizeWindowWidth = (width) => {
  window.innerWidth = width;
  window.dispatchEvent(new Event('resize'));
};

describe('ContentsList', () => {
  it('renders correctly with a label', () => {
    const labelText = 'On This Page';
    const wrapper = renderContentsList(labelText);

    expect(wrapper.getAllByText(labelText)).toHaveLength(2);
    expect(wrapper.container.querySelectorAll('li')).toHaveLength(4);
    expect(wrapper.getAllByText('List Item', { exact: false })).toHaveLength(4);
  });

  it('renders correctly without a label', () => {
    const wrapper = renderContentsList();

    expect(wrapper.container.querySelectorAll('li')).toHaveLength(4);
    expect(wrapper.getAllByText('List Item', { exact: false })).toHaveLength(4);
  });

  it('should show standard version on desktop', async () => {
    const desktopWidth = 1024;
    setDesktop();
    resizeWindowWidth(desktopWidth);

    const wrapper = renderContentsList();
    expect(wrapper.getByTestId('desktop-otp')).not.toHaveStyle('display: none');
    expect(wrapper.queryByTestId('mobile-otp')).toHaveStyle('display: none');
  });

  it('should show collapsible version on mobile', async () => {
    const mobileWidth = 428;
    setMobile();
    resizeWindowWidth(mobileWidth);
    setMatchMedia(theme.screenSize.upToSmall);

    const wrapper = renderContentsList();
    expect(wrapper.queryByTestId('desktop-otp')).toHaveStyle('display: none');
    expect(wrapper.getByTestId('mobile-otp')).not.toHaveStyle('display: none');
  });
});
