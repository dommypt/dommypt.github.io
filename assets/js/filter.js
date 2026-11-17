// Branch tabs + tag filter.
// - Tabs show one branch of work (or "All"). The chosen tab is kept in the URL (#Branch Name),
//   so a link can point straight at one branch.
// - Tag buttons narrow the current tab further; only tags used in the current tab are shown.
// Without JavaScript the tabs and tag bar stay hidden and every project is shown.
(() => {
  const tabList = document.querySelector(".tabs");
  const tagBar = document.querySelector(".filter");
  const tabs = tabList ? [...tabList.querySelectorAll(".tab")] : [];
  const tagButtons = tagBar ? [...tagBar.querySelectorAll(".filter-btn")] : [];
  const cards = [...document.querySelectorAll(".card")];

  const state = { branch: "", tag: "" };
  const tagsOf = (card) => (card.dataset.tags ? card.dataset.tags.split("|") : []);
  const inBranch = (card) => state.branch === "" || card.dataset.branch === state.branch;

  function render() {
    // Only offer tags that exist in the current tab; drop the active tag if it doesn't.
    const available = new Set(cards.filter(inBranch).flatMap(tagsOf));
    if (state.tag && !available.has(state.tag)) state.tag = "";
    tagButtons.forEach((b) => {
      const tag = b.dataset.filter;
      b.hidden = tag !== "" && !available.has(tag);
      b.setAttribute("aria-pressed", String(tag === state.tag));
    });
    if (tagBar) tagBar.hidden = available.size === 0;

    tabs.forEach((t) => {
      const selected = t.dataset.branch === state.branch;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
    });

    cards.forEach((card) => {
      card.hidden = !inBranch(card) || (state.tag !== "" && !tagsOf(card).includes(state.tag));
    });
  }

  function selectTab(tab, { focus = false } = {}) {
    state.branch = tab.dataset.branch;
    const url = state.branch
      ? `#${encodeURIComponent(state.branch)}`
      : location.pathname + location.search;
    history.replaceState(null, "", url);
    if (focus) tab.focus();
    tab.scrollIntoView({ block: "nearest", inline: "nearest" });
    render();
  }

  if (tabList) {
    tabList.hidden = false;
    tabList.addEventListener("click", (event) => {
      const tab = event.target.closest(".tab");
      if (tab) selectTab(tab);
    });
    // Arrow keys / Home / End move between tabs, as in standard tab widgets.
    tabList.addEventListener("keydown", (event) => {
      const i = tabs.indexOf(document.activeElement);
      if (i === -1) return;
      const next = {
        ArrowRight: tabs[(i + 1) % tabs.length],
        ArrowLeft: tabs[(i - 1 + tabs.length) % tabs.length],
        Home: tabs[0],
        End: tabs[tabs.length - 1],
      }[event.key];
      if (!next) return;
      event.preventDefault();
      selectTab(next, { focus: true });
    });

    // Open the tab named in the URL, if any.
    let fromHash = "";
    try {
      fromHash = decodeURIComponent(location.hash.slice(1));
    } catch {}
    const initial = tabs.find((t) => t.dataset.branch && t.dataset.branch === fromHash);
    if (initial) state.branch = initial.dataset.branch;
  }

  tagBar?.addEventListener("click", (event) => {
    const button = event.target.closest(".filter-btn");
    if (!button) return;
    state.tag = button.dataset.filter;
    render();
  });

  render();
})();
