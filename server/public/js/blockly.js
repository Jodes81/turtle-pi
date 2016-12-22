var BlocklyWrapper = function(conf)
{
    var that = this;
    this.defConf = {
        containerSelector: "div.editor-dialog .blockly-container",
        selector: "div.editor-dialog .blockly-container > div",
        onChange: function(newJS, newXML, e){}
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    
    $(this.conf.containerSelector)
            .css("height", "calc(100% - 83px)")
            .css("border", "1px solid #aaa");

    $(this.conf.selector)
            .css("width", "100"); // without this, blockly starts out too wide, and resize miscalculates because scrollbars are created, making size smaller, then removed, leaving a gap

    var blocklyDiv = $(this.conf.selector)[0];
    this.workspace = Blockly.inject(blocklyDiv,
        {
            media: 'blockly/media/',
            toolbox: document.getElementById('toolbox')
        });

    this.saveTimeout = null;
    this.workspace.addChangeListener(this.changeListener.bind(this));
};

BlocklyWrapper.prototype.changeListener = function(e)
{
    if (this.isLoading) return;
    var that = this;
        if (this.saveTimeout == null){
            this.saveTimeout = setTimeout(function()
            {
                if (that.isLoading) return;
                that.conf.onChange(that.getJS(), that.getXml(), e);
                that.saveTimeout = null;
            }, 500);
        }
};

BlocklyWrapper.prototype.load = function(cmdButton)
{
    this.isLoading = true;
    this.workspace.clear();
    var xml = (typeof cmdButton.xml == "undefined") ? "" : cmdButton.xml;
    var xmlDom = Blockly.Xml.textToDom(xml);
    Blockly.Xml.domToWorkspace(
            xmlDom,
            this.workspace
        );    
    this.resize();
    if (!this.done) Blockly.svgResize(this.workspace); // trashcan stops working if done more than once!
    this.isLoading = false;
    this.done = true;
};
BlocklyWrapper.prototype.resize = function() {
    
    var container = $(this.conf.containerSelector)[0];
    var blocklyDiv = $(this.conf.selector)[0];
    
    // Compute the absolute coordinates and dimensions of blocklyArea.
    var element = container;
    var x = 0;
    var y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px';
    blocklyDiv.style.top = y + 'px';
    blocklyDiv.style.width = container.offsetWidth + 'px';
    blocklyDiv.style.height = container.offsetHeight + 'px';
};
BlocklyWrapper.prototype.getJS = function() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
//    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    return Blockly.JavaScript.workspaceToCode(this.workspace);
};
BlocklyWrapper.prototype.getXml = function() {
    var xmlDom = Blockly.Xml.workspaceToDom(this.workspace);
//    return Blockly.Xml.domToText(xmlDom);
    return Blockly.Xml.domToPrettyText(xmlDom);
};


