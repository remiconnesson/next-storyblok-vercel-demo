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

export const getStoryblokApi = storyblokInit({
	accessToken: process.env.STORYBLOK_DELIVERY_API_TOKEN,
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
