# Storyblok + Vercel Demo

This demo renders a Storyblok space with a Next.js App Router frontend and is ready to deploy on Vercel.

It intentionally uses Storyblok's native Visual Editor workflow. Vercel Content Link is not currently listed for Storyblok in Vercel's CMS integration docs, so the demo positions Storyblok visual editing plus Vercel preview deployments instead of field-level Content Link.

## Local Setup

```sh
npm install
```

Create `.env` from `.env.example`:

```sh
STORYBLOK_DELIVERY_API_TOKEN=<preview_or_public_delivery_token>
STORYBLOK_API_BASE_URL=https://api.storyblok.com
STORYBLOK_REGION=eu
```

Run locally:

```sh
npm run dev
```

For Storyblok Visual Editor local preview, Storyblok requires HTTPS:

```sh
npx next dev --experimental-https
```

## Seed Storyblok

The setup script creates or updates the demo components and stories. Do not commit the Management API token.

```sh
STORYBLOK_SPACE_ID=<space_id> \
STORYBLOK_MANAGEMENT_TOKEN=<personal_access_token> \
npm run storyblok:setup
```

The script publishes:

- `/` from the `home` story
- `/visual-editor`
- `/preview-pipeline`
- `/content-model`
