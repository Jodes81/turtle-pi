
var Wheel = function(conf)
{
    this.defConf = {
        side: "left",
        containerSelector: "div.turtle",
        scale: [100, 100],
        width: 0.1,
        height: 0.25,
        wheelPos: 0.5,
        borderSize: 0.01,
        arrowSize: 0.25,
        arrowGap: 0.03,
        direction: Wheel.STOP,
        onCommand: function(direction){}
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    
    this.selector = this.conf.containerSelector+" .wheel-"+this.conf.side;
    this.direction = this.conf.direction;
    this.arrows = [];
    this.draw();
};
Wheel.STOP = "STOP";
Wheel.FORWARD = "FORWARD";
Wheel.REVERSE = "REVERSE";
Wheel.prototype.setDirection = function(direction)
{
    this.direction = direction;
    this.arrows["t"].setActive(this.direction === Wheel.FORWARD);
    this.arrows["b"].setActive(this.direction === Wheel.REVERSE);
};
Wheel.prototype.draw = function()
{
    var that = this;
    $(this.conf.containerSelector).append( // "div.turtle"
              '<div class="wheel wheel-'+this.conf.side+' ">' // ".wheel-left"
            + '</div>'
    );
    var widthPx =    Math.round(this.conf.width *      this.conf.scale[0]);
    var heightPx =   Math.round(this.conf.height *     this.conf.scale[1]);
    var borderPx =   Math.ceil(this.conf.borderSize * this.conf.scale[0]);
    var wheelPosPx = Math.round(this.conf.wheelPos *   this.conf.scale[1]);
    var topPx = wheelPosPx - Math.round(heightPx/2) - borderPx;
    $(this.selector)
            .css("width",  widthPx+"px" )
            .css("height", heightPx+"px" )
            .css("top",    topPx+"px")
            .css("border", borderPx+"px solid #555")
            .css(this.conf.side, (this.conf.arrowSize > this.conf.width) ? 
                    Math.round(((this.conf.arrowSize - this.conf.width) / 2  - this.conf.borderSize) * this.conf.scale[0])
                  : 0 )
    ;
    this.arrows["t"] = new Arrow({
        scale: this.conf.scale,
        containerSelector: this.conf.containerSelector, // "div.turtle"
        size: this.conf.arrowSize,
        pos: {edge: 'bottom', proportion: (1-this.conf.wheelPos) + this.conf.height / 2 + this.conf.arrowGap},
        side: this.conf.side,
        direction: "up",
        onCommand: function(active){
            that.conf.onCommand( active ? Wheel.FORWARD : Wheel.STOP );
        }
    });
    this.arrows["b"] = new Arrow({
        scale: this.conf.scale,
        containerSelector: this.conf.containerSelector, // "div.turtle"
        size: this.conf.arrowSize,
        pos: {edge: 'top', proportion: this.conf.wheelPos + this.conf.height / 2 + this.conf.arrowGap},
        side: this.conf.side,
        direction: "down",
        onCommand: function(active){
            that.conf.onCommand( active ? Wheel.REVERSE : Wheel.STOP );
        }
    });
    this.setDirection(this.direction);
};

Wheel.prototype.setDirection = function(direction)
{
    this.direction = direction;
    switch(this.direction)
    {
        case Wheel.STOP:
            this.arrows["t"].setActive(false);
            this.arrows["b"].setActive(false);
            break;
        case Wheel.FORWARD:
            this.arrows["t"].setActive(true);
            this.arrows["b"].setActive(false);
            break;
        case Wheel.REVERSE:
            this.arrows["t"].setActive(false);
            this.arrows["b"].setActive(true);
            break;
        default:
            console.warn("Unknown direction: "+ this.direction)
            break;
    }
};