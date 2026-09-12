import type { Metadata } from 'next';
import { getPostBySlug } from '../../lib/posts';
import { renderMarkdown } from '../../lib/markdown';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(`${slug}.md`);
  return { title: post?.meta.title };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(`${slug}.md`);
  if (!post) return <p>Post not found.</p>;

  const html = await renderMarkdown(post.body);

  return (
    <article>
      {post.meta.tags && post.meta.tags[0] && <span className="tag">{post.meta.tags[0]}</span>}
      <h1 style={{ fontSize: 30, margin: "12px 0 6px" }}>{post.meta.title}</h1>
      <p className="meta" style={{ margin: "0 0 24px" }}>{post.meta.date}</p>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      {post.meta.tags && (
        <p className="meta" style={{ marginTop: 32 }}>Tags: {post.meta.tags.join(', ')}</p>
      )}
    </article>
  );
}
