(function() {
    var START_TILE_SIZE = 30;
    var START_TILE_MARGIN = 5;
    var tile_size = START_TILE_SIZE;
    var tile_margins = START_TILE_MARGIN;
    var screen_offset = [0, 0];

    // DOM
    var canvas = document.querySelector('.world');
    var ctx = canvas.getContext('2d');
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth * window.devicePixelRatio;
        canvas.height = window.innerHeight * window.devicePixelRatio;
    });
    window.dispatchEvent(new Event('resize'));

    function tiles() {
        var tilemarg = tile_margins + tile_size;
        var max_x_tiles = 0.7 * canvas.width / tilemarg;
        var max_y_tiles = 0.7 * canvas.height / tilemarg;
        for(
            var x = Math.floor(-max_x_tiles - screen_offset[0] / tilemarg);
            x < Math.floor(max_x_tiles - screen_offset[0] / tilemarg);
            x++
        ) {
            for(
                var y = Math.floor(-max_y_tiles - screen_offset[1] / tilemarg);
                y < Math.floor(max_y_tiles - screen_offset[1] / tilemarg);
                y++
            ) {
                ctx.fillStyle = world.getTile(x, y);
                ctx.fillRect(
                    screen_offset[0] + tilemarg * x + canvas.width / 2,
                    screen_offset[1] + tilemarg * y + canvas.height / 2,
                    tile_size,
                    tile_size
                );
            }
        }
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tiles();
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
})();
