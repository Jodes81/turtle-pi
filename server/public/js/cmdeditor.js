
var CmdEditor = function(conf)
{
    this.defConf = {
        selector: "",
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    
    this.isEditing = false;
    this.editingCmd = null;
    this.nameSelector = this.conf.selector + " input.name";
    this.init();
};
CmdEditor.prototype.init = function()
{
    var that = this;
    $(this.conf.selector).dialog({
        autoOpen: false,
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
};
