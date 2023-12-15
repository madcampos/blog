import { type CollectionEntry, getCollection } from 'astro:content';

export type Post = CollectionEntry<'blog'> & {
	slug: string,
	year: string,
	month: string,
	day: string,
	url: string
};

function formatPostMetadata(post: CollectionEntry<'blog'>) {
	const slug = post.slug.split('/').pop() ?? '';
	const postDate = new Date(post.data.updatedAt ?? post.data.createdAt);
	const year = postDate.getFullYear().toString();
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const month = (postDate.getMonth() + 1).toString().padStart(2, '0');
	// eslint-disable-next-line @typescript-eslint/no-magic-numbers
	const day = postDate.getDate().toString().padStart(2, '0');

	return {
		...post,
		slug,
		year,
		month,
		day,
		url: `${year}/${month}/${slug}`
	};
}

export async function listAllPosts() {
	const blogEntries = await getCollection('blog');
	// eslint-disable-next-line max-len
	const posts = blogEntries.map((entry) => formatPostMetadata(entry)).sort((first, second) => Number.parseInt(second.year) - Number.parseInt(first.year) || Number.parseInt(second.month) - Number.parseInt(first.month) || Number.parseInt(second.day) - Number.parseInt(first.day));

	return posts;
}

export async function listPostPagesByYear() {
	const blogEntries = await getCollection('blog');
	const posts = blogEntries.map((entry) => formatPostMetadata(entry));

	const years: Record<string, Post[]> = {};

	for (const post of posts) {
		const year = post.year.toString();

		if (!years[year]) {
			years[year] = [];
		}

		years[year]?.push(post as Post);
	}

	for (const year of Object.keys(years)) {
		years[year]?.sort((first, second) => Number.parseInt(second.month) - Number.parseInt(first.month) || Number.parseInt(second.day) - Number.parseInt(first.day));
	}

	return years;
}

export async function listPostsPagesByMonth() {
	const posts = await listPostPagesByYear();
	const postsByMonth: Record<string, Record<string, Post[]>> = {};

	for (const year of Object.keys(posts)) {
		const months: Record<string, Post[]> = {};

		for (const post of posts[year] as Post[]) {
			const month = post.month.toString();

			if (!months[month]) {
				months[month] = [];
			}

			months[month]?.push(post);
		}

		if (!postsByMonth[year]) {
			postsByMonth[year] = {};
		}

		postsByMonth[year] = months;
	}

	return postsByMonth;
}

export async function listPostPagesByTag() {
	const blogEntries = await getCollection('blog');
	const posts = blogEntries.map((entry) => formatPostMetadata(entry));

	const tags: Record<string, Post[]> = {};

	for (const post of posts) {
		for (const tag of post.data.tags ?? []) {
			if (!tags[tag]) {
				tags[tag] = [];
			}

			tags[tag]?.push(post as Post);
		}
	}

	for (const tag of Object.keys(tags)) {
		// eslint-disable-next-line max-len
		tags[tag]?.sort((first, second) => Number.parseInt(second.year) - Number.parseInt(first.year) || Number.parseInt(second.month) - Number.parseInt(first.month) || Number.parseInt(second.day) - Number.parseInt(first.day));
	}

	return tags;
}
