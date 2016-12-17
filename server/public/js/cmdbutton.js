

var CmdButton = function(conf)
{
    this.defConf = {
        id: null,
        name: "Button",
        containerSelector: "#cmdbutton", 
        active: false,
        onPress: function(){},
        onRelease: function(){},
        onFinish: function(){},
        blocklyDialogSelector: "div.blockly",
        cmdEditor: null,
        serverConn: null,
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    update(this, this.conf, ['id', 'name']); 

    this.classSelector = 'cmd-button-'+this.conf.id;
    this.selector = this.conf.containerSelector+" ."+this.classSelector;
        this.mainButtonSelector = this.selector+" .main-button";
            this.nameSelector = this.mainButtonSelector+" span.name";
            this.stopSelector = this.mainButtonSelector+" .icon-stop";
            this.playSelector = this.mainButtonSelector+" .icon-play";
        this.settingsButtonSelector = this.selector+" .icon-button-settings";
        this.archiveButtonSelector = this.selector+" .icon-button-archive";
        this.deleteButtonSelector = this.selector+" .icon-button-delete";

    this.playAnimTimeout = null;
    this.isActive = false;
    this.setActive(this.conf.active);
    this.draw();
};
CmdButton.prototype.changeName = function(newName)
{
    var that = this;
    this.name = newName;
    this.conf.serverConn.sendMessage({
        msgFor: "cmdButtonManager",
        name: "modifyCmd",
        value: {
            id: that.id,
            name: that.name
        }
    });
};
CmdButton.prototype.update = function(value)
{
    update(this, value, ['name']); 
    $(this.nameSelector).html(this.name);
    this.conf.cmdEditor.updateName(this.name);
};
CmdButton.prototype.delete = function()
{
    var that = this;
    this.conf.serverConn.sendMessage({
        msgFor: "cmdButtonManager",
        name: "deleteCmd",
        value: { id: that.id }
    });
};
CmdButton.prototype.remove = function()
{
    $(this.selector).remove();
};
CmdButton.prototype.animatePlay = function(enabled)
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
        /*
        var that = this;
        $(this.playSelector).animate({
            color: "#000"
        }, 300).animate({
            color: "#ccc"
        }, 300, function(){ 
            that.animatePlay(); 
        });
        */
    } else {
        clearTimeout(this.playAnimTimeout);
    }
};
CmdButton.prototype.setActive = function(active)
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
CmdButton.prototype.draw = function()
{
    var that = this;
    $(this.conf.containerSelector)
        .prepend(
            '<div class="cmd-button '+this.classSelector+'">'+
                '<button class="main-button ui-btn ui-corner-all ui-btn-inline ">'+
                    '<span class="name"></span>'+
                    '<span class="material-icons icon-play icon icon-inactive">play_arrow</span>'+
                    '<span class="material-icons icon-stop icon">stop</span>'+
                '</button>'+
            '<span class="material-icons icon-button-settings icon-button">settings</span>'+
            '<span class="material-icons icon-button-archive icon-button">archive</span>'+
            '<span class="material-icons icon-button-delete icon-button">delete</span>'+
            '</div>'
                );
    $(this.nameSelector).html(this.conf.name);
    
    $(this.mainButtonSelector).on("click", function(){
        that.conf.serverConn.sendMessage({
            msgFor: "cmdButtonManager",
            name: that.isActive ? "stopCmd" : "runCmd",
            value: { id: that.id }
        });
    });
    $(this.mainButtonSelector).on("dblclick taphold", function(){
        that.edit();
    });
    $(this.settingsButtonSelector).on("click", function(){
        that.edit();
    });
    $(this.deleteButtonSelector).on("click", function(){
        if (confirm("Delete "+that.name+": are you sure?")){
            that.delete();
        }
    });
};
CmdButton.prototype.deactivate = function(){};
CmdButton.prototype.edit = function()
{
    this.conf.cmdEditor.edit(this);
};


