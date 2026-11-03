"use client";

import { useState } from "react";
import { formatBytes } from "@/lib/crawlers/utils";
import type { TorrentEntry } from "@/lib/catalog/types";
import { ArrowDown, ArrowUp, Check, Copy, ExternalLink, HardDrive, Magnet, Star } from "lucide-react";

interface LatestReleaseCardProps {
  torrent: TorrentEntry;
}

export default function LatestReleaseCard({ torrent }: LatestReleaseCardProps) {
  const [copied, setCopied] = useState(false);
  const magnetLink = `magnet:${torrent.magnetUrl}`;

  const copyHash = () => {
    navigator.clipboard.writeText(torrent.magnetHash);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

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
        <div className="latest-release-mobile-stats" aria-label="Torrent statistics">
          <span className="latest-mobile-stat latest-mobile-seeders"><ArrowUp aria-hidden="true" />{torrent.seeders} seeds</span>
          <span className="latest-mobile-stat latest-mobile-peers"><ArrowDown aria-hidden="true" />{torrent.leechers} peers</span>
          <span className="latest-mobile-stat latest-mobile-size"><HardDrive aria-hidden="true" />{formatBytes(torrent.sizeInBytes)}</span>
        </div>
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
      <div className="latest-release-mobile-actions">
        <a href={magnetLink} className="latest-mobile-magnet"><Magnet aria-hidden="true" /> Magnet</a>
        <button type="button" className="latest-mobile-copy" onClick={copyHash}>
          {copied ? <><Check aria-hidden="true" /> Copied</> : <><Copy aria-hidden="true" /> Hash</>}
        </button>
      </div>
    </article>
  );
}
