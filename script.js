'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // ===========================
    // CURSOR
    // ===========================
    const cursor = document.getElementById('cursor');
    const cursorDot = document.getElementById('cursor-dot');
    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    document.addEventListener('mousedown', () => cursor.classList.add('is-click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('is-click'));

    (function animateCursor() {
        curX += (mouseX - curX) * 0.12;
        curY += (mouseY - curY) * 0.12;
        cursor.style.left = curX + 'px';
        cursor.style.top = curY + 'px';
        requestAnimationFrame(animateCursor);
    })();

    document.querySelectorAll('a, button, .project-card, .skill-card, .email-row, .filter-btn, .tl-card').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
    });


    // ===========================
    // SCROLL PROGRESS
    // ===========================
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const scrolled = document.documentElement.scrollTop;
        const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progressBar.style.width = (scrolled / total * 100) + '%';
    }, { passive: true });


    // ===========================
    // NAVBAR — hide/show + scrolled style
    // ===========================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const current = window.pageYOffset;
        navbar.classList.toggle('scrolled', current > 40);
        if (current > lastScroll && current > 120) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
        lastScroll = current;
    }, { passive: true });


    // ===========================
    // HAMBURGER MENU
    // ===========================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('open');
        });
    });


    // ===========================
    // REVEAL ON SCROLL
    // ===========================
    const revealEls = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // stagger children slightly
                setTimeout(() => entry.target.classList.add('visible'), 0);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    revealEls.forEach(el => observer.observe(el));


    // ===========================
    // THEME TOGGLE
    // ===========================
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = document.getElementById('theme-icon');

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem('theme', next);
        if (mapInstance) updateMapTiles(next);
    });

    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
        themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }


    // ===========================
    // LANGUAGE TOGGLE
    // ===========================
    const langBtns = document.querySelectorAll('.lang-btn');

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            setLanguage(btn.dataset.lang);
        });
    });

    function setLanguage(lang) {
        document.querySelectorAll('.lang-text').forEach(el => {
            const val = el.getAttribute('data-' + lang);
            if (!val) return;
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = val;
            } else {
                el.innerHTML = val;
            }
        });
    }


    // ===========================
    // COPY EMAIL
    // ===========================
    const copyEmail = document.getElementById('copy-email');
    const copyTag = document.getElementById('copy-tag');
    if (copyEmail) {
        copyEmail.addEventListener('click', () => {
            const email = copyEmail.querySelector('.email-addr').innerText.trim();
            navigator.clipboard.writeText(email).then(() => {
                const activeLang = document.querySelector('.lang-btn.active')?.dataset.lang || 'cz';
                copyTag.innerText = activeLang === 'en' ? 'Copied!' : 'Zkopírováno!';
                setTimeout(() => {
                    copyTag.setAttribute('data-cz', 'Kopírovat');
                    copyTag.setAttribute('data-en', 'Copy');
                    copyTag.innerText = activeLang === 'en' ? 'Copy' : 'Kopírovat';
                }, 2000);
            });
        });
    }


    // ===========================
    // PROJECT FILTER
    // ===========================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            projectCards.forEach(card => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                if (match) {
                    card.style.opacity = '1';
                    card.style.transform = 'none';
                    card.style.display = 'block';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.97)';
                    setTimeout(() => {
                        if (card.dataset.category !== filter && filter !== 'all') {
                            card.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });


    // ===========================
    // PROJECT MODAL
    // ===========================
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modal-close');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalTagsEl = document.getElementById('modal-tags');

    if (modal) {
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                modalImg.src = img ? img.src : '';
                modalImg.alt = img ? img.alt : '';
                modalTitle.innerText = card.dataset.title || '';
                modalDesc.innerText = card.dataset.desc || '';

                // Tags
                modalTagsEl.innerHTML = '';
                const tags = (card.dataset.tags || '').split(' ').filter(Boolean);
                tags.forEach(tag => {
                    const span = document.createElement('span');
                    span.innerText = tag;
                    modalTagsEl.appendChild(span);
                });

                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        };
        modalClose.addEventListener('click', closeModal);
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });
    }


    // ===========================
    // MAP
    // ===========================
    let mapInstance = null;
    let tileLayer = null;

    function initMap() {
        const mapEl = document.getElementById('map');
        if (!mapEl || mapInstance) return;

        mapInstance = L.map('map', {
            scrollWheelZoom: false,
            zoomControl: true
        }).setView([49.0667, 17.4583], 13);

        const marker = L.marker([49.0667, 17.4583]).addTo(mapInstance);
        marker.bindPopup('<strong>Uherské Hradiště</strong><br>Česká Republika').openPopup();

        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        addTiles(theme);
    }

    function addTiles(theme) {
        if (!mapInstance) return;
        const url = theme === 'dark'
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
        if (tileLayer) mapInstance.removeLayer(tileLayer);
        tileLayer = L.tileLayer(url, { attribution: '© CartoDB' }).addTo(mapInstance);
    }

    function updateMapTiles(theme) { addTiles(theme); }

    // Lazy init map when it scrolls into view
    const mapSection = document.querySelector('.map-section');
    if (mapSection) {
        const mapObs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                initMap();
                mapObs.disconnect();
            }
        }, { threshold: 0.1 });
        mapObs.observe(mapSection);
    }


    // ===========================
    // GITHUB STATS
    // ===========================
    async function fetchGithubStats() {
        try {
            const res = await fetch('https://api.github.com/users/frantiseknahlik');
            if (!res.ok) return;
            const data = await res.json();
            const el = document.getElementById('repo-count');
            if (el && data.public_repos !== undefined) el.innerText = data.public_repos;
        } catch (e) { /* silent */ }
    }
    fetchGithubStats();


    // ===========================
    // CYBER LOG IN FOOTER
    // ===========================
    const cyberLog = document.getElementById('cyber-log');
    if (cyberLog) {
        const messages = [
            'No active threats detected.',
            'Monitoring scroll patterns.',
            'Core systems encrypted.',
            'Analyzing viewport data.',
            'Connection secure.',
            'Ready for requests.',
            'Firewall: active.',
        ];
        let idx = 0;
        setInterval(() => {
            idx = (idx + 1) % messages.length;
            cyberLog.style.opacity = '0';
            setTimeout(() => {
                cyberLog.innerText = messages[idx];
                cyberLog.style.opacity = '1';
                cyberLog.style.transition = 'opacity 0.4s';
            }, 300);
        }, 3500);
    }


    // ===========================
    // CONTACT FORM
    // ===========================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const activeLang = document.querySelector('.lang-btn.active')?.dataset.lang || 'cz';
            btn.innerText = activeLang === 'en' ? 'Message sent ✓' : 'Zpráva odeslána ✓';
            btn.style.background = '#2a9d5c';
            setTimeout(() => {
                btn.setAttribute('data-cz', 'Odeslat zprávu');
                btn.setAttribute('data-en', 'Send Message');
                btn.innerText = activeLang === 'en' ? 'Send Message' : 'Odeslat zprávu';
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }


    // ===========================
    // COMMAND PALETTE (Ctrl+K)
    // ===========================
    const cmdOverlay = document.getElementById('cmd-overlay');
    const cmdInput = document.getElementById('cmd-input');
    const cmdList = document.getElementById('cmd-list');

    const commands = [
        { id: 'dark', label: 'Přepnout Tmavý / Světlý režim', desc: 'Theme', icon: 'fa-solid fa-moon', action: () => themeBtn.click() },
        { id: 'top', label: 'Zpět nahoru', desc: 'Navigation', icon: 'fa-solid fa-arrow-up', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
        { id: 'contact', label: 'Přejít na kontakt', desc: 'Navigation', icon: 'fa-solid fa-envelope', action: () => { window.location.hash = '#contact'; } },
        { id: 'projects', label: 'Prohlédnout projekty', desc: 'Navigation', icon: 'fa-solid fa-briefcase', action: () => { window.location.hash = '#works'; } },
        { id: 'github', label: 'Otevřít GitHub', desc: 'External', icon: 'fa-brands fa-github', action: () => window.open('https://github.com/frantiseknahlik', '_blank') },
        { id: 'cv', label: 'Stáhnout CV', desc: 'Download', icon: 'fa-solid fa-file-pdf', action: () => alert('CV link not set.') },
    ];

    let activeIndex = 0;

    function openCmd() {
        if (!cmdOverlay) return;
        cmdOverlay.classList.add('open');
        cmdInput.value = '';
        renderCmd(commands);
        setTimeout(() => cmdInput.focus(), 60);
    }

    function closeCmd() {
        if (!cmdOverlay) return;
        cmdOverlay.classList.remove('open');
    }

    function renderCmd(list) {
        if (!cmdList) return;
        cmdList.innerHTML = '';
        activeIndex = 0;

        if (!list.length) {
            cmdList.innerHTML = '<div class="cmd-empty">Žádný příkaz nenalezen.</div>';
            return;
        }

        list.forEach((cmd, i) => {
            const item = document.createElement('div');
            item.className = 'cmd-item' + (i === 0 ? ' active' : '');
            item.innerHTML = `
                <div class="cmd-item-icon"><i class="${cmd.icon}"></i></div>
                <span class="cmd-item-label">${cmd.label}</span>
                <span class="cmd-item-desc">${cmd.desc}</span>
            `;
            item.addEventListener('click', () => { closeCmd(); cmd.action(); });
            item.addEventListener('mouseenter', () => {
                cmdList.querySelectorAll('.cmd-item').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                activeIndex = i;
            });
            cmdList.appendChild(item);
        });
    }

    if (cmdInput) {
        cmdInput.addEventListener('input', () => {
            const q = cmdInput.value.toLowerCase();
            const filtered = commands.filter(c =>
                c.label.toLowerCase().includes(q) || c.id.includes(q)
            );
            renderCmd(filtered);
        });
    }

    if (cmdOverlay) {
        cmdOverlay.addEventListener('click', e => { if (e.target === cmdOverlay) closeCmd(); });
    }

    document.addEventListener('keydown', e => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            cmdOverlay?.classList.contains('open') ? closeCmd() : openCmd();
            return;
        }
        if (!cmdOverlay?.classList.contains('open')) return;
        if (e.key === 'Escape') { closeCmd(); return; }

        const items = cmdList?.querySelectorAll('.cmd-item');
        if (!items || !items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            items[activeIndex]?.classList.remove('active');
            activeIndex = (activeIndex + 1) % items.length;
            items[activeIndex]?.classList.add('active');
            items[activeIndex]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            items[activeIndex]?.classList.remove('active');
            activeIndex = (activeIndex - 1 + items.length) % items.length;
            items[activeIndex]?.classList.add('active');
            items[activeIndex]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            items[activeIndex]?.click();
        }
    });


    // ===========================
    // STAGGER REVEAL FOR GRID ITEMS
    // ===========================
    document.querySelectorAll('.skills-grid, .projects-grid').forEach(grid => {
        const cards = grid.querySelectorAll('.reveal');
        cards.forEach((card, i) => {
            card.style.transitionDelay = (i * 0.07) + 's';
        });
    });

});
