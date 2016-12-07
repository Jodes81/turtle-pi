
var Server = function(conf)
{
    this.defConf = {
        onMessage: function(event){}
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    
    this.ws;
    this.setup();
};
Server.prototype.setup = function()
{
    var that = this;
    this.ws = new WebSocket('ws://'+document.location.hostname+':'+document.location.port+'/bla');
    this.ws.onmessage = function (event) {
        that.conf.onMessage(event);
    };
};
Server.prototype.send = function(msg)
{
    this.ws.send(msg);
};
