var canvas = document.querySelector('.world');
var ctx = canvas.getContext('2d');
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
});
window.dispatchEvent(new Event('resize'));
var last_frame = performance.now();
var screen_offset = [0, 0];
var SLICE_SIZE = 100;       // sqrt of amount of tiles in a slice

var map = {
    /* There is room for huge performance gains. Typed arrayes, grouping by color, tile etc.
     */
    0: {
        0: 'blue',
        1: 'white',
        2: 'red'
    },
    1: {
        0: 'green',
        1: 'brown'
    }
};

// BTW the rendering animation opacity thingy could be done with a seperate state. prob best way.

var START_TILE_SIZE = 30;
var tile_size = START_TILE_SIZE;
var START_TILE_MARGIN = 5;
var tile_margins = START_TILE_MARGIN;

function update() {
    var now = performance.now();
    var delta_time = now - last_frame;
    var lastframe = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // calculate what we should render based on what will fit
    var tilemarg = tile_margins + tile_size;
    var max_x_tiles = Math.floor(0.6 * canvas.width / tilemarg);
    var max_y_tiles = Math.floor(0.6 * canvas.height / tilemarg);
    for(
        var x = -max_x_tiles - Math.floor(screen_offset[0] / tilemarg);
        x < max_x_tiles - Math.floor(screen_offset[0] / tilemarg);
        x++
    ) {
        for(
            var y = -max_y_tiles - Math.floor(screen_offset[1] / tilemarg);
            y < max_y_tiles - Math.floor(screen_offset[1] / tilemarg);
            y++
        ) {
            if(map[x] && map[x][y]) {
                ctx.fillStyle = map[x][y];
            } else
                ctx.fillStyle = 'white';
            ctx.fillRect(
                screen_offset[0] + tilemarg * x + canvas.width / 2,
                screen_offset[1] + tilemarg * y + canvas.height / 2,
                tile_size,
                tile_size
            );
        }
    }

    requestAnimationFrame(update);
}

update();

// TODO Some momentum would be nice!
var draggin = false;
canvas.addEventListener('mousemove', function(e) {
    if(draggin) {
        screen_offset[0] += 2 * e.movementX;
        screen_offset[1] += 2 * e.movementY;
    }
});

canvas.addEventListener('mousedown', function(e) {
    draggin = true;
});
canvas.addEventListener('mouseup', function(e) {
    draggin = false;
});

// Zoom
canvas.addEventListener('mousewheel', function(e) {
    if(e.wheelDeltaY > 0) {
        tile_size *= 1.1;
        tile_margins *= 1.1;
    } else {
        tile_size *= 0.9;
        tile_margins *= 0.9;
    }
});
