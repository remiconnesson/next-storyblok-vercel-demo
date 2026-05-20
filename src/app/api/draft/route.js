import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

function normalizeSlug(value) {
	if (!value || value === 'home') {
		return '/';
	}

	const path = value.startsWith('/') ? value : `/${value}`;
	return path.startsWith('//') ? '/' : path;
}

export async function GET(request) {
	const url = new URL(request.url);
	const secret = url.searchParams.get('secret');
	const previewSecret = process.env.STORYBLOK_PREVIEW_SECRET;

	if (!previewSecret || secret !== previewSecret) {
		return new Response('Invalid preview secret', { status: 401 });
	}

	const draft = await draftMode();
	draft.enable();

	redirect(normalizeSlug(url.searchParams.get('slug')));
}
