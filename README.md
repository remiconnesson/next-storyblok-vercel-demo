# Storyblok + Vercel Demo

This demo renders Storyblok-managed content with a Next.js App Router frontend deployed on Vercel. It uses Storyblok Visual Editor for authoring, protected draft previews for review, and Vercel ISR with webhook revalidation for published delivery.

## Local Setup

```sh
pnpm install
```

Create `.env` from `.env.example`:

```sh
STORYBLOK_PUBLIC_ACCESS_TOKEN=<public_delivery_token>
STORYBLOK_PREVIEW_ACCESS_TOKEN=<preview_delivery_token>
STORYBLOK_API_BASE_URL=https://api.storyblok.com
STORYBLOK_REGION=eu
STORYBLOK_PREVIEW_SECRET=<random_secret>
STORYBLOK_WEBHOOK_SECRET=<random_secret>
```

Run locally:

```sh
pnpm dev
```

For Storyblok Visual Editor local preview, Storyblok requires HTTPS:

```sh
pnpm exec next dev --experimental-https
```

## Seed Storyblok

The setup script creates or updates the demo components and stories. Do not commit the Management API token.

```sh
STORYBLOK_SPACE_ID=<space_id> \
STORYBLOK_MANAGEMENT_TOKEN=<personal_access_token> \
pnpm storyblok:setup
```

The script publishes:

- `/` from the `home` story
- `/visual-editor`
- `/preview-pipeline`
- `/content-model`

## Production Flow

Public routes fetch `published` content with a public delivery token and cache it with the `storyblok` cache tag. Draft content is only available after enabling Next.js Draft Mode through the signed preview endpoint:

```txt
/api/draft?secret=<STORYBLOK_PREVIEW_SECRET>&slug=/
```

To exit draft mode:

```txt
/api/exit-draft?slug=/
```

Configure Storyblok Visual Editor to use `/preview/` for editorial previews. The `/preview` route verifies Storyblok's `_storyblok_tk` parameters before loading draft content, and also accepts `?secret=<STORYBLOK_PREVIEW_SECRET>` for direct demo access.

For production cache invalidation, create a Storyblok webhook that points to:

```txt
/api/revalidate
```

The webhook must use `STORYBLOK_WEBHOOK_SECRET`; the route verifies Storyblok's `webhook-signature` header before calling `revalidateTag`.
