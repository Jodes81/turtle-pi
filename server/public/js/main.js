var turtle_large, joystick, serverConn, progManager, progEditor;

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
        console.info("Websocket closed. wasClean=", event.wasClean);
        retryTest();
    });

    $('.video').attr("src", 'http://'+document.location.hostname+':'+8090+'/?action=stream')

    progEditor = new ProgEditor({ 
        selector: "div.editor-dialog",
        serverConn: serverConn
    });

    progManager = new ProgManager({
        serverConn: serverConn,
        programContainerSelector: ".prog-container",
        progEditor: progEditor
    });
    progManager.load();
    
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
                progEditor.turtle.msgRx(msg);
                break;
            case "progManager":
                //progManager.msgRx(msg);
                break;
            default:
                console.warn("Not recognised msgFor type: "+msg.msgFor);
                break;
        }
    }
}
