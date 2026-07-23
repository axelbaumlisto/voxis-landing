// Single source of truth for release download links, shared by the download
// popup (Hero / DownloadCta) and the Get-started section.
//
// The version-less asset names resolve to the LATEST release build via GitHub's
// /releases/latest/download/<asset> redirect, so they never need bumping per
// release. Versioned installers (deb/rpm/NSIS) embed the version, so those live
// on the general releases page ("more options").
export const RELEASES_URL = "https://github.com/axelbaumlisto/voxis/releases";
export const REPO_URL = "https://github.com/axelbaumlisto/voxis";
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
  windows: { key: "windows", href: `${DL}/voxis-windows-x64-gui.exe`, file: "voxis-windows-x64-gui.exe" },
  macos: { key: "macos", href: `${DL}/voxis-macos-arm64`, file: "voxis-macos-arm64" },
  linux: { key: "linux", href: `${DL}/voxis-linux-x64-gui`, file: "voxis-linux-x64-gui" },
};
