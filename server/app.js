var wpi = require('wiring-pi');
var conf = require("./conf");
var server = require("./server");
server.start(conf);



/*
console.log('Initting wiringPi......');
wpi.wiringPiSetup();
wpi.pinMode(4, wpi.OUTPUT);
wpi.digitalWrite(4, 1);
 */

wpi.wiringPiSetup();
wpi.pinMode(conf.IR_SENSOR_LEFT, wpi.INPUT);
wpi.wiringPiISR(conf.IR_SENSOR_LEFT, wpi.INT_EDGE_BOTH, function(delta){
    server.wsConns.send('Pin 6 changed to ..?... ('+ delta+ ')');
});


