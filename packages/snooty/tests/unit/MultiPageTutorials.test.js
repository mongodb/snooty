import { render } from '@testing-library/react';
import { MPTNextLinkFull } from '../../src/components/MultiPageTutorials/MPTNextLinkFull';
import { MPTNextLinkMini } from '../../src/components/MultiPageTutorials/MPTNextLinkMini';
import useSnootyMetadata from '../../src/utils/use-snooty-metadata';
import { PageContext } from '../../src/context/page-context';
import {
  OPTION_KEY_SHOW_NEXT_TOP,
  OPTION_KEY_TIME_REQUIRED,
  PAGE_OPTION_NAME,
} from '../../src/components/MultiPageTutorials/constants';
import slugToBreadcrumbLabel from './data/ecosystem/slugToBreadcrumbLabel.json';

jest.mock(`../../src/utils/use-snooty-metadata`, () => jest.fn());

const VALID_PAGE_OPTIONS = {
  [PAGE_OPTION_NAME]: {
    [OPTION_KEY_SHOW_NEXT_TOP]: true,
    [OPTION_KEY_TIME_REQUIRED]: 15,
  },
};

const MOCK_SLUGS = ['drivers/csharp', 'drivers/go', 'drivers/java'];

const MULTI_PAGE_TUTORIALS = {
  'mock-page': {
    slugs: MOCK_SLUGS,
    total_steps: MOCK_SLUGS.length,
  },
};

const TestWrapper = ({ slugIndex, options, children }) => (
  <PageContext.Provider value={{ slug: MOCK_SLUGS[slugIndex], options: options }}>{children}</PageContext.Provider>
);

const renderFullComponent = ({ ...props }) =>
  render(
    <TestWrapper {...props}>
      <MPTNextLinkFull />
    </TestWrapper>
  );

const renderMiniComponent = ({ ...props }) =>
  render(
    <TestWrapper {...props}>
      <MPTNextLinkMini />
    </TestWrapper>
  );

describe('Next link button', () => {
  beforeEach(() => {
    useSnootyMetadata.mockImplementation(() => ({
      multiPageTutorials: MULTI_PAGE_TUTORIALS,
      slugToBreadcrumbLabel,
    }));
  });

  it("renders when there's a next step in the multi-page tutorial", () => {
    const testIndex = 1;
    const tree = renderFullComponent({ slugIndex: testIndex, options: VALID_PAGE_OPTIONS });
    expect(tree.getByText('Next')).toBeTruthy();
    expect(tree.getByText(slugToBreadcrumbLabel[MOCK_SLUGS[testIndex + 1]])).toBeTruthy();
  });

  it("does not render when there's no next step in the multi-page tutorial", () => {
    const testIndex = MOCK_SLUGS.length - 1;
    const tree = renderFullComponent({ slugIndex: testIndex, options: VALID_PAGE_OPTIONS });
    expect(tree.queryByText('Next')).toBeFalsy();
  });

  it('does not render unless page option is present', () => {
    const testIndex = 1;
    const mockOptions = {
      [PAGE_OPTION_NAME]: {
        [OPTION_KEY_SHOW_NEXT_TOP]: false,
        [OPTION_KEY_TIME_REQUIRED]: 15,
      },
    };
    mockOptions.multi_page_tutorial_settings.show_next_top = false;
    const tree = renderFullComponent({ slugIndex: testIndex, options: mockOptions });
    expect(tree.queryByText('Next')).toBeFalsy();
  });
});

describe('Next mini button', () => {
  beforeEach(() => {
    useSnootyMetadata.mockImplementation(() => ({
      multiPageTutorials: MULTI_PAGE_TUTORIALS,
      slugToBreadcrumbLabel,
    }));
  });

  it("renders when there's a next step in the multi-page tutorial", () => {
    const testIndex = 1;
    const tree = renderMiniComponent({ slugIndex: testIndex, options: VALID_PAGE_OPTIONS });
    expect(tree.getByText('Next Step')).toBeTruthy();
  });

  it("does not render when there's no next step in the multi-page tutorial", () => {
    const testIndex = MOCK_SLUGS.length - 1;
    const tree = renderMiniComponent({ slugIndex: testIndex, options: VALID_PAGE_OPTIONS });
    expect(tree.queryByText('Next Step')).toBeFalsy();
  });

  it('does not render unless page option is present', () => {
    const testIndex = 1;
    const mockOptions = { ...VALID_PAGE_OPTIONS };
    mockOptions.multi_page_tutorial_settings.show_next_top = false;
    const tree = renderMiniComponent({ slugIndex: testIndex, options: mockOptions });
    expect(tree.queryByText('Next Step')).toBeFalsy();
  });
});
