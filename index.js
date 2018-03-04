const http = require('http');
const port = process.env.PORT || 8080;

var googleTTS = require('google-tts-api');

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

  if(!_GET.q) {
      res.statusCode = 400;
      res.end('Missing parameter q');
  }
  var speed = parseFloat(_GET.ttsspeed);
  if(isNaN(speed)) {
      speed = 1;
  }
  googleTTS(decodeURIComponent(_GET.q), _GET.tl || "en", speed)   // speed normal = 1 (default), slow = 0.24
    .then(function (url) {
      res.end(url);
    })
    .catch(function (err) {
      if(err instanceof RangeError || err instanceof TypeError) {
        res.statusCode = 400;
        res.end(err.message);
      } else {
        console.error(err.stack);
        res.statusCode = 500;
        res.end(err.message);
      }
    });
};

// Start server
const server = http.createServer(requestHandler);
server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${port}`);
});