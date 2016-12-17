

var importer = require("./importer");
var Interpreter = importer('./lib/acorn_js_interpreter.js', "Interpreter");

function green_led(active)
{
    console.log("Green_led: " + active);
}


var Sandbox = function(conf, fns)
{
    this.stepsRun = 0;
    this.startTime = null;
    this.stepperTimeout = null;
    this.isRunning = false;
    this.interpreter = null;
    this.nextStepTime = null;
    this.stepTime = null;
    var defConf = {
        finished: function(steps, time){ console.log("Finished. Steps:"+steps+", time:"+time); }
    };
    var defFns = {
        sleep: [this, this.sleep],
        green_led: green_led
    };
    this.conf = defConf;
    this.fns = defFns;
    if (typeof conf !== "undefined"){
        for (var k in conf) this.conf[k] = conf[k];
    }
    if (typeof fns !== "undefined"){
        for (var k in fns) this.fns[k] = fns[k];
    }
    this.finished = this.conf.finished;
    var that = this;
    this.interpreterInit = function(interpreter, scope)
    {
        for (let k in that.fns){
            interpreter.setProperty(
                    scope, k, interpreter.createNativeFunction(function(){
                        var fnRef = that.fns[k];
                        var result;
                        if (typeof fnRef == "function")
                        {
                            result = fnRef.apply({}, arguments);
                        }
                        else if (
                                typeof fnRef == "object"  && 
                                typeof fnRef[0] == "object" &&
                                typeof fnRef[1] == "function")
                        {
                            result = fnRef[1].apply(fnRef[0], arguments);
                        } 
                        else 
                        {
                            console.error("Function not specified correctly. Should be 'Function' or '[thisObj, Function]'");
                        }
                        
                        return interpreter.createPrimitive(result);
                    })
            );    
        }
    };
    
    this.interpreter = new Interpreter('', this.interpreterInit);
    
};
Sandbox.prototype.sleep = function(ms)
{
    this.nextStepTime = parseInt(ms) + parseInt(this.stepTime);
}
Sandbox.prototype.stop = function()
{
    if (this.isRunning)
    {
        clearTimeout(this.stepperTimeout);
    }
    this.isRunning = false;
};
Sandbox.prototype.run = function(code, stepTime)
{
    if (this.isRunning) this.stop();
    this.stepsRun = 0;
    this.startTime = new Date().getTime();
    this.isRunning = true;
    this.stepTime = (stepTime == parseInt(stepTime)) ? stepTime : 1;
    this.interpreter.appendCode(code);
    this.nextStepTime = this.stepTime;
    this.stepper();
};
Sandbox.prototype.stepper = function()
{
    var that = this;
    this.stepsRun++;
    if (this.interpreter.step()){
        this.stepperTimeout = setTimeout(function(){
            that.stepper();
        }, this.nextStepTime);
        this.nextStepTime = this.stepTime;
    } else {
        this.finished(this.stepsRun, (new Date().getTime() - this.startTime));
        this.isRunning = false;
    }
};

module.exports = Sandbox;