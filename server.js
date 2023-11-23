'use strict';

const Expert = require('express');
const webhost = Expert();
const http = require('http');
const compression = require('compression');

webhost.use(compression({ threshold: 0 }));

webhost.use(
  '/',
  function (req, res, next) {
    const origin = req.get('Origin') || '*';
    res.setHeader(
      'Access-Control-Allow-Headers',
      'accept, authorization, content-type, x-requested-with'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,POST');
    res.setHeader('Access-Control-Allow-Origin', origin);

    next();
  },
  Expert.static('dist')
);

const httpServer = http.createServer(webhost);

httpServer.listen(process.env.PORT || 3000);

console.log(`running React365:${process.argv[1]} ......`);
