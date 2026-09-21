# DevStash

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types. 

## Context Files

Read the following to get the full context of the project: 
- @context/project-overview.md
- @context/current-feature.md
- @context/coding-standards.md
- @context/ai-interaction.md

## Commands

- `npm run dev`: start the dev server at http://localhost:3000
- `npm run build`: create a production build
- `npm run start`: serve the production build
- `npm run lint`: run ESLint (flat config in `eslint.config.mjs`, using `eslint-config-next` core-web-vitals and typescript presets)
- `npx tsc --noEmit`: type-check the project (there is no script for this)
- `npx next typegen`: regenerate route types without a full build

There is no test framework set up yet.

## Neon MCP

Always operate on the `devstash` Neon project, `development` branch.

- Project: `devstash` — `calm-dust-42770072`
- Branch: `development` — `br-autumn-sunset-zak7vrmg` (use this for every query and migration)
- Branch: `production` — `br-lucky-frog-zae9rq91` — **off limits**

Pass `branch_id: "br-autumn-sunset-zak7vrmg"` explicitly on every Neon MCP call
that accepts it. Omitting it targets the project's *default* branch, which is
`production`.

Never read from, write to, or otherwise touch the production branch unless I name
it in that request. Permission applies to that request only — it does not carry
over to later ones. The same goes for any other Neon project: if a request would
reach outside `devstash`/`development`, stop and ask first.



