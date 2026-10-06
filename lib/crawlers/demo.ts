/**
 * Demo data for development and when live sources are unreachable.
 * This lets you test the full search/filter/display pipeline.
 */
import type { TorrentEntry } from "@/lib/catalog/types";

const DEMO_ENTRIES: TorrentEntry[] = [
  {
    id: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    name: "Ubuntu 24.04.1 LTS Desktop (amd64)",
    slug: "ubuntu-24-04-1-lts-desktop-amd64",
    publishedAt: "2024-08-29T00:00:00.000Z",
    description: "Ubuntu 24.04.1 LTS (Noble Numbat) Desktop 64-bit ISO",
    canonicalUrl: "https://ubuntu.com/download/desktop",
    magnetUrl: "?xt=urn:btih:a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2&dn=ubuntu-24.04.1-desktop-amd64.iso",
    magnetHash: "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2",
    leechers: 45,
    seeders: 1250,
    sizeInBytes: 5_932_163_072,
    category: "Software",
    source: "1337x",
  },
  {
    id: "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
    name: "Fedora Workstation 40 Live x86_64",
    slug: "fedora-workstation-40-live-x86-64",
    publishedAt: "2024-04-23T00:00:00.000Z",
    description: "Fedora 40 Workstation Live ISO for x86_64 architecture",
    canonicalUrl: "https://fedoraproject.org/workstation/download",
    magnetUrl: "?xt=urn:btih:b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3&dn=Fedora-Workstation-Live-x86_64-40",
    magnetHash: "b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
    leechers: 22,
    seeders: 890,
    sizeInBytes: 2_147_483_648,
    category: "Software",
    source: "1337x",
  },
  {
    id: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
    name: "Dune Part Two (2024) [1080p] [WEBRip] [YTS]",
    slug: "dune-part-two-2024-1080p-webrip",
    publishedAt: "2024-06-15T00:00:00.000Z",
    description: "Dune: Part Two follows Paul Atreides as he unites with the Fremen",
    canonicalUrl: "https://yts.mx/movies/dune-part-two-2024",
    magnetUrl: "?xt=urn:btih:c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4&dn=Dune.Part.Two.2024.1080p.WEBRip",
    magnetHash: "c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
    leechers: 312,
    seeders: 4520,
    sizeInBytes: 2_415_919_104,
    category: "Movies",
    source: "YTS",
  },
  {
    id: "d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5",
    name: "Oppenheimer (2023) [2160p] [4K] [BluRay] [YTS]",
    slug: "oppenheimer-2023-2160p-4k-bluray",
    publishedAt: "2024-01-20T00:00:00.000Z",
    description: "The story of J. Robert Oppenheimer and the development of the atomic bomb",
    canonicalUrl: "https://yts.mx/movies/oppenheimer-2023",
    magnetUrl: "?xt=urn:btih:d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5&dn=Oppenheimer.2023.2160p.4K.BluRay",
    magnetHash: "d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5",
    leechers: 189,
    seeders: 3200,
    sizeInBytes: 5_368_709_120,
    category: "Movies",
    source: "YTS",
  },
  {
    id: "e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
    name: "[SubsPlease] Jujutsu Kaisen S2 - 23 (1080p) [Batch]",
    slug: "subsplease-jujutsu-kaisen-s2-23-1080p-batch",
    publishedAt: "2024-03-15T00:00:00.000Z",
    description: "Jujutsu Kaisen Season 2 complete batch in 1080p",
    canonicalUrl: "https://nyaa.si/view/1234567",
    magnetUrl: "?xt=urn:btih:e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6&dn=[SubsPlease]+Jujutsu+Kaisen+S2+-+Batch",
    magnetHash: "e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6",
    leechers: 56,
    seeders: 2100,
    sizeInBytes: 15_032_385_536,
    category: "Anime",
    source: "Nyaa.si",
  },
  {
    id: "f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1",
    name: "[Erai-raws] Solo Leveling - 01~12 [1080p][Multiple Subtitle]",
    slug: "erai-raws-solo-leveling-01-12-1080p",
    publishedAt: "2024-04-01T00:00:00.000Z",
    description: "Solo Leveling Season 1 complete in 1080p with multiple subtitles",
    canonicalUrl: "https://nyaa.si/view/1234568",
    magnetUrl: "?xt=urn:btih:f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1&dn=[Erai-raws]+Solo+Leveling",
    magnetHash: "f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1",
    leechers: 78,
    seeders: 3450,
    sizeInBytes: 12_884_901_888,
    category: "Anime",
    source: "Nyaa.si",
  },
  {
    id: "a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3",
    name: "The Wild Robot (2024) [720p] [WEBRip] [YTS]",
    slug: "the-wild-robot-2024-720p-webrip",
    publishedAt: "2024-12-10T00:00:00.000Z",
    description: "An intelligent robot shipwrecked on an uninhabited island must learn to adapt",
    canonicalUrl: "https://yts.mx/movies/the-wild-robot-2024",
    magnetUrl: "?xt=urn:btih:a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3&dn=The.Wild.Robot.2024.720p.WEBRip",
    magnetHash: "a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3",
    leechers: 95,
    seeders: 1800,
    sizeInBytes: 1_073_741_824,
    category: "Movies",
    source: "YTS",
  },
  {
    id: "b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4",
    name: "Arch Linux 2024.10.01 x86_64",
    slug: "arch-linux-2024-10-01-x86-64",
    publishedAt: "2024-10-01T00:00:00.000Z",
    description: "Arch Linux October 2024 ISO",
    canonicalUrl: "https://archlinux.org/download/",
    magnetUrl: "?xt=urn:btih:b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4&dn=archlinux-2024.10.01-x86_64.iso",
    magnetHash: "b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4",
    leechers: 12,
    seeders: 450,
    sizeInBytes: 858_993_459,
    category: "Software",
    source: "1337x",
  },
  {
    id: "c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5",
    name: "Blender 4.2 LTS (Linux x86_64)",
    slug: "blender-4-2-lts-linux-x86-64",
    publishedAt: "2024-07-16T00:00:00.000Z",
    description: "Blender 4.2 Long Term Support release for Linux",
    canonicalUrl: "https://www.blender.org/download/",
    magnetUrl: "?xt=urn:btih:c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5&dn=blender-4.2-linux-x64.tar.xz",
    magnetHash: "c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5",
    leechers: 8,
    seeders: 320,
    sizeInBytes: 314_572_800,
    category: "Software",
    source: "1337x",
  },
  {
    id: "d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6",
    name: "[Judas] Frieren - Beyond Journey's End - S01 (1080p) [Batch]",
    slug: "judas-frieren-beyond-journeys-end-s01-1080p-batch",
    publishedAt: "2024-03-22T00:00:00.000Z",
    description: "Frieren: Beyond Journey's End Season 1 complete batch",
    canonicalUrl: "https://nyaa.si/view/1234569",
    magnetUrl: "?xt=urn:btih:d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6&dn=[Judas]+Frieren+S01",
    magnetHash: "d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6",
    leechers: 42,
    seeders: 2800,
    sizeInBytes: 18_253_611_008,
    category: "Anime",
    source: "Nyaa.si",
  },
  {
    id: "e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7",
    name: "Interstellar (2014) [2160p] [4K] [BluRay] [REMUX] [YTS]",
    slug: "interstellar-2014-2160p-4k-bluray-remux",
    publishedAt: "2023-11-10T00:00:00.000Z",
    description: "A team of explorers travel through a wormhole in space",
    canonicalUrl: "https://yts.mx/movies/interstellar-2014",
    magnetUrl: "?xt=urn:btih:e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7&dn=Interstellar.2014.2160p.4K.BluRay.REMUX",
    magnetHash: "e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7",
    leechers: 234,
    seeders: 5600,
    sizeInBytes: 60_129_542_144,
    category: "Movies",
    source: "YTS",
  },
  {
    id: "f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2",
    name: "Linux Mint 22 'Wilma' Cinnamon Edition (64-bit)",
    slug: "linux-mint-22-wilma-cinnamon-edition-64-bit",
    publishedAt: "2024-07-25T00:00:00.000Z",
    description: "Linux Mint 22 Cinnamon Edition based on Ubuntu 24.04",
    canonicalUrl: "https://linuxmint.com/download.php",
    magnetUrl: "?xt=urn:btih:f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2&dn=linuxmint-22-cinnamon-64bit.iso",
    magnetHash: "f7a2b3c4d5e6f7a2b3c4d5e6f7a2b3c4d5e6f7a2",
    leechers: 18,
    seeders: 670,
    sizeInBytes: 2_831_155_200,
    category: "Software",
    source: "1337x",
  },
];

/**
 * Filter demo data to simulate search.
 * Performs case-insensitive substring match on name and description.
 */
export function searchDemo(query: string): TorrentEntry[] {
  const lower = query.toLowerCase();
  return DEMO_ENTRIES.filter(
    (e) =>
      e.name.toLowerCase().includes(lower) ||
      e.description.toLowerCase().includes(lower) ||
      e.category.toLowerCase().includes(lower) ||
      e.source.toLowerCase().includes(lower)
  ).sort((a, b) => b.seeders - a.seeders);
}

/**
 * Return all demo data sorted by date (latest first).
 */
export function latestDemo(): TorrentEntry[] {
  return [...DEMO_ENTRIES].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
