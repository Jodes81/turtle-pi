
var ProgEditor = function(conf)
{
    var that = this;
    this.defConf = {
        selector: "div.editor-dialog",
        serverConn: serverConn
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    this.ignoreChangeRefs = {};
    this.blockly = null;
    this.editingProg = null;
    this.nameSelector = this.conf.selector + " input.name";
    this.turtle = null;
    this.blocklyContainerSelector = this.conf.selector + " .blockly-container";
    this.controlSelector = this.selector + " .control-bar"; // "div.editor-dialog .control-bar";
    
    this.blockly = new BlocklyWrapper({
        containerSelector: this.blocklyContainerSelector,
        selector: this.conf.selector + " .blockly-container div",
        onChange: function(newJs, newXml, e){
            if (that.editingProg == null) return;
            that.editingProg.xml = newXml;
            that.editingProg.js = newJs;
            that.sendChangesToServer();
        },
    });
    this.playAnimTimeout = null;
    this.playSelector = '.icon-program-play';
    this.stopSelector = '.icon-program-stop';

    $(this.conf.selector).dialog({
        autoOpen: false,
        resizable: false,
        width: "98%",
        height: 0.98 * $(window).height(),
        show: {effect: 'slide', duration: 200},
        hide: {effect: 'scale', duration: 300},
        close: function(){
        },
        beforeClose: function(){
            that.editingProg = null;
        },
    });
    $(this.nameSelector).on("change", function(){
        that.editingProg.changeName($(that.nameSelector).val());
    });
    $(this.playSelector).on("click", function(){
        that.editingProg.run(true);
    });
    $(this.stopSelector).on("click", function(){
        that.editingProg.run(false);
    });
    
    this.turtle = new Turtle({ selector: this.conf.selector + " .turtle", });

    $(this.conf.controlSelector)
            .css("height", "75px");

    $(window).resize(function(){
        $(that.conf.selector).dialog("option", "width", $(window).width() * 0.98);
        $(that.conf.selector).dialog("option", "height", $(window).height() * 0.98);
        that.blockly.resizeDiv();
    });
    this.progChangeListener = function(prog, confirmingChangeRef)
    {
        this.updateName(prog.name);
        this.updateBlockly(prog, confirmingChangeRef); 
        this.updateIsActive(prog.active); 
    };
    this.progChangeListener = this.progChangeListener.bind(this);
};
ProgEditor.prototype.closeIfEditing = function(prog)
{
    if (prog === this.editingProg)
    {
        $(this.conf.selector).dialog("close");
        that.editingProg = null;
    }
};
ProgEditor.prototype.updateIsActive = function(active)
{
    if (active){
        $(this.playSelector).addClass("icon-program-disabled");
        $(this.stopSelector).removeClass("icon-program-disabled");
        this.animatePlay(true);
    } else {
        $(this.playSelector)
                .removeClass("icon-program-disabled")
                .css("color", "#000");
        $(this.stopSelector).addClass("icon-program-disabled");
        this.animatePlay(false);
    }
};
ProgEditor.prototype.animatePlay = function(enabled)
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
ProgEditor.prototype.updateName = function(name)
{
    $(this.nameSelector).val(name);
};
ProgEditor.prototype.updateBlockly = function(prog, confirmingChangeRef)
{
    if  (   this.blockly.getXml() == prog.xml ||
            this.isChangeRefInIgnoreList(confirmingChangeRef)
    ){
        return;
    }
    this.blockly.update(prog);
};
ProgEditor.prototype.isChangeRefInIgnoreList = function(changeRef)
{
    return (typeof this.ignoreChangeRefs[changeRef] !== "undefined");
};
ProgEditor.prototype.edit = function(prog)
{
    if (this.editingProg != null) this.editingProg.removeChangeListener(this.progChangeListener);
    this.editingProg = prog;
    this.editingProg.addChangeListener(this.progChangeListener);
    $(this.conf.selector).dialog('open');
    this.updateName(prog.name);
    this.updateIsActive(prog.active);
    this.blockly.show(prog);
};
ProgEditor.prototype.sendChangesToServer = function()
{
    var changeRef = Math.random().toString(32);
    this.ignoreChangeRefs[changeRef] = true;
    this.conf.serverConn.sendMessage({
        msgFor: "progManager",
        name: "modifyProg",
        changeRef: changeRef,
        value: {
            id: this.editingProg.id,
            js: this.editingProg.js,
            xml: this.editingProg.xml
        }
    });
}