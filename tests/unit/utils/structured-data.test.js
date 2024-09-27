import { SoftwareSourceCodeSd } from '../../../src/utils/structured-data';

describe('SoftwareSourceCode', () => {
  it('returns valid structured data with programmingLanguage', () => {
    const code = 'print("hello world")';
    const lang = 'py';
    const softwareSourceCodeSd = new SoftwareSourceCodeSd({ code, lang });
    expect(softwareSourceCodeSd).toMatchSnapshot();
  });

  it('returns valid structured data without programmingLangauge', () => {
    const code = 'print("hello world")';
    const softwareSourceCodeSd = new SoftwareSourceCodeSd({ code });
    expect(softwareSourceCodeSd).toMatchSnapshot();
  });
});
