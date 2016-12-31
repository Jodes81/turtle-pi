
var storage = require('node-persist'); // https://www.npmjs.com/package/node-persist

var db = 
{
    isReady: false,
    notifyOnReady: [],
    addOnReady: function(callback)
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
    retrieve: function(key, onDone)
    {
        if (!db.isReady){
            console.error("Retrieve: storage is not up yet. (Tried to retrieve '"+key+"')");
        } else {
            storage.getItem(key).then(onDone);
        }
    },
    init: function()
    {
        storage.init().then(function(){
            db.isReady = true;
            db.notifyReady();
        });
    },
    notifyReady: function()
    {
        for (var i in db.notifyOnReady)
        {
            db.notifyOnReady[i]();
        }
    }
};

db.init();

module.exports = db;
