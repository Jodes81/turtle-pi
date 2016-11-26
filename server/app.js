var server = require('http').createServer();
var url = require('url');
var WebSocketServer = require('ws').Server;
var express = require('express');
var serveIndex = require('serve-index');
var wpi = require('wiring-pi');
var app = express();
var wss = new WebSocketServer({ server: server });
var port = 8080;

// ==========================================================
// ============== Enable directory listings =================
// ==========================================================

// make all files in ./public VISIBLE at the web root
app.use('/', serveIndex(__dirname + '/public', {'icons': true}));
// make all files in /root/lib/blockly VISIBLE in [webroot]/blockly
app.use('/blockly', serveIndex('/root/lib/blockly', {'icons': true}));

// ==========================================================
// ============== Map filesystem to urls ====================
// ==========================================================

// make all files in ./public ACCESSIBLE at the web root (/)
app.use('/', express.static('public'));
// make all files in ./public/js ACCESSIBLE in [webroot]/js
app.use('/js', express.static('public/js'));
// make all files in ./public/css ACCESSIBLE in [webroot]/css
app.use('/css', express.static('public/css'));
// make all files in /root/lib/blockly ACCESSIBLE in [webroot]/blockly
app.use('/blockly', express.static('/root/lib/blockly'));
// make all files in /root/lib/blockly/media ACCESSIBLE in [webroot]/blockly/media
app.use('/blockly/media', express.static('/root/lib/blockly/media'));

// ==========================================================
// ============== Start the server ==========================
// ==========================================================

server.on('request', app);

server.listen(port, function () { console.log('Listening on ' + server.address().port) });

wss.on('connection', function connection(ws) {
 
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send('Hello back!');
  });
 
  ws.send('Hello Apollo, we hear you');
});

/*
console.log('Initting wiringPi......');
wpi.wiringPiSetup();
wpi.pinMode(4, wpi.OUTPUT);
wpi.digitalWrite(4, 1);
 */

