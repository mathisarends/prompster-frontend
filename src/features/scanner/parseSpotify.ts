/**
 * Extracts a Spotify track ID from various QR code payload formats.
 *
 * Supported formats:
 *   - spotify:track:6rqhFgbbKwnb9MLmUQDhG6
 *   - https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6
 *   - https://open.spotify.com/track/6rqhFgbbKwnb9MLmUQDhG6?si=abc123
 */

const SPOTIFY_TRACK_RE =
  /(?:spotify:track:|open\.spotify\.com\/track\/)([a-zA-Z0-9]{22})/;

export function parseSpotifyTrackId(payload: string): string | null {
  const match = payload.match(SPOTIFY_TRACK_RE);
  return match ? match[1] : null;
}
