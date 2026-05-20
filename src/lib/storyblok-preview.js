import { createHash, timingSafeEqual } from 'node:crypto';

function getSearchParam(searchParams, key) {
	const value = searchParams?.[key];
	return Array.isArray(value) ? value[0] : value;
}

function safeEqualHex(left, right) {
	const leftBuffer = Buffer.from(left || '', 'hex');
	const rightBuffer = Buffer.from(right || '', 'hex');

	return (
		leftBuffer.length === rightBuffer.length &&
		timingSafeEqual(leftBuffer, rightBuffer)
	);
}

export function isValidStoryblokPreview(searchParams) {
	const spaceId = getSearchParam(searchParams, '_storyblok_tk[space_id]');
	const timestamp = getSearchParam(searchParams, '_storyblok_tk[timestamp]');
	const token = getSearchParam(searchParams, '_storyblok_tk[token]');
	const previewToken =
		process.env.STORYBLOK_PREVIEW_ACCESS_TOKEN ||
		process.env.STORYBLOK_DELIVERY_API_TOKEN;

	if (!spaceId || !timestamp || !token || !previewToken) {
		return false;
	}

	const timestampNumber = Number(timestamp);
	const timestampIsFresh =
		Number.isFinite(timestampNumber) &&
		timestampNumber > Math.floor(Date.now() / 1000) - 3600;

	if (!timestampIsFresh) {
		return false;
	}

	const validationString = `${spaceId}:${previewToken}:${timestamp}`;
	const expected = createHash('sha1').update(validationString).digest('hex');

	return safeEqualHex(token, expected);
}

export function hasPreviewSecret(searchParams) {
	const secret = getSearchParam(searchParams, 'secret');
	return Boolean(
		process.env.STORYBLOK_PREVIEW_SECRET &&
			secret === process.env.STORYBLOK_PREVIEW_SECRET,
	);
}
