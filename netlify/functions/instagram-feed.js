const API_VERSION = 'v25.0';
const DEFAULT_LIMIT = 3;

const jsonResponse = (statusCode, body) => ({
	statusCode,
	headers: {
		'Content-Type': 'application/json; charset=utf-8',
		'Cache-Control': 'public, max-age=0, s-maxage=900'
	},
	body: JSON.stringify(body)
});

const getRequiredEnv = () => {
	const instagramUserId = process.env.INSTAGRAM_USER_ID;
	const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

	if (!instagramUserId || !instagramAccessToken) {
		return {
			error: 'Missing INSTAGRAM_USER_ID or INSTAGRAM_ACCESS_TOKEN environment variable.'
		};
	}

	return {
		instagramUserId,
		instagramAccessToken
	};
};

const fetchJson = async (url) => {
	const response = await fetch(url, {
		headers: {
			Accept: 'application/json'
		}
	});

	const payload = await response.json();

	if (!response.ok) {
		const apiMessage = payload?.error?.message || `Instagram API request failed with status ${response.status}.`;
		throw new Error(apiMessage);
	}

	return payload;
};

const buildMediaListUrl = (instagramUserId, instagramAccessToken, limit) => {
	const query = new URLSearchParams({
		access_token: instagramAccessToken,
		limit: String(limit)
	});

	return `https://graph.facebook.com/${API_VERSION}/${instagramUserId}/media?${query.toString()}`;
};

const buildMediaDetailsUrl = (mediaId, instagramAccessToken) => {
	const query = new URLSearchParams({
		fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,username',
		access_token: instagramAccessToken
	});

	return `https://graph.facebook.com/${API_VERSION}/${mediaId}?${query.toString()}`;
};

exports.handler = async function handler() {
	try {
		const env = getRequiredEnv();

		if (env.error) {
			return jsonResponse(500, { error: env.error });
		}

		const { instagramUserId, instagramAccessToken } = env;
		const mediaListPayload = await fetchJson(
			buildMediaListUrl(instagramUserId, instagramAccessToken, DEFAULT_LIMIT)
		);

		const mediaIds = Array.isArray(mediaListPayload?.data)
			? mediaListPayload.data.map((item) => item.id).filter(Boolean).slice(0, DEFAULT_LIMIT)
			: [];

		if (mediaIds.length === 0) {
			return jsonResponse(200, { data: [] });
		}

		const mediaItems = await Promise.all(
			mediaIds.map(async (mediaId) => fetchJson(buildMediaDetailsUrl(mediaId, instagramAccessToken)))
		);

		const filteredItems = mediaItems
			.filter((item) => item.media_url || item.thumbnail_url)
			.slice(0, DEFAULT_LIMIT);

		return jsonResponse(200, { data: filteredItems });
	} catch (error) {
		return jsonResponse(500, {
			error: error instanceof Error ? error.message : 'Unexpected error while loading Instagram feed.'
		});
	}
};