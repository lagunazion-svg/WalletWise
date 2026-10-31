# Verification notes

Checked October 29, 2026.

## Automated

`npm run check`: JavaScript syntax, relative imports and local font files.

`npm test`: nine tests passed covering the $500 interest scenario, invalid numeric inputs, mixed-category comparison prevention, saved-state normalization, saved-option toggling, reset behavior, plan consent and choice validation, monthly commitment limits, near-term investment warnings, HTML escaping and independent state copies.

## Browser checks

The frontend was compared to the Figma home screen at 390 × 844. Checked these working flows:

- Home → card browsing → Sprout details → save → workspace → refresh.
- No ongoing fee → select Sprout and Everyday → comparison → balance scenario.
- $1,000 balance shows $20.75 and $23.25; an invalid negative balance shows an error.
- Create a custom goal and priority; enter $175 available per month.
- Leave a draft, reload and resume at the saved step with the entered amount.
- Choose Everyday Clear, Pocket Reserve and no immediate investment.
- A $200 commitment is blocked against $175 available.
- A $25 commitment, reasoning and next step appear correctly in the review.
- Save the plan and reload; the actual choices and amounts remain.
- Checked the browser console after this flow: no errors were reported.

The project has not been tested in every browser or with real participants. The frontend uses local storage, not a production backend. The feature ZIPs share stable module interfaces; rerun smoke tests after changes and merges.
