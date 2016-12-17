
var storage = require('node-persist'); // https://www.npmjs.com/package/node-persist

storage.init().then(function(stuff){
//    console.log("INIT: ", stuff);
    db.isReady = true;
    
//    db.remove('buttons', function(){
//        notifyReady();
//    }); // FOR TESTING ONLY; REMOVE TO HAVE THEM PERSIST!
        
//    notifyReady();
});

function notifyReady(){
    for (var i in db.notifyOnReady)
    {
        db.notifyOnReady[i]();
    }
}

var db = 
{
    isReady: false,
    notifyOnReady: [],
    onReady: function(callback)
    {
        if (db.isReady)
            callback();
        else
            this.notifyOnReady.push(callback);
    },
    remove: function(key, onDone)
    {
        if (!db.isReady){
            console.error("Store: storage is not up yet. (Tried to remove '"+key+"')");
        } else {
            storage.removeItem(key).then(onDone);
        }
    },
    store: function(key, val, onDone)
    {
        if (!db.isReady){
            console.error("Store: storage is not up yet. (Tried to store '"+key+"':'"+val+"')");
        } else {
            storage.setItem(key, val).then(onDone);
        }
    },
    retrieve: function(key, onDone){
        if (!db.isReady){
            console.error("Retrieve: storage is not up yet. (Tried to retrieve '"+key+"')");
        } else {
            storage.getItem(key).then(onDone);
        }
    }
    
};

/*
storage.init().then(function(stuff){
    storage.setItem("Hello", "world").then(function(stuff){
        var thing = stuff[0];
        console.log("stuff: ", stuff[0], "arguments: ", arguments);
        console.log(thing.key, thing.value, thing.ttl);
        console.log("getItem: ", storage.getItem("Hello"));
        return "elloello";
    }).then(function(returned){
        console.log("NEXT THEN: ", returned)
    });
});
*/

module.exports = db;
