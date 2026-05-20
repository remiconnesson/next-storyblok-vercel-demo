import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

function normalizeSlug(value) {
	if (!value) {
		return '/';
	}

	const path = value.startsWith('/') ? value : `/${value}`;
	return path.startsWith('//') ? '/' : path;
}

export async function GET(request) {
	const url = new URL(request.url);
	const draft = await draftMode();
	draft.disable();

	redirect(normalizeSlug(url.searchParams.get('slug')));
}
