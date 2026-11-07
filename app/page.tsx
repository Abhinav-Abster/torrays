"use client";

import LatestReleaseCard from "@/components/LatestReleaseCard";
import MediaSpotlight from "@/components/MediaSpotlight";
import TorrentCard from "@/components/TorrentCard";
import type { MediaMetadata, TorrentEntry } from "@/lib/catalog/types";
import { CATEGORIES } from "@/lib/catalog/types";
import { useNsfw, useTheme } from "@/lib/settings";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Code2,
    Compass,
    Filter,
    Loader2,
    Palette,
    RotateCcw,
    Search,
    SearchX,
    Sparkles,
    Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

const SOURCES = ["YTS", "ThePirateBay", "Nyaa.si"] as const;
const LATEST_RESULTS_LIMIT = 12;

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TorrentEntry[]>([]);
  const [media, setMedia] = useState<MediaMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [latestPage, setLatestPage] = useState(1);
  const [theme, setTheme] = useTheme();
  const [nsfw, toggleNsfw] = useNsfw();

  // Filters
  const [sourceFilter, setSourceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // For debounced search
  const abortRef = useRef<AbortController | null>(null);

  // Load latest YTS releases on mount and when NSFW changes
  useEffect(() => {
    if (!hasSearched) {
      loadLatest(nsfw);
    }
  }, [nsfw]);

  const loadLatest = async (allowNsfw: boolean = nsfw) => {
    setIsLoading(true);
    setError("");
    setMedia(null);
    setLatestPage(1);
    try {
      const res = await fetch(`/api/latest?nsfw=${allowNsfw}`);
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
      setLatestPage(1);

      try {
        const params = new URLSearchParams({ q: trimmed });
        if (sourceFilter) params.set("source", sourceFilter);
        if (categoryFilter) params.set("category", categoryFilter);
        if (nsfw) params.set("nsfw", "true");

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
    [query, sourceFilter, categoryFilter, nsfw]
  );

  // Re-search when filters change (if we've already searched)
  useEffect(() => {
    if (hasSearched && query.trim().length >= 2) {
      handleSearch();
    }
  }, [sourceFilter, categoryFilter, nsfw]);

  const filteredResults = results.filter((t) => {
    if (!nsfw && (t.isNsfw || t.category.toLowerCase() === "xxx")) {
      return false;
    }
    if (sourceFilter) {
      const sf = sourceFilter.toLowerCase().replace(/[\s.-]/g, "");
      const s = t.source.toLowerCase().replace(/[\s.-]/g, "");
      if (
        (sf === "thepiratebay" || sf === "piratebay" || sf === "tpb") &&
        (s === "thepiratebay" || s === "piratebay" || s === "tpb")
      ) {
        return true;
      }
      if (s !== sf) return false;
    }
    if (categoryFilter) {
      if (t.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    }
    return true;
  });

  const latestPageCount = Math.max(
    1,
    Math.ceil(filteredResults.length / LATEST_RESULTS_LIMIT)
  );
  const latestStartIndex = (latestPage - 1) * LATEST_RESULTS_LIMIT;
  const displayedResults = hasSearched
    ? filteredResults
    : filteredResults.slice(
        latestStartIndex,
        latestStartIndex + LATEST_RESULTS_LIMIT
      );

  return (
    <div className="app-container" data-theme={theme}>
      {/* Neo-brutalist Marquee Ticker */}
      <div className="neo-marquee-wrap">
        <div className="neo-marquee-inner">
          <span>★ TORRAYS // THE OPEN-SOURCE TORRENT AGGREGATOR</span>
          <span>★ LIVE DISTRIBUTED CRAWLING: YTS • THEPIRATEBAY • NYAA</span>
          <span>★ HIGH-SATURATION MEDIA DISCOVERY</span>
          <span>★ POWERED BY TMDB & ANILIST METADATA</span>
          <span>★ TORRAYS // THE OPEN-SOURCE TORRENT AGGREGATOR</span>
          <span>★ LIVE DISTRIBUTED CRAWLING: YTS • THEPIRATEBAY • NYAA</span>
          <span>★ HIGH-SATURATION MEDIA DISCOVERY</span>
          <span>★ POWERED BY TMDB & ANILIST METADATA</span>
        </div>
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-sticker-group">
            <div className="brand-badge">
              <Zap className="brand-icon-neo h-8 w-8 stroke-[3px] text-black fill-neo-accent" />
              <svg className="brand-mark-petal" viewBox="0 0 512 512" fill="none" aria-hidden="true">
                <defs>
                  <clipPath id="headerSwirlClip">
                    <path d="M220.6,291.4 C234.0,256.2 230.3,200.8 262.6,171.7 C286.7,150.6 332.5,160.8 362.1,149.9 C351.2,179.5 361.4,225.3 340.3,249.4 C311.2,281.7 255.8,278.0 220.6,291.4 Z M291.4,220.6 C278.0,255.8 281.7,311.2 249.4,340.3 C225.3,361.4 179.5,351.2 149.9,362.1 C160.8,332.5 150.6,286.7 171.7,262.6 C200.8,230.3 256.2,234.0 291.4,220.6 Z" />
                  </clipPath>
                </defs>
                <path fill="#026065" d="M220.6,291.4 C234.0,256.2 230.3,200.8 262.6,171.7 C286.7,150.6 332.5,160.8 362.1,149.9 C351.2,179.5 361.4,225.3 340.3,249.4 C311.2,281.7 255.8,278.0 220.6,291.4 Z M291.4,220.6 C278.0,255.8 281.7,311.2 249.4,340.3 C225.3,361.4 179.5,351.2 149.9,362.1 C160.8,332.5 150.6,286.7 171.7,262.6 C200.8,230.3 256.2,234.0 291.4,220.6 Z" />
                <path fill="#A04106" d="M291.4,291.4 C256.2,278.0 200.8,281.7 171.7,249.4 C150.6,225.3 160.8,179.5 149.9,149.9 C179.5,160.8 225.3,150.6 249.4,171.7 C281.7,200.8 278.0,256.2 291.4,291.4 Z M220.6,220.6 C255.8,234.0 311.2,230.3 340.3,262.6 C361.4,286.7 351.2,332.5 362.1,362.1 C332.5,351.2 286.7,361.4 262.6,340.3 C230.3,311.2 234.0,255.8 220.6,220.6 Z" />
                <g clipPath="url(#headerSwirlClip)">
                  <path fill="#E45B24" d="M291.4,291.4 C256.2,278.0 200.8,281.7 171.7,249.4 C150.6,225.3 160.8,179.5 149.9,149.9 C179.5,160.8 225.3,150.6 249.4,171.7 C281.7,200.8 278.0,256.2 291.4,291.4 Z M220.6,220.6 C255.8,234.0 311.2,230.3 340.3,262.6 C361.4,286.7 351.2,332.5 362.1,362.1 C332.5,351.2 286.7,361.4 262.6,340.3 C230.3,311.2 234.0,255.8 220.6,220.6 Z" />
                </g>
              </svg>
              <h1 className="logo-text">Torrays</h1>
            </div>
            <span className="sub-tag-sticker">AGGREGATOR v2.0</span>
          </div>
          <p className="tagline">
            Open-source torrent index &middot; Search across live swarms
          </p>
          <div className="header-controls">
            <div
              className="nsfw-toggle-group"
              title="Toggle adult / NSFW content (disabled by default)"
            >
              <span className="nsfw-toggle-label">18+ NSFW</span>
              <button
                type="button"
                role="switch"
                aria-checked={nsfw}
                className={`nsfw-toggle-btn ${nsfw ? "is-active" : ""}`}
                onClick={toggleNsfw}
              >
                <span className="nsfw-toggle-thumb" />
                <span className="nsfw-toggle-text">{nsfw ? "ON" : "OFF"}</span>
              </button>
            </div>

            <div className="theme-switcher" aria-label="Choose interface theme">
              <Palette className="theme-switcher-icon" aria-hidden="true" />
              <span className="theme-switcher-label">Theme</span>
              <div className="theme-options" role="group" aria-label="Themes">
                <button
                  type="button"
                  className="theme-option"
                  aria-pressed={theme === "original"}
                  onClick={() => setTheme("original")}
                >
                  Original
                </button>
                <button
                  type="button"
                  className="theme-option"
                  aria-pressed={theme === "petal"}
                  onClick={() => setTheme("petal")}
                >
                  Petal
                </button>
              </div>
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
              placeholder="SEARCH MOVIES, ANIME, SHOWS, SOFTWARE..."
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
                  loadLatest(nsfw);
                }}
              >
                ✕
              </button>
            )}
          </div>
          <div className="search-actions">
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
            <Link
              href="/browse"
              className="browse-button"
              title="Browse latest releases from all providers in list view"
            >
              <Compass className="h-5 w-5 stroke-[3px]" />
              <span>BROWSE ALL</span>
            </Link>
          </div>
        </form>

        {/* Filters */}
        <div className="filters-row">
          <div className="filter-group">
            <label>
              <Filter className="h-3.5 w-3.5 stroke-[3px]" /> Provider Swarm
            </label>
            <div className="select-wrapper">
              <select
                className="neo-select"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
              >
                <option value="">ALL PROVIDERS (YTS, THEPIRATEBAY, NYAA)</option>
                {SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="select-chevron" aria-hidden="true" />
            </div>
          </div>

          <div className="filter-group">
            <label>
              <Sparkles className="h-3.5 w-3.5 stroke-[3px]" /> Category
            </label>
            <div className="select-wrapper">
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
              <ChevronDown className="select-chevron" aria-hidden="true" />
            </div>
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
                ? "Querying YTS, ThePirateBay, and Nyaa.si in real-time..."
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
                    <span className="results-query-sticker">
                      ★ LATEST YTS MOVIES · PAGE {latestPage}/{latestPageCount}
                    </span>
                  )}
                </div>

                {/* Home page: Search shows card list; Default shows YTS posters */}
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

                {!hasSearched && latestPageCount > 1 && (
                  <nav className="latest-pagination" aria-label="Latest release pages">
                    <button
                      type="button"
                      className="latest-page-button"
                      onClick={() => setLatestPage((page) => page - 1)}
                      disabled={latestPage === 1}
                    >
                      <ChevronLeft aria-hidden="true" /> Previous
                    </button>
                    <span className="latest-page-status" aria-live="polite">
                      Page {latestPage} of {latestPageCount}
                    </span>
                    <button
                      type="button"
                      className="latest-page-button"
                      onClick={() => setLatestPage((page) => page + 1)}
                      disabled={latestPage === latestPageCount}
                    >
                      Next <ChevronRight aria-hidden="true" />
                    </button>
                  </nav>
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
