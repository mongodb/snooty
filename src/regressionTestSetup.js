const fs = require('fs');
const path = require('path');

const getSlugs = (dir, results) => {
  fs.readdirSync(dir).forEach(fileName => {
    const filePath = path.resolve(dir, fileName);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      getSlugs(filePath, results);
    } else if (filePath.includes('index.html')) {
      if (filePath.match(new RegExp('public/(.*)/index.html'))) {
        results.push(filePath.match(new RegExp('public/(.*)/index.html'))[1]);
      }
    }
  });
  return results;
};

export const slugArray = getSlugs('./public', []); // eslint-disable-line import/prefer-default-export
