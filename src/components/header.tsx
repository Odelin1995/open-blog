"use client";

import { Link } from "next-view-transitions";
import { AUTHOR_NAME, AUTHOR_IMAGE_URL, GITHUB_URL } from "@/config/site";

interface HeaderProps {
  onSearchOpen?: () => void;
}

export default function Header({ onSearchOpen }: HeaderProps) {
  return (
    <header className="mb-10 flex flex-row place-content-between items-center">
      <Link
        href="/"
        className={
          "flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-200"
        }
      >
        blog
      </Link>

      <div className="flex items-center gap-4">
        {onSearchOpen && (
          <button
            onClick={onSearchOpen}
            className="flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-600"
          >
            <svg
              className="h-4 w-4"
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
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline rounded border border-neutral-300 px-2 py-0.5 text-xs dark:border-neutral-700">
              ⌘K
            </kbd>
          </button>
        )}

        {GITHUB_URL && AUTHOR_IMAGE_URL && (
          <span className="relative flex items-center gap-1 italic">
            by
            <Link
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AUTHOR_IMAGE_URL}
                loading="eager"
                alt={AUTHOR_NAME}
                className="relative mx-1 inline h-8 w-8 rounded-full"
              />
            </Link>
          </span>
        )}
      </div>
    </header>
  );
}
