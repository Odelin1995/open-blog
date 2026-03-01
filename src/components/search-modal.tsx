"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import FlexSearch, { type Index } from "flexsearch";
import type { SearchResult } from "@/lib/search";

interface SearchModalProps {
  searchData: SearchResult[];
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({
  searchData,
  isOpen,
  onClose,
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const indexRef = useRef<Index | null>(null);

  useEffect(() => {
    const index = new FlexSearch.Index({
      tokenize: "forward",
      cache: true,
    });

    searchData.forEach((post, idx) => {
      const searchableContent = `${post.title} ${post.description}`;
      index.add(idx, searchableContent);
    });

    indexRef.current = index;
  }, [searchData]);

  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!indexRef.current || !searchQuery.trim()) {
        setResults([]);
        return;
      }

      try {
        const searchResults = indexRef.current.search(searchQuery, {
          limit: 10,
        });

        const mappedResults = searchResults
          .map((idx) => searchData[idx as number])
          .filter(Boolean);

        setResults(mappedResults);
        setSelectedIndex(0);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      }
    },
    [searchData],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        setQuery("");
        setResults([]);
      }

      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }

      if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        navigateToPost(results[selectedIndex].slug);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const navigateToPost = (slug: string) => {
    router.push(`/blog/${slug}/`);
    onClose();
    setQuery("");
    setResults([]);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-x-4 top-20 z-50 mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-lg border border-neutral-300 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
          <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
            <svg
              className="h-5 w-5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search posts..."
              className="flex-1 bg-transparent text-lg outline-none placeholder:text-neutral-400"
            />
            <kbd className="rounded border border-neutral-300 px-2 py-1 text-xs text-neutral-500 dark:border-neutral-700">
              ESC
            </kbd>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {query && results.length === 0 && (
              <div className="px-4 py-8 text-center text-neutral-500">
                No posts found for &quot;{query}&quot;
              </div>
            )}

            {!query && (
              <div className="px-4 py-8 text-center text-sm text-neutral-500">
                Start typing to search posts...
              </div>
            )}

            {results.map((result, index) => (
              <button
                key={result.slug}
                onClick={() => navigateToPost(result.slug)}
                className={`w-full border-b border-neutral-200 px-4 py-3 text-left transition-colors dark:border-neutral-800 ${
                  index === selectedIndex
                    ? "bg-neutral-100 dark:bg-neutral-800"
                    : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                }`}
              >
                <div className="mb-1 font-medium">
                  {highlightMatch(result.title, query)}
                </div>
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {highlightMatch(result.description, query)}
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  {new Date(result.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </button>
            ))}
          </div>

          {results.length > 0 && (
            <div className="flex items-center gap-4 border-t border-neutral-200 px-4 py-2 text-xs text-neutral-500 dark:border-neutral-800">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-neutral-300 px-1 dark:border-neutral-700">
                  ↑↓
                </kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-neutral-300 px-1 dark:border-neutral-700">
                  ↵
                </kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-neutral-300 px-1 dark:border-neutral-700">
                  ESC
                </kbd>
                Close
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
