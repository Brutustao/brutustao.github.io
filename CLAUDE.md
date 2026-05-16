# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Hexo-based static blog (Chinese-language) with the NexT theme (Pisces scheme), deployed to GitHub Pages. Both source and generated output live on the master branch — the root-level `index.html`, `css/`, `js/`, `archives/`, `tags/` are the published site.

## Commands

```sh
npm run build     # hexo generate — builds static site to public/
npm run clean     # hexo clean — removes generated files
npm run server    # hexo server — local dev server at localhost:4000
npm run deploy    # hexo deploy
npx hexo new post "Post Title"         # new post from scaffold
npx hexo new draft "Draft Title"       # new draft
```

The NexT theme lives in `node_modules/hexo-theme-next` and is gitignored at `themes/next/`. To preview locally, copy it first:

```sh
cp -r node_modules/hexo-theme-next themes/next
```

## Architecture

- **Content**: `source/_posts/*.md` — each file is a blog post with YAML front matter (title, date, tags)
- **Config**: `_config.yml` — both Hexo and NexT settings
- **Scaffolds**: `scaffolds/post.md` and `scaffolds/draft.md` — templates for new content
- **Tags page**: `source/tags/index.md` — single `type: tags` page
- **Theme**: `hexo-theme-next` (npm) — Pisces scheme, the `themes/next/` dir is gitignored and symlinked/copied at build time
- **Third-party libs**: `lib/` — bundled JS libraries (jQuery, Font Awesome, Fancybox, Velocity, etc.)
- **Custom assets**: `css/main.css`, `js/src/` — overrides

## CI/CD

GitHub Actions (`.github/workflows/deploy.yml`) on push to master:
1. Checkout → Node 20 → `npm ci`
2. Copy theme from node_modules → `themes/next/`
3. `npx hexo generate` → outputs to `./public`
4. Upload artifact → deploy to GitHub Pages via `actions/deploy-pages`

## Comment System

A self-built comment system (no third-party service) with two parts:

### Backend (`comments-server/`)
- Express + JSON-file-stored REST API
- `GET /api/comments?post=<path>` — fetch comments for a post
- `POST /api/comments` — submit a comment (`{post, author, email?, content, parent_id?}`)
- Rate limited (20 req/15min), basic spam blocking (external links)
- Start: `cd comments-server && npm install && npm start` (port 3000)

### Frontend (`js/src/comments-widget.js`)
- Vanilla JS widget, auto-initializes on post pages
- Renders nested comments with reply support
- CSS: `css/comments.css`
- NexT integration via `theme_config.custom_file_path.bodyEnd` (loads `source/_data/body-end.njk`)

### Deploying
- The comment server must be deployed separately (VPS, Railway, Render, etc.)
- Update `COMMENTS_API_URL` in `js/src/comments-widget.js` to point to the deployed server
- Both `js/src/comments-widget.js` and `source/js/src/comments-widget.js` need updating (or set up a symlink)

## Branch Strategy

Everything happens on `master` — source, generated output, and CI. No separate branches.
