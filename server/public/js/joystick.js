var Joystick = function(conf)
{
    this.defConf = {
        selector: 'div.joystick',
        onChange: function(newState){}
    };
    this.conf = this.defConf; 
    update(this.conf, conf); // selector, width, height
    
    this.width = $(this.conf.selector).width();
    this.height = $(this.conf.selector).height();
    
    this.donut = new Donut([100,100], 8, 95, 20, 0.1);
    this.pieces = this.donut.split();
    this.hole;
    
    this.draw();
    this.hoverActive = false;
    this.activeElement = null;
};
Joystick.prototype.getState = function()
{
    if (this.activeElement === null) return 0;
    return this.activeElement.data("segment");
};
Joystick.prototype.draw = function()
{
    var that = this;
    function doInactive(){
        if (that.activeElement !== null){
            that.activeElement.removeClass("segment-active");
            that.activeElement = null;
            that.conf.onChange(that.getState());
        }
    }
    function doActive(point){
        var e = document.elementFromPoint(point.x, point.y);
        var jq = $(e).filter(".segment");
        if (jq.length) // if hovering over a segment
        {
            // if the segment is already active
            if ( that.activeElement == null || jq[0] != that.activeElement[0] )
            {
                doInactive();
                that.activeElement = jq;
                jq.addClass("segment-active");
                that.conf.onChange(that.getState());
            }
        }
    }
    function xyFromEvent(event){
        if (typeof event.pageX !== "undefined"){
            return {
                x: event.pageX,
                y: event.pageY
            };
        } else {
            return {
                x: event.originalEvent.touches[0].pageX,
                y: event.originalEvent.touches[0].pageY
            };
        }
    }
    $(this.conf.selector).svg({
        settings: {
            viewBox: "0 0 200 200",
            width: this.width+"px",
            height: this.height+"px",
        }, 
        onLoad: function(svg){
            for (var i in that.pieces){
                that.pieces[i].draw(svg, parseInt(i)+1);
            }
            that.hole = svg.circle(100, 100, that.donut.inner * 0.75, {
                fill: '#ff0',
                class: "joystick-hole"
            });
            $(".joystick-hole").on("mousedown", function(){    /*$(this).css("cursor", "none");*/ });
            $(".joystick-hole").on("mouseup", function(){    /*$(this).css("cursor");*/ });
            
            $(this).on("mousedown touchstart", function(event)
            {
                that.hoverActive = true;
                //doInactive();
                doActive(xyFromEvent(event));
                return false;
            });
            $(this).on("mousemove touchmove", function(event)
            {
                if (that.hoverActive){
                    //doInactive();
                    doActive(xyFromEvent(event));
                }
                return false;
            });
            $(this).on("mouseup mouseleave touchend", function(event)
            {
                that.hoverActive = false;
                doInactive();
                return false;
            });

        }
    });
};


var Piece = function(donut, thetaStart, thetaEnd)
{
    this.donut = donut; 
    this.thetaStart = thetaStart; 
    this.thetaEnd =   thetaEnd; 
};
Piece.prototype.draw = function(svg, i){
    this.svgPath = svg.path(this.pathStr(), {
            class: "segment segment_"+i,
            draggable: false
    });
    $(this.svgPath).data("segment", i);
//    this.selector = ".segment_"+i;
};
Piece.prototype.pathStr = function()
{
    this.outerStart = [
        100 + Piece.opposite(this.thetaStart, this.donut.outer),
        100 - Piece.adjacent(this.thetaStart, this.donut.outer)
    ];
    this.outerEnd = [
        100 + Piece.opposite(this.thetaEnd, this.donut.outer),
        100 - Piece.adjacent(this.thetaEnd, this.donut.outer)
    ];
    this.innerStart = [
        100 + Piece.opposite(this.thetaEnd, this.donut.inner),
        100 - Piece.adjacent(this.thetaEnd, this.donut.inner)
    ];
    this.innerEnd = [
        100 + Piece.opposite(this.thetaStart, this.donut.inner),
        100 - Piece.adjacent(this.thetaStart, this.donut.inner)
    ];
    
    var p = "";
    p += Piece.pp("M", this.outerStart);
    p += Piece.svgArc(this.donut.outer, this.outerEnd, true);
    p += Piece.pp("L", this.innerStart);
    p += Piece.svgArc(this.donut.inner, this.innerEnd, false);
    p += Piece.pp("L", this.outerStart);
    p += " z "
    return p;
};
Piece.opposite = function(theta, hyp){    return Math.sin(theta) * hyp;   };
Piece.adjacent = function(theta, hyp){    return Math.cos(theta) * hyp;   };
Piece.svgArc = function(radius, end, bulgeLeft){
    return  Piece.pp("A", [radius, radius]) +
            " 0, 0, " + (bulgeLeft?1:0) + " " +
            Piece.pp("", end);
};
Piece.pp = function(prefix, pair){ return " "+prefix+" "+pair[0]+","+pair[1]+" "; };


var Donut = function(centre, divs, outer, inner, gap){
    this.centre = centre;
    this.divs = divs;
    this.outer = outer;
    this.inner = inner;
    this.gap = gap;
};
Donut.prototype.split = function()
{
    var theta = -(this.getNetDivTheta()/2);
    var pieces = [];
    
    for (d = 0; d < this.divs; d++)
    {
        pieces.push(new Piece(
                this, 
                theta, 
                theta += this.getNetDivTheta()
            ));
        theta += this.gap;
    }
    return pieces;
};
Donut.prototype.getNetDivTheta = function(){        return ((Math.PI * 2) / this.divs) - this.gap;  };
