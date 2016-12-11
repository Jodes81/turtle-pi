var wpi = require('wiring-pi');
var conf = require("./conf");
var server = require("./server");
var Turtle = require("./turtle");
var storage = require('node-persist'); // https://www.npmjs.com/package/node-persist

var code = "for (var i = 0; i < 1; i++){\
                    green_led(1);\
                    sleep(500);\
                    green_led(0);\
                    sleep(500);\
                }";

var JSISandbox = require("./jsisandbox");
var sandbox = new JSISandbox({
//    finished: function(steps){}
},{
    green_led: green_led
});

function parsePinValue(val){
    return (val==1 || val==true) ? 1 : 0; 
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


var turtle = new Turtle({
    onStateChange: function(msgFor, name, value){
        server.send(JSON.stringify([{msgFor: msgFor, name: name, value: value}]));
    }
});

wpi.wiringPiSetup();
wpi.pinMode(conf.LED_GREEN, wpi.OUTPUT);
//wpi.digitalWrite(conf.LED_GREEN, 1);

function green_led(active)
{
    active = parsePinValue(active);
    console.log("Actual LED: " + active + "("+(typeof active)+")");
    wpi.digitalWrite(conf.LED_GREEN, active);
}

wpi.wiringPiSetup();
wpi.pinMode(conf.IR_SENSOR_LEFT, wpi.INPUT);
wpi.pinMode(conf.IR_SENSOR_RIGHT, wpi.INPUT);
wpi.wiringPiISR(conf.IR_SENSOR_LEFT, wpi.INT_EDGE_BOTH, function(delta)
{
    turtle.setIrSensor(
            "left", 
            !wpi.digitalRead(conf.IR_SENSOR_LEFT)
        );
});
wpi.wiringPiISR(conf.IR_SENSOR_RIGHT, wpi.INT_EDGE_BOTH, function(delta)
{
    turtle.setIrSensor(
            "right", 
            !wpi.digitalRead(conf.IR_SENSOR_RIGHT)
        );
});


