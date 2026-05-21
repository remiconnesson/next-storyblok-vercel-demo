import Link from 'next/link';

export const metadata = {
	title: 'React CMS Integration - Storyblok + Vercel Demo',
	description:
		'Code examples for rendering Storyblok stories and CMS blocks in React with Next.js.',
};

const routeSnippet = `import { StoryblokStory } from '@storyblok/react/rsc';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { fetchStory, getStoryPathFromSlug } from '@/lib/storyblok';

export default async function Page({ params }) {
	const { slug } = await params;
	const fullSlug = getStoryPathFromSlug(slug);
	const { isEnabled: preview } = await draftMode();
	const story = await fetchStory(fullSlug, { preview });

	if (!story) {
		notFound();
	}

	return <StoryblokStory story={story} />;
}`;

const blockSnippet = `import {
	StoryblokServerComponent,
	storyblokEditable,
} from '@storyblok/react/rsc';

function asBlocks(value) {
	return Array.isArray(value) ? value : [];
}

export function Page({ blok }) {
	return (
		<main {...storyblokEditable(blok)}>
			{asBlocks(blok.body).map((nestedBlok) => (
				<StoryblokServerComponent
					blok={nestedBlok}
					key={nestedBlok._uid}
				/>
			))}
		</main>
	);
}

export function FeatureGrid({ blok }) {
	return (
		<section {...storyblokEditable(blok)}>
			{asBlocks(blok.features).map((nestedBlok) => (
				<StoryblokServerComponent
					blok={nestedBlok}
					key={nestedBlok._uid}
				/>
			))}
		</section>
	);
}`;

const registrySnippet = `import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';
import { FeatureCard, FeatureGrid, Page } from '@/components/StoryblokBlocks';

export const getStoryblokApi = storyblokInit({
	accessToken: process.env.STORYBLOK_PUBLIC_ACCESS_TOKEN,
	use: [apiPlugin],
	components: {
		page: Page,
		feature_grid: FeatureGrid,
		feature_card: FeatureCard,
	},
});`;

const steps = [
	{
		label: '01',
		title: 'Fetch the story',
		description:
			'Resolve the route slug, request the matching Storyblok story, and keep draft mode separate from published delivery.',
	},
	{
		label: '02',
		title: 'Render the root component',
		description:
			'Pass the returned story into StoryblokStory so the CMS component name selects the registered React component.',
	},
	{
		label: '03',
		title: 'Render nested blocks',
		description:
			'Inside each component, map nested bloks through StoryblokServerComponent so editors can compose sections from the CMS.',
	},
	{
		label: '04',
		title: 'Register every block',
		description:
			'Keep the Storyblok component names and React exports aligned in storyblokInit so new CMS blocks have a frontend renderer.',
	},
];

const checklist = [
	'Use StoryblokStory for the full story payload returned by the Delivery API.',
	'Use StoryblokServerComponent for nested blok arrays such as body, features, metrics, and steps.',
	'Spread storyblokEditable(blok) on rendered block wrappers so Visual Editor selection works.',
	'Fetch draft content only in preview contexts and published content everywhere else.',
];

function CodePanel({ title, eyebrow, code }) {
	return (
		<article className="code-panel">
			<div>
				<p className="eyebrow">{eyebrow}</p>
				<h2>{title}</h2>
			</div>
			<pre className="code-sample">
				<code>{code}</code>
			</pre>
		</article>
	);
}

export default function ReactCmsPage() {
	return (
		<div className="site-shell">
			<header className="site-header">
				<Link className="brand-mark" href="/">
					<span className="brand-badge">B</span>
					<span>
						<strong>Storyblok + Vercel</strong>
						<small>React CMS implementation guide</small>
					</span>
				</Link>
				<nav aria-label="Main navigation" className="site-nav">
					<Link className="nav-link" href="/">
						Home
					</Link>
					<Link className="nav-link" href="/visual-editor">
						Visual editor
					</Link>
					<Link className="nav-link" href="/preview-pipeline">
						Preview pipeline
					</Link>
					<Link className="nav-link" href="/content-model">
						Content model
					</Link>
				</nav>
			</header>

			<main>
				<section className="developer-hero">
					<div className="developer-hero-copy">
						<p className="eyebrow">React implementation</p>
						<h1>Plug Storyblok stories and CMS blocks into React</h1>
						<p>
							This page shows the two handoff points in the demo: a Next.js
							route fetches the CMS story, then registered React components
							render each nested Storyblok block.
						</p>
						<div className="hero-actions">
							<Link className="button button-primary" href="#story-route">
								Story route
							</Link>
							<Link className="button button-secondary" href="#block-rendering">
								Block rendering
							</Link>
						</div>
					</div>
					<div className="developer-flow" aria-label="Storyblok React flow">
						{steps.map((step) => (
							<article className="developer-flow-step" key={step.label}>
								<span>{step.label}</span>
								<h2>{step.title}</h2>
								<p>{step.description}</p>
							</article>
						))}
					</div>
				</section>

				<section className="section developer-checklist">
					<div className="section-heading">
						<p className="eyebrow">Rendering contract</p>
						<h2>The pattern in this app</h2>
						<p>
							Stories are page-level CMS entries. Blocks are the nested
							components inside each story. React owns how both are rendered.
						</p>
					</div>
					<ul>
						{checklist.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</section>

				<section className="code-section" id="story-route">
					<CodePanel
						code={routeSnippet}
						eyebrow="Route"
						title="Fetch a story and hand it to StoryblokStory"
					/>
				</section>

				<section className="code-section" id="block-rendering">
					<CodePanel
						code={blockSnippet}
						eyebrow="Blocks"
						title="Map CMS blok arrays to React components"
					/>
				</section>

				<section className="code-section">
					<CodePanel
						code={registrySnippet}
						eyebrow="Registry"
						title="Connect Storyblok component names to React exports"
					/>
				</section>
			</main>

			<footer className="site-footer">
				<span>Stories come from Storyblok. Components render in React.</span>
				<span>Use this page as the implementation reference for the demo.</span>
			</footer>
		</div>
	);
}
