'use strict';

const fs = require('fs');
const Expert = require('express');
// TODO: CORS might not be necessary for this server
const webhost = Expert();
const http = require('http');
const https = require('https');
const compression = require('compression');

const privateKey = fs.readFileSync('./config/cert/localhost-key.pem', 'utf8');
const certificate = fs.readFileSync('./config/cert/localhost.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

webhost.use(compression({ threshold: 0 }));

webhost.use(function (req, res, next) {
  const origin = req.get('Origin') || '*';
  res.setHeader(
    'Access-Control-Allow-Headers',
    'accept, authorization, content-type, x-requested-with'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,POST');
  res.setHeader('Access-Control-Allow-Origin', origin);

  next();
}, Expert.static('dist'));

const httpServer = http.createServer(webhost);
const httpsServer = https.createServer(credentials, webhost);

httpServer.listen(process.env.PORT || 3000);
httpsServer.listen(process.env.PORT || 3443);

console.log(`running React365:${process.argv[1]} ......`);
