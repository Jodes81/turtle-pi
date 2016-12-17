
var CmdButtonManager = function(conf)
{
    this.defConf = {
        controlsContainerSelector: ".cmd-button-utils-container",
        buttonContainerSelector: "#cmd-button-container", 
        serverConn: null,
        blocklyDialogSelector: "div.blockly",
        cmdEditor: null
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    
    var that = this;
    this.buttons = {};
    $(this.conf.controlsContainerSelector+" .add").on("click", function(){
        that.conf.serverConn.sendMessage({
            msgFor: "cmdButtonManager",
            name: "newCmd",
            value: ""
        });
    });
    
    this.conf.serverConn.addMessageListener({
        msgFor: "cmdButtonManager", 
        onMessage: function(msg){
            that.msgRx(msg);
        }
    });
    
    function animatePlay(){
        $('.icon-button-play').css("color", "#000");
        setTimeout(function(){
            $('.icon-button-play').css("color", "#ccc");
            setTimeout(function(){
                animatePlay();
            }, 300);
        }, 300);
        /*
        $('.icon-button-play').animate({
            color: "#000"
        }, 300).animate({
            color: "#ccc"
        }, 300, function(){ play_animate(); });
        */
    }
    animatePlay();
    
};
CmdButtonManager.prototype.load = function()
{
    this.conf.serverConn.send(JSON.stringify({
        msgFor: "cmdButtonManager",
        name: "initRequest",
        value: ""
    }));
};
CmdButtonManager.prototype.createButton = function(conf)
{
    var that = this;
    var cb = new CmdButton({
        id: conf.id,
        name: conf.name,
        containerSelector: that.conf.buttonContainerSelector,
        cmdEditor: that.conf.cmdEditor,
        serverConn: that.conf.serverConn
    });
    this.buttons[cb.id] = cb;
};
CmdButtonManager.prototype.msgRx = function(msg)
{
    switch (msg.name)
    {
        case "setIsActiveCmd":
            this.buttons[msg.value.id].setActive(msg.value.active);
            break;
        case "updateCmd":
            this.buttons[msg.value.id].update(msg.value);
            break;
        case "removeCmd":
            this.buttons[msg.value.id].remove();
            delete this.buttons[msg.value.id];
            break;
        case "newCmd":
            this.createButton(msg.value);// {buttons:[{name: , id},{}]}
            break;
        case "initResponse":
            var response = msg.value; // {buttons:[{name: , id},{}]}
            for (var i in response.buttons)
            {
                this.createButton(response.buttons[i]); //{name: , id}
            }
            break;
        default:
            console.error("Unknown message name: "+msg.name);
            break;
    }
};