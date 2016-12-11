
/* global Wheel */

var Turtle = function(conf)
{
    this.defConf = {
        selector: 'div.turtle',
        bodyMargin: [0.15, 0.08],  // excludes border.
        bodyBorderSize: 0.01,
        wheelHeight: 0.25,
        wheelWidth: 0.13,
        wheelPos: 0.55,
        wheelArrowSize: 0.2,
        onCommand: function(wheel, direction){}
    };
    this.conf = this.defConf; 
    update(this.conf, conf); // selector, width, height

    this.bodySelector = this.conf.selector + " .body";
    this.width = $(this.conf.selector).width();
    this.height = $(this.conf.selector).height();
    
    this.sensors = [];
    this.wheels = [];
    this.draw();
};
Turtle.prototype.msgRx = function(msg)
{
    switch (msg.msgFor)
    {
        case "irSensor":
            this.sensors[msg.name].setActive(msg.value);
//            console.log("Changing LED! " + msg.name + " to " + msg.value);
            break;
        case "wheel":
            this.wheels[msg.name].setDirection(msg.value);
//            console.log("Changing Wheel Direction! " + msg.name + " to " + msg.value);
            break;
        default:
            console.log("Not recognised msgFor type: "+msg.msgFor);
            break;
    }
    
};
Turtle.prototype.draw = function()
{
    var that = this;
    
    $(this.conf.selector).html('<div class="body"></div>');
    
    this.scale = [this.width, this.height];

    var margin = [
        Math.round(this.scale[0] * this.conf.bodyMargin[0]),
        Math.round(this.scale[1] * this.conf.bodyMargin[1])
    ];
    
    var bodyBorderPx = Math.ceil(this.conf.bodyBorderSize * this.scale[0]);

    $(this.bodySelector)
        .css("left",    margin[0]+"px" )
        .css("right",   margin[0]+"px" )
        .css("top",     margin[1]+"px" )
        .css("bottom",  margin[1]+"px" )
        .css("border", bodyBorderPx+"px solid #777")
    ;
    
    var wheelConf = {
        scale: this.scale,
        containerSelector: this.conf.selector, // "div.turtle"
        width: this.conf.wheelWidth,
        height: this.conf.wheelHeight,
        wheelPos: this.conf.wheelPos,
        arrowSize: this.conf.wheelArrowSize,
        direction: Wheel.STOP
    };
    var wheelConfLeft = {
        side: "left",
        onCommand: function(direction){
            that.conf.onCommand("left", direction);
        }
    };
    var wheelConfRight = {
        side: "right",
        onCommand: function(direction){
            that.conf.onCommand("right", direction);
        }
    };
    this.wheels['left'] =  new Wheel(update(wheelConfLeft,  wheelConf));
    this.wheels['right'] = new Wheel(update(wheelConfRight, wheelConf));
    
    var sensorConf = 
    {
        scale: this.scale,
        containerSelector: this.conf.selector, // "div.turtle"
        size: 0.1,
        top: 0.02,
    };
    var sensorConfLeft = {
        left: 0.3,
    };
    var sensorConfRight = {
        right: 0.3,
    };
    this.sensors['left'] =  new LED(update(sensorConfLeft,  sensorConf));
    this.sensors['right'] =  new LED(update(sensorConfRight,  sensorConf));
    
};
