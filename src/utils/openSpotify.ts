/**
 * Attempts to open a Spotify track via deep link (native app),
 * falling back to the web player URL after a short delay.
 */
export const openSpotifyTrack = (trackId: string): void => {
  const deepLink = `spotify:track:${trackId}`;
  const webUrl = `https://open.spotify.com/track/${trackId}`;

  // Try native deep link first
  const start = Date.now();
  window.location.href = deepLink;

  // If the page is still visible after 800ms, the deep link likely failed —
  // fall back to the web player
  setTimeout(() => {
    if (document.visibilityState !== "hidden" && Date.now() - start < 2000) {
      window.open(webUrl, "_blank", "noopener");
    }
  }, 800);
};

export const copyTrackLink = (trackId: string): Promise<void> => {
  const url = `https://open.spotify.com/track/${trackId}`;
  return navigator.clipboard.writeText(url);
};
