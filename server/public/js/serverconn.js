
var ServerConn = function(conf)
{
    this.wasClosed = false;
    this.isOpen = false;
    this.sendQueue = [];
    this.messageListeners = [];
    this.closeListeners = [];
    this.openListeners = [];
    this.defConf = {
        onMessages: function(msgs){},
        onOpen: function(event){},
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    
    this.addOpenListener(this.conf.onOpen);
    this.ws;
    this.setup();
};
ServerConn.prototype.testConn = function(fn)
{
    
    var test_ws = new WebSocket('ws://'+document.location.hostname+':'+document.location.port+'/bla');
    test_ws.onopen = function(event){
        test_ws.onclose = null;
        test_ws.close();
        fn(true);
    };
    test_ws.onclose = function(event){
        fn(false);
    };
};
ServerConn.prototype.setup = function()
{
    var serverConn = this;
    this.ws = new WebSocket('ws://'+document.location.hostname+':'+document.location.port+'/bla');
    this.ws.onopen = function(event)
    {
        serverConn.isOpen = true;
        for (var i in serverConn.openListeners){
            serverConn.openListeners[i](event);
        }
        if (serverConn.sendQueue.length) console.info("Sending " + serverConn.sendQueue.length + " queued messages.");
        serverConn.sendQueued();
    };
    this.ws.onclose = function(event){
        serverConn.wasClosed = true;
        for (var i in serverConn.closeListeners){
            serverConn.closeListeners[i](event);
        }
    };
    this.ws.onmessage = function (event) {
        try {
            msgs = JSON.parse(event.data);
        } catch (e) {
            console.log("JSON could not be parsed:"+event.data);
        } finally {
            serverConn.conf.onMessages(msgs);
            for (var i in msgs)
            {
                var listeners = serverConn.messageListeners[msgs[i].msgFor];
                for (var j in listeners)
                {
                    listeners[j].onMessage(msgs[i]);
                }
            }
            
        }
    };
};
ServerConn.prototype.sendMessage = function(msg)
{
    this.send(JSON.stringify(msg));
};
ServerConn.prototype.send = function(str)
{
    this.sendQueue.push(str);
    this.sendQueued();
};
ServerConn.prototype.sendQueued = function()
{
    if (this.isOpen)
    {
        for (var i in this.sendQueue)
            this.ws.send(this.sendQueue[i]);
        this.sendQueue = [];
    }
    else console.info("Could not send queued message(s) yet.");
};
ServerConn.prototype.addMessageListener = function(conf)
{
    if (typeof this.messageListeners[conf.msgFor] === "undefined") 
    {
        this.messageListeners[conf.msgFor] = [];
    }
    this.messageListeners[conf.msgFor].push(conf);
};
ServerConn.prototype.addCloseListener = function(fn)
{
    this.closeListeners.push(fn);
};
ServerConn.prototype.addOpenListener = function(fn)
{
    this.openListeners.push(fn);
};
