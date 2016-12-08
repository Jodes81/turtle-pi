server = {
    send: function(message)
    {
        return this.wsConns.send(message);
    },
    start: function(port, onMessage){
        this.port = port;
        this.msgHandler = onMessage;
        this.load();
        this.confPaths();
        
        this.http.on('request', this.app);

        this.http.listen(
                this.port, 
                function () { 
                    console.log('Listening on ' + server.http.address().port)
                }
        );

        this.wss.on('connection', function connection(ws) {
            server.wsConns.push(ws);

            ws.on('message', server.msgHandler);
            ws.on('error', function (error) {
                console.log('cws error: %s', error);
            });

//            console.log("New web socket connection made");
//            ws.send('Hello Apollo, we hear you');
        });
    },
    load: function(){
        this.http = require('http').createServer();
        this.WebSocket = require('ws');
        this.WebSocketServer = this.WebSocket.Server;
        this.wss = new this.WebSocketServer({ server: this.http });
        this.express = require('express');
        this.serveIndex = require('serve-index');
        this.app = this.express();
    },
    confPaths: function(){
        // ============== Enable directory listings =================

        // make all files in ./public VISIBLE at the web root
        this.app.use('/', this.serveIndex(__dirname + '/public', {'icons': true}));
        // make all files in /root/lib/blockly VISIBLE in [webroot]/blockly
        this.app.use('/blockly', this.serveIndex('/root/lib/blockly', {'icons': true}));

        // ============== Map filesystem to urls ====================

        // make all files in ./public ACCESSIBLE at the web root (/)
        this.app.use('/', this.express.static('public'));
        // make all files in ./public/js ACCESSIBLE in [webroot]/js
        this.app.use('/js', this.express.static('public/js'));
        // make all files in ./public/lib ACCESSIBLE in [webroot]/lib
        this.app.use('/lib', this.express.static('public/lib'));
        // make all files in ./public/css ACCESSIBLE in [webroot]/css
        this.app.use('/css', this.express.static('public/css'));
        // make all files in /root/lib/blockly ACCESSIBLE in [webroot]/blockly
        this.app.use('/blockly', this.express.static('/root/lib/blockly'));
        // make all files in /root/lib/blockly/media ACCESSIBLE in [webroot]/blockly/media
        this.app.use('/blockly/media', this.express.static('/root/lib/blockly/media'));
    },
    wsConns: {
        conns: [],
        push: function(conn){
            this.conns.push(conn);
        },
        send: function(message){
            this.removeClosed();
//            console.log("Sending message to "+this.length()+" connections");
//            console.log(message);
            for (var i in this.conns){
                var conn = this.conns[i];
                if (
                    conn.readyState === server.WebSocket.OPEN
                ){
                    conn.send(message);
                } else {
                    console.log('Could not send message: websocket not open. ('+message+')');
                }
            }
        },
        length: function(){
            return this.conns.length;
        },
        removeClosed: function(){
            var openConns = [];
            for (var i in this.conns){
                if (
                        this.conns[i].readyState !== server.WebSocket.CLOSING &&
                        this.conns[i].readyState !== server.WebSocket.CLOSED
                ){
                    openConns.push(this.conns[i]);
                }
            }
            var num = this.conns.length-openConns.length;
            if (num) console.log("Removed "+num+" closed WebSocket connections")
            this.conns = openConns;
        }
    } // websocket connections
    
};

module.exports = server;