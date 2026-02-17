document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Custom Cursor
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .work-card, .copy-email-box, .skill-item').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });

    // 2. Hide Nav on Scroll
    let lastScroll = 0;
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > lastScroll && currentScroll > 100) {
            nav.classList.add('hide');
        } else {
            nav.classList.remove('hide');
        }
        lastScroll = currentScroll;
    });

    // 3. Scroll Reveal Animation
    const reveal = () => {
        const reveals = document.querySelectorAll('.reveal');
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - 100) {
                el.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', reveal);
    reveal();

    // 4. Dark Mode Toggle
    const btn = document.getElementById('dark-mode-toggle');
    btn.addEventListener('click', () => {
        const theme = document.body.getAttribute('data-theme');
        if (theme === 'dark') {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // 5. Copy Email
    const emailBox = document.getElementById('copy-email');
    if (emailBox) {
        emailBox.addEventListener('click', () => {
            const email = emailBox.querySelector('.email-text').innerText;
            navigator.clipboard.writeText(email);
            const badge = emailBox.querySelector('.copy-badge');
            badge.innerText = 'Zkopírováno!';
            badge.style.color = 'green';
            setTimeout(() => {
                badge.innerText = 'Klikni pro kopírování';
                badge.style.color = 'var(--accent)';
            }, 2000);
        });
    }

    // 6. Map Initialization (Custom Style)
    if (document.getElementById('map')) {
        const map = L.map('map', { scrollWheelZoom: false }).setView([-31.95, 115.86], 12);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png').addTo(map);
        L.marker([-31.95, 115.86]).addTo(map);
    }

    // 7. Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.work-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            projects.forEach(p => {
                p.style.display = (filter === 'all' || p.dataset.category === filter) ? 'block' : 'none';
            });
        });
    });

    // 8. Modal Logic
    const modal = document.getElementById('project-modal');
    const closeModal = document.querySelector('.close-modal');

    if (modal) {
        projects.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img').src;
                const title = card.querySelector('h4').innerText;
                
                document.getElementById('modal-image').src = img;
                document.getElementById('modal-title').innerText = title;
                document.getElementById('modal-description').innerText = "Detailní popis projektu " + title + ". Zde by byl delší text popisující technologie a funkce.";
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // Zavření kliknutím mimo obsah
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
});