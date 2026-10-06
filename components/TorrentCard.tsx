"use client";

import { useState } from "react";
import { formatBytes } from "@/lib/crawlers/utils";
import type { TorrentEntry } from "@/lib/catalog/types";
import {
  Magnet,
  Copy,
  Check,
  ArrowUp,
  ArrowDown,
  HardDrive,
  Star,
  ExternalLink,
} from "lucide-react";

interface TorrentCardProps {
  torrent: TorrentEntry;
}

export default function TorrentCard({ torrent }: TorrentCardProps) {
  const [copied, setCopied] = useState(false);
  const magnetLink = `magnet:${torrent.magnetUrl}`;
  const publishedDate = new Date(torrent.publishedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  const handleCopyHash = () => {
    navigator.clipboard.writeText(torrent.magnetHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="torrent-card">
      <div className="torrent-card-body">
        {/* Poster Thumbnail */}
        {torrent.posterUrl && (
          <div className="torrent-poster-thumb">
            <img
              src={torrent.posterUrl}
              alt={torrent.name}
              loading="lazy"
            />
          </div>
        )}

        <div className="torrent-info">
          {/* Header Metadata Stickers */}
          <div className="torrent-card-header">
            <div className="torrent-meta-tags">
              <span
                className="source-badge"
                data-source={torrent.source.toLowerCase()}
              >
                {torrent.source}
              </span>

              <span className="category-badge">{torrent.category}</span>

              {torrent.year && (
                <span className="year-badge">{torrent.year}</span>
              )}

              {torrent.rating !== undefined && (
                <span className="rating-badge">
                  <Star className="w-3 h-3 fill-black stroke-[3px]" />
                  <span>{torrent.rating}</span>
                </span>
              )}
            </div>

            <span className="torrent-date">// {publishedDate}</span>
          </div>

          {/* Title with Outlink */}
          <h3 className="torrent-name">
            <a
              href={torrent.canonicalUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={torrent.name}
              className="inline-flex items-center gap-1.5"
            >
              <span>{torrent.name}</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5px] opacity-40 inline-block shrink-0" />
            </a>
          </h3>

          {/* Swarm & Size Stats */}
          <div className="torrent-stats">
            <div className="stat-pill stat-seeders" title="Active Seeders">
              <ArrowUp className="w-3.5 h-3.5 stroke-[3px]" />
              <span>{torrent.seeders} SEEDS</span>
            </div>

            <div className="stat-pill stat-leechers" title="Active Leechers">
              <ArrowDown className="w-3.5 h-3.5 stroke-[3px]" />
              <span>{torrent.leechers} PEERS</span>
            </div>

            <div className="stat-pill stat-size" title="File Size">
              <HardDrive className="w-3.5 h-3.5 stroke-[3px]" />
              <span>{formatBytes(torrent.sizeInBytes)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="torrent-actions">
        <a
          href={magnetLink}
          className="magnet-button"
          title="Download via Magnet URI"
        >
          <Magnet className="w-4 h-4 stroke-[3px]" />
          <span>MAGNET DOWNLOAD</span>
        </a>

        <button
          type="button"
          className="copy-hash-button"
          onClick={handleCopyHash}
          title="Copy Torrent Info Hash"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600 stroke-[3px]" />
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 stroke-[3px]" />
              <span>HASH</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
