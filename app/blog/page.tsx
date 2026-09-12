import { redirect, notFound } from "next/navigation";
import { getAllPostSummaries } from "../lib/posts";

export default function BlogPage() {
  const posts = getAllPostSummaries();
  if (posts.length === 0) notFound();
  redirect(`/blog/${posts[0].slug}`);
}
