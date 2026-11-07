"use client";

import TorrentCard from "@/components/TorrentCard";
import type { TorrentEntry } from "@/lib/catalog/types";
import { CATEGORIES } from "@/lib/catalog/types";
import { useNsfw, useTheme } from "@/lib/settings";
import {
    ArrowLeft,
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
const BROWSE_PAGE_LIMIT = 20;

export default function BrowsePage() {
  const [results, setResults] = useState<TorrentEntry[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [theme, setTheme] = useTheme();
  const [nsfw, toggleNsfw] = useNsfw();

  // Filters
  const [sourceFilter, setSourceFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    loadAllLatest(nsfw);
  }, [nsfw]);

  const loadAllLatest = async (allowNsfw: boolean = nsfw) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError("");
    setCurrentPage(1);

    try {
      const res = await fetch(`/api/latest?all=true&nsfw=${allowNsfw}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("Failed to fetch releases");
      const data = await res.json();
      setResults(data.results ?? []);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("Failed to fetch latest swarms — please refresh or try again");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side filtering
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
        // match
      } else if (s !== sf) {
        return false;
      }
    }
    if (categoryFilter) {
      if (t.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    }
    if (searchFilter.trim().length > 0) {
      const q = searchFilter.toLowerCase().trim();
      const inName = t.name.toLowerCase().includes(q);
      const inCat = t.category.toLowerCase().includes(q);
      const inSource = t.source.toLowerCase().includes(q);
      if (!inName && !inCat && !inSource) return false;
    }
    return true;
  });

  const pageCount = Math.max(1, Math.ceil(filteredResults.length / BROWSE_PAGE_LIMIT));
  const startIndex = (currentPage - 1) * BROWSE_PAGE_LIMIT;
  const displayedResults = filteredResults.slice(
    startIndex,
    startIndex + BROWSE_PAGE_LIMIT
  );

  return (
    <div className="app-container" data-theme={theme}>
      {/* Neo-brutalist Marquee Ticker */}
      <div className="neo-marquee-wrap">
        <div className="neo-marquee-inner">
          <span>★ TORRAYS BROWSE // ALL LIVE PROVIDERS CONCURRENT FEED</span>
          <span>★ REAL-TIME SWARMS: YTS • THEPIRATEBAY • NYAA</span>
          <span>★ MULTI-CATEGORY SWARM INDEX</span>
          <span>★ NO POPUPS • NO REDIRECTS • DIRECT MAGNETS</span>
          <span>★ TORRAYS BROWSE // ALL LIVE PROVIDERS CONCURRENT FEED</span>
          <span>★ REAL-TIME SWARMS: YTS • THEPIRATEBAY • NYAA</span>
          <span>★ MULTI-CATEGORY SWARM INDEX</span>
          <span>★ NO POPUPS • NO REDIRECTS • DIRECT MAGNETS</span>
        </div>
      </div>

      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand-sticker-group">
            <Link href="/" className="brand-badge-link" title="Return to home page">
              <div className="brand-badge">
                <Zap className="brand-icon-neo h-8 w-8 stroke-[3px] text-black fill-neo-accent" />
                <svg className="brand-mark-petal" viewBox="0 0 512 512" fill="none" aria-hidden="true">
                  <defs>
                    <clipPath id="headerSwirlClipBrowse">
                      <path d="M220.6,291.4 C234.0,256.2 230.3,200.8 262.6,171.7 C286.7,150.6 332.5,160.8 362.1,149.9 C351.2,179.5 361.4,225.3 340.3,249.4 C311.2,281.7 255.8,278.0 220.6,291.4 Z M291.4,220.6 C278.0,255.8 281.7,311.2 249.4,340.3 C225.3,361.4 179.5,351.2 149.9,362.1 C160.8,332.5 150.6,286.7 171.7,262.6 C200.8,230.3 256.2,234.0 291.4,220.6 Z" />
                    </clipPath>
                  </defs>
                  <path fill="#026065" d="M220.6,291.4 C234.0,256.2 230.3,200.8 262.6,171.7 C286.7,150.6 332.5,160.8 362.1,149.9 C351.2,179.5 361.4,225.3 340.3,249.4 C311.2,281.7 255.8,278.0 220.6,291.4 Z M291.4,220.6 C278.0,255.8 281.7,311.2 249.4,340.3 C225.3,361.4 179.5,351.2 149.9,362.1 C160.8,332.5 150.6,286.7 171.7,262.6 C200.8,230.3 256.2,234.0 291.4,220.6 Z" />
                  <path fill="#A04106" d="M291.4,291.4 C256.2,278.0 200.8,281.7 171.7,249.4 C150.6,225.3 160.8,179.5 149.9,149.9 C179.5,160.8 225.3,150.6 249.4,171.7 C281.7,200.8 278.0,256.2 291.4,291.4 Z M220.6,220.6 C255.8,234.0 311.2,230.3 340.3,262.6 C361.4,286.7 351.2,332.5 362.1,362.1 C332.5,351.2 286.7,361.4 262.6,340.3 C230.3,311.2 234.0,255.8 220.6,220.6 Z" />
                  <g clipPath="url(#headerSwirlClipBrowse)">
                    <path fill="#E45B24" d="M291.4,291.4 C256.2,278.0 200.8,281.7 171.7,249.4 C150.6,225.3 160.8,179.5 149.9,149.9 C179.5,160.8 225.3,150.6 249.4,171.7 C281.7,200.8 278.0,256.2 291.4,291.4 Z M220.6,220.6 C255.8,234.0 311.2,230.3 340.3,262.6 C361.4,286.7 351.2,332.5 362.1,362.1 C332.5,351.2 286.7,361.4 262.6,340.3 C230.3,311.2 234.0,255.8 220.6,220.6 Z" />
                  </g>
                </svg>
                <h1 className="logo-text">Torrays</h1>
              </div>
            </Link>
            <span className="sub-tag-sticker">BROWSE FEED</span>
            <Link href="/" className="back-home-pill">
              <ArrowLeft className="h-3.5 w-3.5 stroke-[3px]" />
              <span>HOME</span>
            </Link>
          </div>
          <p className="tagline">
            Latest releases aggregated from all live torrent swarms
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

      {/* Filter / Search section */}
      <section className="search-section">
        <div className="browse-filter-bar">
          <div className="search-input-wrap">
            <div className="search-icon-box">
              <Search className="h-6 w-6 stroke-[3px]" />
            </div>
            <input
              type="text"
              className="search-input"
              placeholder="QUICK FILTER LATEST RELEASES..."
              value={searchFilter}
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchFilter && (
              <button
                type="button"
                className="search-clear"
                aria-label="Clear filter"
                onClick={() => setSearchFilter("")}
              >
                ✕
              </button>
            )}
          </div>
        </div>

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
                onChange={(e) => {
                  setSourceFilter(e.target.value);
                  setCurrentPage(1);
                }}
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
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
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

          {(sourceFilter || categoryFilter || searchFilter) && (
            <button
              type="button"
              className="clear-filters-btn"
              onClick={() => {
                setSourceFilter("");
                setCategoryFilter("");
                setSearchFilter("");
                setCurrentPage(1);
              }}
            >
              <RotateCcw className="h-3.5 w-3.5 stroke-[3px]" />
              <span>RESET</span>
            </button>
          )}
        </div>
      </section>

      {/* Results in list card form */}
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
            <h3 className="loading-title">// AGGREGATING ALL PROVIDERS //</h3>
            <p className="loading-subtext">
              Pulling newest feeds from YTS, ThePirateBay, and Nyaa.si in real-time...
            </p>
          </div>
        )}

        {!isLoading && !error && (
          <>
            <div className="results-header">
              <span className="results-count-sticker">
                {displayedResults.length}{" "}
                {displayedResults.length === 1 ? "RELEASE" : "RELEASES"} SHOWN (TOTAL {filteredResults.length})
              </span>
              <span className="results-query-sticker">
                ★ ALL PROVIDERS CARD VIEW · PAGE {currentPage}/{pageCount}
              </span>
            </div>

            {displayedResults.length > 0 ? (
              <>
                <div className="results-grid">
                  {displayedResults.map((t) => (
                    <TorrentCard key={t.id} torrent={t} />
                  ))}
                </div>

                {pageCount > 1 && (
                  <nav className="latest-pagination" aria-label="Browse pagination">
                    <button
                      type="button"
                      className="latest-page-button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft aria-hidden="true" /> Previous
                    </button>
                    <span className="latest-page-status" aria-live="polite">
                      Page {currentPage} of {pageCount}
                    </span>
                    <button
                      type="button"
                      className="latest-page-button"
                      onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
                      disabled={currentPage === pageCount}
                    >
                      Next <ChevronRight aria-hidden="true" />
                    </button>
                  </nav>
                )}
              </>
            ) : (
              <div className="empty-box">
                <SearchX className="h-16 w-16 stroke-[2.5px] mx-auto text-neo-accent" />
                <h3 className="empty-title">NO RELEASES MATCHING FILTERS</h3>
                <p className="loading-subtext">
                  Try clearing your filters or check back in a few minutes.
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <p className="footer-main-text">
            Torrays &middot; Open-source torrent aggregator
          </p>
          <div className="flex items-center gap-3 flex-wrap justify-center mt-1">
            <Link href="/" className="footer-badge-link">
              <ArrowLeft className="h-4 w-4 stroke-[2.5px]" />
              <span>RETURN HOME</span>
            </Link>
            <a
              href="https://github.com/sergiotapia/magnetissimo"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-badge-link"
            >
              <Code2 className="h-4 w-4 stroke-[2.5px]" />
              <span>MAGNETISSIMO CRAWLERS</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

