import { getAllPosts } from "../lib/posts";
import BlogSidebar from "./sidebar";

function monthYear(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Undated";
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const posts = getAllPosts();
  const groups: { month: string; posts: { slug: string; title: string }[] }[] = [];
  for (const p of posts) {
    const month = monthYear(p.meta.date || "");
    let group = groups.find((g) => g.month === month);
    if (!group) {
      group = { month, posts: [] };
      groups.push(group);
    }
    group.posts.push({ slug: p.slug, title: p.meta.title });
  }

  return (
    <div className="blog-layout">
      <div className="blog-main">{children}</div>
      <BlogSidebar groups={groups} />
    </div>
  );
}
