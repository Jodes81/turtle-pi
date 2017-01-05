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
    if (this.isLoading) return; // DOES NOT WORK!
    var that = this;
    if (this.saveTimeout == null){
        this.saveTimeout = setTimeout(function()
        {
            if (that.isLoading) return; // Necessary so if new program is opened, previous will not be replaced with new
            that.conf.onChange(that.getJS(), that.getXml(), e);
            that.saveTimeout = null;
        }, 500);
    }
    
};

BlocklyWrapper.prototype.update = function(prog)
{
    var that = this;
    this.isLoading = true;
    this.workspace.clear();
    var xml = (typeof prog.xml == "undefined") ? "" : prog.xml;
    var xmlDom = Blockly.Xml.textToDom(xml);
    Blockly.Xml.domToWorkspace(
            xmlDom,
            this.workspace
        );    
    setTimeout(function(){
        that.isLoading = false; // Blockly triggers onChange asynchronously after workspace updated
    }, 500);
};

BlocklyWrapper.prototype.show = function(prog)
{
    this.update(prog);
    this.resizeDiv();
    this.resizeSvgIfNotDone(); // MUST NOT be done while is NOT showing
};
BlocklyWrapper.prototype.resizeSvgIfNotDone = function()
{
    if (this.resizeSvgDone !== true){
        Blockly.svgResize(this.workspace);
    } // trashcan stops working if done more than once!
    this.resizeSvgDone = true;
};
BlocklyWrapper.prototype.resizeDiv = function()
{
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


