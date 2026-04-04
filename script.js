/* =============================================================
   Elara Voss — Painting Portfolio
   script.js
   ============================================================= */


/* ── 1. NAVBAR — scroll shadow ───────────────────────────────── */

const nav = document.getElementById('navbar');



window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});


/* ── 2. MOBILE MENU — hamburger toggle ───────────────────────── */

const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  if (open) {
    mobileMenu.style.display = 'block';
    requestAnimationFrame(() => mobileMenu.classList.add('visible'));
  } else {
    mobileMenu.classList.remove('visible');
    setTimeout(() => { mobileMenu.style.display = 'none'; }, 350);
  }
});

function closeMobile() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('visible');
  setTimeout(() => { mobileMenu.style.display = 'none'; }, 350);
}


/* ── 3. GALLERY FILTER — Portrait / Nature / Abstract ────────── */

const filterBtns  = document.querySelectorAll('.filter-btn');
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));


filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {

    // Highlight the active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    galleryItems.forEach(item => {
      const match = filter === 'all' || item.dataset.cat === filter;

      if (match) {
        // Restore item then fade in
        item.style.display = '';
        item.offsetHeight; // force reflow so transition plays
        item.style.opacity    = '1';
        item.style.transform  = 'scale(1)';
        item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        item.removeAttribute('data-hidden');
      } else {
        // Fade out then hide
        item.style.opacity    = '0';
        item.style.transform  = 'scale(0.95)';
        item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
        item.setAttribute('data-hidden', '');
        setTimeout(() => {
          if (item.hasAttribute('data-hidden')) item.style.display = 'none';
        }, 350);
      }
    });
  });
});


/* ── 4. LIGHTBOX ─────────────────────────────────────────────── */

const lightbox   = document.getElementById('lightbox');
const lbArtwork  = document.getElementById('lbArtwork');
const lbTitle    = document.getElementById('lbTitle');
const lbMeta     = document.getElementById('lbMeta');
const lbClose    = document.getElementById('lbClose');
const lbBackdrop = document.getElementById('lbBackdrop');
const lbPrev     = document.getElementById('lbPrev');
const lbNext     = document.getElementById('lbNext');

let visibleItems = [];
let currentIndex = 0;

/** Returns only items not currently filtered out */
function getVisibleItems() {
  return galleryItems.filter(item => !item.hasAttribute('data-hidden'));
}

/** Open lightbox at the given index within visibleItems */
function openLightbox(index) {
  visibleItems = getVisibleItems();
  currentIndex = index;
  populateLightbox(currentIndex);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/** Close the lightbox */
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

/** Populate the lightbox panel with artwork data */
function populateLightbox(index) {
  const item     = visibleItems[index];
  const paintDiv = item.querySelector('.painting');

  // Mirror the CSS painting class onto the lightbox artwork div
  lbArtwork.className = 'lb-artwork ' + paintDiv.className;
  lbTitle.textContent = item.querySelector('.caption-title').textContent;
  lbMeta.textContent  = item.querySelector('.caption-meta').textContent;

  // Dim arrows at the boundaries
  lbPrev.style.opacity = index === 0                      ? '0.3' : '1';
  lbNext.style.opacity = index === visibleItems.length - 1 ? '0.3' : '1';
}

function showPrev() {
  if (currentIndex > 0) {
    currentIndex--;
    populateLightbox(currentIndex);
  }
}

function showNext() {
  if (currentIndex < visibleItems.length - 1) {
    currentIndex++;
    populateLightbox(currentIndex);
  }
}

// Open on thumbnail click
galleryItems.forEach(item => {
  item.querySelector('.gallery-thumb').addEventListener('click', () => {
    visibleItems = getVisibleItems();
    openLightbox(visibleItems.indexOf(item));
  });
});

// Close triggers
lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  showPrev();
  if (e.key === 'ArrowRight') showNext();
});


/* ── 5. SCROLL REVEAL ────────────────────────────────────────── */

const reveals  = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => observer.observe(el));


/* ── 6. CONTACT FORM ─────────────────────────────────────────── */

function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  btn.textContent = 'Sending…';
  btn.disabled    = true;

  setTimeout(() => {
    e.target.reset();
    btn.textContent = 'Send Message';
    btn.disabled    = false;

    const msg = document.getElementById('successMsg');
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 4000);
  }, 1200);
}


document.querySelectorAll('.gallery-item').forEach(item => {
  let images = item.querySelectorAll('.carousel img');

  if (images.length === 0) return;

  let current = 0;

  let nextBtn = item.querySelector('.next');
  let prevBtn = item.querySelector('.prev');

  nextBtn.onclick = (e) => {
    e.stopPropagation();
    images[current].classList.remove('active');
    current = (current + 1) % images.length;
    images[current].classList.add('active');
  };

  prevBtn.onclick = (e) => {
    e.stopPropagation();
    images[current].classList.remove('active');
    current = (current - 1 + images.length) % images.length;
    images[current].classList.add('active');
  };
});

document.querySelectorAll(".gallery-item").forEach(item => {
  item.addEventListener("click", () => {
    const activeImg = item.querySelector(".carousel img.active");

    // lbArtwork.innerHTML = `<img src="${activeImg.src}" style="max-width:100%; border-radius:10px;">`;

    const images = item.querySelectorAll(".carousel img");

    let carouselHTML = `<div class="popup-carousel">`;

    images.forEach((img, i) => {
    carouselHTML += `<img src="${img.src}" class="${i === 0 ? 'active' : ''}">`;
    });

    carouselHTML += `
    <button class="popup-prev">‹</button>
    <button class="popup-next">›</button>
    </div>
    `;

    lbArtwork.innerHTML = carouselHTML;

    lbTitle.textContent = "";
    lbMeta.textContent =  item.dataset.desc;

    lightbox.classList.add("open");
  });
});

lbClose.addEventListener("click", () => {
  lightbox.classList.remove("open");
});

document.addEventListener("click", function(e) {
  if (e.target.classList.contains("popup-next")) {
    const imgs = document.querySelectorAll(".popup-carousel img");
    let index = [...imgs].findIndex(img => img.classList.contains("active"));
    imgs[index].classList.remove("active");
    index = (index + 1) % imgs.length;
    imgs[index].classList.add("active");
  }

  if (e.target.classList.contains("popup-prev")) {
    const imgs = document.querySelectorAll(".popup-carousel img");
    let index = [...imgs].findIndex(img => img.classList.contains("active"));
    imgs[index].classList.remove("active");
    index = (index - 1 + imgs.length) % imgs.length;
    imgs[index].classList.add("active");
  }
});