import { createHmac, timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { STORYBLOK_CACHE_TAG, getStoryCacheTag } from '@/lib/storyblok';

function isValidSignature(payload, signature, secret) {
	if (!signature || !secret) {
		return false;
	}

	const expected = createHmac('sha1', secret).update(payload).digest('hex');
	const actualBuffer = Buffer.from(signature, 'hex');
	const expectedBuffer = Buffer.from(expected, 'hex');

	return (
		actualBuffer.length === expectedBuffer.length &&
		timingSafeEqual(actualBuffer, expectedBuffer)
	);
}

function extractFullSlug(payload) {
	return (
		payload?.story?.full_slug ||
		payload?.story?.slug ||
		payload?.full_slug ||
		payload?.slug ||
		null
	);
}

export async function POST(request) {
	const secret = process.env.STORYBLOK_WEBHOOK_SECRET;

	if (!secret) {
		return Response.json(
			{ ok: false, error: 'Missing STORYBLOK_WEBHOOK_SECRET' },
			{ status: 500 },
		);
	}

	const payloadText = await request.text();
	const signature = request.headers.get('webhook-signature');

	if (!isValidSignature(payloadText, signature, secret)) {
		return Response.json(
			{ ok: false, error: 'Invalid webhook signature' },
			{ status: 401 },
		);
	}

	let payload = {};
	try {
		payload = payloadText ? JSON.parse(payloadText) : {};
	} catch {
		return Response.json(
			{ ok: false, error: 'Invalid JSON payload' },
			{ status: 400 },
		);
	}

	const fullSlug = extractFullSlug(payload);
	const tags = [STORYBLOK_CACHE_TAG];

	if (fullSlug) {
		tags.push(getStoryCacheTag(fullSlug));
	}

	for (const tag of tags) {
		revalidateTag(tag, 'max');
	}

	return Response.json({
		ok: true,
		action: payload.action || null,
		fullSlug,
		revalidated: tags,
	});
}
