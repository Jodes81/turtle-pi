
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
        arrowGap: 0.03
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    
    this.selector = this.conf.containerSelector+" .wheel-"+this.conf.side;
    
    this.arrows = [];
    this.draw();
};

Wheel.prototype.draw = function()
{
    $(this.conf.containerSelector).append( // "div.turtle"
              '<div class="wheel wheel-'+this.conf.side+' ">' // ".wheel-left"
            + '</div>'
    );
    
    var widthPx =    Math.round(this.conf.width *      this.conf.scale[0]);
    var heightPx =   Math.round(this.conf.height *     this.conf.scale[1]);
    var borderPx =   Math.round(this.conf.borderSize * this.conf.scale[0]);
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
        active: true
    });
    this.arrows["b"] = new Arrow({
        scale: this.conf.scale,
        containerSelector: this.conf.containerSelector, // "div.turtle"
        size: this.conf.arrowSize,
        pos: {edge: 'top', proportion: this.conf.wheelPos + this.conf.height / 2 + this.conf.arrowGap},
        side: this.conf.side,
        direction: "down",
        active: false
    });
};

Wheel.prototype.setDirection = function()
{
    
};