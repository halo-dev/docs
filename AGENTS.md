# Repository Guidelines

## Project Structure & Module Organization

This repository contains the Halo documentation site built with Rspress. Author documentation in `docs/`: user guides live under `docs/guide/`, developer material under `docs/developer-guide/`, and stable static assets under `docs/public/`. Use `_nav.json` and `_meta.json` files to control navigation labels and ordering. Site configuration belongs in `rspress.config.ts`; shared styling belongs in `styles/index.css`. The `build/` directory is generated output and must not be edited.

## Build, Test, and Development Commands

Use pnpm 11.24.0, as declared in `package.json`.

- `pnpm install` installs dependencies.
- `pnpm dev` starts the local Rspress development server.
- `pnpm build` creates the production site in `build/` and checks static rendering and dead links.
- `pnpm preview` serves the latest production build locally.
- `pnpm check` runs Biome checks and applies safe fixes.
- `pnpm format` formats supported files with Biome.

Do not hand-edit `pnpm-lock.yaml` or other generated artifacts.

## Coding Style & Naming Conventions

Biome is the source of truth for TypeScript, JavaScript, JSON, and CSS formatting. Use spaces for indentation and single quotes in JavaScript/TypeScript. Keep configuration in TypeScript and prefer existing Rspress options over custom components. Name documentation files in lowercase kebab-case, such as `migrate-from-1.x.md`. Use MDX only when a page needs components; otherwise prefer Markdown. Keep headings task-oriented and code samples minimal and runnable.

## Testing Guidelines

There is no dedicated automated test suite or coverage threshold. Treat `pnpm build` as the required validation for documentation changes. Before submitting, open affected pages with `pnpm dev` or `pnpm preview` and verify navigation, links, code blocks, and images. For visual changes, check both desktop and narrow viewport layouts.

## Commit & Pull Request Guidelines

The current history contains only generic `init` commits, so it does not establish a useful convention. Write short, imperative subjects that describe the change, for example `Document offline installation`. Keep each pull request focused on one topic, explain the user-facing impact, link the relevant issue when one exists, and include screenshots for layout or styling changes. Run `pnpm check` and `pnpm build` before requesting review; avoid force-pushing after review begins.
