function update(to, from, propNames)
{
    if (typeof propNames != "undefined")
    {
        for (var i in propNames)
        {
            // so has same behaviour as when propNames is not defined; specifically,
            // if a property is not in `from`, that property in `to` will not be removed (ie undefined)
            if (typeof from[propNames[i]] == "undefined") continue; 
            to[propNames[i]] = from[propNames[i]];
        }
    }
    else 
    {
        for (var k in from) to[k] = from[k];
    }
    return to;
};