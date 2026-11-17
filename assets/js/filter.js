// Simple tag filter: click a tag to show only projects with that tag.
// Without JavaScript the filter bar stays hidden and every project is shown.
(() => {
  const bar = document.querySelector(".filter");
  if (!bar) return;
  const buttons = bar.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".card");

  bar.hidden = false;
  bar.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");
    if (!button) return;
    const tag = button.dataset.filter;

    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
    cards.forEach((card) => {
      const cardTags = card.dataset.tags ? card.dataset.tags.split("|") : [];
      card.hidden = tag !== "" && !cardTags.includes(tag);
    });
  });
})();
