function update(to, from, propNames)
{
    if (typeof propNames != "undefined")
    {
        for (var i in propNames)
        {
            to[propNames[i]] = from[propNames[i]];
        }
    }
    else 
    {
        for (var k in from) to[k] = from[k];
    }
    return to;
};