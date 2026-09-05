(() => {
  const carousel = document.querySelector('.slideshow');
  if (!carousel) return;
  const slides = Array.from(carousel.querySelectorAll('figure'));
  const controls = carousel.querySelector('.slideshow-controls');
  const footer = carousel.querySelector('.slideshow-footer');
  const caption = carousel.querySelector('.slideshow-caption');
  const toggle = controls.querySelector('[data-slide="play"]');
  const count = controls.querySelector('.slide-count');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let playing = !motion.matches;
  let visible = true;
  function show(next) {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== index;
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('aria-label', `${i + 1} of ${slides.length}`);
    });
    count.textContent = `${index + 1} / ${slides.length}`;
    caption.replaceChildren(...Array.from(slides[index].querySelector('figcaption').childNodes, node => node.cloneNode(true)));
  }
  function updateToggle() { toggle.textContent = playing ? 'Pause' : 'Play'; }
  carousel.classList.add('is-enhanced');
  footer.hidden = false;
  show(0);
  updateToggle();
  controls.querySelector('[data-slide="previous"]').addEventListener('click', () => show(index - 1));
  controls.querySelector('[data-slide="next"]').addEventListener('click', () => show(index + 1));
  toggle.addEventListener('click', () => { playing = !playing; updateToggle(); });
  carousel.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  motion.addEventListener('change', () => { playing = !motion.matches; updateToggle(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(carousel);
  }
  window.setInterval(() => {
    if (playing && visible && !document.hidden && !carousel.matches(':hover') && !carousel.contains(document.activeElement)) show(index + 1);
  }, 5000);
})();
