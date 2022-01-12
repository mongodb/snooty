import React from 'react';
import { render } from '@testing-library/react';
import Code from '../../src/components/Code';
import { CodeProvider } from '../../src/components/code-context';
import { TabProvider } from '../../src/components/tab-context';
import * as browserStorage from '../../src/utils/browser-storage';
import { tick } from '../utils';

// data for this component
import mockData from './data/Code.test.json';

const mockSelectors = {
  drivers: {
    nodejs: [
      {
        type: 'text',
        position: {
          start: {
            line: 0,
          },
        },
        value: 'Node.js',
      },
    ],
    python: [
      {
        type: 'text',
        position: {
          start: {
            line: 0,
          },
        },
        value: 'Python',
      },
    ],
    shell: [
      {
        type: 'text',
        position: {
          start: {
            line: 0,
          },
        },
        value: 'MongoDB Shell',
      },
    ],
  },
};

const shallowCode = ({ data }) => {
  return render(<Code nodeData={data} />);
};

const mountCodeWithSelector = ({ data }) => {
  return render(
    <TabProvider selectors={mockSelectors}>
      <CodeProvider>
        <Code nodeData={data} />
      </CodeProvider>
    </TabProvider>
  );
};

it('renders correctly', () => {
  const wrapper = shallowCode({ data: mockData.testCode, activeTabs: { cloud: 'cloud' } });
  expect(wrapper.asFragment()).toMatchSnapshot();
});

describe('when rendering with selectors', () => {
  jest.useFakeTimers();

  const testData = mockData.testWithSelectors;
  let mockGetLocalValue;

  beforeAll(() => {
    const mockActiveTabs = {
      drivers: 'shell',
    };
    mockGetLocalValue = jest.spyOn(browserStorage, 'getLocalValue').mockImplementation(() => mockActiveTabs);
  });

  afterAll(() => {
    mockGetLocalValue.mockClear();
  });

  it('renders with the correct active tab', () => {
    const wrapper = mountCodeWithSelector({ data: testData });
    const codeComponent = wrapper.find('Code').last();
    expect(codeComponent.props().language).toEqual('MongoDB Shell');
    expect(wrapper.find('LanguageSwitcher').exists()).toBeTruthy();
  });

  it('changes the selected driver', async () => {
    const wrapper = mountCodeWithSelector({ data: testData });
    let codeComponent = wrapper.find('Code').last();
    // Assume that the LG component propagates events upwards successfully
    codeComponent.invoke('onChange')({ id: 'nodejs' });

    await tick({ wrapper });

    codeComponent = wrapper.find('Code').last();
    expect(codeComponent.props().language).toEqual('Node.js');
  });
});
