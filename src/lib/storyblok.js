import {
	CtaSection,
	FeatureCard,
	FeatureGrid,
	HeroPanelItem,
	HeroSection,
	IntegrationNode,
	IntegrationPanel,
	Metric,
	MetricStrip,
	NavItem,
	Page,
	RichTextSection,
	WorkflowSection,
	WorkflowStep,
} from '@/components/StoryblokBlocks';
import { apiPlugin, storyblokInit } from '@storyblok/react/rsc';

export const STORYBLOK_CACHE_TAG = 'storyblok';

function getDeliveryToken(preview = false) {
	const token = preview
		? process.env.STORYBLOK_PREVIEW_ACCESS_TOKEN ||
			process.env.STORYBLOK_DELIVERY_API_TOKEN
		: process.env.STORYBLOK_PUBLIC_ACCESS_TOKEN ||
			process.env.STORYBLOK_DELIVERY_API_TOKEN;

	if (!token) {
		throw new Error(
			preview
				? 'Missing STORYBLOK_PREVIEW_ACCESS_TOKEN or STORYBLOK_DELIVERY_API_TOKEN'
				: 'Missing STORYBLOK_PUBLIC_ACCESS_TOKEN or STORYBLOK_DELIVERY_API_TOKEN',
		);
	}

	return token;
}

function getStoryblokCdnBaseUrl() {
	if (process.env.STORYBLOK_API_BASE_URL) {
		return `${new URL(process.env.STORYBLOK_API_BASE_URL).origin}/v2`;
	}

	switch (process.env.STORYBLOK_REGION) {
		case 'us':
			return 'https://api-us.storyblok.com/v2';
		case 'ca':
			return 'https://api-ca.storyblok.com/v2';
		case 'ap':
		case 'au':
			return 'https://api-ap.storyblok.com/v2';
		default:
			return 'https://api.storyblok.com/v2';
	}
}

function createStoryblokUrl(path, params) {
	const url = new URL(`${getStoryblokCdnBaseUrl()}/${path}`);

	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null) {
			url.searchParams.set(key, value);
		}
	}

	return url;
}

export function getStoryPathFromSlug(slug) {
	const normalized = Array.isArray(slug) ? slug.join('/') : slug;
	return normalized || 'home';
}

export function getRoutePathFromStorySlug(fullSlug) {
	return fullSlug === 'home' ? '/' : `/${fullSlug}`;
}

export function getStoryCacheTag(fullSlug) {
	return `${STORYBLOK_CACHE_TAG}:story:${fullSlug}`;
}

export async function fetchStory(fullSlug, { preview = false } = {}) {
	const url = createStoryblokUrl(`cdn/stories/${fullSlug}`, {
		token: getDeliveryToken(preview),
		version: preview ? 'draft' : 'published',
	});

	const response = await fetch(
		url,
		preview
			? { cache: 'no-store' }
			: {
					next: {
						revalidate: 3600,
						tags: [STORYBLOK_CACHE_TAG, getStoryCacheTag(fullSlug)],
					},
				},
	);

	if (response.status === 404) {
		return null;
	}

	if (!response.ok) {
		throw new Error(`Storyblok fetch failed: ${response.status}`);
	}

	const { story } = await response.json();
	return story || null;
}

export async function fetchStoryLinks({ preview = false } = {}) {
	const url = createStoryblokUrl('cdn/stories', {
		token: getDeliveryToken(preview),
		version: preview ? 'draft' : 'published',
		per_page: '100',
	});

	const response = await fetch(
		url,
		preview
			? { cache: 'no-store' }
			: {
					next: {
						revalidate: 3600,
						tags: [STORYBLOK_CACHE_TAG],
					},
				},
	);

	if (!response.ok) {
		throw new Error(`Storyblok stories fetch failed: ${response.status}`);
	}

	const { stories = [] } = await response.json();
	return stories
		.filter((story) => story?.content?.component === 'page')
		.map((story) => story.full_slug);
}

export const getStoryblokApi = storyblokInit({
	accessToken:
		process.env.STORYBLOK_PUBLIC_ACCESS_TOKEN ||
		process.env.STORYBLOK_DELIVERY_API_TOKEN,
	use: [apiPlugin],
	components: {
		page: Page,
		nav_item: NavItem,
		hero_section: HeroSection,
		hero_panel_item: HeroPanelItem,
		integration_panel: IntegrationPanel,
		integration_node: IntegrationNode,
		metric_strip: MetricStrip,
		metric: Metric,
		feature_grid: FeatureGrid,
		feature_card: FeatureCard,
		workflow_section: WorkflowSection,
		workflow_step: WorkflowStep,
		rich_text_section: RichTextSection,
		cta_section: CtaSection,
	},
	apiOptions: {
		/** Set the correct region for your space. Learn more: https://www.storyblok.com/docs/packages/storyblok-js#example-region-parameter */
		region: process.env.STORYBLOK_REGION || 'eu',
		/** The following code is only required when creating a Storyblok space directly via the Blueprints feature. */
		endpoint: process.env.STORYBLOK_API_BASE_URL
			? `${new URL(process.env.STORYBLOK_API_BASE_URL).origin}/v2`
			: undefined,
	},
});
