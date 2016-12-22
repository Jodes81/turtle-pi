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
                {
                    commands.db.store("buttons", [],function(stuff){
                        commands.buttons = [];
                    });
                }
                else
                {
                    commands.buttons = val;
                }
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
        var messages = [];
        if (this.activeCommand != null){
            messages.push({
                msgFor: "cmdButtonManager",
                name: "setIsActiveCmd",
                value: {
                    id: this.activeCommand,
                    active: false
                }
            });
        }
        messages.push({
            msgFor: "cmdButtonManager",
            name: "setIsActiveCmd",
            value: {
                id: value.id,
                active: true
            }
        });
        this.activeCommand = value.id;
        commands.server.sendMessageSet(messages);
        this.getButton(this.activeCommand, function(button)
        {
            that.onStop();
            that.onRun(button.js);
        });
    },
    stopCommand: function(value)
    {
        this.activeCommand = null;
        commands.server.sendSingleMessage({
            msgFor: "cmdButtonManager",
            name: "setIsActiveCmd",
            value: {
                id: value.id,
                active: false
            }
        });
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
                    case "runCmd":
                        commands.runCommand(value);
                        break;
                    case "stopCmd":
                        commands.stopCommand(value);
                        break;
                    case "newCmd":
                        commands.newCommand();
                        break;
                    case "modifyCmd":
                        commands.modifyCommand(value);
                        break;
                    case "deleteCmd":
                        commands.deleteCommand(value);
                        break;
                    case "initRequest":
                        commands.initRequest();
                        break;
                    default:
                        console.warn("Unknown msg name: "+name);
                        break;
                }
                break;
            case "cmd":
                
                break;
            default:
                console.warn("Unknown msgFor: "+msgFor);
                break;
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
            commands.server.send(JSON.stringify([{
                msgFor: "cmdButtonManager",
                name: "initResponse",
                value: {
                    buttons: buttons 
                }
            }]));
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

            commands.server.sendSingleMessage({
                msgFor: "cmdButtonManager",
                name: "newCmd",
                value: {
                    name: name,
                    id: id
                }
            });
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
            commands.server.sendSingleMessage({
                msgFor: "cmdButtonManager",
                name: "updateCmd",
                value: button
            });
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
            commands.server.sendSingleMessage({
                msgFor: "cmdButtonManager",
                name: "removeCmd",
                value: button
            });
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
};


module.exports = commands;
