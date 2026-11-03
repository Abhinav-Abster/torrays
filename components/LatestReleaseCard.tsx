"use client";

import { formatBytes } from "@/lib/crawlers/utils";
import type { TorrentEntry } from "@/lib/catalog/types";
import { ArrowDown, ArrowUp, ExternalLink, HardDrive, Magnet, Star } from "lucide-react";

interface LatestReleaseCardProps {
  torrent: TorrentEntry;
}

export default function LatestReleaseCard({ torrent }: LatestReleaseCardProps) {
  const magnetLink = `magnet:${torrent.magnetUrl}`;

  return (
    <article className="latest-release-card">
      <div className="latest-release-header">
        <div className="latest-release-tags">
          <span className="source-badge" data-source={torrent.source.toLowerCase()}>{torrent.source}</span>
          {torrent.year && <span className="year-badge">{torrent.year}</span>}
          {torrent.rating !== undefined && (
            <span className="rating-badge"><Star className="h-3 w-3 fill-black stroke-[3px]" />{torrent.rating}</span>
          )}
        </div>
        <h3 className="latest-release-title">
          <a href={torrent.canonicalUrl} target="_blank" rel="noopener noreferrer" title={torrent.name}>
            {torrent.name}<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </h3>
      </div>

      <div className="latest-release-poster">
        {torrent.posterUrl ? (
          <img src={torrent.posterUrl} alt={torrent.name} loading="lazy" />
        ) : (
          <div className="latest-release-poster-fallback">NO POSTER</div>
        )}
        <div className="latest-release-details">
          <div className="latest-release-stats">
            <span><ArrowUp aria-hidden="true" />{torrent.seeders} seeds</span>
            <span><ArrowDown aria-hidden="true" />{torrent.leechers} peers</span>
            <span><HardDrive aria-hidden="true" />{formatBytes(torrent.sizeInBytes)}</span>
          </div>
          <a href={magnetLink} className="latest-release-magnet"><Magnet aria-hidden="true" /> Magnet download</a>
        </div>
      </div>
    </article>
  );
}
