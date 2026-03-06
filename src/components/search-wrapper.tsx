"use client";

import { useState, useEffect } from "react";
import Header from "./header";
import SearchModal from "./search-modal";
import type { SearchResult } from "@/lib/search";

interface SearchWrapperProps {
  searchData: SearchResult[];
}

export default function SearchWrapper({ searchData }: SearchWrapperProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Header onSearchOpen={() => setIsSearchOpen(true)} />
      <SearchModal
        searchData={searchData}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
