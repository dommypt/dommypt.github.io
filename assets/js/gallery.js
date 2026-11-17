// Photo galleries inside cards.
// The photos sit in a horizontally scrolling strip that snaps to one photo at a time
// (swipe on phones). This script adds the arrows, the "3 / 12" counter, clickable
// thumbnails, arrow-key support, and points the card's "Full size" link at the
// photo currently shown. Without JavaScript the strip can still be scrolled.
(() => {
  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const track = gallery.querySelector(".gallery-track");
    const slides = [...track.querySelectorAll(".gallery-slide")];
    const thumbs = [...gallery.querySelectorAll(".gallery-thumb")];
    const prev = gallery.querySelector(".gallery-prev");
    const next = gallery.querySelector(".gallery-next");
    const count = gallery.querySelector(".gallery-count");
    const fullLinks = gallery.closest(".card").querySelectorAll("[data-full-link]");
    let current = 0;

    gallery.classList.add("is-enhanced");
    if (slides.length < 2) return; // a single photo needs no controls

    [prev, next, count, gallery.querySelector(".gallery-thumbs")].forEach((el) => (el.hidden = false));

    const goTo = (i, behavior = "smooth") => {
      const index = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: index * track.clientWidth, behavior });
    };

    const update = () => {
      if (!track.clientWidth) return; // card is hidden by a tab/tag filter
      const index = Math.round(track.scrollLeft / track.clientWidth);
      if (index === current) return;
      current = index;
      count.textContent = `${index + 1} / ${slides.length}`;
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
      thumbs.forEach((t, i) => t.toggleAttribute("aria-current", i === index));
      thumbs[index].scrollIntoView({ block: "nearest", inline: "nearest" });
      fullLinks.forEach((a) => (a.href = slides[index].href));
    };

    prev.disabled = true;
    prev.addEventListener("click", () => goTo(current - 1));
    next.addEventListener("click", () => goTo(current + 1));
    thumbs.forEach((thumb, i) => thumb.addEventListener("click", () => goTo(i)));
    track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    track.addEventListener("keydown", (event) => {
      const step = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
      if (!step) return;
      event.preventDefault();
      goTo(current + step);
    });
    // Keep the current photo in place when the card changes width (window resize, tabs).
    new ResizeObserver(() => goTo(current, "instant")).observe(track);
  });
})();
