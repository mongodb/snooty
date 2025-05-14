import React from 'react';
import { render } from '@testing-library/react';
import {
  AncestorComponentContextProvider,
  useAncestorComponentContext,
} from '../../src/context/ancestor-components-context';

const TEXT_NESTED_IN_A = 'Nested in A';
const TEXT_NESTED_IN_B = 'Nested in B';
const TEXT_NESTED_IN_C = 'Nested in C';
const TEXT_NESTED_IN_D = 'Nested in D';
const COMPONENT_A = 'testComponentA';
const COMPONENT_B = 'testComponentB';
const COMPONENT_C = 'testComponentC';
const COMPONENT_D = 'testComponentD';

const TestComponent = ({ children }) => {
  const ancestors = useAncestorComponentContext();
  const isNestedInA = !!ancestors[COMPONENT_A];
  const isNestedInB = !!ancestors[COMPONENT_B];
  const isNestedInC = !!ancestors[COMPONENT_C];
  const isNestedInD = !!ancestors[COMPONENT_D];

  return (
    <div>
      {isNestedInA && <span>{TEXT_NESTED_IN_A}</span>}
      {isNestedInB && <span>{TEXT_NESTED_IN_B}</span>}
      {isNestedInC && <span>{TEXT_NESTED_IN_C}</span>}
      {isNestedInD && <span>{TEXT_NESTED_IN_D}</span>}
      {children}
    </div>
  );
};

describe('Tests ancestor components context', () => {
  it('defaults ancestors to falsy', () => {
    const wrapper = render(<TestComponent />);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_A)).toHaveLength(0);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_B)).toHaveLength(0);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_C)).toHaveLength(0);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_D)).toHaveLength(0);
  });

  it('keeps ancestor counts separate', () => {
    const wrapper = render(
      <TestComponent>
        <AncestorComponentContextProvider component={COMPONENT_A}>
          <TestComponent />
          <TestComponent />
        </AncestorComponentContextProvider>

        <AncestorComponentContextProvider component={COMPONENT_B}>
          <TestComponent />
        </AncestorComponentContextProvider>

        <TestComponent />
      </TestComponent>
    );

    expect(wrapper.queryAllByText(TEXT_NESTED_IN_A)).toHaveLength(2);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_B)).toHaveLength(1);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_C)).toHaveLength(0);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_D)).toHaveLength(0);
  });

  it('persists ancestors from previous providers', () => {
    const wrapper = render(
      <AncestorComponentContextProvider component={COMPONENT_B}>
        <TestComponent>
          <AncestorComponentContextProvider component={COMPONENT_A}>
            <AncestorComponentContextProvider component={COMPONENT_C}>
              <AncestorComponentContextProvider component={COMPONENT_D}>
                <TestComponent />
              </AncestorComponentContextProvider>
            </AncestorComponentContextProvider>
          </AncestorComponentContextProvider>
        </TestComponent>

        <TestComponent />
      </AncestorComponentContextProvider>
    );

    expect(wrapper.queryAllByText(TEXT_NESTED_IN_A)).toHaveLength(1);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_B)).toHaveLength(3);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_C)).toHaveLength(1);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_D)).toHaveLength(1);
  });

  it('maintains truthy value when component is nested multiple times', () => {
    const wrapper = render(
      <AncestorComponentContextProvider component={COMPONENT_A}>
        <AncestorComponentContextProvider component={COMPONENT_A}>
          <div>
            <AncestorComponentContextProvider component={COMPONENT_A}>
              <TestComponent />
            </AncestorComponentContextProvider>
          </div>
        </AncestorComponentContextProvider>
      </AncestorComponentContextProvider>
    );

    expect(wrapper.queryAllByText(TEXT_NESTED_IN_A)).toHaveLength(1);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_B)).toHaveLength(0);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_C)).toHaveLength(0);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_D)).toHaveLength(0);
  });

  it('does not add an ancestor when component is not added', () => {
    const wrapper = render(
      <AncestorComponentContextProvider>
        <TestComponent />
      </AncestorComponentContextProvider>
    );

    expect(wrapper.queryAllByText(TEXT_NESTED_IN_A)).toHaveLength(0);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_B)).toHaveLength(0);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_C)).toHaveLength(0);
    expect(wrapper.queryAllByText(TEXT_NESTED_IN_D)).toHaveLength(0);
  });
});
