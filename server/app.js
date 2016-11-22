var express = require('express');
var serveIndex = require('serve-index');
var app = express();

app.use('/', serveIndex(__dirname + '/public', {'icons': true}))
app.use('/blockly', serveIndex('/root/lib/blockly', {'icons': true}))

app.use('/', express.static('public'));
app.use('/js', express.static('public/js'));
app.use('/css', express.static('public/css'));
app.use('/blockly', express.static('/root/lib/blockly'));
app.use('/blockly/media', express.static('/root/lib/blockly/media'));

var server = app.listen(8080, function() {
    console.log('Express is listening to http://localhost:8080');
});
