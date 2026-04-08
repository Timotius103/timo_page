/* ═══════ ANIMATED BACKGROUND ═══════ */
        (function () {
            const canvas = document.getElementById('bg-canvas');
            const ctx = canvas.getContext('2d');
            let W, H, particles = [];
            const COUNT = 90;

            function resize() {
                W = canvas.width = window.innerWidth;
                H = canvas.height = window.innerHeight;
            }
            resize();
            window.addEventListener('resize', resize);

            function rand(a, b) { return Math.random() * (b - a) + a; }

            for (let i = 0; i < COUNT; i++) {
                particles.push({
                    x: rand(0, 1), y: rand(0, 1),
                    r: rand(0.5, 1.8),
                    vx: rand(-0.08, 0.08), vy: rand(-0.06, 0.06),
                    o: rand(0.2, 0.6)
                });
            }

            function draw() {
                ctx.clearRect(0, 0, W, H);
                /* grid dots */
                ctx.fillStyle = 'rgba(100,255,218,0.04)';
                const step = 60;
                for (let x = 0; x < W; x += step) for (let y = 0; y < H; y += step) {
                    ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
                }
                /* particles */
                particles.forEach(p => {
                    p.x += p.vx / W * 1.5; p.y += p.vy / H * 1.5;
                    if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
                    if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
                    ctx.beginPath();
                    ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(100,255,218,${p.o})`;
                    ctx.fill();
                });
                /* connections */
                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = (particles[i].x - particles[j].x) * W;
                        const dy = (particles[i].y - particles[j].y) * H;
                        const d = Math.sqrt(dx * dx + dy * dy);
                        if (d < 120) {
                            ctx.strokeStyle = `rgba(100,255,218,${0.08 * (1 - d / 120)})`;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x * W, particles[i].y * H);
                            ctx.lineTo(particles[j].x * W, particles[j].y * H);
                            ctx.stroke();
                        }
                    }
                }
                requestAnimationFrame(draw);
            }
            draw();
        })();

        /* ═══════ CUSTOM CURSOR ═══════ */
        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        let mx = 0, my = 0, rx = 0, ry = 0;
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
        (function lerp() {
            rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
            dot.style.left = mx + 'px'; dot.style.top = my + 'px';
            ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
            requestAnimationFrame(lerp);
        })();
        document.querySelectorAll('a,button,.be-card,.fe-card,.exp-tab').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
        });

        /* ═══════ SCROLL PROGRESS ═══════ */
        const bar = document.getElementById('scroll-bar');
        window.addEventListener('scroll', () => {
            const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
            bar.style.width = pct + '%';
        });

        /* ═══════ NAV HIDE/SHOW ═══════ */
        let last = 0;
        const nav = document.getElementById('main-nav');
        window.addEventListener('scroll', () => {
            const cur = window.scrollY;
            nav.classList.toggle('hide', cur > last && cur > 80);
            nav.classList.toggle('scrolled', cur > 80);
            last = cur;
        });

        /* ═══════ REVEAL ON SCROLL ═══════ */
        const observer = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        /* Trigger visible on page load for hero items */
        setTimeout(() => {
            document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('visible'));
        }, 100);

        /* ═══════ EXPERIENCE TABS ═══════ */
        function showTab(btn, id) {
            document.querySelectorAll('.exp-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.exp-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(id).classList.add('active');
        }