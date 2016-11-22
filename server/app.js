var express = require('express');
var serveIndex = require('serve-index');
var app = express();

// ==========================================================
// ============== Enable directory listings =================
// ==========================================================

// make all files in ./public VISIBLE at the web root
app.use('/', serveIndex(__dirname + '/public', {'icons': true}))

// make all files in /root/lib/blockly VISIBLE in [webroot]/blockly
app.use('/blockly', serveIndex('/root/lib/blockly', {'icons': true}))

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

var server = app.listen(8080, function() {
    console.log('Express is listening to http://localhost:8080');
});
