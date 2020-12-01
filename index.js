const http      = require('http'),
      https     = require('https'),
      urlParse  = require('url').parse;

function params(href) {
    var hash = href.indexOf('#');
    if(hash != -1) {
        href = href.substr(0, hash);
    }
    var vars = {};
    href.replace( 
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function( m, key, value ) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );
    return vars;
}

// Handle requests
const requestHandler = (req, res) => {
  var _GET = params(req.url);

  res.setHeader('Access-Control-Allow-Origin', req.headers.origin ? req.headers.origin : '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Check parameters
  if(!_GET.q) {
      res.statusCode = 400;
      res.end('Missing parameter q');
  }
  var speed = parseFloat(_GET.ttsspeed);
  if(isNaN(speed)) {
      speed = 1;
  }

  // Retrieve mp3's url
  // speed normal = 1 (default), slow = 0.24
  let url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${_GET.tl || "en"}&client=tw-ob&q=${_GET.q}&tk=${Math.floor(Math.random() * 1000000)}&ttsspeed=${speed}`;

  if(typeof _GET.download != "undefined") {
    var info = urlParse(url);

    var request = https.get({
      host: info.host,
      path: info.path,
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:58.0) Gecko/20100101 Firefox/58.0'
      }

    }, function (proxyRes) {
      ['date', 'expires', 'content-type', 'content-length'].forEach(k => {
        res.setHeader(k, proxyRes.headers[k]);
      });
      proxyRes.on('data', function (chunk) {
          res.write(chunk, 'binary');
      });
      proxyRes.on('end', function () {
          res.end();
      });
    });

    request.on('error', function(err) {
        console.error(err.reason);
        res.statusCode = 500;
        res.end(err.reason);
    });

  } else {
    res.end(url);
  }
};

// Start server
const server = http.createServer(requestHandler);
const port   = process.env.PORT || 8080;

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});