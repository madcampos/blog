import type { APIRoute } from 'astro';

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getImage } from 'astro:assets';

import defaultImage from '../assets/images/logo-blog-micro.png';

export const GET: APIRoute = async (context) => {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const ONE_WEEK_IN_MINUTES = 60 * 24 * 7;

  const blogImage = await getImage({ src: defaultImage, format: 'png', width: 512, height: 512 });

  return rss({
    title: "Marco Campos' Blog",
    description: 'A space where I talk about web development, Vue.js, Node.js, TypeScript, JavaScript',
    site: context.site ?? '',
    items: await Promise.all((await getCollection('blog')).map(async (post) => {
      const image = post.data.image && await getImage({ src: post.data.image, format: 'png' });
      let imageSize = 0;

      if (image) {
          const imageResponse = await fetch(image.src);

          imageSize = Number.parseInt(imageResponse.headers.get('Content-Length') ?? '0');
      }


      return {
        title: post.data.title,
        summary: post.data.summary,
        pubDate: post.data.createdAt,
        categories: post.data.tags,
        link: `${context.site?.toString() ?? ''}/${post.slug}`,
        ...(image && {
          enclosure: {
            url: new URL(image.src, context.site).toString(),
            type: 'image/png',
            length: imageSize
          }
        })
      };
    })),
    customData: `
      <language>en-us</language>
      <image>
        <url>${new URL(blogImage.src, context.site).toString()}</url>
        <title>Marco Campos' Blog</title>
        <link>${context.site?.toString() ?? ''}</link>
        <width>${blogImage.options.width}</width>
        <height>${blogImage.options.height}</height>
      </image>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <ttl>${ONE_WEEK_IN_MINUTES}</ttl>
    `
  });
};
