var conf = require("./conf");
var server = require("./modules/server");
var programs = require("./modules/programs");
var db = require("./modules/db");
var Turtle = require("./modules/turtle");
var JSISandbox = require("./modules/jsisandbox");
var hardware = require("./modules/hw");

console.log("\n-------------- Loading app --------------\n");

server.start(conf.port, function onMessage(str){
//    console.log("--Message Rx--", str);
}, function onConnection(svr){});

var sandbox = new JSISandbox({
    finished: function(){
        programs.stopActiveProgram();
    }
},{
    green_led: [hardware, hardware.green_led ]
});

programs.init({
    db: db, 
    server: server,
    onRun: function(js){
        sandbox.run(js);
    },
    onStop: function(){
        sandbox.stop();
    }
});

hardware.setup(conf);

var turtle = new Turtle({ 
    server: server,
    hardware: hardware
});




/*
var code = "for (var i = 0; i < 1; i++){\
                    green_led(1);\
                    sleep(500);\
                    green_led(0);\
                    sleep(500);\
                }";
function guiCommandButton(name, value){
    switch(name)
    {
        case "RunEval":
            console.log("Running Eval");
            Fiber(function(){
                eval(code);
            }).run();
            break;
        case "RunVM2":
            sandbox.run(code);
            break;
        case "StopVM2":
            sandbox.stop();
            break;
        case "ResetVM2Fiber":
            sandbox.reset();
            break;
        case "RunJSInterpreter":
            sandbox.run(code);
            break;
        default:
            console.log("Button not recognised: "+name);
            break;
    }
}
server.start(conf.port, 
function(str){
    try {
        var o = JSON.parse(str);
        switch(o.msgFor){
            case "wheel":
                turtle.setWheelDirection(o.name, o.value);
                break;
            case "guiCommandButton":
                guiCommandButton(o.name, o.value);
                break;
            case "cmdButtonManager":
                cmdButtonManager(o.name, o.value);
                break;
            default:
                console.log("Unknown msgFor:" + o.msgFor);
                break;
        }
    } catch (e) {
        console.log("Problem handling received message: \n", e);
    }
}, 
function(ws){
    ws.send(turtle.stateAsMessage());
});

*/
