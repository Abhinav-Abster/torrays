"use client";

import type { MediaMetadata } from "@/lib/catalog/types";
import { Star, ExternalLink, Film, Tv, Sparkles, Hash } from "lucide-react";

interface MediaSpotlightProps {
  media: MediaMetadata;
}

export default function MediaSpotlight({ media }: MediaSpotlightProps) {
  const isAnilist = media.source === "AniList";

  return (
    <section className="media-spotlight" aria-label="Media Spotlight">
      {/* Caution Ticker Tape Header */}
      <div className="media-spotlight-tape">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-black stroke-[3px]" />
          <span>// MEDIA RADAR INTEL //</span>
        </div>
        <div className="flex items-center gap-2 font-mono">
          <span>SOURCE: {media.source.toUpperCase()}</span>
          <span>•</span>
          <span>ID: {media.id}</span>
        </div>
      </div>

      <div className="media-content">
        {/* Physical Framed Poster */}
        {media.posterUrl && (
          <div className="media-poster-wrap">
            <img
              src={media.posterUrl}
              alt={media.title}
              className="media-poster"
              loading="lazy"
            />
          </div>
        )}

        {/* Details Column */}
        <div className="media-details">
          <div className="media-meta-row">
            {/* Source Pill */}
            <span
              className={`neo-pill ${
                isAnilist ? "pill-anilist" : "pill-tmdb"
              }`}
            >
              {media.source}
            </span>

            {/* Type Pill */}
            <span className="neo-pill pill-type">
              {media.type === "anime" ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 stroke-[3px]" />
                  <span>Anime</span>
                </>
              ) : media.type === "tv" ? (
                <>
                  <Tv className="w-3.5 h-3.5 stroke-[3px]" />
                  <span>TV Series</span>
                </>
              ) : (
                <>
                  <Film className="w-3.5 h-3.5 stroke-[3px]" />
                  <span>Movie</span>
                </>
              )}
            </span>

            {/* Release Year */}
            {media.releaseYear && (
              <span className="neo-pill bg-white">
                {media.releaseYear}
              </span>
            )}

            {/* Score / Rating */}
            {media.rating !== undefined && (
              <span className="neo-pill pill-rating">
                <Star className="w-3.5 h-3.5 fill-current stroke-[3px]" />
                <span>
                  {media.rating}
                  {media.ratingMax === 10 ? "/10" : "%"}
                </span>
              </span>
            )}

            {/* Episodes */}
            {media.episodes && (
              <span className="neo-pill bg-white">
                <Hash className="w-3 h-3 stroke-[3px]" />
                <span>{media.episodes} EPS</span>
              </span>
            )}
          </div>

          <h2 className="media-title">{media.title}</h2>

          {media.originalTitle && (
            <p className="media-original-title">
              [ALT: {media.originalTitle}]
            </p>
          )}

          {/* Genre Chips */}
          {media.genres && media.genres.length > 0 && (
            <div className="media-genres">
              {media.genres.slice(0, 5).map((genre) => (
                <span key={genre} className="genre-tag">
                  {genre}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          {media.overview && (
            <div className="media-overview">
              <span className="text-[0.7rem] font-black uppercase tracking-widest text-black/60 block mb-1">
                // SYNOPSIS //
              </span>
              <p className="m-0">{media.overview}</p>
            </div>
          )}

          {/* Source Link Action */}
          {media.url && (
            <div className="media-actions">
              <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="media-link-btn"
              >
                <span>OPEN ON {media.source}</span>
                <ExternalLink className="w-4 h-4 stroke-[3px]" />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
