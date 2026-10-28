"use client";

import { searchProjects, SearchResultType } from "@/lib/supabase/queries";
import Link from "next/link";
import { useState } from "react";

const Search = () => {
  const [input, setInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResultType | null>(
    null,
  );

  const handleChange = async (e: { target: { value: string } }) => {
    const value = e.target.value;

    setInput(value);

    if (!value.trim()) {
      setSearchResults(null);
      return;
    }

    const { data, error } = await searchProjects(value);

    if (error) throw new Error();

    setSearchResults(data);
  };

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="flex gap-2">
        <input
          onChange={handleChange}
          placeholder="Search for projects"
          value={input}
          className="input m-0"
        />
      </div>

      {searchResults && searchResults.length > 0 && (
        <div className="absolute left-0 top-full z-10 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-surface shadow-lg">
          {searchResults.map((result, index) => (
            <Link
              className="block px-4 py-3 hover:bg-primary hover:text-white"
              key={index}
              href={`/${result.slug}`}
              onClick={() => setSearchResults(null)}
            >
              {result.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
