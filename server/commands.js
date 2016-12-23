var utils = require("./utils");

var commands = 
{
    activeCommand: null,
    buttons: null,
    init: function(conf){
        commands.db = conf.db;
        commands.server = conf.server;
        commands.onRun = conf.onRun;
        commands.onStop = conf.onStop;
        
        commands.db.onReady(function(){
            commands.db.retrieve("buttons", function(val)
            {
                if (typeof val === "undefined")
                    commands.db.store("buttons", [],function(stuff){
                        commands.buttons = [];
                    });
                else commands.buttons = val;
            });
        });
        commands.server.addMessageListener({ msgFor: "cmdButtonManager", onMessage: function(o){
            commands.msgRx(o.msgFor, o.name, o.value);
        }});
        commands.server.addMessageListener({ msgFor: "cmd", onMessage: function(o){
            commands.msgRx(o.msgFor, o.name, o.value);
        }});
        
    },
    runCommand: function(value)
    {
        var that = this;
        if (this.activeCommand != null){
            commands.queueMessage({ name: "setIsActiveCmd",
                value: {
                    id: this.activeCommand,
                    active: false
                }
            });
        }
        commands.queueMessage({ name: "setIsActiveCmd",
            value: {
                id: value.id,
                active: true
            }
        });
        this.activeCommand = value.id;
        commands.sendQueuedMessages();
        this.getButton(this.activeCommand, function(button)
        {
            that.onStop();
            that.onRun(button.js);
        });
    },
    stopCommand: function(value)
    {
        this.activeCommand = null;
        commands.queueMessage({ name: "setIsActiveCmd", 
            value: {
                id: value.id,
                active: false
            }
        });
        commands.sendQueuedMessages();
        this.activeCommand = value.id;
        this.onStop();
    },
    stopActiveCommand: function()
    {
        if (this.activeCommand != null){
            this.stopCommand({id: this.activeCommand});
        }
    },
    msgRx: function(msgFor, name, value)
    {
        switch(msgFor){
            case "cmdButtonManager":
                switch (name)
                {
                    case "runCmd":  commands.runCommand(value);             break;
                    case "stopCmd": commands.stopCommand(value);            break;
                    case "newCmd": commands.newCommand();                   break;
                    case "modifyCmd": commands.modifyCommand(value);        break;
                    case "deleteCmd": commands.deleteCommand(value);        break;
                    case "initRequest": commands.initRequest();             break;
                    default: console.warn("Unknown msg name: "+name);       break;
                }
                break;
            default: console.warn("Unknown msgFor: "+msgFor); break;
        }
    },
    getButtons: function(onDone)
    {
        commands.db.retrieve("buttons", onDone);
    },
    initRequest: function()
    {
        commands.getButtons(function(buttons)
        {
            commands.queueMessage({ name: "initResponse",
                value: {
                    buttons: buttons 
                }
            });
            commands.sendQueuedMessages();
        });
    },
    newCommand: function()
    {
        commands.getButtons(function(buttons)
        {
            var num = buttons.length;
            var next = num++;
            var name = "No Name! #"+next;
            var id = "cmd"+next;

            buttons.push({
                name: name,
                id: id,
                xml: "<xml></xml>"
            });
            
            commands.db.store("buttons", buttons, function(){});

            commands.queueMessage({ name: "newCmd",
                value: {
                    name: name,
                    id: id
                }
            });
            commands.sendQueuedMessages();
        });
    },
    modifyCommand: function(value)
    {
        commands.getButton(value.id, function(button, buttons, i)
        {
            if (button == null){
                console.warn("modifyCommand: Button not found! id=" + value.id, buttons);
                return;
            } 
            utils.update(button, value);
            commands.db.store("buttons", buttons, function(){});
            commands.queueMessage({ name: "updateCmd",
                value: button
            });
            commands.sendQueuedMessages();
        });
    },
    deleteCommand: function(value)
    {
        commands.getButton(value.id, function(button, buttons, i)
        {
            if (button == null){
                console.warn("deleteCommand: Button not found! id=" + value.id, buttons);
                return;
            } 
            buttons.splice(i, 1);
            commands.db.store("buttons", buttons, function(){});
            commands.queueMessage({ name: "removeCmd",
                value: button
            });
            commands.sendQueuedMessages();
        });
    },
    getButton: function(id, onDone)
    {
        commands.getButtons(function(buttons){
            for (var i in buttons){
                if (buttons[i].id == id){
                    onDone(buttons[i], buttons, i);
                    return;
                }
            }
            onDone(null, buttons);
        });
    },
    queueMessage: function(message){
        message.msgFor = "cmdButtonManager";
        commands.server.queueMessage(message);
    },
    sendQueuedMessages: function(){
        commands.server.sendQueuedMessages();
    },
};


module.exports = commands;
