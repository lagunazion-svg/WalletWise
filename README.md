# Shared foundation

This is the runnable integration foundation. The four pages are placeholders until each feature ZIP is applied. See COLLABORATION.md for the workflow.

# Wallet Wise frontend

A working mobile-first implementation of the Bread Bros Wallet Wise Figma project. Built with HTML, CSS and JavaScript modules. No third-party JavaScript packages, accounts or API keys are required.

## Run it

Install Node.js 20 or newer, then open a terminal in this folder:

```sh
npm start
```

Open **http://127.0.0.1:5173**. Stop with Ctrl+C. If that port is busy, use `npm start -- --port 5174`.

Do not double-click `index.html`: browsers need an HTTP server to load JavaScript modules. You do not need `npm install` for this project because it has no package dependencies.

```sh
npm run check
npm test
```

The first command checks syntax, local imports and bundled assets. The tests cover interest calculations, selection rules, saved data, plan validation and escaping user content.

## What works

- Explore nine fictional options across credit cards, bank accounts and investing.
- Search, filter by no ongoing fee and sort options.
- Read requirements, costs, trade-offs and plain-language explanations.
- Compare up to three options from one category.
- Edit the carried balance and see monthly interest estimates update.
- Build a plan through ten steps with your own amounts, choices, reasoning and next step.
- Save and resume a draft, edit the saved plan and print it.
- Save and remove products, retain choices after refreshing and reset demo data.
- Use touch controls, keyboard navigation, form labels and confirmation dialogs.

All data stays in the browser's local storage. There is no backend, real account integration or cross-device synchronization. All financial products and rates are fictional teaching examples. The monthly-interest scenario uses a simplified balance × APR ÷ 12 estimate.

## Team file split

Read **COLLABORATION.md** before copying anything into an existing repository. The four feature modules have separate page files and stylesheets:

| Part | Feature | Owned files |
|---|---|---|
| A | Explore, product details, learning | `src/pages/explore.js`, `src/styles/explore.css` |
| B | Comparison and balance scenario | `src/pages/compare.js`, `src/styles/compare.css` |
| C | Decision planner and review | `src/pages/plan.js`, `src/styles/plan.css` |
| D | Saved workspace and reset | `src/pages/saved.js`, `src/styles/saved.css` |

Shared files in `src/lib`, `src/components`, `src/app.js` and the shared styles should be coordinated with the group. Module ZIPs preserve the `src/` paths so each can be copied to the repository root.

## Structure

```text
index.html                  App entry point
src/app.js                  Hash routes and page lifecycle
src/components/             Reusable UI and navigation
src/lib/products.js         Fictional product catalog
src/lib/store.js            Shared state and persistence
src/lib/format.js           Display helpers and interest math
src/lib/plan-model.js       Plan defaults, validation and warnings
src/pages/                  The four feature modules
src/styles/                 Shared theme plus per-feature styles
assets/                     Local DM Sans fonts and their license
scripts/serve.mjs           Dependency-free local server
scripts/check.mjs           Source/asset checks
tests/core.test.js          Shared behavior tests
```

The DM Sans font is bundled under its SIL Open Font License in `assets/FONT-LICENSE.txt`. No other remote resources are needed at runtime. Design reference: https://www.figma.com/design/FBFMQlTTAN4YRduwmabAxM

This is an AI-assisted starter implementation. Review and understand the code, make and test your own changes, and document actual contributions according to your course policy.
