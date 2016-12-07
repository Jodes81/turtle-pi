var wpi = require('wiring-pi');
var conf = require("./conf");
var server = require("./server");
var Turtle = require("./turtle");

server.start(conf.port, function(str){
    try {
        var o = JSON.parse(str);
        switch(o.msgFor){
            case "wheel":
                turtle.wheelDirection(o.name, o.value);
                break;
            default:
                console.log("Unknown msgFor:" + o.msgFor);
                break;
        }
    } catch (e) {
        console.log("JSON could not be parsed:"+str);
    }
});

var turtle = new Turtle({
    onStateChange: function(msgFor, name, value){
        server.send(JSON.stringify([{msgFor: msgFor, name: name, value: value}]));
    }
});

/*
console.log('Initting wiringPi......');
wpi.wiringPiSetup();
wpi.pinMode(4, wpi.OUTPUT);
wpi.digitalWrite(4, 1);
 */

wpi.wiringPiSetup();
wpi.pinMode(conf.IR_SENSOR_LEFT, wpi.INPUT);
wpi.pinMode(conf.IR_SENSOR_RIGHT, wpi.INPUT);
wpi.wiringPiISR(conf.IR_SENSOR_LEFT, wpi.INT_EDGE_BOTH, function(delta){
    server.send(JSON.stringify(
        [{msgFor: 'irSensors', name: 'left', value: !wpi.digitalRead(conf.IR_SENSOR_LEFT)}]
    ));
});
wpi.wiringPiISR(conf.IR_SENSOR_RIGHT, wpi.INT_EDGE_BOTH, function(delta){
    server.send(JSON.stringify(
        [{msgFor: 'irSensors', name: 'right', value: !wpi.digitalRead(conf.IR_SENSOR_RIGHT)}]
    ));
});


