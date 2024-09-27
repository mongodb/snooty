import { SoftwareSourceCodeSd, VideoObjectSd } from '../../../src/utils/structured-data';

describe('SoftwareSourceCode', () => {
  it('returns valid structured data with programmingLanguage', () => {
    const code = 'print("hello world")';
    const lang = 'py';
    const softwareSourceCodeSd = new SoftwareSourceCodeSd({ code, lang });
    expect(softwareSourceCodeSd.isValid()).toBeTruthy();
    expect(softwareSourceCodeSd).toMatchSnapshot();
  });

  it('returns valid structured data without programmingLangauge', () => {
    const code = 'print("hello world")';
    const softwareSourceCodeSd = new SoftwareSourceCodeSd({ code });
    expect(softwareSourceCodeSd.isValid()).toBeTruthy();
    expect(softwareSourceCodeSd).toMatchSnapshot();
  });
});

describe('VideoObject', () => {
  const embedUrl = 'https://www.youtube.com/embed/XrJG994YxD8';
  const name = 'Mastering Indexing for Perfect Query Matching';
  const uploadDate = '2023-11-08T05:00:28-08:00';
  const thumbnailUrl = 'https://i.ytimg.com/vi/XrJG994YxD8/maxresdefault.jpg';
  const description = 'Learn more about indexes in Atlas Search';

  it('returns valid structured data with description', () => {
    const videoObjectSd = new VideoObjectSd({ embedUrl, name, uploadDate, thumbnailUrl, description });
    expect(videoObjectSd.isValid()).toBeTruthy();
    expect(videoObjectSd).toMatchSnapshot();
  });

  it('returns valid structured data without description', () => {
    const videoObjectSd = new VideoObjectSd({ embedUrl, name, uploadDate, thumbnailUrl });
    expect(videoObjectSd.isValid()).toBeTruthy();
    expect(videoObjectSd).toMatchSnapshot();
  });

  it('returns invalid structured data with missing name field', () => {
    const videoObjectSd = new VideoObjectSd({ embedUrl, uploadDate, thumbnailUrl, description });
    expect(videoObjectSd.isValid()).toBeFalsy();
  });
});
