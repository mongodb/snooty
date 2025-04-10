import assertLeadingBrand from '../../../src/utils/assert-leading-brand';

describe('assert leading brand', () => {
  it('should insert MongoDB brand into a string if it does not contain', () => {
    expect(assertLeadingBrand('test product')).toEqual('MongoDB test product');
  });
  it('should return the string if it has the brand in it', () => {
    expect(assertLeadingBrand('mongodb test product')).toEqual('MongoDB test product');
    expect(assertLeadingBrand('MongoDb test product')).toEqual('MongoDB test product');
    expect(assertLeadingBrand('MongoDb test product')).toEqual('MongoDB test product');
  });
  it('should change the position of brand if it contains it elsewhere in title', () => {
    expect(assertLeadingBrand('books mongodb', { titleCase: true })).toEqual('MongoDB Books');
    expect(assertLeadingBrand('books mongodb')).toEqual('MongoDB books');
  });
  it('should title case if passed the option', () => {
    expect(assertLeadingBrand('MongoDB test product', { titleCase: true })).toEqual('MongoDB Test Product');
  });
  it('should preserve casing if a name has mixed values', () => {
    expect(assertLeadingBrand('test iProduct', { titleCase: true })).toEqual('MongoDB Test iProduct');
  });
});
