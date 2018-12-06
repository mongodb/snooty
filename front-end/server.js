const http = require('http');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser'); 
const querystring = require('querystring');  
const exec = require('child_process').exec;

// express setup
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));  

// server + socket setup
const server = require('http').Server(app);
const io = require('socket.io')(server);

// data structure to store running builds
const QUEUE = [];
const BUILDS = {};

// allow static files to be viewed
const setupStaticConfig = (path) => {
  app.use(express.static(__dirname + `/staging`));
  app.use(express.static(__dirname + `/staging/${path}`));
  app.use('/static', express.static(__dirname + `/staging/${path}/static`));
  app.use('/images', express.static(__dirname + `/staging/${path}/images`));
};

// https://stackoverflow.com/questions/18052762/remove-directory-which-is-not-empty
const deleteFolderRecursive = (path) => {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach((file, index) => {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { 
        deleteFolderRecursive(curPath);
      } else { 
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

const getStatus = (req, res, id) => {
  if (BUILDS[id]) {
    res.json(BUILDS[id]);
  } else {
    res.json({
      'status': 'error',
      'message': 'prefix ID does not exist'
    });
  }
};

const addToQueue = (params) => {
  const prefix = params.buildInfo.prefix;
  // only add build object to queue if not currently in queue, not in progress, 
  // or was already completed and a new build needs to start
  if (!BUILDS[prefix] || BUILDS[prefix]['status'] === 'complete') {
    const updatedQueueLength = QUEUE.unshift(params);
    BUILDS[prefix] = { 'status': 'queued', 'message': `inserted on ${new Date().toLocaleString()} at position ${updatedQueueLength} in queue` };
    console.log('added to queue, new size is', updatedQueueLength);
  }
};

const processQueue = () => {
  if (QUEUE.length === 0) return;
  const currentBuildObject = QUEUE[QUEUE.length - 1];
  const prefix = currentBuildObject.buildInfo.prefix;
  if (BUILDS[prefix]['status'] !== 'in progress') {
    BUILDS[prefix]['status'] = 'in progress';
    BUILDS[prefix]['message'] = 'currently building site';
    console.log('getting first item in queue and starting build', currentBuildObject.buildInfo);
    beginBuild(currentBuildObject);
  }
};

const beginBuild = (buildObject) => {
  const stitch_id = buildObject.buildInfo.stitch_id;
  const namespace = buildObject.buildInfo.namespace;
  const prefix = buildObject.buildInfo.prefix;
  const output_json = {};
  // set env variables
  const env = Object.assign({}, process.env);
  env['STITCH_ID'] = stitch_id;
  env['NAMESPACE'] = namespace;
  env['PREFIX'] = prefix;
  // kick off build
  const gatsbyBuild = exec('gatsby build --prefix-paths', { env: env }, (err, stdout, stderr) => {
    if (err) {
      console.log('ERROR: problem with kicking off build using Gatsby');
    }
  });
  // TODO: upload files to aws `make stage`
  // when build is finished
  gatsbyBuild.on('exit', function() {
    // create proper prefix directory and move files into it
    const outputDir = `staging/${prefix}`;
    exec(`mkdir -p ${outputDir}`, (err, stdout, stderr) => {
      if (err) throw err;
      deleteFolderRecursive(outputDir);
      fs.rename(__dirname + `/public`, __dirname + '/' + outputDir, (err) => {
        if (err) throw err;
        setupStaticConfig(prefix);
        console.log(`moved public/ directory to staging/${prefix}`);
      });
    });
    // remove build object from queue
    QUEUE.pop();
    BUILDS[prefix]['status'] = 'complete';
    BUILDS[prefix]['message'] = 'last build completed on ' + new Date().toLocaleString();
    BUILDS[prefix]['url'] = `https://snooty-test.docs.staging.mongodb.sh/${prefix}/index.html`;
    // move on to next build
    processQueue();
  });
};

// being build
app.post('/build', (req, res) => { 
  // make sure params are all set
  const stitch_id = req.body.stitch_id;
  const namespace = req.body.namespace;
  const prefix = req.body.prefix;
  if (!stitch_id || !namespace || !prefix) {
    res.json({ 'status': 'error', 'message': 'incorrect params' });
  } else {
    addToQueue({
      httpInfo: { req, res },
      buildInfo: { stitch_id, namespace, prefix }
    });
    res.json({ 'status': 'success', 'message': `added build object to queue, check status at route /status/${prefix}` });
    processQueue();
  }
});

// get status of build
app.get('/status/:namespace*', (req, res) => { 
  let fullPrefixPath;
  if (req.params) {
    fullPrefixPath = req.params.namespace + req.params[0];
  }
  getStatus(req, res, fullPrefixPath);
});

server.listen(8080, () => {
  console.log(`Server running on http://localhost:8080`);
});


