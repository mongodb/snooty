import React from 'react';
import { render } from '@testing-library/react';
import Video from '../../src/components/Video';

// data for this component
import mockData from './data/Video.test.json';

const REACT_PLAYER_QUERY = 'div.react-player__preview';
const SD_SCRIPT_QUERY = 'script[type="application/ld+json"]';

it('YouTube video renders correctly', () => {
  const tree = render(<Video nodeData={mockData.validYouTubeURL} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('Vimeo video renders null', () => {
  const tree = render(<Video nodeData={mockData.validVimeoURL} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('Wistia video renders correctly', () => {
  const tree = render(<Video nodeData={mockData.validWistiaURL} />);
  expect(tree.asFragment()).toMatchSnapshot();
});

it('DailyMotion video renders null', () => {
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
      'Media Not Found: A video player could not be found for the following https://docs.mongodb.com/realm/',
      'Invalid URL: https://www.youtube.com/ has been passed into the Video component',
    ]);
  });
});

describe('Structured data', () => {
  it('is defined when all fields required by Google are present', () => {
    const mockNodeData = { ...mockData.validYouTubeURL };
    mockNodeData['options'] = {
      title: 'Test Video',
      'upload-date': '2023-11-08T05:00:28-08:00',
      'thumbnail-url': 'https://i.ytimg.com/vi/o2ss2LJNZVE/maxresdefault.jpg',
    };

    const { container } = render(<Video nodeData={mockNodeData} />);
    const videoPlayer = container.querySelector(REACT_PLAYER_QUERY);
    const sdScript = container.querySelector(SD_SCRIPT_QUERY);

    expect(videoPlayer).toBeInTheDocument();
    expect(sdScript).toBeInTheDocument();
    expect(sdScript.textContent).toEqual(
      '{"@context":"https://schema.org","@type":"VideoObject","embedUrl":"https://www.youtube.com/watch?v=YBOiX8DwinE&ab_channel=MongoDB","name":"Test Video","uploadDate":"2023-11-08T05:00:28-08:00","thumbnailUrl":"https://i.ytimg.com/vi/o2ss2LJNZVE/maxresdefault.jpg"}'
    );
  });

  it('is defined with optional fields', () => {
    const mockNodeData = { ...mockData.validYouTubeURL };
    mockNodeData['options'] = {
      title: 'Test Video',
      'upload-date': '2023-11-08T05:00:28-08:00',
      'thumbnail-url': 'https://i.ytimg.com/vi/o2ss2LJNZVE/maxresdefault.jpg',
      description: 'Optional description field',
    };

    const { container } = render(<Video nodeData={mockNodeData} />);
    const videoPlayer = container.querySelector(REACT_PLAYER_QUERY);
    const sdScript = container.querySelector(SD_SCRIPT_QUERY);

    expect(videoPlayer).toBeInTheDocument();
    expect(sdScript).toBeInTheDocument();
    expect(sdScript.textContent).toEqual(
      '{"@context":"https://schema.org","@type":"VideoObject","embedUrl":"https://www.youtube.com/watch?v=YBOiX8DwinE&ab_channel=MongoDB","name":"Test Video","uploadDate":"2023-11-08T05:00:28-08:00","thumbnailUrl":"https://i.ytimg.com/vi/o2ss2LJNZVE/maxresdefault.jpg","description":"Optional description field"}'
    );
  });

  it('is not defined when missing one or more field(s) required by Google', () => {
    const mockNodeData = { ...mockData.validYouTubeURL };
    const { container } = render(<Video nodeData={mockNodeData} />);
    const videoPlayer = container.querySelector(REACT_PLAYER_QUERY);
    const sdScript = container.querySelector(SD_SCRIPT_QUERY);
    expect(videoPlayer).toBeInTheDocument();
    expect(sdScript).not.toBeInTheDocument();
  });
});
