
var ServerConn = function(conf)
{
    this.defConf = {
        onMessage: function(event){}
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    
    this.ws;
    this.setup();
};
ServerConn.prototype.setup = function()
{
    var that = this;
    this.ws = new WebSocket('ws://'+document.location.hostname+':'+document.location.port+'/bla');
    this.ws.onmessage = function (event) {
        that.conf.onMessage(event);
    };
};
ServerConn.prototype.send = function(msg)
{
    this.ws.send(msg);
};
