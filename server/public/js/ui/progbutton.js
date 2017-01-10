
var ProgButton = function(conf){
    update(this, conf);
    
    this.classSelector = 'prog-'+this.id;
    this.selector = this.containerSelector+" ."+this.classSelector;
        this.mainProgramSelector = this.selector+" .main-program";
            this.nameSelector = this.mainProgramSelector+" span.name";
            this.stopSelector = this.mainProgramSelector+" .icon-stop";
            this.playSelector = this.mainProgramSelector+" .icon-play";
        this.settingsProgramSelector = this.selector+" .icon-program-settings";
        this.archiveProgramSelector = this.selector+" .icon-program-archive";
        this.deleteProgramSelector = this.selector+" .icon-program-delete";
    this.playAnimTimeout = null;
    
};
ProgButton.prototype.draw = function()
{
    var that = this;
    $(this.containerSelector)
        .prepend(
            '<div class="prog '+this.classSelector+'">'+
                '<button class="main-program ui-btn ui-corner-all ui-btn-inline ">'+
                    '<span class="name"></span>'+
                    '<span class="material-icons icon-play icon icon-inactive">play_arrow</span>'+
                    '<span class="material-icons icon-stop icon">stop</span>'+
                '</button>'+
            '<span class="material-icons icon-program-settings icon-program">settings</span>'+
            '<span class="material-icons icon-program-archive icon-program">archive</span>'+
            '<span class="material-icons icon-program-delete icon-program">delete</span>'+
            '</div>'
                );
    this.setName(this.name);
    
    $(this.mainProgramSelector).on("click", function(){
        that.onToggle();
    });
    $(this.mainProgramSelector).on("dblclick taphold", function(){
        that.onEdit();
    });
    $(this.settingsProgramSelector).on("click", function(){
        that.onEdit();
    });
    $(this.deleteProgramSelector).on("click", function(){
        that.onDelete();
    });
};
ProgButton.prototype.setActive = function(active)
{
    if (active){
        $(this.playSelector).removeClass("icon-inactive");
        $(this.stopSelector).addClass("icon-inactive");
        this.animatePlay(true);
    } else {
        $(this.playSelector)
                .addClass("icon-inactive")
                .css("color", "#000");
        $(this.stopSelector).removeClass("icon-inactive");
        this.animatePlay(false);
    }
};
ProgButton.prototype.remove = function()
{
    $(this.selector).remove();
};
ProgButton.prototype.animatePlay = function(enabled)
{
    var that = this;
    if (enabled){
        $(this.playSelector).css("color", "#000");
        this.playAnimTimeout = setTimeout(function(){
            $(that.playSelector).css("color", "#ccc");
            that.playAnimTimeout = setTimeout(function(){
                that.animatePlay(true);
            }, 300);
        }, 300);
    } else {
        clearTimeout(this.playAnimTimeout);
    }
};
ProgButton.prototype.setName = function(name)
{
    $(this.nameSelector).text(name);
};
ProgButton.prototype.onToggle = function()
{
    console.error("Not set");
};
ProgButton.prototype.onEdit = function()
{
    console.error("Not set");
};
ProgButton.prototype.onDelete = function()
{
    console.error("Not set");
};