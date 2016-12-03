
var Turtle = function(conf)
{
    this.defConf = {
        selector: 'div.turtle',
        bodyMargin: [0.15, 0.08],  // excludes border.
        bodyBorderSize: 0.01,
        wheelHeight: 0.25,
        wheelWidth: 0.13,
        wheelPos: 0.55,
        wheelArrowSize: 0.2
    };
    this.conf = this.defConf; 
    update(this.conf, conf); // selector, width, height

    this.bodySelector = this.conf.selector + " .body";
    this.width = $(this.conf.selector).width();
    this.height = $(this.conf.selector).height();
    
    this.wheels = [];
    this.draw();
};

Turtle.prototype.draw = function()
{
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
        arrowSize: this.conf.wheelArrowSize
    };
    var wheelConfLeft = {
        side: "left",
    };
    var wheelConfRight = {
        side: "right",
    };
    this.wheels['left'] =  new Wheel(update(wheelConfLeft,  wheelConf));
    this.wheels['right'] = new Wheel(update(wheelConfRight, wheelConf));
    
    
    
};
