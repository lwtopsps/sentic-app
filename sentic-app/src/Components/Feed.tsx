import { createClient } from '@/lib/supabase/server';

export default async function Feed() {
  const supabase = await createClient();
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, user_id, content->>text AS text, media_urls')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[Feed] failed to load posts', error);
    return <div className="text-red-400">Failed to load feed</div>;
  }

  return (
    <div className="space-y-6">
      {posts?.map((post: any) => (
        <article key={post.id} className="rounded-lg border border-white/6 bg-white/[0.02] p-4">
          <div className="text-sm text-neutral-400">@{post.user_id}</div>
          <p className="mt-2 text-white">{post.text}</p>
        </article>
      ))}
    </div>
  );
}
