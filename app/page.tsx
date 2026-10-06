"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { TorrentEntry, MediaMetadata } from "@/lib/catalog/types";
import { CATEGORIES } from "@/lib/catalog/types";
import TorrentCard from "@/components/TorrentCard";
import MediaSpotlight from "@/components/MediaSpotlight";
import {
  Search,
  Zap,
  Filter,
  Sparkles,
  Loader2,
  SearchX,
  RotateCcw,
  Code2,
} from "lucide-react";

const SOURCES = ["YTS", "1377x", "Nyaa.si"] as const;

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TorrentEntry[]>([]);
  const [media, setMedia] = useState<MediaMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Filters
  const [sourceFilter, setSourceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // For debounced search
  const abortRef = useRef<AbortController | null>(null);

  // Load latest on mount
  useEffect(() => {
    loadLatest();
  }, []);

  const loadLatest = async () => {
    setIsLoading(true);
    setError("");
    setMedia(null);
    try {
      const res = await fetch("/api/latest");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setResults(data.results ?? []);
    } catch {
      // Silently fail for initial load
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      const trimmed = query.trim();
      if (trimmed.length < 2) {
        setError("TYPE AT LEAST 2 CHARACTERS TO SEARCH");
        return;
      }

      // Cancel previous request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setError("");
      setHasSearched(true);

      try {
        const params = new URLSearchParams({ q: trimmed });
        if (sourceFilter) params.set("source", sourceFilter);
        if (categoryFilter) params.set("category", categoryFilter);

        const res = await fetch(`/api/search?${params}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Search failed");
        }

        const data = await res.json();
        setResults(data.results ?? []);
        setMedia(data.media ?? null);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(
          err instanceof Error ? err.message : "Search failed — try again"
        );
        setResults([]);
        setMedia(null);
      } finally {
        setIsLoading(false);
      }
    },
    [query, sourceFilter, categoryFilter]
  );

  // Re-search when filters change (if we've already searched)
  useEffect(() => {
    if (hasSearched && query.trim().length >= 2) {
      handleSearch();
    }
  }, [sourceFilter, categoryFilter]);

  const filteredResults = results;

  return (
    <div className="app-container">
      {/* Neo-brutalist Marquee Ticker */}
      <div className="neo-marquee-wrap">
        <div className="neo-marquee-inner">
          <span>★ TORRAYS // THE OPEN-SOURCE TORRENT AGGREGATOR</span>
          <span>★ LIVE DISTRIBUTED CRAWLING: YTS • 1377X • NYAA</span>
          <span>★ HIGH-SATURATION MEDIA DISCOVERY</span>
          <span>★ POWERED BY TMDB & ANILIST METADATA</span>
          <span>★ TORRAYS // THE OPEN-SOURCE TORRENT AGGREGATOR</span>
          <span>★ LIVE DISTRIBUTED CRAWLING: YTS • 1377X • NYAA</span>
          <span>★ HIGH-SATURATION MEDIA DISCOVERY</span>
          <span>★ POWERED BY TMDB & ANILIST METADATA</span>
        </div>
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-sticker-group">
            <div className="brand-badge">
              <Zap className="h-8 w-8 stroke-[3px] text-black fill-neo-accent" />
              <h1 className="logo-text">Torrays</h1>
            </div>
            <span className="sub-tag-sticker">AGGREGATOR v2.0</span>
          </div>
          <p className="tagline">
            Open-source torrent index &middot; Search across live swarms
          </p>
        </div>
      </header>

      {/* Search & Filter Bar */}
      <section className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrap">
            <div className="search-icon-box">
              <Search className="h-6 w-6 stroke-[3px]" />
            </div>
            <input
              type="text"
              className="search-input"
              placeholder="SEARCH MOVIES, ANIME, SHOWS..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {query && (
              <button
                type="button"
                className="search-clear"
                aria-label="Clear query"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setMedia(null);
                  setHasSearched(false);
                  loadLatest();
                }}
              >
                ✕
              </button>
            )}
          </div>
          <button
            type="submit"
            className="search-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin stroke-[3px]" />
                <span>SCRAPING...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 stroke-[3px] fill-current" />
                <span>SEARCH</span>
              </>
            )}
          </button>
        </form>

        {/* Filters */}
        <div className="filters-row">
          <div className="filter-group">
            <label>
              <Filter className="h-3.5 w-3.5 stroke-[3px]" /> Source Swarm
            </label>
            <select
              className="neo-select"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="">ALL SOURCES (YTS, 1377X, NYAA)</option>
              {SOURCES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>
              <Sparkles className="h-3.5 w-3.5 stroke-[3px]" /> Category
            </label>
            <select
              className="neo-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">ALL CATEGORIES</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {(sourceFilter || categoryFilter) && (
            <button
              type="button"
              className="clear-filters-btn"
              onClick={() => {
                setSourceFilter("");
                setCategoryFilter("");
              }}
            >
              <RotateCcw className="h-3.5 w-3.5 stroke-[3px]" />
              <span>RESET</span>
            </button>
          )}
        </div>
      </section>

      {/* Results */}
      <main className="results-section">
        {error && (
          <div className="error-banner">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {isLoading && (
          <div className="loading-box">
            <Loader2 className="h-12 w-12 animate-spin stroke-[3px] mx-auto text-black" />
            <h3 className="loading-title">// CRAWLING LIVE TRACKERS //</h3>
            <p className="loading-subtext">
              Querying YTS, 1377x, and Nyaa.si in real-time...
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {hasSearched && media && <MediaSpotlight media={media} />}

            {filteredResults.length > 0 && (
              <>
                <div className="results-header">
                  <span className="results-count-sticker">
                    {filteredResults.length}{" "}
                    {filteredResults.length === 1 ? "RESULT" : "RESULTS"} FOUND
                  </span>
                  {hasSearched ? (
                    <span className="results-query-sticker">
                      QUERY: &ldquo;{query.toUpperCase()}&rdquo;
                    </span>
                  ) : (
                    <span className="results-query-sticker">★ LATEST RELEASES</span>
                  )}
                </div>
                <div className="results-grid">
                  {filteredResults.map((t) => (
                    <TorrentCard key={t.id} torrent={t} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {!isLoading && !error && filteredResults.length === 0 && hasSearched && (
          <div className="empty-box">
            <SearchX className="h-16 w-16 stroke-[2.5px] mx-auto text-neo-accent" />
            <h3 className="empty-title">NO TORRENTS FOUND</h3>
            <p className="loading-subtext">
              Try broader keywords or clear your active category/source filters.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <p className="footer-main-text">
            Torrays &middot; Open-source torrent aggregator
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center mt-1">
            <a
              href="https://github.com/sergiotapia/magnetissimo"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-badge-link"
            >
              <Code2 className="h-4 w-4 stroke-[2.5px]" />
              <span>MAGNETISSIMO CRAWLERS</span>
            </a>
            <span className="footer-badge-link">
              <span>★ PURE NEO-BRUTALISM UI</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

