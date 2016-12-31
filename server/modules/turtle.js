var Turtle = function(conf){
    this.defConf = {
        server: null,
        hardware: null
        //onStateChange: function(msgFor, name, value){}
    };
    this.conf = this.defConf; 
    for (var k in conf) this.conf[k] = conf[k];
    
    this.wheel = {left: "STOP", right: "STOP"};
    this.irSensor = {left: 0, right: 0};
    
    var turtle = this;
    this.conf.server.addMessageListener({ msgFor: "wheel", onMessage: function(o){
        turtle.setWheelDirection(o.name, o.value);
    }});
    this.conf.server.addConnectionListener(function(server){
        server.send(turtle.stateAsMessage());
    });
    this.conf.hardware.wpi.wiringPiISR(this.conf.hardware.conf.IR_SENSOR_LEFT, this.conf.hardware.wpi.INT_EDGE_BOTH, function(delta)
    {
        turtle.setIrSensor(
                "left", 
                !turtle.conf.hardware.wpi.digitalRead(turtle.conf.hardware.conf.IR_SENSOR_LEFT)
            );
    });
    this.conf.hardware.wpi.wiringPiISR(this.conf.hardware.conf.IR_SENSOR_RIGHT, this.conf.hardware.wpi.INT_EDGE_BOTH, function(delta)
    {
        turtle.setIrSensor(
                "right", 
                !turtle.conf.hardware.wpi.digitalRead(turtle.conf.hardware.conf.IR_SENSOR_RIGHT)
            );
    });
    
};
Turtle.prototype.onStateChange = function(msgFor, name, value)
{
    //this.conf.onStateChange(msgFor, name, value);
    this.conf.server.sendSingleMessage({msgFor: msgFor, name: name, value: value});
};
Turtle.prototype.setWheelDirection = function(wheel, direction)
{
    this.wheel[wheel] = direction;
    this.onStateChange("wheel", wheel, direction);
};
Turtle.prototype.setIrSensor = function(irSensor, value)
{
    this.irSensor[irSensor] = value;
    this.onStateChange("irSensor", irSensor, value);
};
Turtle.prototype.stateAsMessage = function(){
    return JSON.stringify([
        this.msgObject("wheel", "left", this.wheel.left),
        this.msgObject("wheel", "right", this.wheel.right),
        this.msgObject("irSensor", "left", this.irSensor.left),
        this.msgObject("irSensor", "right", this.irSensor.right),
    ]);
};
Turtle.prototype.msgObject = function(msgFor, name, value){
    return {msgFor: msgFor, name: name, value: value};
};

module.exports = Turtle;