
var CmdEditor = function(conf)
{
    this.defConf = {
        selector: "div.editor-dialog",
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    
    this.blockly = null;
    this.isEditing = false;
    this.editingCmd = null;
    this.nameSelector = this.conf.selector + " input.name";
    this.turtle = null;
    this.blocklyContainerSelector = this.conf.selector + " .blockly-container";
    this.blockly = new BlocklyWrapper({
        containerSelector: this.blocklyContainerSelector,
        selector: this.conf.selector + " .blockly-container div",
        logSelector: this.conf.selector + " .blockly-log",
    });
    this.init();
};
CmdEditor.prototype.init = function()
{
    var that = this;
    $(this.conf.selector).dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: "98%",
        height: 0.98 * $(window).height(),
        show: {effect: 'slide', duration: 200},
        hide: {effect: 'scale', duration: 300},
        close: function(){
            that.isEditingCmd = false;
        },
    });
    $(this.nameSelector).on("change", function(){
        that.editingCmd.changeName($(that.nameSelector).val());
    });
    this.turtle = new Turtle({ selector: this.conf.selector + " .turtle", });

    $(window).resize(function(){
        $(that.conf.selector).dialog("option", "width", $(window).width() * 0.98);
        $(that.conf.selector).dialog("option", "height", $(window).height() * 0.98);
        that.blockly.resize();
    });
};
CmdEditor.prototype.updateName = function(name)
{
    $(this.nameSelector).val(name);
};
CmdEditor.prototype.edit = function(cmdButton)
{
    this.isEditing = true;
    this.editingCmd = cmdButton;
    $(this.conf.selector).dialog('open');
    $(this.nameSelector).val(cmdButton.name);

    this.blockly.load(cmdButton);
};
