# Bistro Bud website

A static website and interactive restaurant operations prototype. Open `index.html` locally, or deploy the files through GitHub Pages.

## Publish with GitHub Pages

1. Create a GitHub repository for Bistro Bud.
2. Upload **the contents of this ZIP** to the repository root: `index.html`, `app.js`, `assets/`, `.nojekyll`, and this README. Keep the `assets` folder intact.
3. In the repository, open **Settings → Pages**. Choose **Deploy from a branch**, select `main` and `/(root)`, then save.
4. Open the Pages URL GitHub provides. Changes to the repository's files will redeploy the site.

There is no build step and no package installation.

## About the demo

- The day and date in the overview use the viewer's local device clock. They update when the page is reopened, when its tab becomes active, and while it stays open.
- Sales, cover forecasts, inventory, vendor prices, cost percentages, and staffing recommendations are **illustrative sample values**. They do not update from a real restaurant or become more accurate over time.
- The prep and labor sliders recalculate sample plans. **Reset sample** restores the baseline scenario. Ask Bud uses scripted, keyword-based replies; it is not connected to an AI service.
- Purchase orders, schedules, kitchen handoffs, invoice extraction, and reports are previews. They do not reach a restaurant system.
- The contact form opens a draft in the visitor's email application. The visitor must send it there; the site itself does not submit or save the message.

For live statistics, the prototype would need integrations with a restaurant's point-of-sale, inventory, scheduling, and finance systems, plus a secure backend and data validation.

## Trying the new interactions

- Add a priority action in the Overview, mark it done or undo it, and remove it. Custom actions are stored in that browser's local storage (up to 30 actions), so clearing browser data removes them. **Reset sample** keeps them.
- Generate sample invoice cycles through two prepared examples and can be used repeatedly. It does not upload or extract an actual file.
- A cover is one guest served. The labor table shows nonoverlapping coverage windows, not separate employee shifts; the staffing counts and projected percentage are sample calculations.
- Real vendor price comparisons require restaurant-specific supplier quotes or feeds, normalized pack sizes and delivery terms, and dated prices. The sample supplier names and prices here are fictional.
- The site has no login, shared account, kitchen integration, or saved schedule. Those require a backend, authentication, access controls, and integrations before a restaurant can use them operationally.

## Inventory and order tracker

- In **Inventory**, add your own items with on-hand stock, par (target stock), units, and an optional supplier note. Update on-hand counts using **Save stock** in the table; use **Track** to copy an item to the order list. The four original sample rows stay illustrative.
- In **Your order tracker**, add any item and quantity, edit quantities, mark items ordered or to buy, and remove them. The two sample low-stock rows have quick **Track** buttons. This is a personal checklist, not a purchase order: marking ordered never sends an order or updates stock automatically.
- Custom inventory (up to 30 items) and order entries (up to 50) are stored in the same browser using local storage. They remain after **Reset sample**, do not sync across devices, and disappear if you clear this site's browser data.
