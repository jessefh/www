import { redirect, notFound } from "next/navigation";
import { getAllPosts } from "../lib/posts";

export default function BlogPage() {
  const posts = getAllPosts();
  if (posts.length === 0) notFound();
  redirect(`/blog/${posts[0].slug}`);
}

