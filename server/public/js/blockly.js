var BlocklyWrapper = function(conf)
{
    this.defConf = {
        controlSelector: "div.editor-dialog .control-bar",
        containerSelector: "div.editor-dialog .blockly-container",
        selector: "div.editor-dialog .blockly-container > div",
    };
    this.conf = this.defConf; 
    update(this.conf, conf); 
    
    $(this.conf.controlSelector)
            .css("height", "75px");
    
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
//    this.firstTime = true;
};
BlocklyWrapper.prototype.load = function(cmdButton)
{
    Blockly.Xml.domToWorkspace(
            document.getElementById('startBlocks'), 
            this.workspace
        );    
    this.resize();
    Blockly.svgResize(this.workspace);
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

