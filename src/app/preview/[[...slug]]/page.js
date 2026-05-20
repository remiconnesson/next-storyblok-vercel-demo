import { StoryblokStory } from '@storyblok/react/rsc';
import PreviewToolbar from '@/components/PreviewToolbar';
import {
	fetchStory,
	getRoutePathFromStorySlug,
	getStoryPathFromSlug,
} from '@/lib/storyblok';
import {
	hasPreviewSecret,
	isValidStoryblokPreview,
} from '@/lib/storyblok-preview';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
	return {
		title: 'Draft Preview - Storyblok + Vercel',
	};
}

export default async function PreviewPage({ params, searchParams }) {
	const { slug } = await params;
	const query = await searchParams;
	const canPreview = isValidStoryblokPreview(query) || hasPreviewSecret(query);
	const fullSlug = getStoryPathFromSlug(slug);
	const publicPath = getRoutePathFromStorySlug(fullSlug);

	if (!canPreview) {
		if (!slug) {
			redirect(publicPath);
		}

		notFound();
	}

	const story = await fetchStory(fullSlug, { preview: true });

	if (!story) {
		notFound();
	}

	return (
		<>
			<PreviewToolbar path={publicPath} />
			<StoryblokStory story={story} />
		</>
	);
}
