// Single source of truth for release download links, shared by the download
// popup (Hero / DownloadCta) and the Get-started section.
//
// The version-less asset names resolve to the LATEST release build via GitHub's
// /releases/latest/download/<asset> redirect, so they never need bumping per
// release. Windows and macOS point at stable-name copies of the per-release
// installer artifacts (NSIS setup.exe, notarized DMG) — that is exactly why
// those copies exist. The other packages (.deb/.rpm, portable .zip) live on
// the general releases page ("more options").
export const RELEASES_URL = "https://github.com/axelbaumlisto/voxis/releases";
export const REPO_URL = "https://github.com/axelbaumlisto/voxis";
export const GROQ_KEYS_URL = "https://console.groq.com/keys";
export const SELF_HOSTED_DOCS_URL = "https://docs.voxis.top/self-hosted-transcription.html";
const DL = `${RELEASES_URL}/latest/download`;

export type PlatformKey = "windows" | "macos" | "linux";

export interface PlatformDownload {
  key: PlatformKey;
  /** direct download of the latest build for this OS (no GitHub detour) */
  href: string;
  /** suggested filename for the download attribute */
  file: string;
}

export const DOWNLOADS: Record<PlatformKey, PlatformDownload> = {
  windows: { key: "windows", href: `${DL}/voxis-windows-x64-setup.exe`, file: "voxis-windows-x64-setup.exe" },
  macos: { key: "macos", href: `${DL}/voxis-macos-arm64.dmg`, file: "voxis-macos-arm64.dmg" },
  linux: { key: "linux", href: `${DL}/voxis-linux-x64-gui`, file: "voxis-linux-x64-gui" },
};
