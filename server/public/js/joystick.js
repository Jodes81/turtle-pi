var Joystick = function(conf)
{
    this.defConf = {
        selector: 'div.joystick',
    };
    this.conf = this.defConf; 
    update(this.conf, conf); // selector, width, height
    
    this.width = $(this.conf.selector).width();
    this.height = $(this.conf.selector).height();
    this.draw();
};
Joystick.prototype.draw = function()
{

    var donut = new Donut([100,100], 8, 95, 20, 0.1);
    var hole;
    var pieces = donut.split();
    $("path").attr("draggable", false);
    $(this.conf.selector).svg({settings: {
            viewBox: "0 0 200 200",
            width: $(this.conf.selector).width()+"px",
            height: $(this.conf.selector).height()+"px",
    }, onLoad: function(svg){
        var i = 0;
        for (; i < pieces.length; i++){
            
            var p = svg.path(pieces[i].pathStr(), {
                    fill: "#eee",
                    strokeWidth: "1",
                    stroke: "#bbb",
                    class: "segment_"+i,
                    draggable: false
            });
            pieces[i].svg = p;
            pieces[i].selector = ".segment_"+i;
            
            
            var down = false;
            $(document).mousedown(function() {
                down = true;
            }).mouseup(function() {
                down = false;  
            });
            
            function applyDown(idx){
//                console.log("on", idx);
                $(pieces[idx].selector)
                        .attr("stroke-width", "2")
                        .attr("stroke", "#181")
                        .attr("fill", "#afa");
            }
            function applyHover(idx){
                if(down) {
                    applyDown(idx);
                } else {
//                    console.log("off", idx);
                    $(pieces[idx].selector)
                            .attr("stroke-width", "3")
                            .attr("stroke", "#f00");
                }
            }
            function applyOut(idx){
//                console.log("off", idx);
                $(pieces[idx].selector)
                        .attr("stroke-width", "1")
                        .attr("stroke", "#bbb")
                        .attr("fill", "#eee");
            }
            function applyUp(idx){
//                console.log("off", idx);
                $(pieces[idx].selector)
                        .attr("stroke-width", "1")
                        .attr("stroke", "#bbb")
                        .attr("fill", "#eee");
            }
            function doDown(idx){
                return function(){
                    applyDown(idx);
                    down = true; // ensure "down" follows mouse as it moves over other segments
                    return false; // prevent dragging ghost
                };
            }
            function go(idx, fn){
                return function(){
                    fn(idx);
                }
            }
            $(".segment_"+i).hover(go(i, applyHover));
            $(".segment_"+i).on("mousedown", doDown(i));
            $(".segment_"+i).on("mouseout", go(i, applyOut));
            $(".segment_"+i).on("mouseup", go(i, applyUp));
        }
        hole = svg.circle(100, 100, donut.inner * 0.75, {
            fill: '#ff0',
            class: "joystick-hole"
        });
        $(".joystick-hole").on("mousedown", function(){
//            $(this).css("cursor", "none");
        });
        $(".joystick-hole").on("mouseup", function(){
//            $(this).css("cursor");
        });
    }});
    
};

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

var Piece = function(donut, thetaStart, thetaEnd)
{
    this.donut = donut; 
    this.thetaStart = thetaStart; 
    this.thetaEnd =   thetaEnd; 
    this.outerStart = [
        100 + opposite(this.thetaStart, this.donut.outer),
        100 - adjacent(this.thetaStart, this.donut.outer)
    ];
    this.outerEnd = [
        100 + opposite(this.thetaEnd, this.donut.outer),
        100 - adjacent(this.thetaEnd, this.donut.outer)
    ];
    this.innerStart = [
        100 + opposite(this.thetaEnd, this.donut.inner),
        100 - adjacent(this.thetaEnd, this.donut.inner)
    ];
    this.innerEnd = [
        100 + opposite(this.thetaStart, this.donut.inner),
        100 - adjacent(this.thetaStart, this.donut.inner)
    ];
};

var opposite = function(theta, hyp){    return Math.sin(theta) * hyp;   };
var adjacent = function(theta, hyp){    return Math.cos(theta) * hyp;   };
function arc(radius, end, bulgeLeft){
    return  pp("A", [radius, radius]) +
            " 0, 0, " + (bulgeLeft?1:0) + " " +
            pp("", end);
}
function pp(prefix, pair){ return " "+prefix+" "+pair[0]+","+pair[1]+" "; }

Piece.prototype.pathStr = function()
{
    var p = "";
    p += pp("M", this.outerStart);
    p += arc(this.donut.outer, this.outerEnd, true);
    p += pp("L", this.innerStart);
    p += arc(this.donut.inner, this.innerEnd, false);
    p += pp("L", this.outerStart);
    p += " z "
    return p;
};