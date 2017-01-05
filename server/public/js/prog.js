

var Prog = function(conf)
{
    this.defConf = {
        id: null,
        name: "Program",
        xml: "",
        js: "",
        containerSelector: "#prog", 
        active: false,
        onPress: function(){},
        onRelease: function(){},
        onFinish: function(){},
        blocklyDialogSelector: "div.blockly",
        progEditor: null,
        serverConn: null,
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    update(this, this.conf, ['id', 'name', 'xml', 'js']); 
    this.changeListeners = $.Callbacks();
    this.classSelector = 'prog-'+this.conf.id;
    this.selector = this.conf.containerSelector+" ."+this.classSelector;
        this.mainProgramSelector = this.selector+" .main-program";
            this.nameSelector = this.mainProgramSelector+" span.name";
            this.stopSelector = this.mainProgramSelector+" .icon-stop";
            this.playSelector = this.mainProgramSelector+" .icon-play";
        this.settingsProgramSelector = this.selector+" .icon-program-settings";
        this.archiveProgramSelector = this.selector+" .icon-program-archive";
        this.deleteProgramSelector = this.selector+" .icon-program-delete";

    this.playAnimTimeout = null;
    this.isActive = false;
    this.setActive(this.conf.active);
    this.draw();
};
Prog.prototype.addChangeListener = function(fn){
    this.changeListeners.add(fn);
}
Prog.prototype.removeChangeListener = function(fn){
    this.changeListeners.remove(fn);
}
Prog.prototype.changeName = function(newName)
{
    var that = this;
    this.name = newName;
    this.conf.serverConn.sendMessage({
        msgFor: "progManager",
        name: "modifyProg",
        value: {
            id: that.id,
            name: that.name
        }
    });
};
Prog.prototype.update = function(value, confirmingChangeRef)
{
    console.info("NEW UPDATE! Question: should it update JS as well?? Or just name & xml?", this.name, this.id);
    update(this, value, ['name', 'xml']); 
    $(this.nameSelector).text(this.name);
    this.changeListeners.fire(this, confirmingChangeRef);
//    this.conf.progEditor.updateName(this.name);
//    this.conf.progEditor.updateBlockly(this, confirmingChangeRef); 
};
Prog.prototype.delete = function()
{
    var that = this;
    this.conf.serverConn.sendMessage({
        msgFor: "progManager",
        name: "deleteProg",
        value: { id: that.id }
    });
};
Prog.prototype.remove = function()
{
    $(this.selector).remove();
};
Prog.prototype.animatePlay = function(enabled)
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
Prog.prototype.setActive = function(active)
{
    this.isActive = active;
    if (this.isActive){
        $(this.playSelector).removeClass("icon-inactive");
        $(this.stopSelector).addClass("icon-inactive");
        this.animatePlay(true);
    } else {
        $(this.playSelector)
                .addClass("icon-inactive")
                .clearQueue()
                .css("color", "#000");
        $(this.stopSelector).removeClass("icon-inactive");
        this.animatePlay(false);
    }
};
//Prog.prototype.setWorkspace = function(workspace)
//{
//    this.workspace = workspace;
//};
Prog.prototype.draw = function()
{
    var that = this;
    $(this.conf.containerSelector)
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
    $(this.nameSelector).text(this.conf.name);
    
    $(this.mainProgramSelector).on("click", function(){
        that.conf.serverConn.sendMessage({
            msgFor: "progManager",
            name: that.isActive ? "stopProg" : "runProg",
            value: { id: that.id }
        });
    });
    $(this.mainProgramSelector).on("dblclick taphold", function(){
        that.edit();
    });
    $(this.settingsProgramSelector).on("click", function(){
        that.edit();
    });
    $(this.deleteProgramSelector).on("click", function(){
        if (confirm("Delete "+that.name+": are you sure?")){
            that.delete();
        }
    });
};
Prog.prototype.deactivate = function(){};
Prog.prototype.edit = function()
{
    this.conf.progEditor.edit(this);
};
Prog.prototype.restore = function()
{
    this.conf.serverConn.sendMessage({
        msgFor: "progManager",
        name: "newProg",
        value: {
            id: this.id,
            xml: this.xml,
            js: this.js,
            name: this.name,
//            active: false
        }
    });
};


