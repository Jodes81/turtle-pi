var utils = require("./utils"); // not sure why this path works but hey (See top of jsisandbox.js and app.js)

var programs = 
{
    activeProgram: null,
    programs: null,
    init: function(conf){
        programs.db = conf.db;
        programs.server = conf.server;
        programs.onRun = conf.onRun;
        programs.onStop = conf.onStop;
        
        programs.db.addOnReady(function(){
            programs.db.retrieve("programs", function(val)
            {
                if (typeof val === "undefined")
                    programs.db.store("programs", [],function(stuff){
                        programs.programs = [];
                    });
                else programs.programs = val;
            });
        });
        programs.server.addMessageListener({ msgFor: "progManager", onMessage: function(o, conn){
            switch (o.name)
            {
                case "runProg":  programs.runProgram(o.value);                  break;
                case "stopProg": programs.stopProgram(o.value);                 break;
                case "newProg": programs.newProgram(o.value);                   break;
                case "modifyProg": programs.modifyProgram(o.value, o.changeRef);break;
                case "deleteProg": programs.deleteProgram(o.value);             break;
                case "initRequest": programs.initRequest(conn);                 break;
                default: console.warn("Unknown msg name: "+o.name);             break;
            }
        }});
        
    },
    runProgram: function(value)
    {
        var that = this;
        if (this.activeProgram != null){
            programs.queueMessage({ name: "setIsActiveProg",
                value: {
                    id: this.activeProgram,
                    active: false
                }
            });
        }
        programs.queueMessage({ name: "setIsActiveProg",
            value: {
                id: value.id,
                active: true
            }
        });
        this.activeProgram = value.id;
        programs.sendQueuedMessages();
        
        this.getProgram(this.activeProgram, function(program)
        {
            // SHIT. This check should be run BEFORE the above!!!!
            // WHAT A MESS. this.activeProgram would be null?!!?
            if (program == null){
                console.warn("runProgram: Program not found! id=" + this.activeProgram);
                programs.programNotFound(this.activeProgram);
                return;
            } 
            that.onStop();
            that.onRun(program.js);
        });
    },
    stopProgram: function(value)
    {
        this.activeProgram = null;
        programs.queueMessage({ name: "setIsActiveProg", 
            value: {
                id: value.id,
                active: false
            }
        });
        programs.sendQueuedMessages();
        this.activeProgram = value.id;
        this.onStop();
    },
    stopActiveProgram: function()
    {
        if (this.activeProgram != null){
            this.stopProgram({id: this.activeProgram});
        }
    },
    getPrograms: function(onDone)
    {
        programs.db.retrieve("programs", onDone);
    },
    initRequest: function(conn)
    {
        programs.getPrograms(function(progs)
        {
            programs.queueMessage({ name: "initResponse",
                value: {
                    programs: progs 
                }
            }, conn);
            programs.sendQueuedMessages();
        });
    },
    newProgram: function(value)
    {
        programs.getPrograms(function(progs)
        {
            var id, name;
            var xml = "<xml></xml>";
            if (typeof value.id === "undefined")
            {
                var num = progs.length;
                var next = num++;
                id = "prog"+next;
                name = "No Name! #"+next;
            }
            else
            {
                id = value.id;
                name = (typeof value.name === "undefined") ? id : value.name;
                xml = (typeof value.xml === "undefined") ? xml : value.xml;
            }
            progs.push({
                name: name,
                id: id,
                xml: xml
            });
            
            programs.db.store("programs", progs, function(){});

            programs.queueMessage({ name: "newProg",
                value: {
                    name: name,
                    id: id,
                    xml: xml
                }
            });
            programs.sendQueuedMessages();
        });
    },
    modifyProgram: function(value, changeRef)
    {
        programs.getProgram(value.id, function(program, progs, i)
        {
            if (program == null){
                console.warn("modifyProgram: Program not found! id=" + value.id);
                programs.programNotFound(value.id);
                return;
            } 
            utils.update(program, value);
            programs.db.store("programs", progs, function(){});
            programs.queueMessage({ name: "updateProg",
                value: program,
                confirmingChangeRef: changeRef
            });
            programs.sendQueuedMessages();
        });
    },
    programNotFound: function(programId)
    {
        programs.queueMessage({ name: "noSuchProg",
            value: {id: programId}
        });
        programs.sendQueuedMessages();
    },
    deleteProgram: function(value)
    {
        // TO DO: Check program is not running!!!!!
        programs.getProgram(value.id, function(program, progs, i)
        {
            if (program == null){
                console.warn("deleteProgram: Program not found! id=" + value.id);
                return;
            } 
            progs.splice(i, 1);
            programs.db.store("programs", progs, function(){});
            programs.queueMessage({ name: "removeProg",
                value: program
            });
            programs.sendQueuedMessages();
        });
    },
    getProgram: function(id, onDone)
    {
        programs.getPrograms(function(progs){
            for (var i in progs){
                if (progs[i].id == id){
                    onDone(progs[i], progs, i);
                    return;
                }
            }
            onDone(null, progs);
        });
    },
    queueMessage: function(message, conn){
        message.msgFor = "progManager";
        if (typeof conn == "undefined"){
            programs.server.queueMessage(message);
        } else {
            conn.queueMessage(message);
        }
    },
    sendQueuedMessages: function(){
        programs.server.sendQueuedMessages();
    },
};


module.exports = programs;
