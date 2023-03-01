module.exports =
  typeof global !== 'undefined' && global.process ? global.process : require('../node_modules/process/browser.js');
