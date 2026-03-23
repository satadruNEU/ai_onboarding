import { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 55;
const ACCENT = { r: 200, g: 200, b: 200 };
const PURPLE = { r: 140, g: 140, b: 140 };

export default function ParticleCanvas({ active }) {
    const canvasRef = useRef(null);
    const animRef = useRef(null);

    useEffect(() => {
        if (!active) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, particles = [];

        function resize() {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        }
        function rand(a, b) { return a + Math.random() * (b - a); }
        function makeParticle() {
            const color = Math.random() > 0.6 ? PURPLE : ACCENT;
            return { x: rand(0, W), y: rand(0, H), r: rand(0.8, 2.2), vx: rand(-0.12, 0.12), vy: rand(-0.18, -0.06), opacity: rand(0.08, 0.45), pulse: rand(0, Math.PI * 2), pulseSpeed: rand(0.005, 0.018), color };
        }
        function init() { particles = []; for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(makeParticle()); }

        function drawConnections() {
            const maxDist = 130;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < maxDist) {
                        ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(200,200,200,${(1 - dist / maxDist) * 0.06})`; ctx.lineWidth = 0.5; ctx.stroke();
                    }
                }
            }
        }

        function tick() {
            ctx.clearRect(0, 0, W, H);
            drawConnections();
            particles.forEach(p => {
                p.x += p.vx; p.y += p.vy; p.pulse += p.pulseSpeed;
                if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10; if (p.y < -10) p.y = H + 10;
                const pulsed = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color.r},${p.color.g},${p.color.b},${pulsed})`; ctx.fill();
            });
            animRef.current = requestAnimationFrame(tick);
        }

        resize(); init(); tick();
        const onResize = () => { resize(); init(); };
        window.addEventListener('resize', onResize);
        return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', onResize); };
    }, [active]);

    return <canvas ref={canvasRef} id="particle-canvas" className={active ? 'visible' : ''} />;
}
