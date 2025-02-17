const http = require('http');
const query = require('querystring');
const htmlResponses = require('./htmlResponses.js');
const jsonResponses = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const getRouter = {
  '/': htmlResponses.getIndex,
  '/style.css': htmlResponses.getCSS,
  '/getUsers': jsonResponses.getUsers,
  notFound: jsonResponses.notFound,
};

const parseBody = (req, res, handler) => {
  const body = [];

  req.on('error', (err) => {
    console.dir(err);
    res.statusCode = 400;
    res.end();
  });

  req.on('data', (chunk) => {
    body.push(chunk);
  });

  req.on('end', () => {
    const bodyString = Buffer.concat(body).toString();
    req.body = query.parse(bodyString);

    handler(req, res);
  });
};

const handlePost = (req, res, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    parseBody(req, res, jsonResponses.addUser);
  }
};

const handleGet = (req, res, parsedUrl) => {
  if (getRouter[parsedUrl.pathname]) {
    getRouter[parsedUrl.pathname](req, res);
  } else {
    getRouter.notFound(req, res);
  }
};

const handler = (req, res) => {
  const protocol = req.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(req.url, `${protocol}://${req.headers.host}`);

  if (req.method === 'POST') {
    handlePost(req, res, parsedUrl);
  } else {
    handleGet(req, res, parsedUrl);
  }
};

http.createServer(handler).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
