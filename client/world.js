var canvas = document.querySelector('.world');
var ctx = canvas.getContext('2d');
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
});
window.dispatchEvent(new Event('resize'));
var last_frame = performance.now();
var location_center = [0, 0];       // center of view
var SLICE_SIZE = 100;       // sqrt of amount of tiles in a slice

var map = {
    /* There is room for huge performance gains. Typed arrayes, grouping by color.
     The positions are offsets from the tile position. No negative values are allowed.
     */
    0: {
        0: {
            tiles: {
                0: {
                    0: 'blue',
                    1: 'white',
                    2: 'red'
                },
                1: {
                    0: 'green',
                    1: 'brown'
                }
            }
        }
    }
};

var tile_size = 30;
var tile_margins = 5;

function update() {
    var now = performance.now();
    var delta_time = now - last_frame;
    var lastframe = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // render slice 0, 0;
    var tiles = map[0][0].tiles;
    Object.keys(tiles).forEach(function(x) {
        Object.keys(tiles[x]).forEach(function(y) {
            ctx.fillStyle = tiles[x][y];
            ctx.fillRect(
                tile_margins + (tile_size + tile_margins) * x,
                tile_margins + (tile_size + tile_margins) * y, 
                tile_size,
                tile_size
            );
        });
    });
    requestAnimationFrame(update);
}

update();

