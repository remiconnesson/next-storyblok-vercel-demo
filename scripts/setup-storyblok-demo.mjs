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
				eyebrow: 'Storyblok on Vercel',
				headline: 'Launch Storyblok sites on Vercel',
				summary:
					'Give editors visual authoring in Storyblok while Vercel delivers the Next.js frontend with secure previews, caching, and revalidation.',
				primary_label: 'Explore the editor',
				primary_href: '/visual-editor',
				secondary_label: 'View architecture',
				secondary_href: '/preview-pipeline',
				visual_image_url: heroEditorImage,
				visual_alt: 'Storyblok Visual Editor interface with AI tools and editable page preview',
				panel_kicker: 'Production pattern',
				panel_title:
					'Editors manage content in Storyblok. Developers ship the frontend on Vercel.',
				panel_items: [
					blok('hero_panel_item', { label: 'Authoring', value: 'Visual CMS' }),
					blok('hero_panel_item', { label: 'Frontend', value: 'Next.js' }),
					blok('hero_panel_item', { label: 'Delivery', value: 'Vercel' }),
				],
			}),
			blok('integration_panel', {
				eyebrow: 'Architecture',
				heading: 'From visual editing to global delivery',
				description:
					'Content teams compose pages in Storyblok while engineering keeps control of the React components, routing, caching, and deployment workflow.',
				nodes: [
					blok('integration_node', {
						badge: '01',
						title: 'Model content',
						description:
							'Reusable Storyblok blocks define the sections editors can safely compose.',
					}),
					blok('integration_node', {
						badge: '02',
						title: 'Render with Next.js',
						description:
							'The App Router maps each CMS block to a governed React Server Component.',
					}),
					blok('integration_node', {
						badge: '03',
						title: 'Preview securely',
						description:
							'Draft content loads only in authenticated preview contexts before it reaches production.',
					}),
					blok('integration_node', {
						badge: '04',
						title: 'Deliver globally',
						description:
							'Published pages are cached on Vercel and refreshed through targeted revalidation.',
					}),
				],
			}),
			blok('metric_strip', {
				eyebrow: 'Outcome',
				heading: 'A workflow built for content and engineering teams',
				metrics: [
					blok('metric', {
						value: 'Visual',
						label: 'authoring experience',
						detail:
							'Editors update structured page sections in Storyblok without changing application code.',
					}),
					blok('metric', {
						value: 'Governed',
						label: 'component system',
						detail:
							'Developers control the React components, data fetching, and production behavior.',
					}),
					blok('metric', {
						value: 'Fast',
						label: 'published delivery',
						detail:
							'Vercel serves published pages through static generation, caching, and revalidation.',
					}),
				],
			}),
			blok('feature_grid', {
				eyebrow: 'Capabilities',
				heading: 'What this integration enables',
				description:
					'The same setup supports visual editing, controlled page composition, secure draft previews, and fast production delivery.',
				features: [
					blok('feature_card', {
						tag: 'Authoring',
						title: 'Visual editing',
						description:
							'Editors select page sections, update fields, and preview changes in the Storyblok interface.',
					}),
					blok('feature_card', {
						tag: 'Frontend',
						title: 'Component mapping',
						description:
							'Every Storyblok block maps to a deliberate React component in the Next.js application.',
					}),
					blok('feature_card', {
						tag: 'Preview',
						title: 'Draft isolation',
						description:
							'Draft content is available to editors without changing what production visitors see.',
					}),
					blok('feature_card', {
						tag: 'Delivery',
						title: 'Cached production pages',
						description:
							'Published pages are generated and cached by Vercel for fast global delivery.',
					}),
					blok('feature_card', {
						tag: 'Security',
						title: 'Separated access',
						description:
							'Public delivery, draft preview, and management access use different tokens and environments.',
					}),
					blok('feature_card', {
						tag: 'Operations',
						title: 'On-demand freshness',
						description:
							'Storyblok publish events can refresh affected Vercel routes without a full site rebuild.',
					}),
				],
			}),
			blok('workflow_section', {
				eyebrow: 'Workflow',
				heading: 'A publishing flow teams can trust',
				steps: [
					blok('workflow_step', {
						label: '01',
						title: 'Compose content in Storyblok',
						description:
							'Content teams build pages from approved sections and edit fields in a visual CMS.',
					}),
					blok('workflow_step', {
						label: '02',
						title: 'Preview through the real frontend',
						description:
							'Draft previews render through the same Next.js components that power production.',
					}),
					blok('workflow_step', {
						label: '03',
						title: 'Publish approved changes',
						description:
							'Storyblok publish events promote approved content from draft to published delivery.',
					}),
					blok('workflow_step', {
						label: '04',
						title: 'Refresh the Vercel cache',
						description:
							'The frontend revalidates the relevant content so visitors see the latest published page.',
					}),
				],
			}),
			blok('rich_text_section', {
				eyebrow: 'Team model',
				heading: 'Built for clear ownership',
				body: richDoc([
					paragraph(
						'Storyblok owns the authoring experience and structured content model. Vercel owns the frontend runtime, deployment workflow, caching behavior, and production delivery.',
					),
					bullet(
						'Editors can move quickly without opening pull requests for routine page updates.',
					),
					bullet(
						'Developers keep control of the UI contract, performance profile, and release process.',
					),
				]),
			}),
			blok('cta_section', {
				eyebrow: 'Get started',
				heading: 'Bring Storyblok content to Vercel',
				description:
					'Use Storyblok for visual authoring and Vercel for secure previews, fast published pages, and production-grade delivery.',
				primary_label: 'View architecture',
				primary_href: '/preview-pipeline',
				secondary_label: 'See content model',
				secondary_href: '/content-model',
			}),
		]),
	},
	{
		name: 'Visual Editor',
		slug: 'visual-editor',
		content: pageContent([
			blok('hero_section', {
				eyebrow: 'Visual authoring',
				headline: 'Give editors a CMS they can work in directly',
				summary:
					'Storyblok Visual Editor lets content teams edit structured blocks while seeing the page they are changing. The Next.js frontend keeps the rendering system consistent across preview and production.',
				primary_label: 'View content model',
				primary_href: '/content-model',
				secondary_label: 'Back home',
				secondary_href: '/',
				visual_image_url: marketerEditorImage,
				visual_alt: 'Storyblok Visual Editor page preview with editable landing page content',
				panel_kicker: 'Editor experience',
				panel_title:
					'Visual editing stays connected to the same components that ship to production.',
				panel_items: [
					blok('hero_panel_item', {
						label: 'Selection',
						value: 'Block-level',
					}),
					blok('hero_panel_item', {
						label: 'Content',
						value: 'Structured fields',
					}),
					blok('hero_panel_item', {
						label: 'Frontend',
						value: 'Next.js App Router',
					}),
				],
			}),
			blok('rich_text_section', {
				eyebrow: 'Authoring',
				heading: 'What editors can manage',
				body: richDoc([
					paragraph(
						'Editors can update hero copy, add feature cards, reorder sections, and publish approved changes without waiting for a frontend deploy.',
					),
					bullet('Select a section in the Visual Editor and edit its fields.'),
					bullet(
						'Reorder page sections while staying inside the approved component model.',
					),
					bullet('Publish content independently from application deployment.'),
				]),
			}),
			blok('cta_section', {
				eyebrow: 'Preview',
				heading: 'Draft content stays separate from production',
				description:
					'Editors can review unpublished changes in Storyblok while the public Vercel site continues serving the last published version.',
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
				eyebrow: 'Frontend delivery',
				headline: 'Use Vercel to preview, publish, and scale',
				summary:
					'Vercel gives Storyblok-powered sites secure preview URLs, globally cached production pages, and a deployment workflow that fits modern frontend teams.',
				primary_label: 'Inspect model',
				primary_href: '/content-model',
				secondary_label: 'Back home',
				secondary_href: '/',
				visual_image_url: developerCodeImage,
				visual_alt: 'Storyblok developer code panel showing a Next.js example',
				panel_kicker: 'Delivery layer',
				panel_title:
					'Storyblok content moves through the same Vercel delivery controls as the rest of the application.',
				panel_items: [
					blok('hero_panel_item', { label: 'Host', value: 'Vercel' }),
					blok('hero_panel_item', { label: 'Preview', value: 'Draft content' }),
					blok('hero_panel_item', { label: 'Publish', value: 'Revalidated pages' }),
				],
			}),
			blok('workflow_section', {
				eyebrow: 'Delivery workflow',
				heading: 'How content reaches production',
				steps: [
					blok('workflow_step', {
						label: '01',
						title: 'Fetch published content',
						description:
							'The public site requests the published Storyblok version and generates static pages on Vercel.',
					}),
					blok('workflow_step', {
						label: '02',
						title: 'Protect draft previews',
						description:
							'The preview route validates Storyblok preview parameters before rendering draft content.',
					}),
					blok('workflow_step', {
						label: '03',
						title: 'Revalidate on publish',
						description:
							'A signed Storyblok webhook refreshes the relevant Vercel cache tags when content is published.',
					}),
				],
			}),
			blok('metric_strip', {
				eyebrow: 'Frontend platform',
				heading: 'Where Vercel adds value',
				metrics: [
					blok('metric', {
						value: 'Secure',
						label: 'preview routes',
						detail:
							'Draft content is only available through protected preview paths.',
					}),
					blok('metric', {
						value: 'Global',
						label: 'edge delivery',
						detail:
							'Published pages are served through Vercel infrastructure close to visitors.',
					}),
					blok('metric', {
						value: 'ISR',
						label: 'publish revalidation',
						detail:
							'Updated content can refresh without rebuilding the entire application.',
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
				headline: 'Govern page composition with reusable blocks',
				summary:
					'The integration gives editors reusable Storyblok sections while developers keep the frontend component contract explicit and testable.',
				primary_label: 'Visual editor page',
				primary_href: '/visual-editor',
				secondary_label: 'Home',
				secondary_href: '/',
				visual_image_url: developerCodeImage,
				visual_alt: 'Code-oriented Storyblok developer panel for a Next.js setup',
				panel_kicker: 'Content model',
				panel_title:
					'Structured Storyblok blocks map directly to the components rendered by Next.js.',
				panel_items: [
					blok('hero_panel_item', { label: 'Root type', value: 'page' }),
					blok('hero_panel_item', { label: 'Sections', value: 'Reusable' }),
					blok('hero_panel_item', { label: 'Rendering', value: 'Component-driven' }),
				],
			}),
			blok('feature_grid', {
				eyebrow: 'Content model',
				heading: 'The pieces editors can compose',
				description:
					'Each block gives editors useful control while preserving the design system and frontend implementation.',
				features: [
					blok('feature_card', {
						tag: 'Root',
						title: 'Page',
						description:
							'Defines navigation and a restricted body of approved section components.',
					}),
					blok('feature_card', {
						tag: 'Section',
						title: 'Hero section',
						description:
							'Combines primary messaging, calls to action, a visual asset, and proof points.',
					}),
					blok('feature_card', {
						tag: 'Section',
						title: 'Integration panel',
						description:
							'Explains architecture and process as editable content.',
					}),
					blok('feature_card', {
						tag: 'Section',
						title: 'Metric strip',
						description:
							'Highlights outcome statements without hard-coding copy in the frontend.',
					}),
					blok('feature_card', {
						tag: 'Section',
						title: 'Feature grid',
						description:
							'Lets editors add and reorder value propositions as nested cards.',
					}),
					blok('feature_card', {
						tag: 'Section',
						title: 'Rich text and CTA',
						description:
							'Supports explanatory content and next actions from Storyblok.',
					}),
				],
			}),
			blok('rich_text_section', {
				eyebrow: 'Governance',
				heading: 'Why this model scales',
				body: richDoc([
					paragraph(
						'The model separates concerns cleanly: content teams control page composition, developers control the rendering contract, and Vercel provides the delivery layer.',
					),
					bullet(
						'Component whitelists keep editors inside approved page structures.',
					),
					bullet(
						'Block-driven rendering lets teams add stories without creating new application routes.',
					),
					bullet(
						'The same content model can support landing pages, campaign pages, and product storytelling.',
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
