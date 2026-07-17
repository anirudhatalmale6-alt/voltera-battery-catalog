# TitanCell — Battery Catalog (Mockup)

A clean, minimalist showcase catalog for battery products, with a branded cyan
"lightning" energy theme matched to the TitanCell packaging artwork. This is a
design mockup (homepage + product detail page) built with sample data.

## Pages
- `index.html` — homepage: hero, 8-product catalog grid, "why" strip, contact/quote CTA
- `product.html?id=<id>` — individual product detail page (specs, benefits, related products)

## Notes
- Pure static HTML/CSS/JS — no build step. Just open `index.html`.
- Product data lives in `assets/data.js`. In the full build this comes from the
  admin panel / database (add / edit / delete products, images, specs, prices).
- "Request a Quote" opens a contact form (demo only in this mockup).
- Fully responsive (desktop / tablet / mobile).

Sample product images are lightweight SVGs; real product photos will be uploaded via the admin panel.
