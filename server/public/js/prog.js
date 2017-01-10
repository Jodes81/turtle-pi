

var Prog = function(conf)
{
    this.defConf = {
        id: null,
        name: "Program",
        xml: "",
        js: "",
        containerSelector: "#prog", 
        active: false,
        progEditor: null,
        serverConn: null,
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    update(this, this.conf, ['id', 'name', 'xml', 'js']); 
    this.changeListeners = $.Callbacks();
    this.isActive = false;
    this.button = new ProgButton({
        id: this.conf.id,
        containerSelector: this.conf.containerSelector
    });
    this.setActive(this.conf.active);
    this.drawButton();
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
    update(this, value, ['name', 'xml', 'active']); 
    $(this.nameSelector).text(this.name);
    this.setActive(this.active);
    this.changeListeners.fire(this, confirmingChangeRef);
};
Prog.prototype.removeButton = function()
{
    this.button.remove();
};
Prog.prototype.setActive = function(active)
{
    this.isActive = active;
    this.button.setActive(this.isActive);
};
Prog.prototype.drawButton = function()
{
    var that = this;
    
    this.button.draw();
    this.button.setName(this.conf.name);
    
    this.button.onToggle = function(){
        that.run(!that.isActive);
    }.bind(this);
    this.button.onEdit = function(){
        that.conf.progEditor.edit(this);
    }.bind(this);
    this.button.onDelete = function(){
        if (confirm("Delete "+that.name+": are you sure?")){
            that.conf.serverConn.sendMessage({
                msgFor: "progManager",
                name: "deleteProg",
                value: { id: that.id }
            });
        }
    }.bind(this);
};
Prog.prototype.run = function(run)
{
    this.conf.serverConn.sendMessage({
        msgFor: "progManager",
        name: run ? "runProg" : "stopProg",
        value: { id: this.id }
    });
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
        }
    });
};


