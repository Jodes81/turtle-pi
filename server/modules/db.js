
var storage = require('node-persist'); // https://www.npmjs.com/package/node-persist

/*
 * ====== Thoughts =======
 *  - Add another layer to manage collections of objects, and the objects themselves
 *  - A `modify()` method for the above
 *  - Modify objects in memory only, with persistence and asynchronous issues abstracted away
 *  - Make the methods below return Promises
 *  - async / await??
 *  - can the isReady check be removed altogether, and have the operations perform once complete? (Using promises?)
 *  - Use promises' catch feature to solve the above and other error situations (or try/catch with async/await)
 *  - 
 * 
 */

var db = 
{
    isReady: false,
    notifyOnReady: [],
    init: function()
    {
        storage.init().then(function(){
            db.isReady = true;
            db.notifyReady();
        });
    },
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
