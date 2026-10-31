# Sharing the project and working in Git

## Which ZIP should we use?

**Wallet-Wise-Frontend-Complete.zip** contains the entire working frontend. Use this if you want one person to add a runnable starting point, then everyone makes further changes on their own branches.

**Wallet-Wise-Team-Split.zip** contains a shared foundation plus four separate feature ZIPs. Use it if your group wants each completed feature added in a separate branch/PR. The foundation has temporary placeholder pages so it runs before features are merged. Each feature ZIP replaces only its page and stylesheet; the four paths do not overlap. The finished reference project is included separately in the complete ZIP, not inside the split bundle.

Do not copy these files over an existing React or other application without agreeing on how to integrate them. For a repository already containing unrelated coursework, put this frontend in an agreed `frontend/` subfolder and run commands there. Do not overwrite your repository's existing `.git` directory, configuration or unrelated files.

## Option 1: each person adds one feature

### One person adds the foundation first

1. Clone your actual group repository.
2. Extract the contents of `00-Shared-Foundation.zip` into the agreed frontend directory.
3. Review the files and run `npm run check`, `npm test` and `npm start`.
4. Commit that foundation and push it. Merge it before everyone else starts.

Use a real repository URL chosen by your group; none is preconfigured in this package.

### Everyone starts from the same merged foundation

From your clone of the group repository:

```sh
git switch main
git pull --ff-only
git switch -c feature/explore
```

Use `feature/compare`, `feature/plan` or `feature/saved` for the other parts. If your repository uses another base branch, replace `main` with its actual name.

Extract your assigned feature ZIP into the same frontend directory, preserving the `src/` paths. Inspect it, run it, and make your own changes. Stage only your files. Example for Part A, assuming the frontend is at the repository root:

```sh
git add src/pages/explore.js src/styles/explore.css
git diff --cached
git commit -m "Implement Explore and product details"
git push -u origin feature/explore
```

Open a pull request into the shared base branch. Other parts use their own two files and branch names. If your frontend is in `frontend/`, prefix both file paths with `frontend/` when staging from the repository root.

Each part is a completed starting implementation. Its owner should understand, review, customize and test it. A Git commit does not by itself establish independent authorship or satisfy course contribution rules.

## Option 2: one complete baseline, then individual changes

One person adds `Wallet-Wise-Frontend-Complete.zip` as a baseline. Everyone pulls that baseline, creates their own branch, and edits only the assigned files. Commit actual changes rather than re-adding unchanged files from the module ZIPs.

## Suggested ownership

| Part | Page module | Stylesheet | Route |
|---|---|---|---|
| A | `src/pages/explore.js` | `src/styles/explore.css` | `/`, `/explore`, `/product/:id` |
| B | `src/pages/compare.js` | `src/styles/compare.css` | `/compare`, `/compare/scenario` |
| C | `src/pages/plan.js` | `src/styles/plan.css` | `/plan`, `/plan/review` |
| D | `src/pages/saved.js` | `src/styles/saved.css` | `/saved` |

Assign names together. One person coordinates shared-file changes. Shared dependencies are already present in the foundation, so each module can be developed against a consistent contract.

## Shared interfaces

- Each page exports `mountExplore`, `mountCompare`, `mountPlan` or `mountSaved`.
- The router passes `{ container, path, params, navigate, refreshNavigation }`.
- A mount function renders inside `container` and returns an optional cleanup function that removes delegated event listeners.
- Use `navigate('/saved')` for programmatic navigation and `#/saved` for links. Routes are hash-based and work on static hosts.
- `getState()` returns a copy. Use `updateState(patch)`, `toggleSelected(id)` and `toggleSaved(id)` instead of mutating shared state directly.
- Product IDs and field names come from `src/lib/products.js`. Do not rename them in only one module.
- A plan has `goal`, `priority`, `available`, `buffer`, `horizon`, `card`, `bank`, `invest`, `monthly`, `reason`, `next`, `understand` and `savedAt`. Money input values are numeric strings. `later` means the user deferred a product choice.
- A draft uses the same fields, with `draftStep` stored separately. It can also hold a `shortlist` of product IDs from Compare.
- Escape user-provided text before injecting HTML. Use `escapeHTML` from `format.js`.
- Reuse `Button`, `InputField`, `pageHeading`, `bindActions`, `toast` and the shared theme. Do not copy global rules into feature stylesheets.

## Before merging

- Pull the latest base branch and integrate any shared changes.
- Run `npm run check` and `npm test`.
- Test your feature in the browser, including an empty state and a return path.
- Check phone width and confirm the bottom navigation stays usable.
- Test the combined three task flows once all feature branches merge.
- If a shared interface must change, coordinate it before merging. Avoid editing another person's page file in the same PR.

## Smoke-test checklist

1. Explore → Sprout details → Save → Saved → refresh. The option should remain.
2. Explore → no ongoing fee → select Sprout and Everyday → Compare → balance scenario. $500 gives $10.38 and $11.63. $1,000 gives $20.75 and $23.25.
3. Enter an invalid negative balance. The result should show an error instead of a cost.
4. Plan → complete the steps with different choices and a $25 commitment → save → reopen → edit. Choices should remain your own.
5. Try a commitment larger than the available monthly amount. Saving should be blocked with an explanation.
6. Leave a draft and return to it after a refresh.
7. Remove a saved option and cancel once, then confirm. Verify both paths.
8. Open an unknown route and use the return link.

Do not send `.git`, credentials, `.env`, dependency folders or browser data through Discord. These are not included in the ZIPs.
