var Turtle = function(conf){
    this.conf = conf;
    this.selector = conf.selector;
};
Turtle.prototype.draw = function(){
    $(this.selector).html(
              ''
            + '<div class="wheel wheel-left"></div>'
            + '<div class="wheel wheel-right"></div>'
            + '<div class="ir-sensor ir-sensor-left"></div>'
            + '<div class="ir-sensor ir-sensor-right"></div>'
            + ''
    );
};