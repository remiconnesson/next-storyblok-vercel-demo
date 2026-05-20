import { StoryblokStory } from '@storyblok/react/rsc';
import {
	fetchStory,
	fetchStoryLinks,
	getRoutePathFromStorySlug,
	getStoryPathFromSlug,
} from '@/lib/storyblok';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import PreviewToolbar from '@/components/PreviewToolbar';

export const revalidate = 3600;

export async function generateStaticParams() {
	const fullSlugs = await fetchStoryLinks();

	return fullSlugs.map((fullSlug) => ({
		slug: fullSlug === 'home' ? [] : fullSlug.split('/'),
	}));
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const fullSlug = getStoryPathFromSlug(slug);
	const story = await fetchStory(fullSlug);

	if (!story) {
		return {};
	}

	return {
		title: story.name
			? `${story.name} - Storyblok + Vercel`
			: 'Storyblok + Vercel Demo',
	};
}

export default async function Page({ params }) {
	const { slug } = await params;
	const fullSlug = getStoryPathFromSlug(slug);
	const routePath = getRoutePathFromStorySlug(fullSlug);
	const { isEnabled: preview } = await draftMode();
	let story;

	try {
		story = await fetchStory(fullSlug, { preview });
	} catch {
		notFound();
	}

	if (!story) {
		notFound();
	}

	return (
		<>
			{preview ? <PreviewToolbar path={routePath} /> : null}
			<StoryblokStory story={story} />
		</>
	);
}
