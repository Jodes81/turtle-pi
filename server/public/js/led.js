
var LED = function(conf)
{
    this.defConf = {
        scale: [100, 100],
        containerSelector: "div.turtle", // "div.turtle"
        size: 0.1,
        top: 0,
        left: null,
        right: null,
        active: false,
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    this.name = (this.conf.left === null) ? 'right': 'left';
    
    this.selector = this.conf.containerSelector + " .led-" + this.name;
    this.px = {
        border:    Math.ceil(0.02 * this.conf.size * this.conf.scale[0]),
        padding:   Math.round(0.4 * this.conf.size * this.conf.scale[0]),
        size:      Math.round(0.6 * this.conf.size * this.conf.scale[0]),
        onShadowInsetBlur:  Math.round(0.2 * this.conf.size * this.conf.scale[0]),
        onShadowInsetVert:   Math.round(0.1 * this.conf.size * this.conf.scale[0]),
        offShadowInsetBlur:  Math.round(0.2 * this.conf.size * this.conf.scale[0]),
        offShadowInsetVert:   Math.round(0.1 * this.conf.size * this.conf.scale[0]),
        offGlowBlur:  Math.round(0.5 * this.conf.size * this.conf.scale[0]),
        offGlowVert:   Math.round(0.1 * this.conf.size * this.conf.scale[0]),
    };
    this.draw();
    
};

LED.prototype.draw = function()
{
    $(this.conf.containerSelector).append('<div class="led led-'+this.name+'"><div></div></div>');
    $(this.selector)
            .css(this.name, Math.round( this.conf[this.name] * this.conf.scale[0] ) )    
            .css("top", Math.round(this.conf.top * this.conf.scale[1]))
            .css("border", this.px.border+"px solid orange")
            .css("border-radius", "15%")
            .css("padding", this.px.padding+"px")
            .css("background-color", "#fff")
            .css("margin", "0px auto")
    ;
    $(this.selector + " div")
            .css("width", this.px.size+"px")
            .css("height", this.px.size+"px")
            .css("border-radius", "50%")
    ;
    this.setActive(this.conf.active);
};
LED.prototype.setActive = function(active)
{
    if (active)
    {
        $(this.selector)
        $(this.selector + " div")
                .css("box-shadow", 
                        "inset #900 0 -"+this.px.onShadowInsetVert+"px "+this.px.onShadowInsetBlur+"px,"+
                        " #F00 0 "+this.px.offGlowVert+"px "+this.px.offGlowBlur+"px")
                .css("background-color", "#ff4422")
        ;
    }
    else 
    {
        $(this.selector)
        $(this.selector + " div")
                .css("box-shadow", "inset #400 0 -"+this.px.offShadowInsetVert+"px "+this.px.offShadowInsetBlur+"px")
                .css("background-color", "#811")
        ;
    }
    
};