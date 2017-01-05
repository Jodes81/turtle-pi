
var ProgManager = function(conf)
{
    this.defConf = {
        controlsContainerSelector: ".prog-utils-container",
        programContainerSelector: "#prog-container", 
        serverConn: null,
        blocklyDialogSelector: "div.blockly",
        progEditor: null
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    
    var that = this;
    this.programs = {};
    $(this.conf.controlsContainerSelector+" .add").on("click", function(){
        that.conf.serverConn.sendMessage({
            msgFor: "progManager",
            name: "newProg",
            value: ""
        });
    });
    
    this.conf.serverConn.addMessageListener({
        msgFor: "progManager", 
        onMessage: function(msg){
            that.msgRx(msg);
        }
    });
    
    function animatePlay(){
        $('.icon-program-play').css("color", "#000");
        setTimeout(function(){
            $('.icon-program-play').css("color", "#ccc");
            setTimeout(function(){
                animatePlay();
            }, 300);
        }, 300);
        /*
        $('.icon-program-play').animate({
            color: "#000"
        }, 300).animate({
            color: "#ccc"
        }, 300, function(){ play_animate(); });
        */
    }
    animatePlay();
    
};
ProgManager.prototype.load = function()
{
//    console.log("ProgManager.load() (send(initRequest))");
    this.conf.serverConn.send(JSON.stringify({
        msgFor: "progManager",
        name: "initRequest",
        value: ""
    }));
};
ProgManager.prototype.createProgram = function(conf)
{
    // might be called if no such prog was found when modifying, so a client sent it to be restored and it comes back.
    if (typeof this.programs[conf.id] !== "undefined")
    {
        console.info("Someone deleted this program we're editing, so we restored it... in theory anyway. Otherwise something majorly wrong happened", conf.id, this.programs[conf.id]);
        return;
    } 
    var cb = new Prog({
        id: conf.id,
        name: conf.name,
        js: conf.js,
        xml: conf.xml,
        containerSelector: this.conf.programContainerSelector,
        progEditor: this.conf.progEditor,
        serverConn: this.conf.serverConn
    });
    this.programs[cb.id] = cb;
};
ProgManager.prototype.msgRx = function(msg)
{
    switch (msg.name)
    {
        case "setIsActiveProg":
            this.programs[msg.value.id].setActive(msg.value.active);
            break;
        case "updateProg":
            this.programs[msg.value.id].update(msg.value, msg.confirmingChangeRef);
            break;
        case "removeProg":
            this.programs[msg.value.id].remove();
            delete this.programs[msg.value.id];
            break;
        case "newProg":
            this.createProgram(msg.value);// {programs:[{name: , id},{}]}
            break;
        case "noSuchProg":
//            this.programs[msg.value.id].restore();
            break;
        case "initResponse":
            var response = msg.value; // {programs:[{name: , id},{}]}
            for (var i in response.programs)
            {
                this.createProgram(response.programs[i]); //{name: , id}
            }
            break;
        default:
            console.error("Unknown message name: "+msg.name);
            break;
    }
};