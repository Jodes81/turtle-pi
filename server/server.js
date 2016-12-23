server = {
    queuedMessages: [],
    messageListeners: [],
    connectionListeners: [],
    nextConnNum: 0, // Not currently USED. (Solely implemented).
//    nextUpdateNum: 0, // so clients can identify whether an update is one it made or a different client
    send: function(message)
    {
        return server.wsConns.send(message);
    },
    queueMessage: function(message){
        this.queuedMessages.push(message);
    },
    sendQueuedMessages: function(){
        server.sendMessageSet(this.queuedMessages);
        server.queuedMessages = [];
    },
    sendMessageSet: function(messages)
    {
        return server.send(JSON.stringify(messages));
    },
    sendSingleMessage: function(message)
    {
//        console.log("Sending ", message);
        return server.sendMessageSet([message]);
    },
    addMessageListener: function(conf){
        if (typeof server.messageListeners[conf.msgFor] === "undefined") 
        {
            server.messageListeners[conf.msgFor] = [];
        }
        server.messageListeners[conf.msgFor].push(conf);
    },
    wsConns: {
        conns: [],
        push: function(wsConn){
            this.conns.push(wsConn);
        },
        send: function(message){
            this.removeClosed();
//            console.log("Sending message to "+this.length()+" connections");
//            console.log(message);
            for (var i in this.conns){
                var conn = this.conns[i];
                if (
                    conn.ws.readyState === server.WebSocket.OPEN
                ){
                    conn.ws.send(message);
                } else {
                    console.warn('Could not send message: websocket not open. ('+message+')');
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
                        this.conns[i].ws.readyState !== server.WebSocket.CLOSING &&
                        this.conns[i].ws.readyState !== server.WebSocket.CLOSED
                ){
                    openConns.push(this.conns[i]);
                }
            }
            var num = this.conns.length-openConns.length;
            if (num) console.info("Removed "+num+" closed WebSocket connections")
            this.conns = openConns;
        }
    }, // websocket connections
    addConnectionListener: function(fn){
        this.connectionListeners.push(fn);
    },
    start: function(port, onMessage, onConnection){
        this.port = port;
        this.onMessage = onMessage;
        this.onConnection = function(ws){
            onConnection(server);
            for (var i in server.connectionListeners){
                server.connectionListeners[i](server);
            }
        };
        this.load();
        this.confPaths();
        
        this.http.on('request', this.app);

        this.http.listen(
                this.port, 
                function () { 
                    console.log('Listening on ' + server.http.address().port);
                }
        );

        this.wss.on('connection', function(ws)
        {
            var conn = {ws: ws, connNum: server.nextConnNum};
            server.nextConnNum++;
            server.wsConns.push(conn);
            console.info("New connection");
            
//            ws.send(JSON.stringify([{msgFor:"", name:"", value:""}]));
            ws.on('message', function(str){
                server.onMessage(str);
                try {
                    var msg = JSON.parse(str);
                } catch (e) {
                    console.warn("JSON could not be parsed:"+str);
                } finally {
                    if (!Object.keys(server.messageListeners).length){
                        console.warn ("No listeners. ", str);
                    } else {
                        var listeners = server.messageListeners[msg.msgFor];
                        if (!listeners.length){
                            console.warn ("No listeners found for " + msg.msgFor);
                        } else {
                            for (var i in listeners)
                            {
                                listeners[i].onMessage(msg);
                            }
                        }
                    }
                }
            });
            ws.on('error', function (error) {
                console.warn('cws error: %s', error);
            });
            

            server.onConnection(ws);
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
    
};

module.exports = server;