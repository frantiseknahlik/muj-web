'use strict';

(() => {
    const $ = (s, el = document) => el.querySelector(s);
    const $$ = (s, el = document) => [...el.querySelectorAll(s)];
    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const store = {
        get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
    };

    const EMAIL = 'frantisek.nahlik299@gmail.com';
    const GITHUB_USER = 'frantiseknahlik';

    // Inline SVG icon from the sprite at the top of index.html
    const icon = (name, cls = '') => `<svg class="ic${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

    // =====================================================
    // I18N — Czech lives in the HTML, English in data-en
    // =====================================================
    let lang = store.get('fn-lang') === 'en' ? 'en' : 'cz';
    const t = (cz, en) => (lang === 'en' ? en : cz);

    $$('[data-en]').forEach(el => { el.dataset.cz = el.innerHTML.trim(); });
    $$('[data-en-ph]').forEach(el => { el.dataset.czPh = el.placeholder; });

    function setLang(next) {
        lang = next;
        root.lang = next === 'en' ? 'en' : 'cs';
        $$('[data-en]').forEach(el => { el.innerHTML = next === 'en' ? el.dataset.en : el.dataset.cz; });
        $$('[data-en-ph]').forEach(el => { el.placeholder = next === 'en' ? el.dataset.enPh : el.dataset.czPh; });
        $$('.lang-btn').forEach(b => b.classList.toggle('is-active', b.dataset.lang === next));
        store.set('fn-lang', next);
        document.dispatchEvent(new CustomEvent('langchange'));
    }

    $$('.lang-btn').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
    if (lang === 'en') setLang('en');

    // =====================================================
    // THEME
    // =====================================================
    const themeIcon = $('#theme-icon');
    const metaTheme = $('meta[name="theme-color"]');

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        themeIcon.querySelector('use').setAttribute('href', theme === 'dark' ? '#i-sun' : '#i-moon');
        if (metaTheme) metaTheme.content = theme === 'dark' ? '#0b1d5e' : '#f8f6f1';
    }

    function toggleTheme() {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        store.set('fn-theme', next);
        return next;
    }

    applyTheme(root.getAttribute('data-theme') || 'light');
    $('#theme-btn').addEventListener('click', toggleTheme);

    // =====================================================
    // TOAST
    // =====================================================
    const toastEl = $('#toast');
    let toastTimer;
    function toast(msg) {
        toastEl.textContent = msg;
        toastEl.classList.add('is-on');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2400);
    }

    // =====================================================
    // HERO — split letters, load-in, clock; card spotlight
    // =====================================================
    $$('.split').forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        [...text].forEach((ch, i) => {
            const s = document.createElement('span');
            s.className = 'ch';
            s.style.setProperty('--i', i + (el.classList.contains('serif') ? 4 : 0));
            s.textContent = ch;
            el.appendChild(s);
        });
    });

    $$('.hero-meta, .hero-code, .hero-copy, .term').forEach((el, i) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = (0.55 + i * 0.12) + 's';
    });

    const markLoaded = () => requestAnimationFrame(() => document.body.classList.add('is-loaded'));
    if (document.fonts && document.fonts.ready) {
        Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 900))]).then(markLoaded);
    } else {
        markLoaded();
    }

    const clock = $('#clock');
    const clockFmt = new Intl.DateTimeFormat('cs-CZ', {
        timeZone: 'Europe/Prague', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    });
    const tick = () => { clock.textContent = clockFmt.format(new Date()); };
    tick();
    setInterval(tick, 1000);

    if (finePointer && !reduceMotion) {
        $$('.cell').forEach(cell => {
            cell.addEventListener('pointermove', e => {
                const r = cell.getBoundingClientRect();
                cell.style.setProperty('--cx', (e.clientX - r.left) + 'px');
                cell.style.setProperty('--cy', (e.clientY - r.top) + 'px');
            });
        });
    }

    // =====================================================
    // SCROLL — progress, nav state, active link
    // =====================================================
    const nav = $('#nav');
    const progress = $('#progress');
    let lastY = window.scrollY;
    let ticking = false;

    function onScroll() {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        nav.classList.toggle('is-scrolled', y > 20);
        const menuOpen = navLinks.classList.contains('is-open');
        nav.classList.toggle('is-hidden', !menuOpen && y > lastY && y > 400);
        lastY = y;
        ticking = false;
    }
    window.addEventListener('scroll', () => {
        if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
    }, { passive: true });

    const linkMap = new Map($$('.nav-link').map(a => [a.getAttribute('href').slice(1), a]));
    const sectionObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const link = linkMap.get(entry.target.id);
            if (!link) {
                if (entry.isIntersecting) linkMap.forEach(l => l.classList.remove('is-active'));
                return;
            }
            if (entry.isIntersecting) {
                linkMap.forEach(l => l.classList.remove('is-active'));
                link.classList.add('is-active');
            }
        });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(s => sectionObs.observe(s));

    // =====================================================
    // MOBILE MENU
    // =====================================================
    const burger = $('#burger');
    const navLinks = $('#nav-links');
    function setMenu(open) {
        navLinks.classList.toggle('is-open', open);
        nav.classList.toggle('menu-open', open);
        burger.setAttribute('aria-expanded', String(open));
    }
    burger.addEventListener('click', () => setMenu(!navLinks.classList.contains('is-open')));
    $$('.nav-link').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('click', e => {
        if (navLinks.classList.contains('is-open') && !nav.contains(e.target)) setMenu(false);
    });

    onScroll();

    // =====================================================
    // REVEAL + COUNTERS
    // =====================================================
    $$('.bento, .projects, .timeline, .stats').forEach(group => {
        $$(':scope > .reveal', group).forEach((el, i) => el.style.setProperty('--d', (i % 4) * 0.08 + 's'));
    });

    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in');
            revealObs.unobserve(entry.target);
            $$('.count', entry.target).forEach(countUp);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(el => revealObs.observe(el));

    function countUp(el) {
        const target = Number(el.dataset.count) || 0;
        if (reduceMotion) { el.textContent = target; return; }
        const dur = 1200;
        const start = performance.now();
        const step = now => {
            const p = Math.min(1, (now - start) / dur);
            el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    // =====================================================
    // MAGNETIC BUTTONS
    // =====================================================
    if (finePointer && !reduceMotion) {
        $$('.magnetic').forEach(btn => {
            btn.addEventListener('pointermove', e => {
                const r = btn.getBoundingClientRect();
                const x = (e.clientX - r.left - r.width / 2) * 0.18;
                const y = (e.clientY - r.top - r.height / 2) * 0.3;
                btn.style.transform = `translate(${x}px, ${y}px)`;
            });
            btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
        });
    }

    // =====================================================
    // CUSTOM CURSOR — dot + trailing ring, mouse only
    // states: link (grows), view (filled pill with label), text (I-beam), down (pressed)
    // =====================================================
    if (finePointer) {
        const cur = document.createElement('div');
        cur.className = 'cursor is-hidden';
        cur.setAttribute('aria-hidden', 'true');
        cur.innerHTML = '<span class="cursor-ring"><span class="cursor-label"></span></span><span class="cursor-dot"></span>';
        document.body.appendChild(cur);
        root.classList.add('has-cursor');

        const ring = $('.cursor-ring', cur);
        const dot = $('.cursor-dot', cur);
        const label = $('.cursor-label', cur);
        const LINKS = 'a, button, [role="button"], label, select, summary, .email';
        const TEXT = 'input:not([type="radio"]):not([type="checkbox"]), textarea, .term-body';
        let mx = -100, my = -100, rx = -100, ry = -100;

        const setState = el => {
            const view = el && el.closest('.project');
            const text = !view && el && el.closest(TEXT);
            const link = !view && !text && el && el.closest(LINKS);
            cur.classList.toggle('is-view', !!view);
            cur.classList.toggle('is-text', !!text);
            cur.classList.toggle('is-link', !!link);
            if (view) label.textContent = t('Otevřít', 'Open');
        };

        document.addEventListener('pointermove', e => {
            if (e.pointerType !== 'mouse') return;
            mx = e.clientX;
            my = e.clientY;
            if (cur.classList.contains('is-hidden')) { rx = mx; ry = my; cur.classList.remove('is-hidden'); }
            dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        }, { passive: true });
        document.addEventListener('pointerover', e => setState(e.target));
        document.addEventListener('pointerdown', () => cur.classList.add('is-down'));
        document.addEventListener('pointerup', () => cur.classList.remove('is-down'));
        document.documentElement.addEventListener('pointerleave', () => cur.classList.add('is-hidden'));
        window.addEventListener('blur', () => cur.classList.add('is-hidden'));

        (function follow() {
            const k = reduceMotion ? 1 : cur.classList.contains('is-text') ? 0.45 : 0.2;
            rx += (mx - rx) * k;
            ry += (my - ry) * k;
            ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
            requestAnimationFrame(follow);
        })();
    }

    // =====================================================
    // SUBNET CALCULATOR (used by terminal + project modal)
    // =====================================================
    const ipToInt = ip => {
        const parts = ip.trim().split('.');
        if (parts.length !== 4) return null;
        let n = 0;
        for (const p of parts) {
            if (!/^\d{1,3}$/.test(p) || Number(p) > 255) return null;
            n = n * 256 + Number(p);
        }
        return n >>> 0;
    };
    const intToIp = n => [24, 16, 8, 0].map(s => (n >>> s) & 255).join('.');

    function parseCidr(raw) {
        const s = String(raw).trim().replace(/^\//, '');
        if (/^\d{1,2}$/.test(s) && Number(s) <= 32) return Number(s);
        const m = ipToInt(s);
        if (m === null) return null;
        const bin = m.toString(2).padStart(32, '0');
        return /^1*0*$/.test(bin) ? bin.indexOf('0') === -1 ? 32 : bin.indexOf('0') : null;
    }

    function subnet(ipStr, cidrStr) {
        const ip = ipToInt(ipStr);
        const cidr = parseCidr(cidrStr);
        if (ip === null || cidr === null) return null;
        const mask = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr)) >>> 0;
        const network = (ip & mask) >>> 0;
        const broadcast = (network | (~mask >>> 0)) >>> 0;
        const total = 2 ** (32 - cidr);
        let first = network + 1, last = broadcast - 1, usable = total - 2;
        if (cidr === 32) { first = last = network; usable = 1; }
        if (cidr === 31) { first = network; last = broadcast; usable = 2; }
        return {
            cidr,
            network: intToIp(network),
            broadcast: intToIp(broadcast),
            mask: intToIp(mask),
            wildcard: intToIp(~mask >>> 0),
            first: intToIp(first),
            last: intToIp(last),
            usable: usable.toLocaleString('cs-CZ'),
        };
    }

    // =====================================================
    // PROJECT DATA
    // =====================================================
    const PROJECTS = {
        vault: {
            num: '01 — Security',
            title: ['Secure Password Manager', 'Secure Password Manager'],
            desc: [
                'Lokální aplikace pro bezpečné ukládání hesel, která data na disku šifruje pomocí AES. Projekt vznikl hlavně proto, abych do hloubky pochopil kryptografii a bezpečné ukládání citlivých dat.',
                'A local application for storing passwords safely, encrypting data on disk with AES. I built it mainly to understand cryptography and secure storage of sensitive data in depth.',
            ],
            learn: [
                ['Jak funguje symetrické šifrování AES', 'How symmetric AES encryption works'],
                ['Proč se hesla nikdy neukládají v čistém textu', 'Why passwords are never stored in plain text'],
                ['Bezpečné čtení a zápis citlivých dat na disk', 'Reading and writing sensitive data to disk safely'],
            ],
            stack: ['Python', 'AES', 'Cryptography', 'CLI'],
        },
        scanner: {
            num: '02 — Python',
            title: ['Python Port Scanner', 'Python Port Scanner'],
            desc: [
                'Skript v Pythonu, který proskenuje lokální síť — najde aktivní zařízení a zjistí jejich otevřené porty. Skvělý způsob, jak si na vlastní kůži osahat, jak spolu zařízení v síti komunikují.',
                'A Python script that scans a local network — it finds active devices and their open ports. A great hands-on way to see how devices on a network talk to each other.',
            ],
            learn: [
                ['Práce se sockety a TCP handshake', 'Working with sockets and the TCP handshake'],
                ['Jak funguje skenování portů a proč je důležité', 'How port scanning works and why it matters'],
                ['Paralelní běh pro rychlejší sken', 'Concurrency for faster scans'],
            ],
            stack: ['Python', 'Sockets', 'TCP/IP', 'Networking'],
        },
        subnet: {
            num: '03 — Web',
            title: ['Subnet IP kalkulačka', 'Subnet IP Calculator'],
            desc: [
                'Webová aplikace: zadáš IP adresu a masku a kalkulačka spočítá adresu sítě, broadcast a rozsah použitelných adres. Níže si ji můžeš vyzkoušet naživo.',
                'A web app: enter an IP address and a mask and it calculates the network address, broadcast and the usable host range. Try it live below.',
            ],
            learn: [
                ['Binární logika — AND, OR a bitové masky', 'Binary logic — AND, OR and bit masks'],
                ['CIDR zápis a dělení sítí na podsítě', 'CIDR notation and splitting networks into subnets'],
                ['Validace vstupů od uživatele v JavaScriptu', 'Validating user input in JavaScript'],
            ],
            stack: ['JavaScript', 'HTML', 'CSS', 'Networking'],
            lab: true,
        },
        portfolio: {
            num: '04 — Web',
            title: ['Tohle portfolio', 'This portfolio'],
            desc: [
                'Osobní web postavený od nuly — čisté HTML, CSS a JavaScript bez frameworků. Interaktivní terminál, příkazová paleta (Ctrl K), světlý i tmavý režim, dvě jazykové verze a živá data z GitHub API.',
                'A personal site built from scratch — plain HTML, CSS and JavaScript with no frameworks. An interactive terminal, command palette (Ctrl K), light and dark mode, two languages and live data from the GitHub API.',
            ],
            learn: [
                ['Návrh vlastního design systému v CSS proměnných', 'Designing a custom design system with CSS variables'],
                ['Přístupnost, výkon a responzivní layout', 'Accessibility, performance and responsive layout'],
                ['Práce s veřejným API (GitHub)', 'Working with a public API (GitHub)'],
            ],
            stack: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
        },
    };

    // =====================================================
    // PROJECT FILTER
    // =====================================================
    const projectEls = $$('.project');
    $$('.filter').forEach(btn => {
        btn.addEventListener('click', () => {
            $$('.filter').forEach(b => b.classList.toggle('is-active', b === btn));
            const f = btn.dataset.filter;
            projectEls.forEach(p => {
                const show = f === 'all' || p.dataset.cat === f;
                p.classList.toggle('is-out', !show);
                if (show) {
                    p.classList.remove('in');
                    requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add('in')));
                }
            });
        });
    });

    // =====================================================
    // PROJECT MODAL
    // =====================================================
    const modal = $('#modal');
    let lastFocus = null;
    let currentProject = null;

    function renderModal(id) {
        const p = PROJECTS[id];
        const idx = lang === 'en' ? 1 : 0;
        $('#m-num').textContent = p.num;
        $('#m-title').textContent = p.title[idx];
        $('#m-desc').textContent = p.desc[idx];
        $('#m-learn').innerHTML = p.learn.map(l => `<li>${l[idx]}</li>`).join('');
        $('#m-stack').innerHTML = p.stack.map(s => `<span>${s}</span>`).join('');

        const extra = $('#m-extra');
        extra.innerHTML = '';
        if (p.lab) {
            extra.innerHTML = `
                <div class="lab">
                    <div class="lab-head"><span>${t('Vyzkoušej si to', 'Try it yourself')}</span><span class="chip-live">live</span></div>
                    <div class="lab-inputs">
                        <input id="lab-ip" value="192.168.10.34" aria-label="${t('IP adresa', 'IP address')}" spellcheck="false" inputmode="decimal">
                        <input id="lab-cidr" value="/26" aria-label="${t('Maska nebo prefix', 'Mask or prefix')}" spellcheck="false">
                    </div>
                    <div class="lab-out" id="lab-out"></div>
                </div>`;
            const ipIn = $('#lab-ip'), cidrIn = $('#lab-cidr'), out = $('#lab-out');
            const calc = () => {
                const r = subnet(ipIn.value, cidrIn.value);
                ipIn.classList.toggle('bad', ipToInt(ipIn.value) === null);
                cidrIn.classList.toggle('bad', parseCidr(cidrIn.value) === null);
                const rows = r ? [
                    [t('Síť', 'Network'), `${r.network}/${r.cidr}`],
                    ['Broadcast', r.broadcast],
                    [t('První host', 'First host'), r.first],
                    [t('Poslední host', 'Last host'), r.last],
                    [t('Maska', 'Mask'), r.mask],
                    [t('Použitelné adresy', 'Usable hosts'), r.usable],
                ] : [[t('Chyba', 'Error'), t('Neplatná IP nebo maska', 'Invalid IP or mask')]];
                out.innerHTML = rows.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');
            };
            ipIn.addEventListener('input', calc);
            cidrIn.addEventListener('input', calc);
            calc();
        }
    }

    function openProject(id) {
        if (!PROJECTS[id]) return;
        currentProject = id;
        lastFocus = document.activeElement;
        const card = $(`.project[data-id="${id}"]`);
        const pvHost = $('#m-pv');
        pvHost.innerHTML = '';
        if (card) {
            const pv = $('.pv', card).cloneNode(true);
            $$('[id]', pv).forEach(el => el.removeAttribute('id'));
            pvHost.appendChild(pv);
        }
        renderModal(id);
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => modal.classList.add('is-open'));
        $('#modal-close').focus();
    }

    function closeModal() {
        if (modal.hidden) return;
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
        currentProject = null;
        setTimeout(() => { modal.hidden = true; }, 300);
        if (lastFocus) lastFocus.focus({ preventScroll: true });
    }

    projectEls.forEach(card => {
        card.addEventListener('click', () => openProject(card.dataset.id));
        card.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openProject(card.dataset.id); }
        });
    });
    $('#modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    modal.addEventListener('keydown', e => {
        if (e.key !== 'Tab') return;
        const f = $$('button, input, a[href]', modal).filter(el => el.offsetParent !== null);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    });
    document.addEventListener('langchange', () => { if (currentProject) renderModal(currentProject); });

    // Vault cipher shimmer
    const cipher = $('#cipher');
    if (cipher && !reduceMotion) {
        const b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        setInterval(() => {
            let s = 'U2FsdGVkX1';
            for (let i = 0; i < 34; i++) s += b64[Math.floor(Math.random() * 64)];
            $$('.vault-cipher').forEach(el => { el.textContent = s; });
        }, 1400);
    }

    // =====================================================
    // GITHUB — live repo count + latest repos
    // =====================================================
    const LANG_COLORS = {
        JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', 'C#': '#178600', HTML: '#e34c26',
        CSS: '#663399', Shell: '#89e051', Java: '#b07219', 'C++': '#f34b7d', C: '#555555', PHP: '#4F5D95',
    };
    const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    let ghRepos = [];

    async function loadGithub() {
        try {
            const [userRes, reposRes] = await Promise.all([
                fetch(`https://api.github.com/users/${GITHUB_USER}`),
                fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=12`),
            ]);
            if (userRes.ok) {
                const user = await userRes.json();
                const el = $('#repo-count');
                if (typeof user.public_repos === 'number') {
                    el.innerHTML = `<span class="count" data-count="${user.public_repos}">0</span>`;
                    countUp($('.count', el));
                }
            }
            if (reposRes.ok) {
                ghRepos = (await reposRes.json()).filter(r => !r.fork);
                renderGithub();
            }
        } catch (e) { /* offline or rate-limited — section stays hidden */ }
    }

    function renderGithub() {
        const repos = ghRepos.slice(0, 4);
        if (!repos.length) return;
        const fmt = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' });
        $('#gh-list').innerHTML = repos.map(r => `
            <a class="gh-item" href="${esc(r.html_url)}" target="_blank" rel="noopener">
                <span class="gh-name"><span>${esc(r.name)}</span>${icon('arrow-right', 'i-diag')}</span>
                <span class="gh-desc">${esc(r.description || t('Bez popisu', 'No description'))}</span>
                <span class="gh-meta">
                    ${r.language ? `<b style="--lang:${LANG_COLORS[r.language] || 'var(--dim)'}">${esc(r.language)}</b>` : ''}
                    <span>${fmt.format(new Date(r.pushed_at))}</span>
                </span>
            </a>`).join('');
        $('#gh').hidden = false;
    }
    document.addEventListener('langchange', renderGithub);
    loadGithub();

    // =====================================================
    // COPY EMAIL
    // =====================================================
    const emailBtn = $('#copy-email');
    const emailState = $('#email-state');

    async function copyEmail() {
        try {
            await navigator.clipboard.writeText(EMAIL);
        } catch (e) {
            const ta = document.createElement('textarea');
            ta.value = EMAIL;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
        }
        emailBtn.classList.add('is-copied');
        emailState.textContent = t('Zkopírováno ✓', 'Copied ✓');
        toast(t('E-mail zkopírován do schránky', 'E-mail copied to clipboard'));
        setTimeout(() => {
            emailBtn.classList.remove('is-copied');
            emailState.textContent = t('Kopírovat', 'Copy');
        }, 2200);
    }
    emailBtn.addEventListener('click', copyEmail);

    // =====================================================
    // CONTACT FORM — validates, then opens a prefilled e-mail
    // =====================================================
    const form = $('#contact-form');
    const formError = $('#form-error');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const name = $('#f-name'), email = $('#f-email'), msg = $('#f-msg');
        const checks = [
            [name, name.value.trim().length > 1],
            [email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())],
            [msg, msg.value.trim().length > 4],
        ];
        checks.forEach(([el, ok]) => el.parentElement.classList.toggle('is-invalid', !ok));
        const firstBad = checks.find(([, ok]) => !ok);
        if (firstBad) {
            formError.textContent = t('Vyplňte prosím jméno, platný e-mail a zprávu.', 'Please fill in your name, a valid e-mail and a message.');
            firstBad[0].focus();
            return;
        }
        formError.textContent = '';
        const topic = (new FormData(form).get('topic')) || 'Zpráva';
        const subject = `[${topic}] ${name.value.trim()} — frantisek-nahlik.com`;
        const body = `${msg.value.trim()}\n\n—\n${name.value.trim()}\n${email.value.trim()}`;
        window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        toast(t('Otevírám e-mailový klient…', 'Opening your e-mail app…'));
    });
    $$('.field input, .field textarea', form).forEach(el =>
        el.addEventListener('input', () => el.parentElement.classList.remove('is-invalid')));

    // =====================================================
    // FOOTER SYS LOG
    // =====================================================
    const sysLog = $('#sys-log');
    const sysMessages = [
        'All systems operational.',
        'Firewall: active.',
        'TLS 1.3 handshake complete.',
        'No active threats detected.',
        '0 vulnerabilities found. Keep looking.',
        'Ready for requests.',
    ];
    let sysIdx = 0;
    sysLog.textContent = sysMessages[0];
    setInterval(() => {
        sysIdx = (sysIdx + 1) % sysMessages.length;
        sysLog.style.opacity = '0';
        setTimeout(() => { sysLog.textContent = sysMessages[sysIdx]; sysLog.style.opacity = '1'; }, 300);
    }, 3600);

    // =====================================================
    // TERMINAL
    // =====================================================
    const termOut = $('#term-out');
    const termInput = $('#term-input');
    const termBody = $('#term-body');
    const history = [];
    let histIdx = 0;

    const PROMPT = '<span class="p-user">frantisek</span><span class="p-at">@</span><span class="p-host">portfolio</span> <span class="p-path">~</span> <span class="p-sign">$</span>';

    function print(html, cls) {
        const line = document.createElement('div');
        if (cls) line.className = cls;
        line.innerHTML = html;
        termOut.appendChild(line);
        termBody.scrollTop = termBody.scrollHeight;
    }

    const go = id => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    const COMMANDS = {
        help: () => [
            `<span class="t-dim">${t('Dostupné příkazy:', 'Available commands:')}</span>`,
            `  <span class="t-acc">whoami</span>      ${t('kdo jsem', 'who I am')}`,
            `  <span class="t-acc">skills</span>      ${t('co umím', 'what I know')}`,
            `  <span class="t-acc">projects</span>    ${t('moje projekty', 'my projects')}`,
            `  <span class="t-acc">subnet</span>      ${t('kalkulačka — např.', 'calculator — e.g.')} subnet 10.0.0.5/22`,
            `  <span class="t-acc">contact</span>     ${t('jak mě kontaktovat', 'how to reach me')}`,
            `  <span class="t-acc">ls</span>, <span class="t-acc">cat</span>     ${t('procházej soubory', 'browse files')}`,
            `  <span class="t-acc">theme</span>       ${t('světlý / tmavý režim', 'light / dark mode')}`,
            `  <span class="t-acc">lang</span>        ${t('přepni jazyk', 'switch language')} (cz / en)`,
            `  <span class="t-acc">clear</span>       ${t('vyčistit terminál', 'clear the terminal')}`,
        ].join('\n'),
        whoami: () => t(
            `<span class="t-acc">František Náhlík</span> — student IT, Uherské Hradiště.\nStavím weby, píšu v C# a Pythonu a učím se, jak systémy prolomit — abych je uměl ochránit.\n<span class="t-dim">Cíl:</span> penetrační testování.`,
            `<span class="t-acc">František Náhlík</span> — IT student, Uherské Hradiště, CZ.\nI build websites, write C# and Python and learn how systems break — so I can protect them.\n<span class="t-dim">Goal:</span> penetration testing.`),
        skills: () => [
            `<span class="t-g">●</span> Cyber Security   <span class="t-dim">OWASP, pentesting, Wireshark</span>`,
            `<span class="t-g">●</span> Web Development  <span class="t-dim">HTML, CSS, JavaScript</span>`,
            `<span class="t-y">●</span> C#               <span class="t-dim">${t('teď se učím', 'learning now')}</span>`,
            `<span class="t-g">●</span> Python           <span class="t-dim">scripting, automation</span>`,
            `<span class="t-g">●</span> Networking       <span class="t-dim">TCP/IP, subnetting</span>`,
            `<span class="t-g">●</span> Linux            <span class="t-dim">bash, terminal</span>`,
        ].join('\n'),
        projects: () => {
            setTimeout(() => go('work'), 500);
            return [
                `<span class="t-b">01</span> Secure Password Manager   <span class="t-dim">python · aes</span>`,
                `<span class="t-b">02</span> Python Port Scanner       <span class="t-dim">python · sockets</span>`,
                `<span class="t-b">03</span> Subnet IP ${t('kalkulačka', 'Calculator')}      <span class="t-dim">js · networking</span>`,
                `<span class="t-b">04</span> ${t('Tohle portfolio', 'This portfolio')}           <span class="t-dim">html · css · js</span>`,
                `<span class="t-dim">${t('→ scrolluji na projekty…', '→ scrolling to projects…')}</span>`,
            ].join('\n');
        },
        contact: () => [
            `email     <a class="t-link" href="mailto:${EMAIL}">${EMAIL}</a>`,
            `github    <a class="t-link" href="https://github.com/${GITHUB_USER}" target="_blank" rel="noopener">@${GITHUB_USER}</a>`,
            `instagram <a class="t-link" href="https://www.instagram.com/frantissekk" target="_blank" rel="noopener">@frantissekk</a>`,
        ].join('\n'),
        ls: () => `<span class="t-b">projects/</span>  <span class="t-b">skills/</span>  about.txt  contact.txt  <span class="t-dim">.secrets</span>`,
        cat: args => {
            const f = (args[0] || '').replace(/^\.\//, '');
            if (!f) return t('použití: cat &lt;soubor&gt;', 'usage: cat &lt;file&gt;');
            if (f === 'about.txt') return COMMANDS.whoami();
            if (f === 'contact.txt') return COMMANDS.contact();
            if (f === '.secrets') return `<span class="t-r">${t('Přístup odepřen.', 'Permission denied.')}</span> ${t('Hezký pokus ;)', 'Nice try ;)')}`;
            if (f.startsWith('projects')) return COMMANDS.projects();
            if (f.startsWith('skills')) return COMMANDS.skills();
            return `cat: ${esc(f)}: ${t('Soubor nenalezen', 'No such file or directory')}`;
        },
        subnet: args => {
            const [ip, cidr] = (args[0] || '').split('/');
            const r = ip && cidr ? subnet(ip, cidr) : null;
            if (!r) return t('použití: subnet 192.168.1.10/24', 'usage: subnet 192.168.1.10/24');
            return [
                `network    <span class="t-acc">${r.network}/${r.cidr}</span>`,
                `broadcast  ${r.broadcast}`,
                `hosts      ${r.first} – ${r.last}  <span class="t-dim">(${r.usable})</span>`,
                `mask       ${r.mask}`,
            ].join('\n');
        },
        theme: () => {
            const next = toggleTheme();
            return t(`Režim: ${next === 'dark' ? 'tmavý' : 'světlý'}`, `Theme: ${next}`);
        },
        lang: args => {
            const l = (args[0] || '').toLowerCase();
            if (l !== 'cz' && l !== 'en') return t('použití: lang cz | lang en', 'usage: lang cz | lang en');
            setLang(l);
            return l === 'en' ? 'Language: English' : 'Jazyk: čeština';
        },
        date: () => new Date().toLocaleString(lang === 'en' ? 'en-GB' : 'cs-CZ', { timeZone: 'Europe/Prague' }),
        echo: args => esc(args.join(' ')),
        github: () => { window.open(`https://github.com/${GITHUB_USER}`, '_blank', 'noopener'); return t('Otevírám GitHub…', 'Opening GitHub…'); },
        history: () => history.map((h, i) => `  ${String(i + 1).padStart(3)}  ${esc(h)}`).join('\n') || '',
        sudo: () => `<span class="t-r">frantisek is not in the sudoers file.</span> ${t('Incident byl nahlášen.', 'This incident will be reported.')}`,
        rm: () => `<span class="t-r">${t('Zamítnuto. Tenhle web má zálohy.', 'Denied. This site has backups.')}</span>`,
        nmap: () => [
            `Starting Nmap … ${t('na', 'on')} frantisek-nahlik.com`,
            `PORT     STATE  SERVICE`,
            `443/tcp  <span class="t-g">open</span>   https`,
            `1337/tcp <span class="t-g">open</span>   ${t('nadšení-pro-bezpečnost', 'passion-for-security')}`,
            `<span class="t-dim">${t('Hotovo. 1 kandidát na stáž nalezen.', 'Done. 1 internship candidate found.')}</span>`,
        ].join('\n'),
        exit: () => t('Odsud se neodchází. Zkus <span class="t-acc">contact</span>.', 'There is no exit. Try <span class="t-acc">contact</span>.'),
    };
    COMMANDS.about = COMMANDS.whoami;
    COMMANDS['?'] = COMMANDS.help;

    function run(raw) {
        const line = raw.trim();
        print(`${PROMPT} <span class="t-cmd">${esc(line)}</span>`);
        if (!line) return;
        history.push(line);
        histIdx = history.length;
        const [cmd, ...args] = line.split(/\s+/);
        const name = cmd.toLowerCase();
        if (name === 'clear' || name === 'cls') { termOut.innerHTML = ''; return; }
        const fn = COMMANDS[name];
        const out = fn ? fn(args) : `${t('příkaz nenalezen', 'command not found')}: ${esc(cmd)} — ${t('zkus', 'try')} <span class="t-acc">help</span>`;
        if (out) print(out);
    }

    $('#term-form').addEventListener('submit', e => {
        e.preventDefault();
        run(termInput.value);
        termInput.value = '';
    });

    termInput.addEventListener('keydown', e => {
        if (e.key === 'ArrowUp' && history.length) {
            e.preventDefault();
            histIdx = Math.max(0, histIdx - 1);
            termInput.value = history[histIdx];
        } else if (e.key === 'ArrowDown' && history.length) {
            e.preventDefault();
            histIdx = Math.min(history.length, histIdx + 1);
            termInput.value = history[histIdx] || '';
        } else if (e.key === 'Tab') {
            const v = termInput.value.trim().toLowerCase();
            if (!v) return;
            const match = Object.keys(COMMANDS).find(c => c.startsWith(v));
            if (match) { e.preventDefault(); termInput.value = match + ' '; }
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            termOut.innerHTML = '';
        }
    });

    termBody.addEventListener('click', e => {
        if (e.target.closest('a')) return;
        if (window.getSelection().toString()) return;
        termInput.focus({ preventScroll: true });
    });

    // Boot sequence: auto-types `whoami` once
    function boot() {
        print(`<span class="t-dim">Last login: ${new Date().toLocaleDateString(lang === 'en' ? 'en-GB' : 'cs-CZ')} on ttys001</span>`);
        const cmd = 'whoami';
        if (reduceMotion) { run(cmd); print(`<span class="t-dim">${t('Napiš', 'Type')} <span class="t-acc">help</span> ${t('pro další příkazy.', 'for more commands.')}</span>`); return; }
        let i = 0;
        const typer = setInterval(() => {
            termInput.value = cmd.slice(0, ++i);
            if (i === cmd.length) {
                clearInterval(typer);
                setTimeout(() => {
                    termInput.value = '';
                    run(cmd);
                    print(`<span class="t-dim">${t('Napiš', 'Type')} <span class="t-acc">help</span> ${t('pro další příkazy.', 'for more commands.')}</span>`);
                }, 380);
            }
        }, 110);
    }
    setTimeout(boot, 1300);

    // =====================================================
    // COMMAND PALETTE (Ctrl/Cmd + K)
    // =====================================================
    const cmdk = $('#cmdk');
    const cmdkInput = $('#cmdk-input');
    const cmdkList = $('#cmdk-list');
    let cmdkItems = [];
    let cmdkActive = 0;
    let cmdkLastFocus = null;

    const paletteActions = () => [
        { group: t('Navigace', 'Navigate'), icon: 'user', label: t('O mně', 'About'), hint: '01', run: () => go('about') },
        { group: t('Navigace', 'Navigate'), icon: 'layer-group', label: t('Dovednosti', 'Skills'), hint: '02', run: () => go('skills') },
        { group: t('Navigace', 'Navigate'), icon: 'route', label: t('Cesta', 'Journey'), hint: '03', run: () => go('journey') },
        { group: t('Navigace', 'Navigate'), icon: 'briefcase', label: t('Projekty', 'Projects'), hint: '04', run: () => go('work') },
        { group: t('Navigace', 'Navigate'), icon: 'envelope', label: t('Kontakt', 'Contact'), hint: '05', run: () => go('contact') },
        { group: t('Akce', 'Actions'), icon: 'copy', label: t('Zkopírovat e-mail', 'Copy e-mail'), hint: EMAIL, run: copyEmail },
        { group: t('Akce', 'Actions'), icon: 'circle-half-stroke', label: t('Přepnout světlý / tmavý režim', 'Toggle light / dark mode'), hint: 'theme', run: toggleTheme },
        { group: t('Akce', 'Actions'), icon: 'language', label: t('Switch to English', 'Přepnout do češtiny'), hint: lang === 'en' ? 'CZ' : 'EN', run: () => setLang(lang === 'en' ? 'cz' : 'en') },
        { group: t('Akce', 'Actions'), icon: 'terminal', label: t('Otevřít terminál', 'Open terminal'), hint: '~$', run: () => { go('hero'); setTimeout(() => termInput.focus({ preventScroll: true }), 500); } },
        { group: t('Akce', 'Actions'), icon: 'calculator', label: t('Subnet kalkulačka', 'Subnet calculator'), hint: 'live', run: () => openProject('subnet') },
        { group: t('Odkazy', 'Links'), icon: 'github', label: 'GitHub', hint: '@' + GITHUB_USER, run: () => window.open(`https://github.com/${GITHUB_USER}`, '_blank', 'noopener') },
        { group: t('Odkazy', 'Links'), icon: 'instagram', label: 'Instagram', hint: '@frantissekk', run: () => window.open('https://www.instagram.com/frantissekk', '_blank', 'noopener') },
    ];

    function renderPalette() {
        const q = cmdkInput.value.trim().toLowerCase();
        cmdkItems = paletteActions().filter(a => !q || a.label.toLowerCase().includes(q) || a.group.toLowerCase().includes(q) || a.hint.toLowerCase().includes(q));
        cmdkActive = 0;
        if (!cmdkItems.length) {
            cmdkList.innerHTML = `<div class="cmdk-empty">${t('Nic nenalezeno.', 'No results.')}</div>`;
            return;
        }
        let html = '', group = '';
        cmdkItems.forEach((a, i) => {
            if (a.group !== group) { group = a.group; html += `<div class="cmdk-group">${group}</div>`; }
            html += `<div class="cmdk-item${i === 0 ? ' is-active' : ''}" role="option" data-i="${i}"><span class="cmdk-ico">${icon(a.icon)}</span><span>${a.label}</span><span class="hint">${esc(a.hint)}</span></div>`;
        });
        cmdkList.innerHTML = html;
    }

    function setActive(i) {
        const els = $$('.cmdk-item', cmdkList);
        if (!els.length) return;
        cmdkActive = (i + els.length) % els.length;
        els.forEach((el, j) => el.classList.toggle('is-active', j === cmdkActive));
        els[cmdkActive].scrollIntoView({ block: 'nearest' });
    }

    function openPalette() {
        cmdkLastFocus = document.activeElement;
        cmdk.hidden = false;
        cmdkInput.value = '';
        renderPalette();
        cmdkInput.focus();
    }

    function closePalette() {
        if (cmdk.hidden) return;
        cmdk.hidden = true;
        if (cmdkLastFocus) cmdkLastFocus.focus({ preventScroll: true });
    }

    function execPalette(i) {
        const a = cmdkItems[i];
        if (!a) return;
        closePalette();
        a.run();
    }

    $('#cmd-open').addEventListener('click', openPalette);
    cmdkInput.addEventListener('input', renderPalette);
    cmdkList.addEventListener('click', e => {
        const item = e.target.closest('.cmdk-item');
        if (item) execPalette(Number(item.dataset.i));
    });
    cmdkList.addEventListener('mousemove', e => {
        const item = e.target.closest('.cmdk-item');
        if (item && Number(item.dataset.i) !== cmdkActive) setActive(Number(item.dataset.i));
    });
    cmdk.addEventListener('click', e => { if (e.target === cmdk) closePalette(); });
    cmdkInput.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(cmdkActive + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(cmdkActive - 1); }
        else if (e.key === 'Enter') { e.preventDefault(); execPalette(cmdkActive); }
    });

    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            cmdk.hidden ? openPalette() : closePalette();
            return;
        }
        if (e.key === 'Escape') {
            if (!cmdk.hidden) closePalette();
            else if (!modal.hidden) closeModal();
            else if (navLinks.classList.contains('is-open')) setMenu(false);
        }
    });
})();
