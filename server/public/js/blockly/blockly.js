
var blocklyArea = document.getElementById('blocklyArea');
var blocklyDiv = document.getElementById('blocklyDiv');

var workspace = Blockly.inject(blocklyDiv,
    {
        media: 'blockly/media/',
        toolbox: document.getElementById('toolbox')
    });
Blockly.Xml.domToWorkspace(
        document.getElementById('startBlocks'), 
        workspace
    );
    
var onresize = function(e) {
  // Compute the absolute coordinates and dimensions of blocklyArea.
  var element = blocklyArea;
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
  blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
  blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
};

window.addEventListener('resize', onresize, false);
onresize();
Blockly.svgResize(workspace);

$(function(){
    $('#showjs').on("click", function()
    {
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
//        Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        var code = Blockly.JavaScript.workspaceToCode(workspace);
        alert(code);
    });
    $('#highlight').on("click", function()
    {
        var xml = Blockly.Xml.workspaceToDom(workspace);
        var id = $(xml).find("block").attr("id");
        workspace.highlightBlock(id);
    });
    $('#showxml').on("click", function()
    {
        console.log("Showing");
        var xmlDom = Blockly.Xml.workspaceToDom(workspace);
        var xmlText = Blockly.Xml.domToText(xmlDom);
        $('#xml').html(xmlText);
    });
});
