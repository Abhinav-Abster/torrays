"use client";

import { useState, useCallback, useRef, useEffect, useSyncExternalStore } from "react";
import type { TorrentEntry, MediaMetadata } from "@/lib/catalog/types";
import { CATEGORIES } from "@/lib/catalog/types";
import TorrentCard from "@/components/TorrentCard";
import LatestReleaseCard from "@/components/LatestReleaseCard";
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
  Palette,
} from "lucide-react";

const SOURCES = ["YTS", "1377x", "Nyaa.si"] as const;
const LATEST_RESULTS_LIMIT = 12;
type Theme = "original" | "petal";
const THEME_STORAGE_KEY = "torrays-theme";
const THEME_CHANGE_EVENT = "torrays-theme-change";

function readTheme(): Theme {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return savedTheme === "petal" ? "petal" : "original";
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
  };
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TorrentEntry[]>([]);
  const [media, setMedia] = useState<MediaMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, () => "original");

  // Filters
  const [sourceFilter, setSourceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // For debounced search
  const abortRef = useRef<AbortController | null>(null);

  // Load latest on mount
  useEffect(() => {
    loadLatest();
  }, []);

  const changeTheme = (nextTheme: Theme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  };

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
  const displayedResults = hasSearched
    ? filteredResults
    : filteredResults.slice(0, LATEST_RESULTS_LIMIT);

  return (
    <div className="app-container" data-theme={theme}>
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
          <div className="theme-switcher" aria-label="Choose interface theme">
            <Palette className="theme-switcher-icon" aria-hidden="true" />
            <span className="theme-switcher-label">Theme</span>
            <div className="theme-options" role="group" aria-label="Themes">
              <button
                type="button"
                className="theme-option"
                aria-pressed={theme === "original"}
                onClick={() => changeTheme("original")}
              >
                Original
              </button>
              <button
                type="button"
                className="theme-option"
                aria-pressed={theme === "petal"}
                onClick={() => changeTheme("petal")}
              >
                Petal
              </button>
            </div>
          </div>
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
              inputMode="search"
              enterKeyHint="search"
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
              {hasSearched
                ? "Querying YTS, 1377x, and Nyaa.si in real-time..."
                : "Fetching the newest YTS releases..."}
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {hasSearched && media && <MediaSpotlight media={media} />}

            {displayedResults.length > 0 && (
              <>
                <div className="results-header">
                  <span className="results-count-sticker">
                    {displayedResults.length}{" "}
                    {displayedResults.length === 1 ? "RESULT" : "RESULTS"} FOUND
                  </span>
                  {hasSearched ? (
                    <span className="results-query-sticker">
                      QUERY: &ldquo;{query.toUpperCase()}&rdquo;
                    </span>
                  ) : (
                    <span className="results-query-sticker">★ LATEST YTS RELEASES</span>
                  )}
                </div>
                {hasSearched ? (
                  <div className="results-grid">
                    {displayedResults.map((t) => (
                      <TorrentCard key={t.id} torrent={t} />
                    ))}
                  </div>
                ) : (
                  <div className="latest-releases-grid">
                    {displayedResults.map((t) => (
                      <LatestReleaseCard key={t.id} torrent={t} />
                    ))}
                  </div>
                )}
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
              <span>★ ORIGINAL + PETAL THEMES</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

