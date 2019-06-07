import React from 'react';
import { mount, shallow } from 'enzyme';
import Pills from '../../src/components/Pills';

const mountPills = ({ mockData, mockHandleClick }) => mount(<Pills pills={mockData} handleClick={mockHandleClick} />);
const shallowPills = ({ mockData, mockHandleClick }) =>
  shallow(<Pills pills={mockData} handleClick={mockHandleClick} />);

describe('Pills component', () => {
  let wrapper;
  let shallowWrapper;
  const mockData = ['python', 'compass', 'motor', 'go'];
  const mockHandleClick = jest.fn();

  beforeAll(() => {
    wrapper = mountPills({ mockData, mockHandleClick });
    shallowWrapper = shallowPills({ mockData, mockHandleClick });
  });

  it('renders correctly', () => {
    expect(shallowWrapper).toMatchSnapshot();
  });

  it('clicking a pill calls the event handler', () => {
    wrapper
      .find('.guide__pill')
      .first()
      .simulate('click');
    expect(wrapper.props().handleClick).toHaveBeenCalledTimes(1);
  });
});
