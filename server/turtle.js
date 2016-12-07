var Turtle = function(conf){
    this.defConf = {
        onStateChange: function(msgFor, name, value){}
    };
    this.conf = this.defConf; 
    for (var k in conf) this.conf[k] = conf[k];
};
Turtle.prototype.wheelDirection = function(wheel, direction)
{
    this.conf.onStateChange("wheels", wheel, direction);
};

module.exports = Turtle;