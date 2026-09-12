"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarGroup = {
  month: string;
  posts: { slug: string; title: string }[];
};

export default function BlogSidebar({ groups }: { groups: SidebarGroup[] }) {
  const pathname = usePathname();

  return (
    <nav className="blog-sidebar" aria-label="Blog archive">
      {groups.map((group) => (
        <div key={group.month} className="blog-sidebar-group">
          <h3>{group.month}</h3>
          <ul>
            {group.posts.map((p) => {
              const href = `/blog/${p.slug}`;
              const active = pathname === href;
              return (
                <li key={p.slug}>
                  <Link href={href} className={active ? "active" : undefined}>
                    {p.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
