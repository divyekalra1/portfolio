# divyekalra1.github.io/portfolio

Personal website of Divye Kalra — portfolio, publications, and technical notes on security, cloud, and homelab engineering.

Live at **https://divyekalra1.github.io/portfolio/**

## Stack

- [Astro 6](https://astro.build) static site, all content authored in Markdown
- Tailwind CSS v4, IBM Plex Sans/Mono, dark/light theme
- Hosted on GitHub Pages, deployed automatically by GitHub Actions on every push to `main`

## Structure

```
src/content/notes/     technical notes (HTB CPTS, AWS, projects), grouped into series
src/content/blog/      dated blog posts
src/data/              publications and series metadata
src/pages/             routes (home, notes, publications, resume, contact)
public/                resume PDF, photo, PGP key
```

## Development

```sh
pnpm install
pnpm dev        # local dev server
pnpm build      # production build to dist/
pnpm preview    # serve the production build locally
```

The site is served under the `/portfolio` base path; internal links go through the `url()` helper in `src/utils/url.ts`. See `CLAUDE.md` for detailed conventions and content-editing recipes.

## Content

To add a note, drop a Markdown file with frontmatter (`title`, `description`, `series`, `order`, `tags`) into the appropriate folder under `src/content/notes/` — navigation, series sidebars, and indexes update automatically. Images live in a sibling `images/` directory and are optimized at build time.

This site consolidates an earlier Jekyll portfolio and a ReadTheDocs notes site into a single repo (migrated June 2026).
