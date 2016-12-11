var Turtle = function(conf){
    this.defConf = {
        onStateChange: function(msgFor, name, value){}
    };
    this.conf = this.defConf; 
    for (var k in conf) this.conf[k] = conf[k];
    
    this.wheel = {left: "STOP", right: "STOP"};
    this.irSensor = {left: 0, right: 0};
};
Turtle.prototype.setWheelDirection = function(wheel, direction)
{
    this.wheel[wheel] = direction;
    this.conf.onStateChange("wheel", wheel, direction);
};
Turtle.prototype.setIrSensor = function(irSensor, value)
{
    this.irSensor[irSensor] = value;
    this.conf.onStateChange("irSensor", irSensor, value);
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