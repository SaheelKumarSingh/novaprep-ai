const bgCanvas = document.getElementById('background-canvas');
const bgCtx = bgCanvas.getContext('2d', { alpha: false });

const cursorCanvas = document.getElementById('cursor-canvas');
const cCtx = cursorCanvas.getContext('2d', { alpha: true });

let width, height;
let realMouse = { x: -1000, y: -1000 };
let renderedCursor = { x: -1000, y: -1000 };
let stars = [];
let particles = [];

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;

    bgCanvas.width = width;
    bgCanvas.height = height;

    cursorCanvas.width = width;
    cursorCanvas.height = height;

    initUniverse();
}

function initUniverse() {
    stars = [];
    const numStars = Math.floor((width * height) / 1000);
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            z: Math.random() * 2 + 0.1,
            size: Math.random() * 1.5 + 0.5,
            alpha: Math.random() * 0.8 + 0.2,
            blinkSpeed: (Math.random() - 0.5) * 0.02
        });
    }
}

window.addEventListener('resize', resize);
window.addEventListener('mousemove', (e) => {
    realMouse.x = e.clientX;
    realMouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
    realMouse.x = -1000;
    realMouse.y = -1000;
});

resize();

function drawNebula() {
    const cx = width / 2;
    const cy = height / 2;

    // Deep space galaxy core
    let grad = bgCtx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height) * 0.8);
    grad.addColorStop(0, '#020b17');
    grad.addColorStop(0.5, '#010206');
    grad.addColorStop(1, '#010206');

    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, width, height);
}

function drawStars() {
    const prxX = (realMouse.x - width / 2) * 0.02;
    const prxY = (realMouse.y - height / 2) * 0.02;

    stars.forEach(s => {
        s.alpha += s.blinkSpeed;
        if (s.alpha > 1 || s.alpha < 0.2) s.blinkSpeed *= -1;

        const px = s.x - (prxX / s.z);
        const py = s.y - (prxY / s.z);

        bgCtx.globalAlpha = Math.max(0, Math.min(1, s.alpha));
        bgCtx.beginPath();
        bgCtx.arc(px, py, s.size, 0, Math.PI * 2);
        bgCtx.fillStyle = '#ffffff';
        bgCtx.fill();
    });
    bgCtx.globalAlpha = 1.0;
}

function handleCursorPhysics() {
    if (realMouse.x === -1000) return;

    if (renderedCursor.x === -1000) {
        renderedCursor.x = realMouse.x;
        renderedCursor.y = realMouse.y;
    } else {
        // High responsiveness
        renderedCursor.x += (realMouse.x - renderedCursor.x) * 0.95;
        renderedCursor.y += (realMouse.y - renderedCursor.y) * 0.95;
    }

    // Spawn red cosmic dust aura
    // Emanates a faint trail of glowing particles
    if (Math.random() > 0.3) {
        particles.push({
            x: renderedCursor.x + (Math.random() - 0.5) * 8,
            y: renderedCursor.y + (Math.random() - 0.5) * 8,
            size: Math.random() * 1.5 + 0.5,
            life: 1.0,
            decay: Math.random() * 0.03 + 0.02,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4
        });
    }
}

function drawCustomCursor() {
    cCtx.clearRect(0, 0, width, height);

    if (realMouse.x === -1000) return;

    // Draw cosmic dust aura particles
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.life -= p.decay;
        p.x += p.vx;
        p.y += p.vy;

        if (p.life <= 0) {
            particles.splice(i, 1);
            continue;
        }

        cCtx.beginPath();
        cCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        cCtx.fillStyle = `rgba(255, 51, 102, ${p.life})`;
        cCtx.shadowColor = '#ff3366';
        cCtx.shadowBlur = 8;
        cCtx.fill();
    }

    cCtx.save();
    cCtx.translate(renderedCursor.x, renderedCursor.y);

    // Core red dot
    cCtx.beginPath();
    cCtx.arc(0, 0, 3.5, 0, Math.PI * 2);

    // Subtle inner aura gradient instead of massive blur so it doesn't overdo it
    let aura = cCtx.createRadialGradient(0, 0, 1, 0, 0, 15);
    aura.addColorStop(0, '#ffffff');
    aura.addColorStop(0.2, '#ff3366');
    aura.addColorStop(1, 'transparent');

    cCtx.fillStyle = aura;
    // Removing wide shadowBlur here directly on the dot to prevent bleeding, relying on gradient + particles
    cCtx.fill();

    cCtx.restore();
}

function loop() {
    drawNebula();
    drawStars();

    handleCursorPhysics();
    drawCustomCursor();

    requestAnimationFrame(loop);
}

loop();
