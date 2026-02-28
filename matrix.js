const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let nodes = [];
let mouse = { x: -1000, y: -1000, radius: 150 };

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    initNodes();
}

window.addEventListener('resize', resize);

// Node class for the grid
class Node {
    constructor(x, y) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
    }

    update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Repel from mouse
        if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.vx -= Math.cos(angle) * force * 2;
            this.vy -= Math.sin(angle) * force * 2;
        }

        // Return to base position
        const returnX = this.baseX - this.x;
        const returnY = this.baseY - this.y;
        this.vx += returnX * 0.05;
        this.vy += returnY * 0.05;

        // Friction
        this.vx *= 0.8;
        this.vy *= 0.8;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fill();
    }
}

function initNodes() {
    nodes = [];
    const spacing = 40;
    const cols = Math.floor(width / spacing);
    const rows = Math.floor(height / spacing);

    for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
            nodes.push(new Node(i * spacing, j * spacing));
        }
    }
}

// Track mouse
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

function drawConnections() {
    for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];

        // Draw line from mouse to nearby nodes
        const mDist = Math.sqrt(Math.pow(mouse.x - n1.x, 2) + Math.pow(mouse.y - n1.y, 2));
        if (mDist < mouse.radius * 1.5) {
            const opacity = 1 - (mDist / (mouse.radius * 1.5));
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n1.x, n1.y);
            ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.8})`; // Cyan glow
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Draw network connections between nodes
        for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dist = Math.sqrt(Math.pow(n1.x - n2.x, 2) + Math.pow(n1.y - n2.y, 2));

            // Only connect if they are close enough and near mouse
            if (dist < 60 && mDist < mouse.radius * 2) {
                const opacity = (1 - (mDist / (mouse.radius * 2))) * (1 - (dist / 60));
                ctx.beginPath();
                ctx.moveTo(n1.x, n1.y);
                ctx.lineTo(n2.x, n2.y);
                ctx.strokeStyle = `rgba(255, 0, 255, ${opacity * 0.4})`; // Magenta secondary connection
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function getGradient(x, y) {
    let g = ctx.createRadialGradient(x, y, 0, x, y, mouse.radius * 2);
    g.addColorStop(0, 'rgba(0, 255, 255, 0.05)');
    g.addColorStop(1, 'transparent');
    return g;
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw localized glow around mouse
    if (mouse.x > 0) {
        ctx.fillStyle = getGradient(mouse.x, mouse.y);
        ctx.fillRect(0, 0, width, height);
    }

    nodes.forEach(node => {
        node.update();
        node.draw(ctx);
    });

    drawConnections();

    requestAnimationFrame(animate);
}

resize();
animate();
