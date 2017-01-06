
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
    
    
};
ProgManager.prototype.load = function()
{
    this.conf.serverConn.send(JSON.stringify({
        msgFor: "progManager",
        name: "initRequest",
        value: ""
    }));
};
ProgManager.prototype.createProgram = function(conf)
{
    if (typeof this.programs[conf.id] !== "undefined")
    {
        console.info("Someone deleted this program we're editing, so we restored it... "+
            "in theory anyway. Otherwise something majorly wrong happened. id=", conf.id);
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
//        case "setIsActiveProg":
//            this.programs[msg.value.id].setActive(msg.value.active);
//            break;
        case "setIsActiveProg":
        case "updateProg":
            this.programs[msg.value.id].update(msg.value, msg.confirmingChangeRef);
            break;
        case "removeProg":
            if  (
                    this.conf.progEditor.isEditing && 
                    this.conf.progEditor.editingProg === this.programs[msg.value.id] &&
                    confirm("Someone deleted this program! Would you like to restore it?")
                )
            {
                this.programs[msg.value.id].restore();
                break;
            }
            this.conf.progEditor.deleteProg(this.programs[msg.value.id]);
            this.programs[msg.value.id].remove();
            delete this.programs[msg.value.id];
            break;
        case "newProg":
            this.createProgram(msg.value);// {programs:[{name: , id},{}]}
            break;
        case "noSuchProg":
            console.warn("No such program found! id=", msg.value.id);
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