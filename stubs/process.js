import process from 'process';

//monkey patch process
global.process = process;

console.log('PROCESS MAYA:', process);

// const exp = typeof global !== 'undefined' && global.process ? global.process : import {process} from '../node_modules/process/browser.js'
// MAYA TODO

// module.exports =
//   typeof global !== 'undefined' && global.process ? global.process : require('../node_modules/process/browser.js');

export default typeof global !== 'undefined' && global.process
  ? global.process
  : import('../node_modules/process/browser.js');

// require('../node_modules/process/browser.js');
