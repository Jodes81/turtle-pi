function update(to, from)
{
    for (var k in from) to[k] = from[k];
    return to;
};