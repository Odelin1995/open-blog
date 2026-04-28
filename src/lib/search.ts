import { getBlogPosts } from "./blog";

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  date: string;
  excerpt?: string;
}

export function generateSearchData(): SearchResult[] {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
    title: post.metadata.title,
    description: post.metadata.description,
    date: post.metadata.date.toString(),
  }));
}

export function extractExcerpt(
  content: string,
  query: string,
  maxLength: number = 150,
): string {
  if (!query || !content) return content.slice(0, maxLength);

  const lowerContent = content.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const queryIndex = lowerContent.indexOf(lowerQuery);

  if (queryIndex === -1) {
    return content.slice(0, maxLength) + "...";
  }

  const start = Math.max(0, queryIndex - 50);
  const end = Math.min(content.length, queryIndex + query.length + 100);

  let excerpt = content.slice(start, end);

  if (start > 0) excerpt = "..." + excerpt;
  if (end < content.length) excerpt = excerpt + "...";

  return excerpt;
}
