

var Arrow = function (conf){
    this.defConf = {
        scale: [100, 100],
        containerSelector: "div.turtle", // "div.turtle"
        size: 0.1,
        pos: {edge: 'bottom', proportion:0.25},
        side: 'left',
        direction: 'up',
        active: false,
        onCommand: function(active){}
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 

    this.active = this.conf.active;
    this.classSelector = 'double-arrow-'+this.conf.pos.edge+'-'+this.conf.side;
    this.selector = this.conf.containerSelector+" ."+this.classSelector;
    
    this.draw();
    
};

Arrow.prototype.draw = function()
{
    var that = this;
    $(this.conf.containerSelector).append( // "div.turtle"
              '<div class="double-arrow '+this.classSelector+' ">'
            + '</div>'
    );
    $(this.selector)
            .css(this.conf.pos.edge, Math.round(this.conf.pos.proportion * this.conf.scale[1])+"px")
            .css(this.conf.side, "0px")
    ;

    var sizePx = this.conf.size * this.conf.scale[0];
    
    var arrowPathStr = 'M4.35,0l-3.725,-3.725c-0.625,-0.625,-1.875,0.625,-1.25,1.25l2.5,2.5l-2.5,2.5c-0.625,0.625,0.625,1.875,1.25,1.25l3.725,-3.725ZM0.625,0l-3.725,-3.725c-0.625,-0.625,-1.875,0.625,-1.25,1.25l2.5,2.5l-2.5,2.5c-0.625,0.625,0.625,1.875,1.25,1.25l3.725,-3.725Z';
    $(this.selector).svg({settings: {
            viewBox: "0 0 10 10",
            width: sizePx+"px",
            height: sizePx+"px",
        }});
    var svg = $(this.selector).svg("get");
    $(this.selector);
    $(this.selector)
            .on("mouseup",  function(){  that.conf.onCommand(false); })
            .on("mousedown", function(){ that.conf.onCommand(true); });
    var obj = svg.path(arrowPathStr, {
        transform: "translate(5, 5) rotate("+((this.conf.direction==="down")?90:270)+", 0, 0)",
        strokeWidth: 0,
        stroke: "#181",
        fill: "#afa"
    });
    this.setActive(this.active);
};

Arrow.prototype.setActive = function(active)
{
    this.active = active;
    
    var that = this;
    function loop(){
        $("path", $(that.selector).svg("get").root()).animate({
            svgStrokeWidth: '0.3'
        }, 300).animate({
            svgStrokeWidth: '0.04'
        }, 300, loop);
    }
    if (this.active)
    {
        $("path", $(this.selector).svg("get").root())
                .attr("fill", "#afa")
                .attr("stroke-width", "0")
                .attr("stroke", "#181");
        loop();
    }
    else 
    {
        $("path", $(this.selector).svg("get").root())
                .stop(true)
                .attr("fill", "#eee")
                .attr("stroke-width", "0.2")
                .attr("stroke", "#bbb");
    }
};
