// https://www.npmjs.com/package/vm2

/*
     USAGE
 ================
var Vm2Sandbox = require("./vm2sandbox");
var sandbox = new Vm2Sandbox(Vm2Sandbox.type.VM, { green_led: green_led, });
sandbox.run("\
    for (var i = 0; i < 5; i++){\
        green_led(1);\
        sleep(500);\
        green_led(0);\
        sleep(500);\
    }\
    ");
function green_led(active){ wpi.digitalWrite(conf.LED_GREEN, active); }


THE PROBLEM WITH VM2+Fibers
===========================
What if "while(true){}" is run? If there isn't something that calls fiber.run() in
the loop then it will continue indefinitely. One easy solution is to replace all closing
braces with a function that can be used to break the loop. But what if "while(true) x();"
or simply "while(true);" is run? Then the braces are not good enough. The following 
would need to be parsed:
 - recursive functions
 - for, while (+others?)
But since the point in VM2 is to remove security issues, the infinite loop problem can be solved
by modifying code sent by blockly to have a loop-breaker. It would not stop untrustworthy code
injecting an infinite loop, but it would make every-day functionality infinite-loop-free.


Alternatives:
============
JS-Interpreter. (https://github.com/NeilFraser/JS-Interpreter)
How would this solve the various problems? Code can be stepped through one line
at a time. === But then how would sleep() be implemented? === 



*/



var Fiber = require('fibers');

function sleep(ms){
    var fiber = Fiber.current;
    setTimeout(function(){ fiber.run(); }, ms);
    Fiber.yield();
}

var Sandbox = function(type, context)
{
    this.fiberRun = null;
    this.fiber = null;
    this.vm = null;
    this.type = type;
    this.context = context;
    var defContext = {
        Fiber: Fiber,
        console: console,
        sleep: sleep,
        finished: function(){console.log("Finished");}
    };
    for (var k in defContext) this.context[k] = defContext[k];
    
    switch (type){
        case "VM":
            const {VM} = require('vm2'); // https://www.npmjs.com/package/vm2
            this.vm = new VM({
                sandbox: this.context,
                timeout: 1000
            });
            break;
        case "NodeVM":
            const {NodeVM} = require('vm2'); // https://www.npmjs.com/package/vm2
            this.vm = new NodeVM({
                sandbox: this.context,
                require: {
                    external: true,
                }
            });
            break;
        default:
            console.error("Unknown VM type: " + type);
            break;
    }
};
Sandbox.type = {
    VM: "VM",
    NodeVM: "NodeVM"
};
Sandbox.prototype.stop = function()
{
    this.fiberRun = this.fiber.run;
    this.fiber.run = function(){ console.log("fiber.run() stubb executed")};
};
Sandbox.prototype.reset = function()
{
    if (typeof this.fiberRun !== null) this.fiber.run = this.fiberRun;
    this.fiber.reset();
};
Sandbox.prototype.run = function(code)
{
    var all = `
//            var Fiber = require("fibers");
    ` + 
    `var fiber = Fiber(function(){` +
        code + 
        "finished();" +
    `});
    fiber.run()`;
    this.vm.run(all, "/root/turtle-pi/server/SANDBOX");
    this.fiber = this.vm._context.fiber;
}



module.exports = Sandbox;

