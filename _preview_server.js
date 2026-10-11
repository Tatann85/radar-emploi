const http = require('http');
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '_site');
http.createServer(function (req, res) {
  var p = path.join(dir, req.url === '/' ? 'index.html' : req.url);
  fs.readFile(p, function (err, data) {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
}).listen(8891, '127.0.0.1', function () {
  console.log('preview on http://127.0.0.1:8891/');
});
