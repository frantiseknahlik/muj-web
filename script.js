document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ZVÝRAZNĚNÍ AKTIVNÍHO MENU PŘI SCROLLU =====
window.addEventListener('scroll', () => {
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
        const href = link.getAttribute('href');
        const section = document.querySelector(href);

        if (section) {
            const rect = section.getBoundingClientRect();

            // Pokud je sekce viditelná (top < 150px od okna)
            if (rect.top <= 150 && rect.bottom >= 150) {
                links.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
});



window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const links = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= 150 && rect.bottom >= 150) {
            // Odstraň .current ze všech
            sections.forEach(s => s.classList.remove('current'));
            // Přidej na aktuální
            section.classList.add('current');

            // Update menu
            const id = section.getAttribute('id');
            links.forEach(l => l.classList.remove('active'));
            document.querySelector(`a[href="#${id}"]`)?.classList.add('active');
        }
    });
});






// ===== VYLEPŠENÝ PORTFOLIO FILTER =====

function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktivní tlačítko
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Počítadlo pro stagger efekt
            let visibleIndex = 0;

            portfolioCards.forEach((card, index) => {
                const cardCategory = card.getAttribute('data-category');
                const shouldShow = filterValue === 'all' || cardCategory === filterValue;

                if (shouldShow) {
                    // Zobraz kartu s postupným zpožděním
                    card.style.display = 'block';

                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, visibleIndex * 100); // Každá karta o 100ms později

                    visibleIndex++;
                } else {
                    // Skryj kartu
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';

                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', initPortfolioFilter);




// Skryj projekty nad limit
const portfolioCards = document.querySelectorAll('.portfolio-card');
const loadMoreBtn = document.getElementById('load-more-btn');
let itemsToShow = 3;

portfolioCards.forEach((card, index) => {
    if (index >= itemsToShow) {
        card.classList.add('hidden');
    }
});

loadMoreBtn.addEventListener('click', () => {
    portfolioCards.forEach(card => {
        card.classList.remove('hidden');
        card.style.display = 'block';
    });
    loadMoreBtn.style.display = 'none';
});











// Modal pro detail projektu
const modal = document.getElementById('project-modal');
const modalClose = document.querySelector('.modal-close');

// Kliknutí na kartu otevře modal
document.querySelectorAll('.portfolio-card').forEach(card => {
    card.addEventListener('click', () => {
        // Získej data z karty
        const img = card.querySelector('img').src;
        const title = card.querySelector('.portfolio-title').textContent;
        const description = card.querySelector('.portfolio-description').textContent;

        // Naplň modal
        document.getElementById('modal-image').src = img;
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-description').textContent = description;

        // Zobraz modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Zablokuj scroll
    });
});

// Zavření modalu
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Obnov scroll
}

// Zavři modal při ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});