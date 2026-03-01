import { describe, it, expect } from "vitest";

import { generateSearchData, extractExcerpt } from "../search";

describe("generateSearchData", () => {
  it("returns an array of search results", () => {
    const data = generateSearchData();
    expect(Array.isArray(data)).toBe(true);
  });

  it("each result has required fields", () => {
    const data = generateSearchData();
    data.forEach((result) => {
      expect(result).toHaveProperty("slug");
      expect(result).toHaveProperty("title");
      expect(result).toHaveProperty("description");
      expect(result).toHaveProperty("date");
    });
  });

  it("all fields are strings", () => {
    const data = generateSearchData();
    data.forEach((result) => {
      expect(typeof result.slug).toBe("string");
      expect(typeof result.title).toBe("string");
      expect(typeof result.description).toBe("string");
      expect(typeof result.date).toBe("string");
    });
  });

  it("slugs and titles are non-empty", () => {
    const data = generateSearchData();
    data.forEach((result) => {
      expect(result.slug.length).toBeGreaterThan(0);
      expect(result.title.length).toBeGreaterThan(0);
    });
  });

  it("dates are valid date strings", () => {
    const data = generateSearchData();
    data.forEach((result) => {
      const parsed = new Date(result.date);
      expect(parsed.getTime()).toBeGreaterThan(0);
    });
  });
});

describe("extractExcerpt", () => {
  const longContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. " +
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.";

  it("returns content around the matched query", () => {
    const excerpt = extractExcerpt(longContent, "tempor");
    expect(excerpt).toContain("tempor");
  });

  it("is case-insensitive", () => {
    const excerpt = extractExcerpt(longContent, "LOREM");
    expect(excerpt.toLowerCase()).toContain("lorem");
  });

  it("adds leading ellipsis when match is not at the start", () => {
    const excerpt = extractExcerpt(longContent, "voluptate");
    expect(excerpt.startsWith("...")).toBe(true);
  });

  it("adds trailing ellipsis when match is not at the end", () => {
    const excerpt = extractExcerpt(longContent, "tempor");
    expect(excerpt.endsWith("...")).toBe(true);
  });

  it("returns beginning of content when query is not found", () => {
    const excerpt = extractExcerpt(longContent, "nonexistent");
    expect(excerpt).toContain("Lorem ipsum");
    expect(excerpt.endsWith("...")).toBe(true);
  });

  it("returns beginning of content when query is empty", () => {
    const excerpt = extractExcerpt(longContent, "");
    expect(excerpt).toContain("Lorem ipsum");
  });

  it("returns empty string when content is empty", () => {
    const excerpt = extractExcerpt("", "test");
    expect(excerpt).toBe("");
  });

  it("respects custom maxLength for no-match fallback", () => {
    const excerpt = extractExcerpt(longContent, "nonexistent", 20);
    // 20 chars of content + "..."
    expect(excerpt.length).toBeLessThanOrEqual(23);
  });

  it("handles short content without adding ellipsis", () => {
    const excerpt = extractExcerpt("short text", "short");
    expect(excerpt).toBe("short text");
    expect(excerpt).not.toContain("...");
  });

  it("handles query at the very beginning", () => {
    const excerpt = extractExcerpt(longContent, "Lorem");
    expect(excerpt.startsWith("...")).toBe(false);
    expect(excerpt).toContain("Lorem");
  });
});
