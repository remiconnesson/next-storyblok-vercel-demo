# Storyblok + Vercel Demo Flow

This demo is primarily about the Git + Vercel development workflow. Storyblok is shown quickly afterward to prove that content authoring works against the same frontend.

## 1. Start In GitHub

Open the repository:

https://github.com/remiconnesson/next-storyblok-vercel-demo

Position the app as a normal Next.js project backed by Storyblok. Content is managed in Storyblok, but the frontend delivery workflow stays Git-based.

Show these files:

- `src/components/StoryblokBlocks.jsx`: Storyblok blocks mapped to React components.
- `src/lib/storyblok.js`: published vs preview Storyblok fetching.
- `src/app/api/revalidate/route.js`: signed Storyblok publish revalidation.

## 2. Make A Small Frontend Change

Create a branch or edit locally.

Good options:

- Update a spacing, border, or typography token in `src/app/globals.css`.
- Change a small layout detail in `src/components/StoryblokBlocks.jsx`.
- Adjust a label or supporting UI element without changing the Storyblok content model.

Push the branch.

Talk track:

> Engineering changes move through Git. Vercel creates a preview deployment for every branch before production.

## 3. Show The Vercel Preview Deployment

Open the branch preview deployment in Vercel.

Show:

- The preview URL.
- Build output and deployment status.
- The Storyblok-powered page rendered through the changed branch frontend.

Talk track:

> This preview uses the same Storyblok content model, but the frontend code is isolated to this branch. Teams can review app changes without touching production.

## 4. Merge And Promote

Merge the branch to `main`.

Open production:

https://next-storyblok-vercel-demo.vercel.app

Talk track:

> Once approved, the change goes through the normal Git workflow. Vercel builds and promotes the production deployment automatically.

## 5. Quick Storyblok Proof

Open the Storyblok space and edit the Home story.

Show:

- Storyblok Visual Editor loads the Vercel frontend through `/preview/`.
- A block can be selected in the preview.
- A headline or one sentence can be edited and saved.

Talk track:

> Storyblok gives editors visual authoring against the real frontend components.

## 6. Show Draft Isolation

Refresh production before publishing the Storyblok change.

Talk track:

> The public site still shows published content. Drafts are isolated from production.

## 7. Publish Content

Publish the Storyblok change.

Refresh production and show the updated content.

Talk track:

> On publish, Storyblok calls a signed Vercel route handler. The app revalidates Storyblok cache tags so published content updates without a full rebuild.

## Summary Talk Track

The point is ownership separation. Developers use Git and Vercel previews for frontend changes. Editors use Storyblok for content changes. Vercel is the delivery layer: preview deployments for code, protected preview for drafts, and revalidation for published content.
