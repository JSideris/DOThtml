# Blog Posts

This directory contains blog posts for the DOThtml website.

## File Naming Convention

Blog posts should follow this naming pattern:
```
YYYY-MM-DD-slug.md
```

- **YYYY-MM-DD**: UTC publication date (e.g., `2026-10-01`)
- **slug**: kebab-case URL slug (e.g., `hello-world`)

Example: `2026-10-01-hello-world.md` → route: `/blog/hello-world`

## Frontmatter (Optional)

Posts may include YAML frontmatter:

```yaml
---
title: Post Title
date: 2026-10-01
summary: A brief summary of the post
draft: false
---
```

- **title**: Display title (falls back to slug if omitted)
- **date**: Publication date (overrides filename date if present)
- **summary**: Short description for the blog index
- **draft**: Set to `true` to hide from public listings

## Adding a New Post

1. Create a markdown file following the naming convention above
2. Add the post to the `posts` array in `src/areas/blog/posts.ts`
3. The post will automatically appear on the blog index at `/blog`
