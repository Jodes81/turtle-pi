
module.exports = function(app)
{
    var express = require('express');
    var serveIndex = require('serve-index');

    var clientRoot = __dirname+'/../../client';
    var blocklyRoot = '/root/lib/blockly';
    
    app.use('/',        express.static(clientRoot));
    app.use('/blockly', express.static(blocklyRoot));

    // ORDER MATTERS, otherwise blockly directory will not be shown in root listing 
    app.use('/blockly', serveIndex('/root/lib/blockly', {'icons': true}));
    app.use('/',        serveIndex(clientRoot,          {'icons': true}));

    

/*
    // make all files in ./public VISIBLE at the web root
    app.use('/', serveIndex(__dirname + '../client', {'icons': true}));
    // make all files in /root/lib/blockly VISIBLE in [webroot]/blockly
    app.use('/blockly', serveIndex('/root/lib/blockly', {'icons': true}));

    // ============== Map filesystem to urls ====================

    // make all files in ./public ACCESSIBLE at the web root (/)
    app.use('/', express.static('../client'));
    // make all files in ./public/js ACCESSIBLE in [webroot]/js
    app.use('/js', express.static('client/js'));
    // make all files in ./public/lib ACCESSIBLE in [webroot]/lib
    app.use('/lib', express.static('client/lib'));
    // make all files in ./public/css ACCESSIBLE in [webroot]/css
    app.use('/css', express.static('client/css'));
    // make all files in /root/lib/blockly ACCESSIBLE in [webroot]/blockly
    app.use('/blockly', express.static('/root/lib/blockly'));
    // make all files in /root/lib/blockly/media ACCESSIBLE in [webroot]/blockly/media
    app.use('/blockly/media', express.static('/root/lib/blockly/media'));

*/
};

