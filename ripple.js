const canvas = document.createElement('canvas');
canvas.id = 'ripple-canvas';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

let width, height;
let ripples = [];

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

class Ripple {
    constructor(x, y, maxR = null, st = null) {
        this.x = x;
        this.y = y;
        this.radius = 2;
        this.maxRadius = maxR || (60 + Math.random() * 40);
        this.speed = st || (0.8 + Math.random() * 1);
        this.alpha = 0.25;
    }

    update() {
        this.radius += this.speed;
        this.alpha -= this.speed / this.maxRadius * 0.25;
    }

    draw(ctx) {
        if (this.alpha <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(58, 134, 255, ${Math.max(0, this.alpha)})`;
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

let lastMouse = { x: 0, y: 0 };
let lastMoveTime = performance.now();

// Ripple on continuous motion
window.addEventListener('mousemove', (e) => {
    const now = performance.now();
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // throttle ripple creation
    if (dist > 50 || now - lastMoveTime > 150) {
        ripples.push(new Ripple(e.clientX, e.clientY));
        lastMouse.x = e.clientX;
        lastMouse.y = e.clientY;
        lastMoveTime = now;
    }
});

// Big ripple on click
window.addEventListener('click', (e) => {
    ripples.push(new Ripple(e.clientX, e.clientY, 150, 2));
    ripples[ripples.length - 1].alpha = 0.5;
});

function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].draw(ctx);
        if (ripples[i].alpha <= 0) {
            ripples.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

animate();
