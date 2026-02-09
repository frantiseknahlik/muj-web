
# Osobní stránka - Sekce Dovednosti | Paso za krokem průvodce

## Cíl
Vytvoříme sekci **Dovednosti** (Skills) s moderním designem:
- **Mřížka s kartičkami** (3-4 sloupce, responzivní)
- **Každá kartička:** ikona + název + krátký popis
- **Interaktivní efekty:** hover (stín, zoom, barva)
- **CSS Grid** pro layout
- **JavaScript smooth scroll** pro otevírání sekcí
- **CSS animace** spouštěné pouze když je prvek viditelný

---

## Krok 1: HTML struktura sekce Dovednosti

Otevři svůj soubor `index.html` a vlož tuto sekci **po hero sekci** (po uzavírajícím `</section>` hero):

```html
<section class="skills" id="skills">
  <div class="container">
    <h2 class="section-title">Moje Dovednosti</h2>
    <p class="section-subtitle">Co umím a na čem pracuji</p>
    
    <div class="skills-grid">
      
      <!-- Kartička 1 -->
      <div class="skill-card">
        <div class="skill-icon">🎨</div>
        <h3 class="skill-title">UI/UX Design</h3>
        <p class="skill-description">Navrhuju intuitivní a krásná uživatelská rozhraní s ohledem na uživatele.</p>
      </div>
      
      <!-- Kartička 2 -->
      <div class="skill-card">
        <div class="skill-icon">💻</div>
        <h3 class="skill-title">HTML & CSS</h3>
        <p class="skill-description">Tvořím responzivní a sémantické webové stránky pomocí moderních technologií.</p>
      </div>
      
      <!-- Kartička 3 -->
      <div class="skill-card">
        <div class="skill-icon">⚙️</div>
        <h3 class="skill-title">JavaScript</h3>
        <p class="skill-description">Programuji interaktivní prvky a logiku pomocí vanilla JS nebo framework.</p>
      </div>
      
    </div>
  </div>
</section>
```

**Co se děje:**
- `id="skills"` - odkaz z menu
- `.section-title` a `.section-subtitle` - nadpis a podnadpis sekce
- `.skills-grid` - kontejner pro kartičky (bude CSS Grid)
- `.skill-card` - jedna kartička s ikonou, nadpisem a popisem
- Emoji 🎨 jako jednoduchá ikona (můžeš nahradit SVG nebo Font Awesome)

**Tvůj úkol:**
- [ ] Vlož HTML do `index.html` pod hero sekci
- [ ] Nahraď emoji vlastními
- [ ] Změň názvy dovedností na své
- [ ] Změň popisy dovedností na své
- [ ] Doplň další 3 dovednosti kterými se chceš prezentovat

---

## Krok 2: Základní CSS stylování sekce Dovednosti

Do souboru `style.css` vlož na konec tyto základní styly. Zatím neřešíme mobilní zobrazení, to přidáme za chvíli.

```css
/* ===== SEKCE DOVEDNOSTI - ZÁKLAD ===== */

.skills {
  padding: var(--spacing-xl) 0;
  background-color: var(--light-bg);
}

/* Nadpisy sekcí */
.section-title {
  font-size: 48px;
  font-weight: 700;
  color: var(--dark-text);
  text-align: center;
  margin-bottom: var(--spacing-md);
  
  /* Gradient text */
  background: linear-gradient(135deg, var(--primary-color), var(--dark-text));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  font-size: 18px;
  color: #6B7280;
  text-align: center;
  margin-bottom: var(--spacing-xl);
  font-weight: 500;
}

/* Grid layout pro desktop */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3 sloupce vedle sebe */
  gap: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;
}

/* Kartička */
.skill-card {
  background-color: var(--white);
  padding: var(--spacing-lg);
  border-radius: 12px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Hover efekt na kartičku */
.skill-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

/* Ikona */
.skill-icon {
  font-size: 48px;
  width: 80px;
  height: 80px;
  margin-bottom: var(--spacing-md);
  
  /* Flexbox pro centrování emoji */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  background-color: #EEF2FF;
  border-radius: 50%;
  transition: all 0.3s ease;
}

/* Hover efekt na ikonu */
.skill-card:hover .skill-icon {
  background-color: var(--primary-color);
  color: var(--white);
  transform: rotate(10deg) scale(1.1);
}

/* Texty */
.skill-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--dark-text);
  margin-bottom: var(--spacing-sm);
  transition: color 0.3s ease;
}

.skill-card:hover .skill-title {
  color: var(--primary-color);
}

.skill-description {
  font-size: 14px;
  color: #6B7280;
  line-height: 1.6;
}
```

**Co tento CSS dělá:**
- Nastavuje Grid layout na 3 sloupce (`repeat(3, 1fr)`).
- Styluje kartičky s bílým pozadím, stínem a kulatými rohy.
- Přidává **hover efekty**: při najetí myší se kartička zvedne, stín se zvětší a ikona změní barvu.

**Tvůj úkol:**
- [ ] Vlož CSS kód do `style.css`.
- [ ] Otevři stránku v prohlížeči a otestuj hover efekty na desktopu.

---

## Krok 3: Responzivita (Mobilní zobrazení)

Teď zajistíme, aby sekce vypadala dobře i na tabletu a mobilu. Protože používáme CSS Grid, je to velmi jednoduché – jen změníme počet sloupců.

Vlož tento kód do `style.css` **pod** předchozí styly:

```css
/* ===== RESPONSIVE DESIGN (Media Queries) ===== */

/* Tablet (menší než 1024px) -> 2 sloupce */
@media (max-width: 1024px) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .section-title {
    font-size: 40px;
  }
}

/* Mobil (menší než 768px) -> 1 sloupec */
@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr; /* Pod sebou */
    gap: var(--spacing-md);
  }
  
  .section-title {
    font-size: 32px;
  }
  
  .section-subtitle {
    font-size: 16px;
  }
  
  .skill-card {
    padding: var(--spacing-md);
  }
  
  .skill-icon {
    width: 60px;
    height: 60px;
    font-size: 32px;
  }
}
```

**Vysvětlení:**
- Na tabletu přepneme na 2 sloupce.
- Na mobilu přepneme na 1 sloupec (kartičky budou pod sebou).
- Zároveň zmenšíme písmo nadpisů a velikost ikon, aby se vešly na malý displej.

**Tvůj úkol:**
- [ ] Vlož Media Queries do `style.css`.
- [ ] Otestuj změnu velikosti okna prohlížeče (nebo použij DevTools > Toggle Device Toolbar).
- [ ] Ověř, že na mobilu jsou kartičky seřazené pod sebou.

---

## Krok 4: ÚKOL - Vlastní design kartičky

Vytvoř si svůj vlastní design kartičky! Vybereš si jednu z možností:

### ÚKOL A: Barevné kartičky
Každá kartička má jinou barvu v levém horním rohu (malý pruh):

```css
.skill-card {
  border-left: 4px solid var(--primary-color);  /* Modrý pruh vlevo */
}

.skill-card:nth-child(2) {
  border-left-color: #10B981;  /* Zelená */
}

.skill-card:nth-child(3) {
  border-left-color: #F59E0B;  /* Oranžová */
}

.skill-card:nth-child(4) {
  border-left-color: #EF4444;  /* Červená */
}

.skill-card:nth-child(5) {
  border-left-color: #8B5CF6;  /* Fialová */
}

.skill-card:nth-child(6) {
  border-left-color: #EC4899;  /* Růžová */
}
```

**Tvůj úkol:**
- [ ] Přidej `border-left: 4px` do `.skill-card`
- [ ] Pro každou kartičku (2-6) změň barvu pomocí `:nth-child(n)`
- [ ] Otestuj, jak to vypadá

---

### ÚKOL B: Ikonka s pozadím
Ikona bude mít barevné pozadí s gradient efektem:

```css
.skill-icon {
  font-size: 48px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0 auto var(--spacing-md) auto;
  
  /* Gradient background */
  background: linear-gradient(135deg, var(--primary-color) 0%, #60A5FA 100%);
  color: var(--white);
  
  /* Transition */
  transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

.skill-card:hover .skill-icon {
  transform: rotate(360deg) scale(1.2);  /* Úplná rotace + zvětšení */
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.5);
}
```

**Tvůj úkol:**
- [ ] Změň `.skill-icon` gradient na `linear-gradient(135deg, ...)`
- [ ] Na hover udělej úplnou rotaci `rotate(360deg)` místo 10deg
- [ ] Zvětši box-shadow

---

## Krok 5: JavaScript - Smooth scroll se zvýrazněním

Tvůj JavaScript z kroku 9 už máš! Ale teď si ověř, že je menu položka `Skills` nastavena správně.

Otevři `script.js` a zkontroluj, že máš tento kód (měl bys ho mít z předchozí lekce):

```javascript
// ===== SMOOTH SCROLL NA # ODKAZY =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
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
```

**Tvůj úkol:**
- [ ] Ověř, že máš tento kód v `script.js`
- [ ] Klikni na "Skills" v menu → měl by se hladce scrollovat
- [ ] Scrolluj ručně → měl by se v menu zvýraznit správný link (modrý)
- [ ] Testuj s ostatními sekcemi (Home, About, Skills, Works, Contact)

---

## Krok 5.1: ÚKOL - Vylepši interakci s menu

### ÚKOL A: Přidej splash efekt na menu link

Když klikneš na menu, přidá se krátka animace "splash" (vlnka):

```css
.nav-link {
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.nav-link:active::before {
  width: 300px;
  height: 300px;
}
```

**Tvůj úkol:**
- [ ] Přidej tento CSS do `.nav-link`
- [ ] Klikni na menu link a sleduj efekt "vlnky"

---

### ÚKOL B: Přidej CSS třídu pro "current" sekci

V `script.js` změň kód tak, aby přidával třídu `.current` do sekce, která je právě viditelná:

```javascript
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
```

Pak v CSS můžeš stylovat `.current` sekci:

```css
section.current {
  animation: sectionEnter 0.6s ease;
}

@keyframes sectionEnter {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

**Tvůj úkol:**
- [ ] Aktualizuj `script.js` podle výše
- [ ] Přidej CSS pro `section.current`
- [ ] Scrolluj a sleduj, jak se sekce "objevují"

---

## Krok 6: CSS Animace - Intersection Observer (DŮLEŽITÉ!)

Toto je klíčová část! Chceš, aby se kartičky **animovaly pouze když se objeví na obrazovce**, ne při načtení stránky.

Použijeme **Intersection Observer** - JavaScript API, které zjišťuje, kdy se prvek dostane do výhledu.

### Část 1: Definice animací v CSS

Do souboru `style.css` vlož na konec toto:

```css
/* ===== ANIMACE PRO PRVKY ===== */

/* Definice animací - Používáme je univerzálně pro libovolný prvek */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* CSS třídy pro animace - připravíme si je pro JavaScript */

.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out forwards;
}

.animate-fade-in-left {
  animation: fadeInLeft 0.8s ease-out forwards;
}

.animate-fade-in-right {
  animation: fadeInRight 0.8s ease-out forwards;
}

.animate-scale-in {
  animation: scaleIn 0.8s ease-out forwards;
}

/* Stagger efekt - zpoždění mezi prvky */
.animate-stagger-1 { animation-delay: 0.1s; }
.animate-stagger-2 { animation-delay: 0.2s; }
.animate-stagger-3 { animation-delay: 0.3s; }
.animate-stagger-4 { animation-delay: 0.4s; }
.animate-stagger-5 { animation-delay: 0.5s; }
.animate-stagger-6 { animation-delay: 0.6s; }

/* Pro skill-cardy - přidáme do nich animace */
.skill-card {
  opacity: 0;  /* Začneme neviditelné */
}

.skill-card.animate-fade-in-up {
  opacity: 1;  /* Jakmile se přidá class, stane se viditelné */
}
```

**Co se děje:**
- `@keyframes` - definujeme 5 různých animací (fadeInUp, fadeInDown, fadeInLeft, fadeInRight, scaleIn)
- `.animate-*` CSS třídy - tyto přidáme JavaScriptem, když se prvek zobrazí
- `.animate-stagger-*` - zpoždění mezi prvky (0.1s, 0.2s, atd.)
- Kartičky jsou iniciálně `opacity: 0` (neviditelné)

---

### Část 2: JavaScript s Intersection Observer

Otevři `script.js` a na konec vlož tuto funkci:

```javascript
// ===== INTERSECTION OBSERVER - ANIMACE PRVKŮ KDYŽ JSOU VIDITELNÉ =====

function initAnimations() {
  // Vyber všechny prvky s atributem data-animate
  const observerElements = document.querySelectorAll('[data-animate]');
  
  // Konfigurační objekt pro observer
  const observerOptions = {
    threshold: 0.2,        // Aktivuj když je 20% prvku viditelné
    rootMargin: '0px 0px -50px 0px'  // Počkat až na dolní část prvku
  };
  
  // Vytvoř Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Prvek je viditelný - přidej animační třídu
        const animationType = entry.target.getAttribute('data-animate');
        entry.target.classList.add(animationType);
        
        // Pokud je .skill-card, přidej i stagger efekt
        if (entry.target.classList.contains('skill-card')) {
          const staggerIndex = Array.from(document.querySelectorAll('.skill-card')).indexOf(entry.target);
          entry.target.classList.add(`animate-stagger-${staggerIndex % 6 + 1}`);
        }
        
        // Když je prvek animován, přestane se sledovat
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Sleduj všechny prvky
  observerElements.forEach(element => observer.observe(element));
}

// Spusť animace když je dokument načten
document.addEventListener('DOMContentLoaded', initAnimations);
```

**Co to dělá:**
- `IntersectionObserver` - sleduje, kdy se prvek dostane do výhledu
- `threshold: 0.2` - aktivuj když je viditelných 20% prvku
- Jakmile je prvek viditelný, přidáš CSS třídu z `data-animate` atributu
- Stagger efekt - každá kartička se animuje s mírným zpožděním

---

### Část 3: Přidej data-animate do HTML

Teď musíš do HTML přidat atribut `data-animate` do prvků, které chceš animovat.

Otevři `index.html` a uprav sekci **Dovednosti**:

```html
<section class="skills" id="skills" data-animate="animate-fade-in-down">
  <div class="container">
    <h2 class="section-title" data-animate="animate-fade-in-up">Moje Dovednosti</h2>
    <p class="section-subtitle" data-animate="animate-fade-in-up">Co umím a na čem pracuji</p>
    
    <div class="skills-grid">
      
      <!-- Kartička 1 -->
      <div class="skill-card" data-animate="animate-fade-in-up">
        <div class="skill-icon">🎨</div>
        <h3 class="skill-title">UI/UX Design</h3>
        <p class="skill-description">Navrhuju intuitivní a krásná uživatelská rozhraní s ohledem na uživatele.</p>
      </div>
      
      <!-- Kartička 2 -->
      <div class="skill-card" data-animate="animate-fade-in-up">
        <div class="skill-icon">💻</div>
        <h3 class="skill-title">HTML & CSS</h3>
        <p class="skill-description">Tvořím responzivní a sémantické webové stránky pomocí moderních technologií.</p>
      </div>
      
      <!-- Kartička 3 -->
      <div class="skill-card" data-animate="animate-fade-in-up">
        <div class="skill-icon">⚙️</div>
        <h3 class="skill-title">JavaScript</h3>
        <p class="skill-description">Programuji interaktivní prvky a logiku pomocí vanilla JS nebo framework.</p>
      </div>
      
      <!-- Kartička 4 -->
      <div class="skill-card" data-animate="animate-fade-in-up">
        <div class="skill-icon">📱</div>
        <h3 class="skill-title">Responsive Design</h3>
        <p class="skill-description">Zajišťuji, aby stránky fungovaly perfektně na všech zařízeních.</p>
      </div>
      
      <!-- Kartička 5 -->
      <div class="skill-card" data-animate="animate-fade-in-up">
        <div class="skill-icon">🎬</div>
        <h3 class="skill-title">Animace & Efekty</h3>
        <p class="skill-description">Přidávám plynulé animace a interaktivní prvky pro lepší UX.</p>
      </div>
      
      <!-- Kartička 6 -->
      <div class="skill-card" data-animate="animate-fade-in-up">
        <div class="skill-icon">🔍</div>
        <h3 class="skill-title">SEO & Performance</h3>
        <p class="skill-description">Optimalizuji webové stránky pro vyhledávače a rychlost načítání.</p>
      </div>
      
    </div>
  </div>
</section>
```

**Co se změnilo:**
- Sekce má `data-animate="animate-fade-in-down"` - bude se objevovat od vrchu
- Nadpisy mají `data-animate="animate-fade-in-up"` - budou se objevovat zespodu
- Kartičky mají `data-animate="animate-fade-in-up"` - budou se objevovat postupně se stagger efektem

**Tvůj úkol:**
- [ ] Vlož JavaScript kód do `script.js`
- [ ] Vlož CSS kódy do `style.css`
- [ ] Uprav HTML v sekci Dovednosti - přidej `data-animate`
- [ ] Otestuj: Scrolluj dolů na sekci Skills - měly by se postupně animovat kartičky!

---

## Krok 6.1: ÚKOL - Vytvořte vlastní animace

### ÚKOL A: Přidej vlastní animaci

Vytvoř novou animaci, kterou pak použiješ v HTML. Příklady:

```css
/* Animace - flip (překlopení) */
@keyframes flipIn {
  from {
    opacity: 0;
    transform: rotateY(-90deg) perspective(500px);
  }
  to {
    opacity: 1;
    transform: rotateY(0deg);
  }
}

.animate-flip-in {
  animation: flipIn 0.8s ease-out forwards;
}
```

```css
/* Animace - bounce (odraz) */
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
}
```

```css
/* Animace - pulse (pulzace) */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

**Tvůj úkol:**
- [ ] Vybereš si jednu animaci (flipIn, bounceIn, pulse)
- [ ] Přidáš ji do `style.css`
- [ ] V HTML přidáš na některou kartičku: `data-animate="animate-flip-in"` (nebo bounceIn)
- [ ] Testuj animaci

---

## Soubory které bys měl/a mít

```
projekt/
├── index.html        (updated - přidaná Skills sekce)
├── style.css         (updated - nový CSS pro skills + animace)
├── script.js         (updated - Intersection Observer)
└── images/
    └── me.jpg
```

**Hotovo! Máš sekci Dovednosti s moderním designem, animacemi a interaktiví! 🎉**
02-dovednosti.md
Zobrazuje se 02-dovednosti.md.d