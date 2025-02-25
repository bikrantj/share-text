"use client";

import { useState, useEffect, FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const SearchCode = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [code, setCode] = useState<string>("");
  const [inSearchPage, setInSearchPage] = useState<boolean>(false);

  // Extract code from URL and set initial state
  useEffect(() => {
    const extractCodeFromUrl = () => {
      if (pathname !== "/" && pathname !== null) {
        const extractedCode = pathname.split("/")[1]; // Extract code from pathname
        setInSearchPage(true); // Indicate we're on a search page
        return extractedCode;
      }
      return searchParams.get("code") || ""; // Fallback to query parameter
    };

    setCode(extractCodeFromUrl());
  }, [pathname, searchParams]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCode(value);

    // Skip URL update if we're on a search page
    if (inSearchPage) return;

    // Update URL with the new code
    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
      params.set("code", value);
      window.history.pushState(null, "", `?${params.toString()}`);
    } else {
      window.history.pushState(null, "", "/");
    }
  };

  // Handle search action
  const handleSearch = () => {
    router.push(`/${code}`);
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-fit mx-auto gap-2 justify-center"
    >
      <Input
        className="bg-white"
        placeholder="Paste 4-digit code"
        value={code}
        onChange={handleInputChange}
        maxLength={4}
      />
      <Button disabled={code.length < 4} type="submit" onClick={handleSearch}>
        Search
      </Button>
    </form>
  );
};
