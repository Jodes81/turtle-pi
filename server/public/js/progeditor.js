
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
    this.isEditing = false;
    this.editingProg = null;
    this.nameSelector = this.conf.selector + " input.name";
    this.turtle = null;
    this.blocklyContainerSelector = this.conf.selector + " .blockly-container";
    this.controlSelector = this.selector + " .control-bar"; // "div.editor-dialog .control-bar";
    
    this.blockly = new BlocklyWrapper({
        containerSelector: this.blocklyContainerSelector,
        selector: this.conf.selector + " .blockly-container div",
        onChange: function(newJs, newXml, e){
            if (!that.isEditing) return;
            that.editingProg.xml = newXml;
            that.editingProg.js = newJs;
            var changeRef = Math.random().toString(32);
            that.ignoreChangeRefs[changeRef] = true;
            serverConn.sendMessage({
                msgFor: "progManager",
                name: "modifyProg",
                changeRef: changeRef,
                value: {
                    id: that.editingProg.id,
                    js: newJs,
                    xml: newXml
                }
            })
        },
    });
    this.init();
};
ProgEditor.prototype.init = function()
{
    var that = this;
    $(this.conf.selector).dialog({
        autoOpen: false,
//        modal: true,
        resizable: false,
        width: "98%",
        height: 0.98 * $(window).height(),
        show: {effect: 'slide', duration: 200},
        hide: {effect: 'scale', duration: 300},
        close: function(){
        },
        beforeClose: function(){
            that.isEditingProg = false;
        },
    });
    $(this.nameSelector).on("change", function(){
        that.editingProg.changeName($(that.nameSelector).val());
    });
    this.turtle = new Turtle({ selector: this.conf.selector + " .turtle", });

    $(this.conf.controlSelector)
            .css("height", "75px");

    $(window).resize(function(){
        $(that.conf.selector).dialog("option", "width", $(window).width() * 0.98);
        $(that.conf.selector).dialog("option", "height", $(window).height() * 0.98);
        that.blockly.resize();
    });
};
ProgEditor.prototype.updateName = function(name)
{
    $(this.nameSelector).val(name);
};
ProgEditor.prototype.updateBlockly = function(prog, confirmingChangeRef)
{
    if  (
            this.blockly.getXml() == prog.xml ||
            this.isChangeRefInIgnoreList(confirmingChangeRef)
    ){
        return;
    }
    this.blockly.load(prog);
};
ProgEditor.prototype.isChangeRefInIgnoreList = function(changeRef)
{
    return (typeof this.ignoreChangeRefs[changeRef] !== "undefined");
};
ProgEditor.prototype.edit = function(prog)
{
    this.isEditing = true;
    this.editingProg = prog;
    $(this.conf.selector).dialog('open');
    $(this.nameSelector).val(prog.name);
    this.blockly.load(prog);
};
