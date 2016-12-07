
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
    this.draw();
};

LED.prototype.draw = function()
{
    $(this.conf.containerSelector).append('<div class="led led-'+this.name+'"><div></div></div>');
    $(this.selector)
            .css(this.name, Math.round( this.conf[this.name] * this.conf.scale[0] ) )    
            .css("top", Math.round(this.conf.top * this.conf.scale[1]))
            .css("border", "2px solid orange")
            .css("border-radius", "15%")
            .css("background-color", "#fff");
    ;
    this.setActive(this.conf.active);
};
LED.prototype.setActive = function(active)
{
    if (active)
    {
        $(this.selector)
            .addClass("led-on")
            .removeClass("led-off");
    }
    else 
    {
        $(this.selector)
            .addClass("led-off")
            .removeClass("led-on");
    }
    
};