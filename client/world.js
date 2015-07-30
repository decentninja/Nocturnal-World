var canvas = document.querySelector('.world');
var ctx = canvas.getContext('2d');
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
});
window.dispatchEvent(new Event('resize'));
var last_frame = performance.now();
function update() {
    var now = performance.now();
    var delta_time = now - last_frame;
    var lastframe = now;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(10, 10, 10, 10);
    requestAnimationFrame(update);
}

update();

