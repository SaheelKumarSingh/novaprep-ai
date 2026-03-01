const cursorCanvas = document.getElementById('cursor-canvas');
const cCtx = cursorCanvas.getContext('2d', { alpha: true });

let pWidth, pHeight;
let mouse = { x: -1000, y: -1000 };
let rMouse = { x: -1000, y: -1000 };

function initDisplay() {
    pWidth = window.innerWidth;
    pHeight = window.innerHeight;
    cursorCanvas.width = pWidth;
    cursorCanvas.height = pHeight;
}

window.addEventListener('resize', initDisplay);

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});
window.addEventListener('mouseout', () => { mouse.x = -1000; mouse.y = -1000; });

/* ====== CURSOR ENGINE ====== */
let dustParticles = [];

function drawCustomCursor() {
    cCtx.clearRect(0, 0, pWidth, pHeight);

    if (mouse.x === -1000) return;

    // Easing for smooth follow
    if (rMouse.x === -1000) { rMouse.x = mouse.x; rMouse.y = mouse.y; }
    else { rMouse.x += (mouse.x - rMouse.x) * 0.95; rMouse.y += (mouse.y - rMouse.y) * 0.95; }

    // Spawn dust logic (more frequent while moving)
    let dist = Math.sqrt(Math.pow(mouse.x - rMouse.x, 2) + Math.pow(mouse.y - rMouse.y, 2));
    if (dist > 5 || Math.random() > 0.3) {
        dustParticles.push({
            x: rMouse.x + (Math.random() - 0.5) * 8,
            y: rMouse.y + (Math.random() - 0.5) * 8,
            life: 1.0,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }

    // Draw trailing dust
    for (let i = dustParticles.length - 1; i >= 0; i--) {
        let p = dustParticles[i];
        p.life -= 0.05;
        p.x += p.vx;
        p.y += p.vy;

        if (p.life <= 0) {
            dustParticles.splice(i, 1);
            continue;
        }

        cCtx.beginPath();
        cCtx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        // Deep cosmic red with bright center
        cCtx.fillStyle = `rgba(255, 51, 102, ${p.life})`;
        cCtx.fill();
    }

    // Draw main dot overlay
    cCtx.beginPath();
    cCtx.arc(rMouse.x, rMouse.y, 3.5, 0, Math.PI * 2);
    // Add a slight radial glow to the main dot
    let glow = cCtx.createRadialGradient(rMouse.x, rMouse.y, 0, rMouse.x, rMouse.y, 10);
    glow.addColorStop(0, '#ff3366');
    glow.addColorStop(1, 'rgba(255, 51, 102, 0)');
    cCtx.fillStyle = glow;
    cCtx.fill();
}

/* ====== LOOP ====== */
initDisplay();

function loop() {
    drawCustomCursor();
    requestAnimationFrame(loop);
}
loop();
