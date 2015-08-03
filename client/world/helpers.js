// Helper functions for interacting with the world.
// Example: shape.circle(0, 0, 50).set(function(x, y) {return 'rgb(' + Math.abs(x)*10 + ',' + Math.abs(y)*10 + ', 100)';}).save()
// Does not care or know about implementation details such as mapslices, 


function ProxyTile(x, y) {
    this.x = x;
    this.y = y;
    this.color = world.getTile(x, y);
    this.new_color = null;
}

function Tileset(what) {
    this.what = what;       // [tile]
}

Tileset.prototype.save = function() {
    var changes = {};
    var that = this;
    that.what.forEach(function(tile) {
        if(tile.new_color) {
            if(!changes[tile.x])
                changes[tile.x] = {}
            changes[tile.x][tile.y] = tile.new_color;
        }
    });
    world.update_tiles(changes);
    return this;
}

Tileset.prototype.set = function(to) {
    this.what.forEach(function(tile) {
        if(to instanceof Function)
            tile.new_color = to(tile.x, tile.y, tile.color);
        else 
            tile.new_color = to;
    });
    return this;
}

var shape = {
    rect: function(x1, y1, x2, y2) {
        var set = [];
        for(var x = x1; x < x2; x++) {
            for(var y = y1; y < y2; y++) {
                set.push(new ProxyTile(x, y));
            } 
        }
        return new Tileset(set);
    },
    circle: function(xcenter, ycenter, radius) {
        var set = [];
        for(var x = xcenter - radius; x < xcenter + radius; x++) {
            for(var y = xcenter - radius; y < xcenter + radius; y++) {
                if(Math.sqrt(Math.pow(x - xcenter, 2) + Math.pow(y - ycenter, 2)) < radius)
                    set.push(new ProxyTile(x, y));
            } 
        }
        return new Tileset(set);
    },
    single: function(x, y) {
        return new Tileset([new ProxyTile(x, y)]);
    }
};
