// src/pages/search.json.ts
import { getImage } from 'astro:assets';
import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');
  const index = await Promise.all(
    posts
      .filter((p) => !p.data.draft)
      .map(async (p) => {
        const img = await getImage({
          src: p.data.imgUrl,
          width: 800,
          height: 400,
        });
        return {
          title: p.data.title,
          description: p.data.description,
          tags: p.data.tags,
          url: `/cases/${p.id}/`,
          img: img.src,
        };
      }),
  );
  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
}
