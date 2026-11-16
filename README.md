# Wallet Wise

A working mobile-first implementation of the Bread Bros Wallet Wise Figma project. Built with HTML, CSS and JavaScript modules. No third-party JavaScript packages, accounts or API keys are required.

- **Live app:** [Open Wallet Wise](https://lagunazion-svg.github.io/WalletWise/)
- **Video demo:** [Watch the walkthrough](https://www.youtube.com/watch?v=PSNcaBd2T-Y)

Wallet Wise helps users compare financial options, review a sample monthly budget, simulate expense payments, practice investing and build a personal decision plan.

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

The first command checks syntax, local imports and bundled assets. The tests cover interest calculations, selection rules, saved data, plan validation and escaping user content. On November 15, 2026, source checks passed and 9 of 10 tests passed. The existing near-term investment warning test fails because it expects no warning for a choice that currently produces one.

## What works

### Money: accounts, budget and expenses

The home screen shows three sample accounts for fictional user Alex: Everyday Checking ($3,200), Emergency Savings ($5,000) and Spending Account ($180). The November 2026 budget allocates $4,200 of monthly income to $2,125 in listed expenses, $750 in everyday spending, $600 in savings and a $725 cushion.

- Review six expenses, their due dates and paid/unpaid statuses.
- Choose a funding account, review the total and confirm **Pay all 6 expenses** to simulate payment together.
- See the account balance and expense statuses update, with insufficient-funds and duplicate-payment protection.
- Use **Reset money demo** to restore balances and unpaid expenses.

This budget uses fixed sample data; it is separate from the editable decision planner. Paying expenses does not transfer the planned savings allocation.

### Explore and Compare

- Browse **11 fictional products**: three credit cards, three bank accounts and five investments.
- Search by name or description, filter by no ongoing fee, and sort by fee or credit-card APR.
- Read requirements, costs, risks, trade-offs and plain-language explanations; save options for later.
- Compare up to **three products from the same category** side by side.
- Change a carried credit-card balance to compare estimated monthly interest.

The investing options are Broad Market Index Fund, Managed Stock Mutual Fund, Government Bond, Individual Company Stock and Cryptocurrency. Comparing all five requires more than one group because of the three-option limit.

### Paper investing

- Start with one shared **$5,000 paper balance** across all five investments.
- Buy by dollar amount or units, including fractional units, from investment listings or details.
- See the remaining balance, total investment value, and units and value held in each option. Purchases exceeding the available paper balance are blocked.
- Explore fictional price charts using **1M, 3M, 6M, 1Y and ALL** ranges.
- Use **Reset paper investments** to clear holdings and restore $5,000 without clearing other app data.

Charts use fixed monthly sample values from November 2024 through November 2026. Purchases use the latest sample price; changing the chart range does not change the purchase price. Holdings do not gain or lose value over time, and selling is not implemented. The paper purchase form uses a $0.01 minimum rather than enforcing the fictional product minimums described in the catalog.

### Decision planner and Saved

- Build a plan through ten steps with a goal, priorities, available money, time horizon, product choices, monthly commitment, reasoning and next step.
- Validate amounts and commitments and show warnings for potentially unsuitable choices.
- Save and resume a draft, review and edit a saved plan, and print it.
- Manage saved products, discard drafts and reset demo data from the Saved workspace.
- Use touch controls, keyboard navigation, form labels and confirmation dialogs.

## Try the three demo tasks

1. **Compare credit cards:** Open Explore → Credit cards, select Campus Flex and Sprout Starter, then choose **Compare selected**. Try a $500 balance scenario to compare estimated monthly interest.
2. **Review a budget and pay expenses:** Open Money, review the accounts and suggested budget, choose Everyday Checking and pay all six expenses. Confirm **Simulate payments**; checking falls from $3,200 to $1,075.
3. **Compare investments and invest $5,000:** Open Explore → Investing. Compare the five options in groups of up to three, then open Broad Market Index Fund. Set **Buy in** to Dollars, enter **5000** and choose **Buy with paper money**. With a fresh paper balance, available cash becomes $0 and the holding value becomes $5,000.

Before repeating the walkthrough, reset the Money demo and paper investments and clear previous comparison selections when switching categories.

## Data and limitations

Saved products, drafts, plans, simulated payments and paper holdings persist in this browser's local storage. Comparison selections clear when the app starts. Clearing browser data removes saved progress; if storage is unavailable, the app displays a warning and changes may not survive refresh. There is no backend, login, real account integration or cross-device synchronization.

All financial products, rates, charts and account balances are fictional teaching examples. Payments and investments do not move real money. The monthly-interest scenario uses a simplified balance × APR ÷ 12 estimate.

## Structure

```text
index.html                  App entry point
src/app.js                  Hash routes and page lifecycle
src/components/             Reusable UI and navigation
src/lib/products.js         Fictional product catalog
src/lib/store.js            Shared state and persistence
src/lib/format.js           Display helpers and interest math
src/lib/plan-model.js       Plan defaults, validation and warnings
src/lib/money-demo.js       Sample accounts, budget and payment logic
src/lib/investment-prices.js Fixed sample investment histories and prices
src/pages/                  Money, Explore, Compare, Plan and Saved
src/styles/                 Shared theme plus per-feature styles
assets/                     Local DM Sans fonts and their license
scripts/serve.mjs           Dependency-free local server
scripts/check.mjs           Source/asset checks
tests/core.test.js          Shared behavior tests
```

The DM Sans font is bundled under its SIL Open Font License in `assets/FONT-LICENSE.txt`. No other remote resources are needed at runtime. Design reference: [Bread Bros Wallet Wise Figma project](https://www.figma.com/design/FBFMQlTTAN4YRduwmabAxM).

## Hosting

The app is a static site with no build step. Its HTML, source modules, styles and assets can be served directly by GitHub Pages. Keep the published repository and Pages site available through the end of the semester for grading. Local storage is specific to the site's origin, so progress on localhost is separate from progress on the hosted app.

This is an AI-assisted starter implementation. Review and understand the code, make and test your own changes, and document actual contributions according to your course policy.
