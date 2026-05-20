const token = process.env.STORYBLOK_MANAGEMENT_TOKEN;
const spaceId = process.env.STORYBLOK_SPACE_ID;

if (!token) {
	throw new Error('Missing STORYBLOK_MANAGEMENT_TOKEN');
}

if (!spaceId) {
	throw new Error('Missing STORYBLOK_SPACE_ID');
}

const apiBase = `https://mapi.storyblok.com/v1/spaces/${spaceId}`;

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(path, options = {}) {
	const maxAttempts = 5;

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		const response = await fetch(`${apiBase}${path}`, {
			method: options.method || 'GET',
			headers: {
				Authorization: token,
				'Content-Type': 'application/json',
			},
			body: options.body ? JSON.stringify(options.body) : undefined,
		});

		const text = await response.text();
		const data = text ? JSON.parse(text) : {};

		if (response.ok) {
			return data;
		}

		if (response.status === 429 && attempt < maxAttempts) {
			await sleep(1200 * attempt);
			continue;
		}

		throw new Error(
			`${options.method || 'GET'} ${path} failed with ${response.status}: ${text}`,
		);
	}
}

function field(type, pos, displayName, extra = {}) {
	return {
		type,
		pos,
		display_name: displayName,
		...extra,
	};
}

function bloks(pos, displayName, whitelist) {
	return field('bloks', pos, displayName, {
		restrict_components: true,
		component_whitelist: whitelist,
	});
}

const pageSections = [
	'hero_section',
	'integration_panel',
	'metric_strip',
	'feature_grid',
	'workflow_section',
	'rich_text_section',
	'cta_section',
];

const componentSpecs = [
	{
		name: 'nav_item',
		display_name: 'Navigation item',
		is_root: false,
		is_nestable: true,
		schema: {
			label: field('text', 0, 'Label', { required: true }),
			href: field('text', 1, 'Href', { required: true }),
		},
	},
	{
		name: 'hero_panel_item',
		display_name: 'Hero panel item',
		is_root: false,
		is_nestable: true,
		schema: {
			label: field('text', 0, 'Label'),
			value: field('text', 1, 'Value'),
		},
	},
	{
		name: 'hero_section',
		display_name: 'Hero section',
		is_root: false,
		is_nestable: true,
		schema: {
			eyebrow: field('text', 0, 'Eyebrow'),
			headline: field('textarea', 1, 'Headline', { required: true }),
			summary: field('textarea', 2, 'Summary'),
			primary_label: field('text', 3, 'Primary label'),
			primary_href: field('text', 4, 'Primary href'),
			secondary_label: field('text', 5, 'Secondary label'),
			secondary_href: field('text', 6, 'Secondary href'),
			visual_image_url: field('text', 7, 'Visual image URL'),
			visual_alt: field('text', 8, 'Visual alt text'),
			panel_kicker: field('text', 9, 'Panel kicker'),
			panel_title: field('textarea', 10, 'Panel title'),
			panel_items: bloks(11, 'Panel items', ['hero_panel_item']),
		},
	},
	{
		name: 'integration_node',
		display_name: 'Integration node',
		is_root: false,
		is_nestable: true,
		schema: {
			badge: field('text', 0, 'Badge'),
			title: field('text', 1, 'Title'),
			description: field('textarea', 2, 'Description'),
		},
	},
	{
		name: 'integration_panel',
		display_name: 'Integration panel',
		is_root: false,
		is_nestable: true,
		schema: {
			eyebrow: field('text', 0, 'Eyebrow'),
			heading: field('text', 1, 'Heading'),
			description: field('textarea', 2, 'Description'),
			nodes: bloks(3, 'Flow nodes', ['integration_node']),
		},
	},
	{
		name: 'metric',
		display_name: 'Metric',
		is_root: false,
		is_nestable: true,
		schema: {
			value: field('text', 0, 'Value'),
			label: field('text', 1, 'Label'),
			detail: field('textarea', 2, 'Detail'),
		},
	},
	{
		name: 'metric_strip',
		display_name: 'Metric strip',
		is_root: false,
		is_nestable: true,
		schema: {
			eyebrow: field('text', 0, 'Eyebrow'),
			heading: field('text', 1, 'Heading'),
			metrics: bloks(2, 'Metrics', ['metric']),
		},
	},
	{
		name: 'feature_card',
		display_name: 'Feature card',
		is_root: false,
		is_nestable: true,
		schema: {
			tag: field('text', 0, 'Tag'),
			title: field('text', 1, 'Title'),
			description: field('textarea', 2, 'Description'),
		},
	},
	{
		name: 'feature_grid',
		display_name: 'Feature grid',
		is_root: false,
		is_nestable: true,
		schema: {
			eyebrow: field('text', 0, 'Eyebrow'),
			heading: field('text', 1, 'Heading'),
			description: field('textarea', 2, 'Description'),
			features: bloks(3, 'Features', ['feature_card']),
		},
	},
	{
		name: 'workflow_step',
		display_name: 'Workflow step',
		is_root: false,
		is_nestable: true,
		schema: {
			label: field('text', 0, 'Label'),
			title: field('text', 1, 'Title'),
			description: field('textarea', 2, 'Description'),
		},
	},
	{
		name: 'workflow_section',
		display_name: 'Workflow section',
		is_root: false,
		is_nestable: true,
		schema: {
			eyebrow: field('text', 0, 'Eyebrow'),
			heading: field('text', 1, 'Heading'),
			steps: bloks(2, 'Steps', ['workflow_step']),
		},
	},
	{
		name: 'rich_text_section',
		display_name: 'Rich text section',
		is_root: false,
		is_nestable: true,
		schema: {
			eyebrow: field('text', 0, 'Eyebrow'),
			heading: field('text', 1, 'Heading'),
			body: field('richtext', 2, 'Body'),
		},
	},
	{
		name: 'cta_section',
		display_name: 'CTA section',
		is_root: false,
		is_nestable: true,
		schema: {
			eyebrow: field('text', 0, 'Eyebrow'),
			heading: field('text', 1, 'Heading'),
			description: field('textarea', 2, 'Description'),
			primary_label: field('text', 3, 'Primary label'),
			primary_href: field('text', 4, 'Primary href'),
			secondary_label: field('text', 5, 'Secondary label'),
			secondary_href: field('text', 6, 'Secondary href'),
		},
	},
	{
		name: 'page',
		display_name: 'Page',
		is_root: true,
		is_nestable: false,
		schema: {
			brand_name: field('text', 0, 'Brand name'),
			brand_caption: field('text', 1, 'Brand caption'),
			nav_items: bloks(2, 'Navigation', ['nav_item']),
			body: bloks(3, 'Body', pageSections),
		},
	},
];

let uidCounter = 0;
function uid(prefix) {
	uidCounter += 1;
	return `${prefix}_${String(uidCounter).padStart(4, '0')}`;
}

function blok(component, fields = {}) {
	return {
		_uid: uid(component),
		component,
		...fields,
	};
}

function paragraph(text) {
	return {
		type: 'paragraph',
		content: [{ type: 'text', text }],
	};
}

function bullet(text) {
	return {
		type: 'bullet_list',
		content: [
			{
				type: 'list_item',
				content: [paragraph(text)],
			},
		],
	};
}

function richDoc(nodes) {
	return {
		type: 'doc',
		content: nodes,
	};
}

function navItems() {
	return [
		blok('nav_item', { label: 'Home', href: '/' }),
		blok('nav_item', { label: 'Visual editor', href: '/visual-editor' }),
		blok('nav_item', { label: 'Preview pipeline', href: '/preview-pipeline' }),
		blok('nav_item', { label: 'Content model', href: '/content-model' }),
	];
}

function pageContent(body) {
	return {
		_uid: uid('page'),
		component: 'page',
		brand_name: 'Storyblok + Vercel',
		brand_caption: 'Visual CMS on the frontend cloud',
		nav_items: navItems(),
		body,
	};
}

const heroEditorImage =
	'https://a.storyblok.com/f/88751/3260x1774/35fe276995/hero-visual-editor-ai-mcp.png/m/1280x697/';
const marketerEditorImage =
	'https://a.storyblok.com/f/88751/2256x2032/800859251f/visual-editor-marketers-orange.png/m/667x601/';
const developerCodeImage =
	'https://a.storyblok.com/f/88751/1128x1014/a7b7b80277/developers-bg.png/m/668x600/';

const stories = [
	{
		name: 'Home',
		slug: 'home',
		content: pageContent([
			blok('hero_section', {
				eyebrow: 'Storyblok + Vercel',
				headline: 'Visual editing for Vercel preview workflows',
				summary:
					'A component-driven Storyblok space feeding a Next.js App Router site. Editors work in Storyblok Visual Editor while Vercel provides preview, production, and the frontend delivery layer.',
				primary_label: 'Explore visual editing',
				primary_href: '/visual-editor',
				secondary_label: 'See preview pipeline',
				secondary_href: '/preview-pipeline',
				visual_image_url: heroEditorImage,
				visual_alt: 'Storyblok Visual Editor interface with AI tools and editable page preview',
				panel_kicker: 'Demo status',
				panel_title: 'CMS-authored blocks are live from Storyblok draft content.',
				panel_items: [
					blok('hero_panel_item', { label: 'CMS region', value: 'EU space' }),
					blok('hero_panel_item', { label: 'Renderer', value: 'Next.js RSC' }),
					blok('hero_panel_item', { label: 'Deployment', value: 'Vercel-ready' }),
				],
			}),
			blok('integration_panel', {
				eyebrow: 'Architecture',
				heading: 'A clean path from content model to preview URL',
				description:
					'The demo keeps the CMS boundary explicit: Storyblok owns components and stories, Next.js maps those blocks to React Server Components, and Vercel can host every branch as a reviewable preview.',
				nodes: [
					blok('integration_node', {
						badge: '01',
						title: 'Storyblok space',
						description:
							'Reusable blocks, editable stories, and native visual preview context live in the CMS.',
					}),
					blok('integration_node', {
						badge: '02',
						title: 'Next.js renderer',
						description:
							'The app fetches draft or published content and renders Storyblok blocks through App Router server components.',
					}),
					blok('integration_node', {
						badge: '03',
						title: 'Vercel preview',
						description:
							'Every branch can expose a shareable URL for editors, architects, and stakeholders to review.',
					}),
					blok('integration_node', {
						badge: '04',
						title: 'Publish loop',
						description:
							'Storyblok publish events can trigger revalidation so the deployment updates without a full rebuild.',
					}),
				],
			}),
			blok('metric_strip', {
				eyebrow: 'What is seeded',
				heading: 'A space that proves the end-to-end motion',
				metrics: [
					blok('metric', {
						value: '13',
						label: 'editable block types',
						detail:
							'Navigation, hero, metrics, feature cards, workflow steps, rich text, and CTAs.',
					}),
					blok('metric', {
						value: '4',
						label: 'published demo stories',
						detail:
							'Home plus focused pages for editing, preview, and content-model discussions.',
					}),
					blok('metric', {
						value: '0',
						label: 'CMS proxy layers',
						detail:
							'The frontend uses Storyblok delivery APIs directly through the official SDK.',
					}),
				],
			}),
			blok('feature_grid', {
				eyebrow: 'Demo talking points',
				heading: 'Position Storyblok where Content Link does not apply yet',
				description:
					'Vercel Content Link is not currently listed for Storyblok, so this demo shows the native Storyblok editing path and the Vercel preview story instead.',
				features: [
					blok('feature_card', {
						tag: 'Editor UX',
						title: 'Visual Editor-ready markup',
						description:
							'Every rendered block uses Storyblok editable attributes so CMS selection and page preview stay connected.',
					}),
					blok('feature_card', {
						tag: 'Frontend',
						title: 'Composable React mapping',
						description:
							'Each Storyblok component maps to a React Server Component with predictable styling and responsive behavior.',
					}),
					blok('feature_card', {
						tag: 'Vercel',
						title: 'Preview deployment fit',
						description:
							'The app is structured for Vercel previews, environment variables, and future webhook revalidation.',
					}),
					blok('feature_card', {
						tag: 'Scale',
						title: 'Schema-first demo content',
						description:
							'The setup script can recreate the component library and demo stories in another Storyblok space.',
					}),
					blok('feature_card', {
						tag: 'Security',
						title: 'Token separation',
						description:
							'The delivery token powers the app; the Management API token is only needed during space setup.',
					}),
					blok('feature_card', {
						tag: 'Roadmap',
						title: 'Content Link caveat is explicit',
						description:
							'The experience is honest about the current integration surface while still showing a strong CMS workflow.',
					}),
				],
			}),
			blok('workflow_section', {
				eyebrow: 'Workflow',
				heading: 'How the demo should be shown',
				steps: [
					blok('workflow_step', {
						label: 'Step 1',
						title: 'Edit blocks in Storyblok',
						description:
							'Open the Home story, select a block in the preview, and change copy or reorder sections.',
					}),
					blok('workflow_step', {
						label: 'Step 2',
						title: 'Review on the Next.js frontend',
						description:
							'The app renders the same content model as production, so the preview reflects the real component system.',
					}),
					blok('workflow_step', {
						label: 'Step 3',
						title: 'Deploy on Vercel',
						description:
							'Link the project, add Storyblok env vars, and let Vercel host previews for every branch.',
					}),
					blok('workflow_step', {
						label: 'Step 4',
						title: 'Add publish revalidation',
						description:
							'Wire a Storyblok webhook to a Vercel route handler once the deployment URL and secret are final.',
					}),
				],
			}),
			blok('rich_text_section', {
				eyebrow: 'Content Link note',
				heading: 'What to say in the demo',
				body: richDoc([
					paragraph(
						'Current Vercel CMS integration docs do not list Storyblok as a Content Link provider. The right positioning is to show Storyblok native visual editing today, then explain how Vercel preview deployments, toolbar feedback, and webhook revalidation complete the operating model.',
					),
					bullet(
						'Use the Contentful demo as the comparison point for field-level Content Link.',
					),
					bullet(
						'Use this Storyblok demo to show component-based authoring, visual preview, and Vercel delivery.',
					),
				]),
			}),
			blok('cta_section', {
				eyebrow: 'Next step',
				heading: 'Ready for Vercel once the local demo is approved',
				description:
					'The project can be linked to a Vercel project, assigned Storyblok delivery env vars, and extended with a Storyblok publish webhook.',
				primary_label: 'Open preview page',
				primary_href: '/preview-pipeline',
				secondary_label: 'Inspect content model',
				secondary_href: '/content-model',
			}),
		]),
	},
	{
		name: 'Visual Editor',
		slug: 'visual-editor',
		content: pageContent([
			blok('hero_section', {
				eyebrow: 'Storyblok native editing',
				headline: 'Click blocks, change content, preview the real site',
				summary:
					'Storyblok Visual Editor gives editors a CMS-native preview surface. The frontend adds editable attributes on every block so the selected CMS block maps to the rendered page.',
				primary_label: 'View content model',
				primary_href: '/content-model',
				secondary_label: 'Back home',
				secondary_href: '/',
				visual_image_url: marketerEditorImage,
				visual_alt: 'Storyblok Visual Editor page preview with editable landing page content',
				panel_kicker: 'Editor behavior',
				panel_title:
					'The demo is built around Storyblok editable blocks rather than Content Link.',
				panel_items: [
					blok('hero_panel_item', {
						label: 'Preview type',
						value: 'Native Storyblok',
					}),
					blok('hero_panel_item', {
						label: 'Markup',
						value: 'storyblokEditable',
					}),
					blok('hero_panel_item', {
						label: 'Frontend',
						value: 'Next.js App Router',
					}),
				],
			}),
			blok('rich_text_section', {
				eyebrow: 'Editor script',
				heading: 'What an editor can do',
				body: richDoc([
					paragraph(
						'An editor can open this story in Storyblok, change the hero headline, add a feature card, and preview the same React component system that will run on Vercel.',
					),
					bullet('Select a section in the Visual Editor and jump to its fields.'),
					bullet(
						'Reorder blocks without asking engineering to change the page route.',
					),
					bullet('Publish content independently from application deployment.'),
				]),
			}),
			blok('cta_section', {
				eyebrow: 'Demo route',
				heading: 'The preview path is already dynamic',
				description:
					'This page is a Storyblok story at /visual-editor, rendered by the same catch-all Next.js route as the home page.',
				primary_label: 'Preview pipeline',
				primary_href: '/preview-pipeline',
				secondary_label: 'Home',
				secondary_href: '/',
			}),
		]),
	},
	{
		name: 'Preview Pipeline',
		slug: 'preview-pipeline',
		content: pageContent([
			blok('hero_section', {
				eyebrow: 'Vercel fit',
				headline: 'Preview deployments make CMS review operational',
				summary:
					'Vercel gives every branch and environment a stable review URL. Storyblok can point its Visual Editor at those URLs once the project is linked and HTTPS preview targets are configured.',
				primary_label: 'Inspect model',
				primary_href: '/content-model',
				secondary_label: 'Back home',
				secondary_href: '/',
				visual_image_url: developerCodeImage,
				visual_alt: 'Storyblok developer code panel showing a Next.js example',
				panel_kicker: 'Deployment layer',
				panel_title:
					'The project is ready for env vars, previews, and webhook revalidation.',
				panel_items: [
					blok('hero_panel_item', { label: 'Host', value: 'Vercel' }),
					blok('hero_panel_item', { label: 'Mode', value: 'Preview first' }),
					blok('hero_panel_item', { label: 'Cache', value: 'Webhook-ready' }),
				],
			}),
			blok('workflow_section', {
				eyebrow: 'Deployment setup',
				heading: 'The Vercel wiring to add next',
				steps: [
					blok('workflow_step', {
						label: 'Env',
						title: 'Add Storyblok delivery variables',
						description:
							'Set the delivery token, region, and optional Storyblok version for preview and production environments.',
					}),
					blok('workflow_step', {
						label: 'URL',
						title: 'Point Storyblok Visual Editor at Vercel',
						description:
							'Use the preview or production URL as the visual editor location once the deployment exists.',
					}),
					blok('workflow_step', {
						label: 'Hook',
						title: 'Add on-demand revalidation',
						description:
							'Create a route handler and a Storyblok webhook so published changes refresh the right cached routes.',
					}),
				],
			}),
			blok('metric_strip', {
				eyebrow: 'Frontend platform',
				heading: 'Where Vercel adds value',
				metrics: [
					blok('metric', {
						value: 'HTTPS',
						label: 'Visual Editor compatible',
						detail:
							'Storyblok preview requires secure URLs; Vercel previews provide them by default.',
					}),
					blok('metric', {
						value: 'Branch',
						label: 'content review URLs',
						detail:
							'Preview deployments create isolated environments for testing CMS changes with app changes.',
					}),
					blok('metric', {
						value: 'ISR',
						label: 'publish revalidation',
						detail:
							'Storyblok publish webhooks can revalidate affected routes after deployment.',
					}),
				],
			}),
		]),
	},
	{
		name: 'Content Model',
		slug: 'content-model',
		content: pageContent([
			blok('hero_section', {
				eyebrow: 'Component model',
				headline: 'Reusable sections seeded through the Management API',
				summary:
					'The demo space is not hand-built in the UI. A repeatable setup script creates or updates components and publishes stories, which makes the demo portable across Storyblok spaces.',
				primary_label: 'Visual editor page',
				primary_href: '/visual-editor',
				secondary_label: 'Home',
				secondary_href: '/',
				visual_image_url: developerCodeImage,
				visual_alt: 'Code-oriented Storyblok developer panel for a Next.js setup',
				panel_kicker: 'Model inventory',
				panel_title:
					'The page body accepts focused section blocks that map directly to React.',
				panel_items: [
					blok('hero_panel_item', { label: 'Root type', value: 'page' }),
					blok('hero_panel_item', { label: 'Sections', value: '7 types' }),
					blok('hero_panel_item', { label: 'Nested blocks', value: '6 types' }),
				],
			}),
			blok('feature_grid', {
				eyebrow: 'Schema',
				heading: 'The pieces editors can compose',
				description:
					'Each block is intentionally small, repeatable, and easy to reason about in a customer-facing architecture demo.',
				features: [
					blok('feature_card', {
						tag: 'Root',
						title: 'Page',
						description:
							'Owns brand metadata, navigation items, and a restricted body of section components.',
					}),
					blok('feature_card', {
						tag: 'Section',
						title: 'Hero section',
						description:
							'Combines key messaging, CTAs, a visual asset URL, and proof-point rows.',
					}),
					blok('feature_card', {
						tag: 'Section',
						title: 'Integration panel',
						description:
							'Shows the Storyblok to Next.js to Vercel flow as editable CMS content.',
					}),
					blok('feature_card', {
						tag: 'Section',
						title: 'Metric strip',
						description:
							'Highlights measurable proof points without hard-coding them in the frontend.',
					}),
					blok('feature_card', {
						tag: 'Section',
						title: 'Feature grid',
						description:
							'Lets editors add and reorder value propositions as nested feature cards.',
					}),
					blok('feature_card', {
						tag: 'Section',
						title: 'Rich text and CTA',
						description:
							'Supports narrative explanation and conversion actions from CMS-managed content.',
					}),
				],
			}),
			blok('rich_text_section', {
				eyebrow: 'Implementation note',
				heading: 'Why this model is useful for a solution architect',
				body: richDoc([
					paragraph(
						'The model keeps the demo close to real customer architecture: marketers control page composition, developers control the rendering contract, and Vercel owns delivery.',
					),
					bullet(
						'The schema uses component whitelists so editors compose valid pages.',
					),
					bullet(
						'The frontend is block-driven, so adding stories does not require new routes.',
					),
					bullet(
						'The setup script makes the demo repeatable for workshops and customer calls.',
					),
				]),
			}),
		]),
	},
];

async function upsertComponents() {
	const existing = await request('/components/');
	const componentsByName = new Map(
		(existing.components || []).map((component) => [component.name, component]),
	);

	for (const spec of componentSpecs) {
		const current = componentsByName.get(spec.name);

		if (current) {
			await request(`/components/${current.id}`, {
				method: 'PUT',
				body: {
					component: {
						...current,
						...spec,
						id: current.id,
					},
				},
			});
			console.log(`updated component: ${spec.name}`);
			continue;
		}

		await request('/components/', {
			method: 'POST',
			body: { component: spec },
		});
		console.log(`created component: ${spec.name}`);
	}
}

async function findStoriesBySlug(slugs) {
	const path = `/stories/?by_slugs=${encodeURIComponent(slugs.join(','))}&per_page=100`;
	const response = await request(path);
	return new Map((response.stories || []).map((story) => [story.full_slug, story]));
}

async function upsertStories() {
	const existingBySlug = await findStoriesBySlug(stories.map((story) => story.slug));

	for (const story of stories) {
		const current = existingBySlug.get(story.slug);

		if (current) {
			await request(`/stories/${current.id}`, {
				method: 'PUT',
				body: {
					force_update: 1,
					publish: true,
					story: {
						...current,
						id: current.id,
						name: story.name,
						slug: story.slug,
						content: story.content,
					},
				},
			});
			console.log(`updated story: ${story.slug}`);
			continue;
		}

		await request('/stories/', {
			method: 'POST',
			body: {
				publish: true,
				story: {
					name: story.name,
					slug: story.slug,
					content: story.content,
				},
			},
		});
		console.log(`created story: ${story.slug}`);
	}
}

await upsertComponents();
await upsertStories();

console.log('Storyblok demo content is ready.');
