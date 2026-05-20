import { StoryblokStory } from '@storyblok/react/rsc';
import { getStoryblokApi } from '@/lib/storyblok';
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
	const { slug } = await params;

	let fullSlug = slug ? slug.join('/') : 'home';

	let sbParams = {
		version: process.env.STORYBLOK_VERSION || 'draft',
	};

	const storyblokApi = getStoryblokApi();
	let data;

	try {
		({ data } = await storyblokApi.get(`cdn/stories/${fullSlug}`, sbParams));
	} catch {
		notFound();
	}

	return <StoryblokStory story={data.story} />;
}
