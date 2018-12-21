const http = require('http');
const fs = require('fs');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser'); 
const querystring = require('querystring');  
const router = express.Router({ strict: true });
const exec = require('child_process').exec;

const app = express();
app.use('/', router);
app.use(bodyParser.urlencoded({ extended: false }));  
app.use(bodyParser.json());

// static files
app.use(express.static('static'));
app.use('/static/bundle.js', express.static(__dirname + '/dist/static/bundle.js'));

const port = 8000;

// https://github.com/gatsbyjs/gatsby/issues/3485
router.get('/', (req, res) => { 
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

router.get('staging/:site/:user/:branch', (req, res) => { 
  console.log(req.params);
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
