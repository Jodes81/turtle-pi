var turtle_large, joystick, serverConn, cmdButtonManager, cmdEditor;

$(function(){
        doLoad(); 
});

function doLoad()
{
    serverConn = new ServerConn({
        onMessages: routeMsgs,
        onOpen: function()
        {
            if (serverConn.wasClosed)
            {
                location.reload(true);
            }
            $("body").css("background-color", "#ddd");                
        }
    });
    var reconnectTime = 1000;
    
    function retryTest(){
        $("body").css("background-color", "#888");
        setTimeout(function(){
            serverConn.testConn(function(ok)
            { 
                if (ok){
                    serverConn.setup();
                } else {
                    retryTest();
                }
            });
        }, reconnectTime);
    }    
    serverConn.addCloseListener(function(event){
        console.log("Websocket closed. wasClean=", event.wasClean);
        retryTest();
    });

    cmdEditor = new CmdEditor({ selector: "div.editor-dialog" });

    cmdButtonManager = new CmdButtonManager({
        serverConn: serverConn,
        buttonContainerSelector: ".cmd-button-container",
        cmdEditor: cmdEditor
    });
    cmdButtonManager.load();
    
    joystick = new Joystick({
        selector: "div.joystick",
        onChange: function(newState){}
    });
    turtle_large = new Turtle({
        selector: "div.turtle_large",
        onCommand: function(wheel, direction){
            serverConn.send(JSON.stringify({
                msgFor: "wheel",
                name: wheel,
                value: direction
            }));
        }
    });

    function cheekyButton(sel, name){
        $(sel).on("click", function(){
            serverConn.sendMessage({ msgFor: "guiCommandButton", name: name, value: "" });
        });
    }
    cheekyButton('.RunEval', "RunEval");
    cheekyButton('.RunVM2', "RunVM2");
    cheekyButton('.StopVM2', "StopVM2");
    cheekyButton('.ResetVM2Fiber', "ResetVM2Fiber");
    cheekyButton('.RunJSInterpreter', "RunJSInterpreter");
};
function routeMsgs(msgs)
{
    for (var i in msgs){
        var msg = msgs[i];
        switch (msg.msgFor)
        {
            case "irSensor":
            case "wheel":
                turtle_large.msgRx(msg);
                cmdEditor.turtle.msgRx(msg);
                break;
            case "cmdButtonManager":
                //cmdButtonManager.msgRx(msg);
                break;
            default:
                console.warn("Not recognised msgFor type: "+msg.msgFor);
                break;
        }
    }
}
