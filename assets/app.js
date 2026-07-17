// Shared front-end logic for the TitanCell catalog mockup.
(function () {
  const products = window.PRODUCTS || [];

  // --- Home catalog grid ---
  const grid = document.getElementById('catalog-grid');
  if (grid) {
    grid.innerHTML = products.map(cardHTML).join('');
  }

  function cardHTML(p) {
    return `
      <a class="card" href="product.html?id=${p.id}">
        <svg class="spark" viewBox="0 0 24 24" fill="none"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="#2ec8ff" stroke="#d2f5ff" stroke-width="1"/></svg>
        <div class="card-media"><img src="${p.image}" alt="${p.name}" loading="lazy"></div>
        <div class="card-body">
          <span class="tag">${p.category}</span>
          <h3>${p.name}</h3>
          <div class="sub">${p.tagline}</div>
          <div class="card-foot">
            <span class="price">${p.price}</span>
            <span class="view">View ${arrow()}</span>
          </div>
        </div>
      </a>`;
  }
  function arrow() {
    return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
  }
  function check() {
    return `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="11" fill="#e9f2ff"/><path d="m8 12 2.5 2.5L16 9" stroke="#2f6df6" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  // --- Product detail page ---
  const pd = document.getElementById('product-detail');
  if (pd) {
    const id = new URLSearchParams(location.search).get('id');
    const p = products.find(x => x.id === id) || products[0];
    document.title = `${p.name} — TitanCell`;

    document.getElementById('crumb-name').textContent = p.name;
    pd.innerHTML = `
      <div class="pd-media"><img src="${p.image}" alt="${p.name}"></div>
      <div class="pd-info">
        <span class="tag">${p.category}</span>
        <h1>${p.name}</h1>
        <div class="tagline">${p.tagline}</div>
        <div class="pd-price">${p.price} <small>+ shipping · quote for bulk</small></div>
        <p class="summary">${p.summary}</p>
        <div class="pd-actions">
          <button class="btn btn-primary" onclick="openQuote('${p.name}')">Request a Quote</button>
          <a class="btn btn-ghost" href="index.html#catalog">Back to catalog</a>
        </div>
        <ul class="benefits">
          ${p.benefits.map(b => `<li>${check()}<span>${b}</span></li>`).join('')}
        </ul>
        <div class="specs">
          <h3>Technical specifications</h3>
          <table class="spec-table">
            ${Object.entries(p.specs).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('')}
          </table>
        </div>
      </div>`;

    // Related products
    const rel = document.getElementById('related-grid');
    if (rel) {
      const others = products.filter(x => x.id !== p.id).slice(0, 4);
      rel.innerHTML = others.map(cardHTML).join('');
    }
  }
})();

// --- Quote modal (global) ---
function openQuote(productName) {
  const modal = document.getElementById('quoteModal');
  const label = document.getElementById('quoteProduct');
  if (label) {
    label.textContent = productName
      ? `Interested in the ${productName}? Send us the details.`
      : "Tell us what you need and we'll get back to you.";
  }
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeQuote() {
  document.getElementById('quoteModal').classList.remove('open');
  document.body.style.overflow = '';
}
function submitQuote(e) {
  e.preventDefault();
  document.getElementById('formNote').style.display = 'block';
  setTimeout(closeQuote, 1800);
  return false;
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeQuote(); });
