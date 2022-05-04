import React from 'react';
import { render } from '@testing-library/react';
import Video from '../../src/components/Video';

// data for this component
import mockData from './data/Video.test.json';

it('YouTube video renders correctly', () => {
  const tree = render(<Video nodeData={mockData.validYouTubeURL} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('Vimeo video renders correctly', () => {
  const tree = render(<Video nodeData={mockData.validVimeoURL} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('DailyMotion video renders correctly', () => {
  const tree = render(<Video nodeData={mockData.validDailyMotionURL} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

describe('Console warning messages', () => {
  let consoleOutput = [];

  const mockedWarn = (output) => consoleOutput.push(output);
  beforeEach(() => (console.warn = mockedWarn));

  it('has to show in console warning messages', () => {
    render(<Video nodeData={mockData.invalidVideoURL1} />);
    render(<Video nodeData={mockData.invalidVideoURL2} />);
    expect(consoleOutput).toEqual([
      'Invalid URL: https://docs.mongodb.com/realm/ has been passed into the Video component',
      'Invalid URL: https://www.youtube.com/ has been passed into the Video component',
    ]);
  });
});
